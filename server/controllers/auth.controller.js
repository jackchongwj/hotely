import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import { ErrorHandler, errorHandler } from '../helpers/error.handler.js';
import { setTokenCookies, generateTokens } from "../services/auth.service.js";

// Invalidate all sessions for a specific user (admin only)
export const invalidateUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    await RefreshToken.deleteMany({ user: userId });
    res.json({ message: 'All sessions invalidated for user.' });
  } catch (error) {
    errorHandler(res, error, req);
  }
};

// Invalidate all sessions across every user (admin only)
export const invalidateAllSessions = async (req, res) => {
  try {
    const result = await RefreshToken.deleteMany({});
    res.json({ message: `All sessions invalidated. ${result.deletedCount} session(s) cleared.` });
  } catch (error) {
    errorHandler(res, error, req);
  }
};

export const register = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorHandler(400, "User with this email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fname, lname, email, role: 'User', password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully.", status: "ok" });
  } catch (error) {
    errorHandler(res, error, req);
  }
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS   = 30 * 60 * 1000; // 30 minutes

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Generic message — don't reveal whether the email exists
      throw new ErrorHandler(400, "Invalid credentials.");
    }

    // Check lockout
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      throw new ErrorHandler(429, `Account locked. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`);
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      const attempts = (user.loginAttempts || 0) + 1;
      const updates = { loginAttempts: attempts };
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        updates.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        updates.loginAttempts = 0;
      }
      await User.findByIdAndUpdate(user._id, updates);
      const remaining = MAX_LOGIN_ATTEMPTS - attempts;
      throw new ErrorHandler(400, remaining > 0
        ? `Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`
        : 'Account locked for 30 minutes due to too many failed attempts.');
    }

    if (!user.role) {
      throw new ErrorHandler(400, "Account not verified.");
    }

    // Successful login — reset lockout counters
    await User.findByIdAndUpdate(user._id, { loginAttempts: 0, lockUntil: null });

    const { accessToken, refreshToken } = await generateTokens(user);
    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Logged in successfully",
      user: { _id: user._id, fname: user.fname, lname: user.lname, email: user.email, role: user.role },
    });
  } catch (error) {
    errorHandler(res, error, req);
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies || req.body;

    if (refreshToken) {
      // Set the refresh token to be expired in the database
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken },
        { expires: new Date(0) } // Date(0) sets the date to Unix epoch time, effectively expiring it
      );
    }

    // Clear the cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during the logout process' });
  }
};

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies; // Assuming cookie-parser middleware is used

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token Required" });
  }

  try {
    const refreshTokenDoc = await RefreshToken.findOne({
      token: refreshToken
    }).populate('user');

    if (!refreshTokenDoc || new Date() > refreshTokenDoc.expires) {
      return res.status(401).json({ message: "Invalid Refresh Token" });
    }

    // Extend refresh token expiration here
    refreshTokenDoc.expires = new Date(Date.now() + 8 * 60 * 60 * 1000); // Extend by 8 hours
    await refreshTokenDoc.save();

    // Generate a new access token
    const accessToken = jwt.sign({
      id: refreshTokenDoc.user._id,
      email: refreshTokenDoc.user.email
    }, process.env.JWT_SECRET, { expiresIn: "30m" });

    // Update the access token in the HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict' // Adjust based on your requirements
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(401).json({ message: "Invalid Refresh Token" });
  }
};


export const validateTokens = async (req, res) => {
  const accessToken = req.cookies['accessToken'];
  const refreshToken = req.cookies['refreshToken'];

  if (accessToken) {
    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.id);
      if (!user || user.email !== decodedToken.email) {
        throw new Error('Invalid user information');
      }
      return res.status(200).json({ valid: true, user: { _id: user._id, fname: user.fname, lname: user.lname, email: user.email, role: user.role } });
    } catch (error) {
      // If accessToken is invalid, try to refresh using refreshToken
    }
  }

  if (refreshToken) {
    try {
      const refreshTokenDoc = await RefreshToken.findOne({
        token: refreshToken,
        expires: { $gt: new Date() } // Ensure the token hasn't expired
      });

      if (!refreshTokenDoc) {
        return res.status(401).json({ valid: false, message: "Invalid refresh token" });
      }

      const newAccessToken = jwt.sign({
        id: refreshTokenDoc.user._id,
        email: refreshTokenDoc.user.email
      }, process.env.JWT_SECRET, { expiresIn: "30m" });

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return res.status(200).json({ valid: true, user: refreshTokenDoc.user });

    } catch (error) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      console.error("Refresh token validation error:", error);
      return res.status(401).json({ valid: false, message: "Error validating refresh token" });
    }
  } else {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(401).json({ valid: false, message: "No tokens provided" });
  }
};
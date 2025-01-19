import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import { ErrorHandler, errorHandler } from '../helpers/error.handler.js';
import { setTokenCookies, generateTokens } from "../services/auth.service.js";

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new ErrorHandler(400, "User not found.");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ErrorHandler(400, "Invalid credentials.");
    }
    if (!user.role) {
      throw new ErrorHandler(400, "Account not verified.")
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // Set cookies for tokens
    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Logged in successfully",
      user: { fname: user.fname, lname: user.lname, email: user.email, role: user.role },
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
    refreshTokenDoc.expires = new Date(Date.now() + 7*24*60*60*1000); // Extend by 7 days
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
      return res.status(200).json({ valid: true, decoded });
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
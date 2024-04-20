import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.js";
import { ErrorHandler, errorHandler } from '../helpers/error.handler.js';

export const register = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorHandler(400, "User with this email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fname, lname, email, password: hashedPassword });
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ErrorHandler(400, "Invalid credentials.");
    }
    
    const { accessToken, refreshToken } = await generateTokens(user);

    // Set cookies for tokens
    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Logged in successfully",
      user: { fname: user.fname, lname: user.lname, email: user.email },
    });
  } catch (error) {
    errorHandler(res, error, req);
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // Assuming your refresh token is in a cookie or the request body
    const { refreshToken } = req.cookies || req.body;

    if (refreshToken) {
      // Set the refresh token to be expired in the database
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken },
        { expires: new Date(0) } // Date(0) sets the date to Unix epoch time, effectively expiring it
      );
    }

    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during the logout process' });
  }
};


const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  let cookieOptions = {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: isProduction, // Ensures cookie is sent over HTTPS
    sameSite: isProduction ? "strict" : "lax", // Adjust based on environment
  };

  if (!isProduction) {
    cookieOptions = { ...cookieOptions, secure: false, sameSite: "lax" }; 
  }

  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 30 * 60 * 1000 }); // 30 minutes
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
};

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email }, 
    process.env.JWT_SECRET, 
    { expiresIn: "30m" }
  );
  
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const expiresIn = new Date();
  expiresIn.setDate(expiresIn.getDate() + 7); // Refresh token expiry 7 days from now
  
  // Save or update the refresh token in the database
  await RefreshToken.findOneAndUpdate(
    { user: user._id }, 
    { token: refreshToken, expires: expiresIn }, 
    { new: true, upsert: true }
  );
  
  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.status(401).json({ message: "Refresh Token Required" });

  try {
    const refreshTokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      expires: { $gte: new Date() }, // Checks if the token hasn't expired
    }).populate('user');

    if (!refreshTokenDoc) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    // Generate a new access token
    const accessToken = jwt.sign({ id: refreshTokenDoc.user._id, email: refreshTokenDoc.user.email }, process.env.JWT_SECRET, { expiresIn: "30m" });

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid Refresh Token" });
  }
};

export const validateRefreshToken = async (token, userEmail) => {
  try {
    const refreshTokenDoc = await RefreshToken.findOne({
      token: token,
      expires: { $gt: new Date() }, // Ensure the token hasn't expired
    }).populate('user');

    if (!refreshTokenDoc || !refreshTokenDoc.user) {
      console.error("Refresh token not found or no associated user.");
      return { isValid: false, user: null };
    }

    // Additional validation step: check if the user's email matches the expected email.
    if (refreshTokenDoc.user.email !== userEmail) {
      console.error("User details do not match.");
      return { isValid: false, user: null };
    }

    // The token and user details are valid
    return { isValid: true, user: refreshTokenDoc.user };
  } catch (error) {
    console.error("Token validation error:", error);
    return { isValid: false, user: null };
  }
};


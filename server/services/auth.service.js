import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import crypto from "crypto";

export const verifyAccessToken = (accessToken) => {
    try {
        return jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Access Token is invalid');
    }
};

export const validateAndRefreshToken = async (refreshToken, isProduction) => {
    const refreshTokenDoc = await RefreshToken.findOne({
        token: refreshToken,
        expires: { $gt: new Date() }
    }).populate('user');

    if (!refreshTokenDoc || !refreshTokenDoc.user) {
        throw new Error('Invalid refresh token or no associated user.');
    }

    // Extend refresh token expiration
    refreshTokenDoc.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Extend by 7 days
    await refreshTokenDoc.save();

    const newAccessToken = jwt.sign({
        id: refreshTokenDoc.user._id,
        email: refreshTokenDoc.user.email
    }, process.env.JWT_SECRET, { expiresIn: "30m" });

    return { newAccessToken, user: refreshTokenDoc.user };
};

export const setAccessTokenCookie = (res, accessToken, isProduction) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax"
    });
};

export const setTokenCookies = (res, accessToken, refreshToken) => {
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
  
export const generateTokens = async (user) => {
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

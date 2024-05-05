import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { errorHandler } from "../helpers/error.handler.js";
import { verifyAccessToken, validateAndRefreshToken, setAccessTokenCookie } from '../services/auth.service.js';

export const requireAuth = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    const isProduction = process.env.NODE_ENV === "production";

    if (accessToken) {
        try {
            const decodedToken = verifyAccessToken(accessToken);
            req.user = await findAndValidateUser(decodedToken.id, decodedToken.email);
            return next();
        } catch (error) {
            if (!refreshToken) {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                return res.status(401).json({ error: "Authentication required, please log in." });
            }
        }
    }

    if (refreshToken) {
        try {
            const { newAccessToken, user } = await validateAndRefreshToken(refreshToken, isProduction);
            setAccessTokenCookie(res, newAccessToken, isProduction);
            req.user = { id: user._id, email: user.email };
            return next();
        } catch (error) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(401).json({ error: error.message });
        }
    } else {
        return res.status(401).json({ error: "Authentication required, please log in." });
    }
};


export const validateRegister = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = errorHandler(422, "User with this email already exists");
    return res.status(422).json({ error });
  }

  next();
};

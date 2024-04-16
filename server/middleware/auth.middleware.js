import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { errorHandler } from "../helpers/error.handler.js";

export const requireAuth = async (req, res, next) => {
  console.log(req.cookies)
  const token = req.cookies['accessToken'];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user by ID from the decoded token
    const user = await User.findById(decodedToken.id);

    // If user does not exist or email does not match
    if (!user || user.email !== decodedToken.email) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Attach user to the request object
    req.user = { id: user._id, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Authentication failed" });
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

import mongoose from "mongoose";
import ErrorLog from '../models/ErrorLog.js';

export class ErrorHandler extends Error {
  constructor(statusCode = 500, message = "Internal Server Error") {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const logErrorToDatabase = async (err, req) => {
  try {
    const errorLog = new ErrorLog({
      statusCode: err.statusCode || 500,
      message: err.message || "Internal Server Error",
      path: req?.originalUrl || "Unknown path", // Provide default value
      user: req?.user?.id || null, // Provide default value for user
    });
    await errorLog.save();
  } catch (dbError) {
    console.error("Failed to log error to database:", dbError);
    // Optionally handle this situation, e.g., logging to an alternative storage
  }
};

export const errorHandler = async (res, err, req) => {
  try {
    await logErrorToDatabase(err, req);
    // Proceed to respond to the client as before
    res.status(err.statusCode || 500).json({
      error: {
        status: err.statusCode || 500,
        message: err.message || "Internal Server Error",
      },
    });
  } catch (error) {
    console.error("Error handling failure:", error);
    // Handle failed error handling, e.g., send a generic error response
    res.status(500).json({ error: { status: 500, message: "Internal Server Error" }});
  }
};

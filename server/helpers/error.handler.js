import ErrorLog from '../models/ErrorLog.js';

export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
const logErrorToDatabase = async (err, req) => {
  try {
    const errorLog = new ErrorLog({
      statusCode: err.statusCode,
      message: err.message,
      path: req?.originalUrl, // Optional chaining in case req is not provided
      // user: req?.user?.id, // Similarly, handle optional chaining for user info
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
        status: err.statusCode,
        message: err.message,
      },
    });
  } catch (error) {
    console.error("Error handling failure:", error);
    // Handle failed error handling, e.g., send a generic error response
    res.status(500).json({ error: { status: 500, message: "Internal Server Error" }});
  }
};

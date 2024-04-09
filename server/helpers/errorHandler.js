class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
    }
  }
  
  const handleError = (res, err) => {
    const { statusCode, message } = err;
    res.status(statusCode).json({
      error: {
        status: statusCode,
        message: message,
      },
    });
  };
  
 export default { ErrorHandler, handleError };
// AppError class extends the built-in Error class to handle custom application errors
class AppError extends Error {
  public statusCode: number; // The HTTP status code for the error

  // Constructor to initialize the error message, status code, and stack trace
  constructor(statusCode: number, message: string, stack = '') {
    super(message); // Call the parent Error class constructor with the message
    this.statusCode = statusCode; // Assign the provided status code

    // If a custom stack trace is provided, use it; otherwise, capture the current stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
    }
  }
}

export default AppError; // Export the AppError class for use in other parts of the application

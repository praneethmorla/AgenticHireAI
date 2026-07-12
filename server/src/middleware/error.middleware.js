import { AppError } from "../utils/app-error.js";

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    error: {
      message: error.message || "Internal server error",
      details: error.details || null
    }
  });
}

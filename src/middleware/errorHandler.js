import { env } from "../config/env.js";

/**
 * 404 handler for unknown routes.
 */
export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

/**
 * Centralized error handler.
 * Converts any error into a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details || null;

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = "A resource with that value already exists";
    details = Object.keys(err.keyValue || {}).map((key) => ({
      field: key,
      message: `${key} is already in use`,
    }));
  }

  // Mongoose cast error (invalid ObjectId etc.)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Log the full error in development
  if (!env.isProd) {
    console.error("Error:", err.stack || err.message);
  }

  res.status(statusCode).json({
    message,
    ...(details ? { details } : {}),
    ...(env.isProd ? {} : { stack: err.stack }),
  });
}

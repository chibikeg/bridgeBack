import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

/**
 * Run after express-validator middleware.
 * Collects any validation errors and returns them in a single 400 response.
 */
export function validate(req, _res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const details = errors.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  next(new ApiError(400, "Validation failed", details));
}

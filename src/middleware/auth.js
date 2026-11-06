import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Verify JWT from the Authorization header and attach the user to the request.
 */
export async function protect(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required. Please log in.");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(401, "User no longer exists.");

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      next(new ApiError(401, "Invalid or expired token. Please log in again."));
    } else {
      next(err);
    }
  }
}

/**
 * Restrict access to specific roles.
 * Usage: restrictTo("admin")
 */
export function restrictTo(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ApiError(403, "You do not have permission to perform this action."));
    } else {
      next();
    }
  };
}

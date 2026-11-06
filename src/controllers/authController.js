import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { success, created } from "../utils/sendResponse.js";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, "An account with this email already exists");

    const user = await User.create({ name, email, password });
    const token = signToken(user);

    created(res, { user, token }, "Account created successfully");
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(401, "Invalid email or password");

    const match = await user.comparePassword(password);
    if (!match) throw new ApiError(401, "Invalid email or password");

    const token = signToken(user);
    user.password = undefined;

    success(res, { user, token }, "Login successful");
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
export async function getProfile(req, res, next) {
  try {
    success(res, { user: req.user }, "Profile retrieved");
  } catch (err) {
    next(err);
  }
}

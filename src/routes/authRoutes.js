import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { registerRules, loginRules } from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.get("/me", protect, getProfile);

export default router;

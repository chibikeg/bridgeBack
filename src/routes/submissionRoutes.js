import { Router } from "express";
import {
  createSubmission,
  getSubmissions,
  getSubmission,
  toggleReviewed,
  deleteSubmission,
} from "../controllers/submissionController.js";
import { createSubmissionRules } from "../validators/submissionValidator.js";
import { validate } from "../middleware/validate.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// Public — anyone can submit a form
router.post("/", createSubmissionRules, validate, createSubmission);

// Protected — admin only can view and manage submissions
router.get("/", protect, restrictTo("admin"), getSubmissions);
router.get("/:id", protect, restrictTo("admin"), getSubmission);
router.patch("/:id/reviewed", protect, restrictTo("admin"), toggleReviewed);
router.delete("/:id", protect, restrictTo("admin"), deleteSubmission);

export default router;

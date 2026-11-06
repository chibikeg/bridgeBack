import { Router } from "express";
import {
  getNewsList,
  getNewsById,
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import { createNewsRules, updateNewsRules } from "../validators/newsValidator.js";
import { validate } from "../middleware/validate.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// Public — published news only
router.get("/", getNewsList);
router.get("/admin/all", protect, restrictTo("admin"), getAllNews);
router.get("/:id", getNewsById);

// Protected — admin only can manage news
router.post("/", protect, restrictTo("admin"), createNewsRules, validate, createNews);
router.put("/:id", protect, restrictTo("admin"), updateNewsRules, validate, updateNews);
router.delete("/:id", protect, restrictTo("admin"), deleteNews);

export default router;

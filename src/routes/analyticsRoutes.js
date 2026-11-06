import { Router } from "express";
import { getOverview, getTrends } from "../controllers/analyticsController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// All analytics endpoints are admin-only
router.get("/overview", protect, restrictTo("admin"), getOverview);
router.get("/trends", protect, restrictTo("admin"), getTrends);

export default router;

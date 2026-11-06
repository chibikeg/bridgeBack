import { body } from "express-validator";

export const createNewsRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("excerpt")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Excerpt cannot exceed 500 characters"),
  body("category")
    .optional()
    .isIn(["announcement", "community-update", "learning-note", "community-story", "event"])
    .withMessage("Invalid category"),
  body("published").optional().isBoolean(),
  body("content").optional().isString(),
  body("imageUrl").optional().isString(),
  body("imageAlt").optional().isString(),
  body("author").optional().isString(),
];

export const updateNewsRules = [
  body("title").optional().trim().isLength({ max: 200 }),
  body("excerpt").optional().trim().isLength({ max: 500 }),
  body("category")
    .optional()
    .isIn(["announcement", "community-update", "learning-note", "community-story", "event"]),
  body("published").optional().isBoolean(),
  body("content").optional().isString(),
  body("imageUrl").optional().isString(),
  body("imageAlt").optional().isString(),
  body("author").optional().isString(),
];

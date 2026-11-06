import { body } from "express-validator";

export const createSubmissionRules = [
  body("formName")
    .notEmpty()
    .withMessage("Form name is required")
    .isIn(["Community interest", "Conference volunteer", "Contact", "Conference registration", "General application", "StackForge interest", "Bridge Conversations interest"])
    .withMessage("Invalid form name"),
  body("fields")
    .isObject()
    .withMessage("Fields must be an object")
    .notEmpty()
    .withMessage("Fields cannot be empty"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
];

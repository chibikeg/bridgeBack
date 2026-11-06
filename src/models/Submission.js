import mongoose from "mongoose";

/**
 * Stores any form submission from the public website:
 *  - "Community interest"
 *  - "Conference volunteer"
 *  - "Contact"
 *  - "Conference registration"
 *
 * The `fields` object stores all submitted form data dynamically,
 * so the schema works for any form without needing model changes.
 */
const submissionSchema = new mongoose.Schema(
  {
    formName: {
      type: String,
      required: true,
      index: true,
      enum: ["Community interest", "Conference volunteer", "Contact", "Conference registration", "General application", "StackForge interest", "Bridge Conversations interest"],
    },
    fields: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // Store the submitter's email separately for easy lookup
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    // IP for basic abuse tracking (not shared with frontend)
    ip: { type: String, default: "" },
    // Whether this submission has been reviewed by an admin
    reviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient admin filtering
submissionSchema.index({ formName: 1, createdAt: -1 });
submissionSchema.index({ email: 1 });

export default mongoose.model("Submission", submissionSchema);

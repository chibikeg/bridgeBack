import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["announcement", "community-update", "learning-note", "community-story", "event"],
      default: "announcement",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imageAlt: {
      type: String,
      default: "",
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    author: {
      type: String,
      default: "The Bridge Initiative",
    },
  },
  { timestamps: true }
);

// Only return published articles for public queries
newsSchema.statics.findPublished = function (filter = {}) {
  return this.find({ published: true, ...filter }).sort({ publishedAt: -1, createdAt: -1 });
};

export default mongoose.model("News", newsSchema);

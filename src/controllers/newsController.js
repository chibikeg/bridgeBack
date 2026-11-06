import News from "../models/News.js";
import { ApiError } from "../utils/ApiError.js";
import { success, created } from "../utils/sendResponse.js";

// GET /api/news — public (published only)
export async function getNewsList(req, res, next) {
  try {
    const { category, limit = 12, page = 1 } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [items, total] = await Promise.all([
      News.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      News.countDocuments(filter),
    ]);

    success(res, {
      items,
      pagination: { page: parseInt(page, 10), limit: parseInt(limit, 10), total, pages: Math.ceil(total / parseInt(limit, 10)) },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/news/:id — public
export async function getNewsById(req, res, next) {
  try {
    const article = await News.findOne({ _id: req.params.id, published: true });
    if (!article) throw new ApiError(404, "Article not found");
    success(res, { article });
  } catch (err) {
    next(err);
  }
}

// GET /api/news/admin/all — protected
export async function getAllNews(req, res, next) {
  try {
    const items = await News.find().sort({ createdAt: -1 });
    success(res, { items });
  } catch (err) {
    next(err);
  }
}

// POST /api/news — protected
export async function createNews(req, res, next) {
  try {
    const body = { ...req.body };
    if (body.published) body.publishedAt = new Date();

    const article = await News.create(body);
    created(res, { article }, "Article created");
  } catch (err) {
    next(err);
  }
}

// PUT /api/news/:id — protected
export async function updateNews(req, res, next) {
  try {
    const article = await News.findById(req.params.id);
    if (!article) throw new ApiError(404, "Article not found");

    Object.keys(req.body).forEach((key) => {
      article[key] = req.body[key];
    });

    // Set publishedAt when first published
    if (req.body.published && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    await article.save();
    success(res, { article }, "Article updated");
  } catch (err) {
    next(err);
  }
}

// DELETE /api/news/:id — protected
export async function deleteNews(req, res, next) {
  try {
    const result = await News.findByIdAndDelete(req.params.id);
    if (!result) throw new ApiError(404, "Article not found");
    success(res, null, "Article deleted");
  } catch (err) {
    next(err);
  }
}

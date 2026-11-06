import Submission from "../models/Submission.js";
import { ApiError } from "../utils/ApiError.js";
import { success, created } from "../utils/sendResponse.js";

// POST /api/submissions — public
export async function createSubmission(req, res, next) {
  try {
    const { formName, fields, email } = req.body;
    const ip = req.ip || "";

    const submission = await Submission.create({
      formName,
      fields,
      email: email || fields?.email || "",
      ip,
    });

    created(res, { id: submission._id, formName }, "Submission received successfully");
  } catch (err) {
    next(err);
  }
}

// GET /api/submissions — protected (admin only)
export async function getSubmissions(req, res, next) {
  try {
    const { formName, reviewed, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (formName) filter.formName = formName;
    if (reviewed !== undefined) filter.reviewed = reviewed === "true";

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [items, total] = await Promise.all([
      Submission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      Submission.countDocuments(filter),
    ]);

    success(res, {
      items,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/submissions/:id — protected
export async function getSubmission(req, res, next) {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) throw new ApiError(404, "Submission not found");
    success(res, { submission });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/submissions/:id/reviewed — protected
export async function toggleReviewed(req, res, next) {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) throw new ApiError(404, "Submission not found");
    submission.reviewed = !submission.reviewed;
    await submission.save();
    success(res, { submission }, "Review status updated");
  } catch (err) {
    next(err);
  }
}

// DELETE /api/submissions/:id — protected
export async function deleteSubmission(req, res, next) {
  try {
    const result = await Submission.findByIdAndDelete(req.params.id);
    if (!result) throw new ApiError(404, "Submission not found");
    success(res, null, "Submission deleted");
  } catch (err) {
    next(err);
  }
}

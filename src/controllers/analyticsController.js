import Submission from "../models/Submission.js";
import News from "../models/News.js";
import User from "../models/User.js";
import { success } from "../utils/sendResponse.js";

/**
 * GET /api/analytics/overview
 * Returns aggregated stats across submissions, news, and users
 * for the admin dashboard overview.
 */
export async function getOverview(req, res, next) {
  try {
    const [
      submissionAgg,
      newsAgg,
      userAgg,
      recentSubmissions,
      recentNews,
    ] = await Promise.all([
      // Submission stats — single facet pipeline
      Submission.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            reviewed: [{ $match: { reviewed: true } }, { $count: "count" }],
            pending: [{ $match: { reviewed: false } }, { $count: "count" }],
            byForm: [{ $group: { _id: "$formName", count: { $sum: 1 } } }],
            last7Days: [
              { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
              { $count: "count" },
            ],
          },
        },
      ]),
      // News stats
      News.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            published: [{ $match: { published: true } }, { $count: "count" }],
            draft: [{ $match: { published: false } }, { $count: "count" }],
            byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
          },
        },
      ]),
      // User stats
      User.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            byRole: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
          },
        },
      ]),
      // Recent submissions (5 most recent)
      Submission.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("formName email reviewed createdAt"),
      // Recent news (5 most recent)
      News.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title category published createdAt"),
    ]);

    const s = submissionAgg[0];
    const n = newsAgg[0];
    const u = userAgg[0];

    success(res, {
      submissions: {
        total: s.total[0]?.count || 0,
        reviewed: s.reviewed[0]?.count || 0,
        pending: s.pending[0]?.count || 0,
        last7Days: s.last7Days[0]?.count || 0,
        byForm: s.byForm.map((f) => ({ formName: f._id, count: f.count })),
      },
      news: {
        total: n.total[0]?.count || 0,
        published: n.published[0]?.count || 0,
        draft: n.draft[0]?.count || 0,
        byCategory: n.byCategory.map((c) => ({ category: c._id, count: c.count })),
      },
      users: {
        total: u.total[0]?.count || 0,
        byRole: u.byRole.map((r) => ({ role: r._id, count: r.count })),
      },
      recentSubmissions,
      recentNews,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/analytics/trends?days=30
 * Returns submission counts grouped by day for the last N days.
 * Used to render a time-series chart in the dashboard.
 */
export async function getTrends(req, res, next) {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365);
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (days - 1));

    // Aggregate submissions per day
    const trends = await Submission.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build a complete date series so the chart always has every day,
    // even days with zero submissions.
    const trendMap = new Map(trends.map((t) => [t._id, t.count]));
    const series = [];
    const cursor = new Date(startDate);
    for (let i = 0; i < days; i++) {
      const key = cursor.toISOString().slice(0, 10);
      series.push({
        date: key,
        count: trendMap.get(key) || 0,
        label: cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    success(res, { days, series });
  } catch (err) {
    next(err);
  }
}

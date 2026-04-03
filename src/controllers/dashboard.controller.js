const dashboardService = require("../services/dashboard.service");
const catchAsync = require("../utils/catchAsync");

const getSummary = catchAsync(async (req, res) => {
  const summary = await dashboardService.getSummary(req.user.id, req.query);
  res.json(summary);
});

const globalSearch = catchAsync(async (req, res) => {
  const results = await dashboardService.globalSearch(req.user.id, req.query.query, req.user.role);
  res.json(results);
});

module.exports = {
  getSummary,
  globalSearch,
};

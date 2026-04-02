const dashboardService = require("../services/dashboard.service");
const catchAsync = require("../utils/catchAsync");

const getSummary = catchAsync(async (req, res) => {
  const summary = await dashboardService.getSummary(req.user.id, req.query);
  res.json(summary);
});

module.exports = {
  getSummary,
};

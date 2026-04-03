const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { authenticate, requireRole, ROLES } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const recordValidation = require("../validations/record.validation");

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

router.get("/summary", requireRole([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]), validate(recordValidation.getSummary), dashboardController.getSummary);
router.get("/search", requireRole([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]), dashboardController.globalSearch);

module.exports = router;

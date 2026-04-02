const express = require("express");
const recordController = require("../controllers/record.controller");
const { authenticate, requireRole, ROLES } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const recordValidation = require("../validations/record.validation");

const router = express.Router();

// All record routes require authentication
router.use(authenticate);

router.post("/", requireRole([ROLES.ADMIN, ROLES.ANALYST]), validate(recordValidation.createRecord), recordController.createRecord);
router.get("/", requireRole([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]), validate(recordValidation.getRecords), recordController.getRecords);
router.get("/:id", requireRole([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]), recordController.getRecordById);
router.put("/:id", requireRole([ROLES.ADMIN, ROLES.ANALYST]), validate(recordValidation.updateRecord), recordController.updateRecord);
router.delete("/:id", requireRole([ROLES.ADMIN]), validate(recordValidation.deleteRecord), recordController.deleteRecord);

module.exports = router;

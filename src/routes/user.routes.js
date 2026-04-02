const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate, requireRole, ROLES } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const userValidation = require("../validations/user.validation");

const router = express.Router();

// All user routes require authentication and ADMIN role
router.use(authenticate);
router.use(requireRole([ROLES.ADMIN]));

router.get("/", userController.getUsers);
router.patch("/:id", validate(userValidation.updateUser), userController.updateUser);

module.exports = router;

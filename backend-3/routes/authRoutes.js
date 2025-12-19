const express = require("express");
const authController = require("../controllers/authController");
const { registerSchoolValidator, loginValidator } = require("../middlewares/validators");

const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/register-school",
  protect,
  restrictTo("SUPER_ADMIN"),
  registerSchoolValidator,
  authController.registerSchool
);

router.post("/register-staff", authController.registerStaff);

router.post("/login", loginValidator, authController.login);

module.exports = router;

const express = require("express");
const studentController = require("../controllers/studentController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(restrictTo("SCHOOL_ADMIN", "SUPER_ADMIN"));

router.post("/", studentController.createStudent);
router.patch("/:id", studentController.updateStudent);
router.post("/bulk-update", studentController.bulkUpdateStudents);
router.get("/", studentController.getAllStudents);

module.exports = router;

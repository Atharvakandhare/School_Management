const express = require("express");
const examController = require("../controllers/examController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const { createExamValidator, addExamResultValidator } = require("../middlewares/validators");

const router = express.Router();

router.use(protect);

// Exam Management
router.post("/", restrictTo("SCHOOL_ADMIN", "SUPER_ADMIN"), createExamValidator, examController.createExam);
router.get("/", examController.getExams);

// Results Management
router.post("/results", restrictTo("TEACHER", "SCHOOL_ADMIN"), addExamResultValidator, examController.addExamResult);
router.get("/report", examController.getStudentReportCard);

module.exports = router;

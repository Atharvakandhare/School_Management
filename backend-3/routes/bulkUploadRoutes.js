const express = require("express");
const bulkUploadController = require("../controllers/bulkUploadController");
const upload = require("../middlewares/uploadMiddleware");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(restrictTo("SCHOOL_ADMIN", "SUPER_ADMIN"));

router.post("/students", upload.single("file"), bulkUploadController.uploadStudentParent);
router.post("/attendance", upload.single("file"), bulkUploadController.uploadAttendance);
router.post("/exams", upload.single("file"), bulkUploadController.uploadExams);
router.post("/results", upload.single("file"), bulkUploadController.uploadExamResults);

module.exports = router;

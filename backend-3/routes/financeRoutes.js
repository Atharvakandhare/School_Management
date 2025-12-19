const express = require("express");
const financeController = require("../controllers/financeController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const { createFeeStructureValidator, collectFeeValidator, createPayrollValidator } = require("../middlewares/validators");

const router = express.Router();

router.use(protect);

// Fees
router.post("/fees", restrictTo("SCHOOL_ADMIN", "SUPER_ADMIN"), createFeeStructureValidator, financeController.createFeeStructure);
router.get("/fees", financeController.getFeeStructures);
router.post("/fees/collect", restrictTo("SCHOOL_ADMIN", "SUPER_ADMIN"), collectFeeValidator, financeController.collectFee);

// Payroll
router.post("/payroll", restrictTo("SCHOOL_ADMIN"), createPayrollValidator, financeController.createPayrollRecord);

module.exports = router;

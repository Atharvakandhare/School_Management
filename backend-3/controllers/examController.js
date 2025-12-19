const { Exam, ExamResult, Student, Subject, GradeRule } = require("../models");
const { Op } = require("sequelize");

// --- Exam Management ---
exports.createExam = async (req, res) => {
    try {
        const { classId, name, type, startDate, endDate } = req.body;
        const schoolId = req.user.schoolId;

        const newExam = await Exam.create({
            schoolId, classId, name, type, startDate, endDate
        });

        res.status(201).json({
            success: true,
            message: "Exam created successfully",
            data: { exam: newExam }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getExams = async (req, res) => {
    try {
        const { classId } = req.query;
        const schoolId = req.user.schoolId;

        const where = { schoolId };
        if (classId) where.classId = classId;

        const exams = await Exam.findAll({ where });

        res.status(200).json({
            success: true,
            message: "Exams fetched successfully",
            results: exams.length,
            data: { exams }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// --- Results Management ---
exports.addExamResult = async (req, res) => {
    try {
        // Bulk add results for a subject in an exam
        // { examId, subjectId, results: [{ studentId, marksObtained, maxMarks }] }
        const { examId, subjectId, results } = req.body;
        const schoolId = req.user.schoolId;

        if (!results || !Array.isArray(results)) {
            return res.status(400).json({
                success: false,
                message: "Invalid results data"
            });
        }

        // Optional: Calculate Grade based on GradeRules here
        // For simplicity, we just store marks for now.

        const resultRecords = results.map(r => ({
            schoolId,
            examId,
            subjectId,
            studentId: r.studentId,
            marksObtained: r.marksObtained,
            maxMarks: r.maxMarks || 100
            // grade: calculateGrade(r.marksObtained, r.maxMarks) -> Helper function using GradeRule
        }));

        await ExamResult.bulkCreate(resultRecords, {
            updateOnDuplicate: ["marksObtained", "maxMarks", "updatedAt"]
        });

        res.status(200).json({
            success: true,
            message: "Results added successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getStudentReportCard = async (req, res) => {
    try {
        const { studentId, examId } = req.query;
        const schoolId = req.user.schoolId;

        const where = { schoolId, studentId };
        if (examId) where.examId = examId;

        const results = await ExamResult.findAll({
            where,
            include: [
                { model: Subject, attributes: ["name", "code"] },
                { model: Exam, attributes: ["name", "type"] }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Report card fetched successfully",
            results: results.length,
            data: { report: results }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

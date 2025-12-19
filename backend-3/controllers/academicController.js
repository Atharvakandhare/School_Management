const { Class, Subject, Timetable } = require("../models");
const { Op } = require("sequelize");

// --- Classes ---
exports.createClass = async (req, res) => {
  try {
    const { name, section } = req.body;
    const schoolId = req.user.schoolId; // Assumes protect middleware

    const newClass = await Class.create({ schoolId, name, section });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: { class: newClass },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const { literal } = require("sequelize");

exports.getAllClasses = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;

    const classes = await Class.findAll({
      where: { schoolId },
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM "students" AS s
              WHERE s."classId" = "Class"."id"
            )`),
            "studentsCount"
          ]
        ]
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Classes fetched successfully",
      results: classes.length,
      data: { classes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --- Subjects ---
exports.createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;
    const schoolId = req.user.schoolId;

    const newSubject = await Subject.create({ schoolId, name, code });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: { subject: newSubject }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const subjects = await Subject.findAll({ where: { schoolId } });

    res.status(200).json({
      success: true,
      message: "Subjects fetched successfully",
      results: subjects.length,
      data: { subjects }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --- Timetable ---
exports.createTimetableEntry = async (req, res) => {
  try {
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime } = req.body;
    const schoolId = req.user.schoolId;

    // Check for conflicts (Simplified)
    // 1. Teacher overlapping
    // 2. Class overlapping
    // Doing logic here or service level. For MVP Controller is fine.

    const newEntry = await Timetable.create({
        schoolId, classId, subjectId, teacherId, dayOfWeek, startTime, endTime
    });

    res.status(201).json({
        success: true,
        message: "Timetable entry created successfully",
        data: { timetable: newEntry }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { classId, teacherId } = req.query;

    const where = { schoolId };
    if (classId) where.classId = classId;
    if (teacherId) where.teacherId = teacherId;

    const timetable = await Timetable.findAll({
        where,
        include: ["Class", "Subject", "User"]
    });

    res.status(200).json({
        success: true,
        message: "Timetable fetched successfully",
        data: { timetable }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

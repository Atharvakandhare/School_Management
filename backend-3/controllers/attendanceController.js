const { Attendance, Class } = require("../models");
const { Op } = require("sequelize");

exports.markAttendance = async (req, res) => {
    try {
        // Expecting array of objects: [{ studentId, status, date }]
        // OR bulk for a class: { classId, date, students: [{ studentId, status }] }
        
        // Implementing Bulk for Class which is most common
        const { classId, date, students } = req.body;
        const schoolId = req.user.schoolId;
        const recordedBy = req.user.id;

        if (!students || !Array.isArray(students)) {
            return res.status(400).json({
                success: false,
                message: "Invalid students data"
            });
        }

        // Use transaction for consistency
        // Simple loop for now, bulkCreate is faster but need to handle updates ("upsert")
        // Sequelize bulkCreate with updateOnDuplicate
        
        const records = students.map(s => ({
            schoolId,
            classId,
            studentId: s.studentId,
            date,
            status: s.status,
            recordedBy
        }));

        // updateOnDuplicate need specific fields
        await Attendance.bulkCreate(records, {
            updateOnDuplicate: ["status", "recordedBy", "updatedAt"]
        });

        res.status(200).json({
            success: true,
            message: "Attendance marked successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAttendanceReport = async (req, res) => {
    try {
        const { classId, date, studentId, startDate, endDate } = req.query;
        const schoolId = req.user.schoolId;

        const where = { schoolId };
        if (classId) where.classId = classId;
        if (studentId) where.studentId = studentId;
        
        if (date) {
            where.date = date;
        } else if (startDate && endDate) {
            // Date range query logic here (using Op.between)
            // For simple MVP let's stick to simple equal or full listing
        }

        const attendance = await Attendance.findAll({
            where,
            include: [
                { model: Student, attributes: ['name', 'admissionNumber'] }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Attendance report fetched successfully",
            results: attendance.length,
            data: { attendance }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const {
  User,
  Parent,
  Student,
  Timetable,
  Attendance,
  ExamResult,
  Subject,
  Class,
  Exam,
} = require("../models");
const bcrypt = require("bcryptjs");

// --- Admin Features ---

exports.createParent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      occupation,
      studentIds, // Array of student IDs to link
    } = req.body;
    const schoolId = req.user.schoolId;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).json({ success: false, message: "Please select at least one student to link." });
    }

    // 1. Create User Account
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      phone,
      passwordHash: hashedPassword,
      schoolId,
      role: "PARENT",
      isActive: true,
    });

    // 2. Create Parent Profile
    const newParent = await Parent.create({
      schoolId,
      userId: newUser.id,
      guardianName: name,
      occupation,
    });

    // 3. Link Students
    // Update the parentId of the selected students
    await Student.update(
      { parentId: newParent.id },
      { where: { id: studentIds, schoolId } } // Ensure students belong to the same school
    );

    res.status(201).json({
      success: true,
      message: "Parent profile created and students linked successfully",
      data: {
        user: newUser,
        parent: newParent,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllParents = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;

    const parents = await Parent.findAll({
      where: { schoolId },
      include: [
        { model: User, attributes: ["name", "email", "phone"] },
        { model: Student, attributes: ["name", "admissionNumber"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      success: true,
      message: "Parents fetched successfully",
      data: { parents },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// --- Parent Features ---

exports.getMyChildren = async (req, res) => {
  try {
    // Assuming we middleware attaches req.parent (we will do this in login or a middleware)
    // Or we use req.user.id to find the parent first.
    // Let's rely on finding by userId for safety if req.parent isn't set yet.
    
    const parent = await Parent.findOne({ where: { userId: req.user.id } });
    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent profile not found" });
    }

    const students = await Student.findAll({
      where: { parentId: parent.id },
      include: [{ model: Class, include: ["School"] }], // Include Basic class details
    });

    res.status(200).json({
      success: true,
      message: "Children fetched successfully",
      data: { students },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getChildDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parent = await Parent.findOne({ where: { userId: req.user.id } });

    if (!parent) {
        return res.status(404).json({ success: false, message: "Parent profile not found" });
    }

    // 1. Verify Ownership
    const student = await Student.findOne({
      where: { id: studentId, parentId: parent.id },
      include: [{ model: Class }],
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this student's data",
      });
    }

    // 2. Fetch Data
    // A. TimeTable (Based on Class)
    let timetable = [];
    if (student.Class && student.Class.id) {
        timetable = await Timetable.findAll({
            where: { classId: student.Class.id },
            include: [
                { model: Subject, attributes: ['name', 'code'] },
                { model: User, attributes: ['name'] } // Teacher Name
            ]
        });
    }

    // B. Attendance
    const attendance = await Attendance.findAll({
        where: { studentId },
        order: [['date', 'DESC']],
        limit: 30 // Last 30 records
    });

    // C. Marks (Exam Results)
    const examResults = await ExamResult.findAll({
        where: { studentId },
        include: [
            { model: Exam, attributes: ['name', 'startDate'] },
            { model: Subject, attributes: ['name', 'code'] }
        ],
        order: [[{ model: Exam }, 'startDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: "Student dashboard data fetched",
      data: {
        student,
        timetable,
        attendance,
        examResults,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

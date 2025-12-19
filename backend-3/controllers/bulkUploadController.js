const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");
const {
  User,
  School,
  Student,
  Parent,
  Class,
  Subject,
  Attendance,
  Exam,
  ExamResult,
  sequelize,
} = require("../models");

// Helper: Parse Excel Buffer to JSON
const parseExcel = (buffer) => {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
};

// Helper: Standardize response
const generateStats = (total, success, failed, errors) => ({
  total,
  success,
  failed,
  errors,
});

exports.uploadStudentParent = async (req, res) => {
  const t = await sequelize.transaction();
  const errors = [];
  let successCount = 0;

  try {
    if (!req.file) throw new Error("No file uploaded");
    const data = parseExcel(req.file.buffer);
    const schoolId = req.user.schoolId;

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rowNum = i + 2; // Excel row number (1-based, header is 1)

        try {
            // Validation
            if (!row.StudentName || !row.AdmissionNumber || !row.ParentEmail || !row.ParentName) {
                throw new Error("Missing required fields: StudentName, AdmissionNumber, ParentEmail, ParentName");
            }

            // 1. Process Parent (User + Profile)
            let parentUser = await User.findOne({ where: { email: row.ParentEmail }, transaction: t });
            let parentProfile;

            if (!parentUser) {
                // Create New Parent User
                const passwordHash = await bcrypt.hash("password123", 12); // Default password
                parentUser = await User.create({
                    name: row.ParentName,
                    email: row.ParentEmail,
                    phone: row.ParentPhone || null,
                    passwordHash,
                    role: "PARENT",
                    schoolId
                }, { transaction: t });

                parentProfile = await Parent.create({
                    userId: parentUser.id,
                    schoolId,
                    guardianName: row.ParentName,
                    occupation: row.Occupation || null
                }, { transaction: t });
            } else {
                 if (parentUser.role !== 'PARENT') throw new Error(`Email ${row.ParentEmail} belongs to a non-parent user`);
                 parentProfile = await Parent.findOne({ where: { userId: parentUser.id }, transaction: t });
            }

            // 2. Process Student
            let student = await Student.findOne({ where: { schoolId, admissionNumber: row.AdmissionNumber }, transaction: t });
            
            if (student) {
                throw new Error(`Student with Admission Number ${row.AdmissionNumber} already exists`);
            }

            // Optional: Get Class ID if ClassName provided
            let classId = null;
            if (row.ClassName) {
                 const classObj = await Class.findOne({ where: { schoolId, name: row.ClassName }, transaction: t });
                 if (classObj) {
                     classId = classObj.id;
                 }
            }

            const newStudent = await Student.create({
                schoolId,
                parentId: parentProfile.id,
                name: row.StudentName,
                admissionNumber: row.AdmissionNumber,
                dob: row.DOB ? new Date(row.DOB) : new Date(),
                gender: row.Gender || "Other",
                classId: classId
            }, { transaction: t });

            successCount++;

        } catch (err) {
            errors.push({ row: rowNum, message: err.message });
        }
    }

    await t.commit();
    res.status(200).json({
        success: true,
        data: generateStats(data.length, successCount, data.length - successCount, errors)
    });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadAttendance = async (req, res) => {
    const errors = [];
    let successCount = 0;
    
    try {
        if (!req.file) throw new Error("No file uploaded");
        const data = parseExcel(req.file.buffer);
        const schoolId = req.user.schoolId;

        // Using transaction for bulk might be heavy if partial success allowed. 
        // Let's do partial success (no transaction rollback for entire file).
        
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNum = i + 2;

            try {
                if (!row.AdmissionNumber || !row.Date || !row.Status) {
                     throw new Error("Missing AdmissionNumber, Date, or Status");
                }

                const student = await Student.findOne({ where: { schoolId, admissionNumber: row.AdmissionNumber } });
                if (!student) throw new Error(`Student ${row.AdmissionNumber} not found`);

                // We need date normalization
                const date = new Date(row.Date);
                
                // For MVP, just create/update
                // Ensure unique per student per date?
                const [attendance, created] = await Attendance.findOrCreate({
                    where: { schoolId, studentId: student.id, date },
                    defaults: {
                        status: row.Status, // Present, Absent, Late
                        remarks: row.Remarks
                    }
                });

                if (!created) {
                    attendance.status = row.Status;
                    attendance.remarks = row.Remarks;
                    await attendance.save();
                }

                successCount++;
            } catch (err) {
                errors.push({ row: rowNum, message: err.message });
            }
        }

        res.status(200).json({
            success: true,
            data: generateStats(data.length, successCount, data.length - successCount, errors)
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.uploadExams = async (req, res) => {
    const errors = [];
    let successCount = 0;

    try {
        if (!req.file) throw new Error("No file uploaded");
        const data = parseExcel(req.file.buffer);
        const schoolId = req.user.schoolId;

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNum = i + 2;

            try {
                if (!row.Name || !row.Type || !row.StartDate) {
                    throw new Error("Missing Name, Type, or StartDate");
                }

                // Check Class validity if provided
                let classId = null;
                if (row.ClassName) {
                    const classObj = await Class.findOne({ where: { schoolId, name: row.ClassName } });
                    if (classObj) classId = classObj.id;
                    else throw new Error(`Class ${row.ClassName} not found`);
                }

                await Exam.create({
                    schoolId,
                    name: row.Name,
                    examType: row.Type,
                    startDate: new Date(row.StartDate),
                    endDate: row.EndDate ? new Date(row.EndDate) : null,
                    classId // Can be null if school-wide? Model (Exam.js) check needed. Assuming nullable or handled.
                });

                successCount++;
            } catch (err) {
                 errors.push({ row: rowNum, message: err.message });
            }
        }

        res.status(200).json({
            success: true,
            data: generateStats(data.length, successCount, data.length - successCount, errors)
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.uploadExamResults = async (req, res) => {
    const errors = [];
    let successCount = 0;

    try {
        if (!req.file) throw new Error("No file uploaded");
        const data = parseExcel(req.file.buffer);
        const schoolId = req.user.schoolId;

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNum = i + 2;

            try {
                if (!row.ExamName || !row.AdmissionNumber || !row.SubjectCode || !row.Marks || !row.TotalMarks) {
                    throw new Error("Missing ExamName, AdmissionNumber, SubjectCode, Marks, TotalMarks");
                }

                // Find Exam
                const exam = await Exam.findOne({ where: { schoolId, name: row.ExamName } });
                if (!exam) throw new Error(`Exam ${row.ExamName} not found`);

                // Find Student
                const student = await Student.findOne({ where: { schoolId, admissionNumber: row.AdmissionNumber } });
                if (!student) throw new Error(`Student ${row.AdmissionNumber} not found`);

                // Find Subject
                const subject = await Subject.findOne({ where: { schoolId, code: row.SubjectCode } });
                if (!subject) throw new Error(`Subject ${row.SubjectCode} not found`);

                // Create/Update Result
                const [result, created] = await ExamResult.findOrCreate({
                    where: { examId: exam.id, studentId: student.id, subjectId: subject.id },
                    defaults: {
                        obtainedMarks: row.Marks,
                        totalMarks: row.TotalMarks,
                        grade: row.Grade || '',
                        remarks: row.Remarks || ''
                    }
                });

                 if (!created) {
                    result.obtainedMarks = row.Marks;
                    result.totalMarks = row.TotalMarks;
                    result.grade = row.Grade || result.grade;
                    result.remarks = row.Remarks || result.remarks;
                    await result.save();
                }

                successCount++;
            } catch (err) {
                errors.push({ row: rowNum, message: err.message });
            }
        }

        res.status(200).json({
            success: true,
            data: generateStats(data.length, successCount, data.length - successCount, errors)
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

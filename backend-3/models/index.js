const { sequelize, Sequelize } = require("../config/database");

const School = require("./School");
const User = require("./User");
const Parent = require("./Parent");
const Student = require("./Student");
const Class = require("./Class");
const Subject = require("./Subject");
const Timetable = require("./Timetable");
const Attendance = require("./Attendance");
const Leave = require("./Leave");
const Exam = require("./Exam");
const ExamResult = require("./ExamResult");
const GradeRule = require("./GradeRule");
const FeeStructure = require("./FeeStructure");
const FeePayment = require("./FeePayment");
const Payroll = require("./Payroll");
const Notification = require("./Notification");
const StaffProfile = require("./StaffProfile");

// School Associations
School.hasMany(User, { foreignKey: "schoolId" });
User.belongsTo(School, { foreignKey: "schoolId" });

School.hasMany(Student, { foreignKey: "schoolId" });
Student.belongsTo(School, { foreignKey: "schoolId" });

School.hasMany(Class, { foreignKey: "schoolId" });
Class.belongsTo(School, { foreignKey: "schoolId" });

School.hasMany(Subject, { foreignKey: "schoolId" });
Subject.belongsTo(School, { foreignKey: "schoolId" });

School.hasMany(Attendance, { foreignKey: "schoolId" });
Attendance.belongsTo(School, { foreignKey: "schoolId" });

School.hasMany(Leave, { foreignKey: "schoolId" });
Leave.belongsTo(School, { foreignKey: "schoolId" });

School.hasMany(Exam, { foreignKey: "schoolId" }); // Exam linked to School
Exam.belongsTo(School, { foreignKey: "schoolId" });

School.hasMany(GradeRule, { foreignKey: "schoolId" });
GradeRule.belongsTo(School, { foreignKey: "schoolId" });

School.hasMany(FeeStructure, { foreignKey: "schoolId" });
FeeStructure.belongsTo(School, { foreignKey: "schoolId" });

School.hasMany(Payroll, { foreignKey: "schoolId" });
Payroll.belongsTo(School, { foreignKey: "schoolId" });

// User Associations
User.hasOne(Parent, { foreignKey: "userId" });
Parent.belongsTo(User, { foreignKey: "userId" });

User.hasOne(StaffProfile, { foreignKey: "userId" });
StaffProfile.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Leave, { foreignKey: "applicantId" });
Leave.belongsTo(User, { foreignKey: "applicantId" });

User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

// Parent-Student Associations
Parent.hasMany(Student, { foreignKey: "parentId" });
Student.belongsTo(Parent, { foreignKey: "parentId" });

// Academic Associations
Class.hasMany(Timetable, { foreignKey: "classId" });
Timetable.belongsTo(Class, { foreignKey: "classId" });

Subject.hasMany(Timetable, { foreignKey: "subjectId" });
Timetable.belongsTo(Subject, { foreignKey: "subjectId" });

User.hasMany(Timetable, { foreignKey: "teacherId" }); // User as Teacher
Timetable.belongsTo(User, { foreignKey: "teacherId" });

// Attendance Associations
Student.hasMany(Attendance, { foreignKey: "studentId" });
Attendance.belongsTo(Student, { foreignKey: "studentId" });

Class.hasMany(Attendance, { foreignKey: "classId" }); // Optional link
Attendance.belongsTo(Class, { foreignKey: "classId" });

// Exam Associations
Class.hasMany(Exam, { foreignKey: "classId" });
Exam.belongsTo(Class, { foreignKey: "classId" });

Exam.hasMany(ExamResult, { foreignKey: "examId" });
ExamResult.belongsTo(Exam, { foreignKey: "examId" });

Student.hasMany(ExamResult, { foreignKey: "studentId" });
ExamResult.belongsTo(Student, { foreignKey: "studentId" });

Subject.hasMany(ExamResult, { foreignKey: "subjectId" });
ExamResult.belongsTo(Subject, { foreignKey: "subjectId" });

Student.belongsTo(Class, { foreignKey: "classId" });
Class.hasMany(Student, { foreignKey: "classId" });

// Finance Associations
Class.hasMany(FeeStructure, { foreignKey: "classId" });
FeeStructure.belongsTo(Class, { foreignKey: "classId" });

FeeStructure.hasMany(FeePayment, { foreignKey: "feeStructureId" });
FeePayment.belongsTo(FeeStructure, { foreignKey: "feeStructureId" });

Student.hasMany(FeePayment, { foreignKey: "studentId" });
FeePayment.belongsTo(Student, { foreignKey: "studentId" });

StaffProfile.hasMany(Payroll, { foreignKey: "staffId" });
Payroll.belongsTo(StaffProfile, { foreignKey: "staffId" });

module.exports = {
  sequelize,
  Sequelize,
  School,
  User,
  Parent,
  Student,
  StaffProfile,
  Class,
  Subject,
  Timetable,
  Attendance,
  Leave,
  Exam,
  ExamResult,
  GradeRule,
  FeeStructure,
  FeePayment,
  Payroll,
  Notification
};

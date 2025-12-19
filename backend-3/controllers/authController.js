const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, School, StaffProfile, Parent } = require("../models");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

exports.registerSchool = async (req, res) => {
  try {
    const { schoolName, schoolAddress, schoolBoard, adminEmail, adminPhone, adminPassword, adminName } = req.body;
    
    // Basic validation
    if (!schoolName || !adminEmail || !adminPassword) {
         return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 1. Create School
    const newSchool = await School.create({
        name: schoolName,
        address: schoolAddress,
        board: schoolBoard,
    });

    // 2. Create Admin User
    const newAdmin = await User.create({
        name: adminName,
        schoolId: newSchool.id,
        email: adminEmail,
        phone: adminPhone,
        passwordHash: await bcrypt.hash(adminPassword, 12),
        role: "SCHOOL_ADMIN",
        isActive: true
    });

    // 3. Create Staff Profile
    await StaffProfile.create({
        schoolId: newSchool.id,
        userId: newAdmin.id,
        employeeCode: `ADMIN-${newSchool.id.split('-')[0]}`,
        designation: "Principal/Admin",
        department: "Administration",
        joiningDate: new Date()
    });

    const token = signToken(newAdmin.id);

    res.status(201).json({
      success: true,
      message: "School registered successfully",
      token,
      data: {
        school: newSchool,
        user: newAdmin,
      },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
         return res.status(401).json({ success: false, message: "Incorrect email or password" });
    }

    const token = signToken(user.id);
    user.passwordHash = undefined;

    let additionalData = {};

    // Fetch Role Specific Profile
    if (user.role === 'PARENT') {
        const parent = await Parent.findOne({ where: { userId: user.id } });
        if (parent) {
            additionalData.parent = parent;
        }
    } else if (['SCHOOL_ADMIN', 'STAFF', 'TEACHER'].includes(user.role)) {
         const staff = await StaffProfile.findOne({ where: { userId: user.id } });
         if (staff) {
             additionalData.staffProfile = staff;
         }
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        user,
        ...additionalData
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

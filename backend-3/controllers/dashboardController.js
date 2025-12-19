const { 
  School, 
  User, 
  Student, 
  Parent, 
  Class, 
  Subject 
} = require("../models");

exports.getSchoolStats = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;

    const [
      studentsCount,
      teachersCount,
      classesCount,
      parentsCount,
      recentStudents
    ] = await Promise.all([
      Student.count({ where: { schoolId } }),
      User.count({ where: { schoolId, role: 'TEACHER' } }), // Assuming TEACHER role exists
      Class.count({ where: { schoolId } }),
      Parent.count({ 
        include: [{ 
          model: User, 
          where: { schoolId },
          required: true 
        }] 
      }),
      Student.findAll({
        where: { schoolId },
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'admissionNumber', 'createdAt'],
        include: [{ model: Class, attributes: ['name', 'section'] }]
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          students: studentsCount,
          teachers: teachersCount,
          classes: classesCount,
          parents: parentsCount
        },
        recentStudents
      }
    });
  } catch (error) {
    console.error("Get school stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSystemStats = async (req, res) => {
  try {
    // Check if user is SUPER_ADMIN (middleware usually handles this but safety check)
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const [
      schoolsCount,
      usersCount,
      recentSchools
    ] = await Promise.all([
      School.count(),
      User.count(),
      School.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'email', 'createdAt', 'status'] // Ensure 'status' exists or remove
      })
    ]);

    // Mock revenue for now as we don't have subscription model fully detailed
    const totalRevenue = schoolsCount * 1500; 

    res.status(200).json({
      success: true,
      data: {
        counts: {
          schools: schoolsCount,
          users: usersCount,
          revenue: totalRevenue
        },
        recentSchools
      }
    });
  } catch (error) {
    console.error("Get system stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

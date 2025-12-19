import api from '@/config/axiosConfig';

/**
 * Mark attendance
 * @param {Object} data - Attendance data
 * @returns {Promise<Object>} Response
 */
const markAttendance = async (data) => {
  try {
    const response = await api.post('/attendance/mark', data);
    return response;
  } catch (error) {
    console.error('Mark attendance error:', error);
    return error.response;
  }
};

/**
 * Get attendance report
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response
 */
const getAttendanceReport = async (params) => {
  try {
    const response = await api.get('/attendance/report', { params });
    return response;
  } catch (error) {
    console.error('Get attendance report error:', error);
    return error.response;
  }
};

const attendanceService = {
  markAttendance,
  getAttendanceReport,
};

export default attendanceService;

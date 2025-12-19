import api from '@/config/axiosConfig';

/**
 * Create a new exam
 * @param {Object} data - Exam data
 * @returns {Promise<Object>} Response
 */
const createExam = async (data) => {
  try {
    const response = await api.post('/exams', data); // Assuming path is /exams based on route file
    return response;
  } catch (error) {
    console.error('Create exam error:', error);
    return error.response;
  }
};

/**
 * Get all exams
 * @returns {Promise<Object>} Response
 */
const getExams = async () => {
  try {
    const response = await api.get('/exams');
    return response;
  } catch (error) {
    console.error('Get exams error:', error);
    return error.response;
  }
};

/**
 * Add exam result
 * @param {Object} data - Result data
 * @returns {Promise<Object>} Response
 */
const addExamResult = async (data) => {
  try {
    const response = await api.post('/exams/results', data);
    return response;
  } catch (error) {
    console.error('Add exam result error:', error);
    return error.response;
  }
};

/**
 * Get student report card
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response
 */
const getStudentReportCard = async (params) => {
  try {
    const response = await api.get('/exams/report', { params });
    return response;
  } catch (error) {
    console.error('Get report card error:', error);
    return error.response;
  }
};

const examService = {
  createExam,
  getExams,
  addExamResult,
  getStudentReportCard,
};

export default examService;

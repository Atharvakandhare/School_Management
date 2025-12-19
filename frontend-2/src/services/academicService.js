import api from '@/config/axiosConfig';

/**
 * Create a new class
 * @param {Object} data - Class data
 * @param {string} data.name - Class name
 * @param {string} data.grade - Grade level
 * @returns {Promise<Object>} Response
 */
const createClass = async (data) => {
  try {
    const response = await api.post('/academics/classes', data);
    return response;
  } catch (error) {
    console.error('Create class error:', error);
    return error.response;
  }
};

/**
 * Get all classes
 * @returns {Promise<Object>} Response
 */
const getAllClasses = async () => {
  try {
    const response = await api.get('/academics/classes');
    return response;
  } catch (error) {
    console.error('Get classes error:', error);
    return error.response;
  }
};

/**
 * Create a new subject
 * @param {Object} data - Subject data
 * @param {string} data.name - Subject name
 * @param {string} data.code - Subject code
 * @returns {Promise<Object>} Response
 */
const createSubject = async (data) => {
  try {
    const response = await api.post('/academics/subjects', data);
    return response;
  } catch (error) {
    console.error('Create subject error:', error);
    return error.response;
  }
};

/**
 * Get all subjects
 * @returns {Promise<Object>} Response
 */
const getAllSubjects = async () => {
  try {
    const response = await api.get('/academics/subjects');
    return response;
  } catch (error) {
    console.error('Get subjects error:', error);
    return error.response;
  }
};

/**
 * Create a new timetable entry
 * @param {Object} data - Timetable entry data
 * @returns {Promise<Object>} Response
 */
const createTimetableEntry = async (data) => {
  try {
    const response = await api.post('/academics/timetable', data);
    return response;
  } catch (error) {
    console.error('Create timetable error:', error);
    return error.response;
  }
};

/**
 * Get timetable
 * @returns {Promise<Object>} Response
 */
const getTimetable = async () => {
  try {
    const response = await api.get('/academics/timetable');
    return response;
  } catch (error) {
    console.error('Get timetable error:', error);
    return error.response;
  }
};

const academicService = {
  createClass,
  getAllClasses,
  createSubject,
  getAllSubjects,
  createTimetableEntry,
  getTimetable,
};

export default academicService;

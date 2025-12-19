import api from '@/config/axiosConfig';

/**
 * Create a new fee structure
 * @param {Object} data - Fee structure data
 * @returns {Promise<Object>} Response
 */
const createFeeStructure = async (data) => {
  try {
    const response = await api.post('/finance/fees', data);
    return response;
  } catch (error) {
    console.error('Create fee structure error:', error);
    return error.response;
  }
};

/**
 * Get fee structures
 * @returns {Promise<Object>} Response
 */
const getFeeStructures = async () => {
  try {
    const response = await api.get('/finance/fees');
    return response;
  } catch (error) {
    console.error('Get fee structures error:', error);
    return error.response;
  }
};

/**
 * Collect fee
 * @param {Object} data - Payment data
 * @returns {Promise<Object>} Response
 */
const collectFee = async (data) => {
  try {
    const response = await api.post('/finance/fees/collect', data);
    return response;
  } catch (error) {
    console.error('Collect fee error:', error);
    return error.response;
  }
};

/**
 * Create payroll record
 * @param {Object} data - Payroll data
 * @returns {Promise<Object>} Response
 */
const createPayrollRecord = async (data) => {
  try {
    const response = await api.post('/finance/payroll', data);
    return response;
  } catch (error) {
    console.error('Create payroll error:', error);
    return error.response;
  }
};

const financeService = {
  createFeeStructure,
  getFeeStructures,
  collectFee,
  createPayrollRecord,
};

export default financeService;

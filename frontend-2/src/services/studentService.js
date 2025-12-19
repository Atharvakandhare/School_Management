import api from '@/config/axiosConfig';

const createStudent = async (data) => {
    try {
        const response = await api.post('/students', data);
        return response;
    } catch (error) {
        console.error('Create student error:', error);
        return error.response;
    }
};

const getAllStudents = async (params) => {
    try {
        const response = await api.get('/students', { params });
        return response;
    } catch (error) {
        console.error('Get all students error:', error);
        return error.response;
    }
};

const updateStudent = async (id, data) => {
    try {
        const response = await api.patch(`/students/${id}`, data);
        return response;
    } catch (error) {
        console.error('Update student error:', error);
        return error.response;
    }
};

const bulkUpdateStudents = async (data) => {
    try {
        const response = await api.post('/students/bulk-update', data);
        return response;
    } catch (error) {
        console.error('Bulk update error:', error);
        return error.response;
    }
};

const studentService = {
    createStudent,
    getAllStudents,
    updateStudent,
    bulkUpdateStudents
};

export default studentService;

import api from '../lib/axios';

const progressService = {
    getProgress: async (courseId) => {
        const response = await api.get(`/courses/${courseId}/progress`);
        return response.data;
    },

    updateProgress: async (courseId, progressData) => {
        const response = await api.put(`/courses/${courseId}/progress`, progressData);
        return response.data;
    }
};

export default progressService;

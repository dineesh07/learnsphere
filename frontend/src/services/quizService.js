import api from '../lib/axios';

const quizService = {
    getQuiz: async (courseId, quizId) => {
        const response = await api.get(`/courses/${courseId}/quizzes/${quizId}`);
        return response.data;
    },

    submitAttempt: async (courseId, quizId, attemptData) => {
        const response = await api.post(`/courses/${courseId}/quizzes/${quizId}/attempt`, attemptData);
        return response.data;
    },

    getMyAttempts: async (courseId, quizId) => {
        const response = await api.get(`/courses/${courseId}/quizzes/${quizId}/attempts`);
        return response.data;
    }
};

export default quizService;

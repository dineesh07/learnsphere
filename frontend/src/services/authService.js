import api from '../lib/axios';

const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (userData) => {
        const response = await api.post('/auth/login', userData);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateDetails: async (userData) => {
        const response = await api.put('/auth/updatedetails', userData);
        return response.data;
    },

    updatePassword: async (passwordData) => {
        const response = await api.put('/auth/updatepassword', passwordData);
        return response.data;
    },
};

export default authService;

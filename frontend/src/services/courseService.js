import api from '../lib/axios';

const courseService = {
    getCourses: async (params) => {
        const response = await api.get('/courses', { params });
        return response.data;
    },

    getCourse: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },

    createCourse: async (courseData) => {
        const response = await api.post('/courses', courseData);
        return response.data;
    },

    updateCourse: async (id, courseData) => {
        const response = await api.put(`/courses/${id}`, courseData);
        return response.data;
    },

    deleteCourse: async (id) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    },

    uploadPhoto: async (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.put(`/courses/${id}/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Lesson related
    addLesson: async (courseId, lessonData) => {
        const response = await api.post(`/courses/${courseId}/lessons`, lessonData);
        return response.data;
    },

    // Invite
    inviteUser: async (courseId, email) => {
        const response = await api.post(`/courses/${courseId}/invite`, { email });
        return response.data;
    }
};

export default courseService;

import axios from '../lib/axios';

const uploadService = {
    // Upload a file (video, document, image)
    uploadFile: async (formData) => {
        const response = await axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default uploadService;

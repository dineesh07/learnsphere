import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.login(userData);
            // Store token in localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            set({ user: response.data, isAuthenticated: true, isLoading: false });
            return response;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Login failed', isLoading: false });
            throw error;
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.register(userData);
            // Store token in localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            set({ user: response.data, isAuthenticated: true, isLoading: false });
            return response;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Registration failed', isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
        // Optional: api call to logout if cookie based
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            // Check if we have token/cookie? 
            // Assuming cookie is httpOnly, we just call getMe
            // If using local storage for token, we need to set header.
            // My backend implementation uses cookie OR header.
            // Let's rely on cookie or assume token is not stored in localStorage for now since I used cookie in backend.
            // But I also sent token in response.
            // If I want to support header, I should store token.
            // Let's assume cookie is handling it or I should store it.
            // In backend `sendTokenResponse`, I sent both cookie and json token.

            const response = await authService.getMe();
            set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));

export default useAuthStore;

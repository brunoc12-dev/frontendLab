import axios from "axios";
import {useAuthStore} from "@/stores/auth";

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.token;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const authStore = useAuthStore();
                const refreshToken = authStore.refreshToken;
                
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }
                
                // Try to refresh the token
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/users/token/refresh/`,
                    { refresh: refreshToken }
                );
                
                if (response.data.access) {
                    // Update the token in the store
                    authStore.setToken(response.data.access);
                    
                    // Retry the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // If refresh fails, logout the user
                const authStore = useAuthStore();
                authStore.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

// Auth endpoints
const auth = {
    login: (credentials) => api.post('/users/login/', credentials),
    register: (userData) => api.post('/users/register/', userData),
    refreshToken: (refreshToken) => api.post('/users/token/refresh/', { refresh: refreshToken }),
};

// Task endpoints
const tasks = {
    getAllTasks: () => api.get('/tasks/'),
    getTaskById: (id) => api.get(`/tasks/${id}/`),
    registerTask: (taskData) => api.post('/tasks/', taskData),
    updateTask: (id, taskData) => api.put(`/tasks/${id}/`, taskData),
    deleteTask: (id) => api.delete(`/tasks/${id}/`),
};

// XML document endpoints
const xml = {
    uploadXml: (formData) => api.post('/xml/upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getAllXmlDocuments: () => api.get('/xml/'),
    getXmlStatistics: (month, year) => api.get('/xml/statistics/', {
        params: {
            month,
            year,
        },
    }),
    getLatestXmlDocuments: (limit = 10) => api.get('/xml/latest/', {
        params: {
            limit,
        },
    }),
};

// Export all API methods
export default {
    ...auth,
    ...tasks,
    ...xml,
};

export { auth, tasks, xml };
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_type');

      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (email, password) => {
    console.log('API Service: Logging in with email:', email);

    // Use the custom login endpoint with JSON
    return axios({
      method: 'post',
      url: 'http://localhost:8000/api/v1/auth/login/custom',
      data: {
        username: email,
        password: password
      },
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log('API Service: Login response:', response);
        return response;
      })
      .catch(error => {
        console.error('API Service: Login error:', error);
        console.error('API Service: Error response:', error.response);
        throw error;
      });
  },
  register: (userData) => {
    console.log('API Service: Registering user with data:', userData);
    return axios({
      method: 'post',
      url: 'http://localhost:8000/api/v1/users/',
      data: userData,
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log('API Service: Registration response:', response);
        return response;
      })
      .catch(error => {
        console.error('API Service: Registration error:', error);
        console.error('API Service: Error response:', error.response);
        throw error;
      });
  },
  getCurrentUser: () => {
    const token = localStorage.getItem('auth_token');
    return axios({
      method: 'get',
      url: 'http://localhost:8000/api/v1/users/me',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('API Service: Get current user response:', response);
        return response;
      })
      .catch(error => {
        console.error('API Service: Get current user error:', error);
        console.error('API Service: Error response:', error.response);
        throw error;
      });
  },
};

// User services
export const userService = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/me', userData),
};

// Student services
export const studentService = {
  getProfile: () => api.get('/students/me'),
  updateProfile: (data) => api.put('/students/me', data),
};

// Senior services
export const seniorService = {
  getProfile: () => api.get('/seniors/me'),
  updateProfile: (data) => api.put('/seniors/me', data),
};

// Chore services
export const choreService = {
  getAllChores: () => api.get('/chores/'),
  getChoreById: (id) => api.get(`/chores/${id}`),
  createChore: (choreData) => api.post('/chores/', choreData),
  updateChore: (id, choreData) => api.put(`/chores/${id}`, choreData),
  deleteChore: (id) => api.delete(`/chores/${id}`),
  volunteerForChore: (id) => api.post(`/chores/${id}/volunteer`),
  completeChore: (id) => api.post(`/chores/${id}/complete`),
};

export default api;

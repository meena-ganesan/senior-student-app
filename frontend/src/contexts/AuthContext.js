import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUserType = localStorage.getItem('user_type');

    if (token) {
      // Verify token with backend
      authService.getCurrentUser()
        .then(response => {
          setCurrentUser(response.data);
          setUserType(storedUserType);
        })
        .catch(error => {
          // If token is invalid, clear localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_type');
          setError('Session expired. Please login again.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      console.log('AuthContext: Logging in with email:', email);
      const response = await authService.login(email, password);
      console.log('AuthContext: Login response:', response);

      // With axios, the response is in response.data
      const { access_token, user } = response.data;

      // Store token and user type in localStorage
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user_type', user.user_type);

      // Token will be automatically added to requests by the API service

      setCurrentUser(user);
      setUserType(user.user_type);

      return user;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      setError(error.message || 'Failed to login');
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError('');
      console.log('AuthContext: Registering user with data:', userData);
      const response = await authService.register(userData);
      console.log('AuthContext: Registration response:', response);
      return response.data;
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      console.error('AuthContext: Error response:', error.response);
      setError(error.response?.data?.detail || 'Failed to register');
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_type');
    // Token will be removed from localStorage
    setCurrentUser(null);
    setUserType(null);
  };

  const value = {
    currentUser,
    userType,
    login,
    register,
    logout,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          // Verify token validity by calling profile API
          const { data } = await API.get('/users/profile', {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`
            }
          });
          setUser({ ...parsedUser, ...data });
        } catch (error) {
          console.error('Invalid token or session expired. Logging out...', error);
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password',
      };
    }
  };

  const register = async (name, email, password, role, phone) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password, role, phone });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const { data } = await API.put('/users/profile', profileData);
      
      // Merge new profile data with token
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

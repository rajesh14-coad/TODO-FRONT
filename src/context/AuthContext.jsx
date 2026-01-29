import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    setUserInfo(userInfoFromStorage);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/users', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
  };

  const loginAsGuest = async () => {
    try {
      const { data } = await api.post('/users/guest');
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        const guestData = {
          _id: 'guest_' + Date.now(),
          name: 'Guest User',
          email: 'guest@local.test',
          token: 'mock_token',
          isGuest: true
        };
        localStorage.setItem('userInfo', JSON.stringify(guestData));
        setUserInfo(guestData);
        return;
      }
      throw err;
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const { data } = await api.put('/users/profile', userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        const updated = { ...userInfo, ...userData };
        localStorage.setItem('userInfo', JSON.stringify(updated));
        setUserInfo(updated);
        return;
      }
      throw err;
    }
  };

  const value = {
    userInfo,
    loading,
    login,
    logout,
    register,
    loginAsGuest,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAccessToken = () => localStorage.getItem('access_token');

  const fetchUser = async () => {
    const token = getAccessToken();
    console.log("fetchUser - token present:", !!token);
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("fetchUser - response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        // console.log("fetchUser - user data:", data);
        setUser(data);
      } else {
        console.log("fetchUser - token invalide, deconnexion");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
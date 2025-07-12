/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUserApi } from '../services/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthUser = async () => {
    try {
      const userData = await getCurrentUserApi();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error checking authenticated user:", e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validate = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");
      const publicRoutes = ['/login', '/signin'];

      if (publicRoutes.includes(location.pathname)) {
        if (token) {
          const isAuth = await checkAuthUser();
          if (isAuth) {
            navigate('/dashboard'); // ✅ Auto-navigate to dashboard
          }
        } else {
          setLoading(false);
        }
        return;
      }

      const isAuth = await checkAuthUser();
      if (!isAuth) {
        navigate('/login');
      }
    };

    validate();
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, isAuthenticated, checkAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export const useAuth = () => useContext(AuthContext);

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
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (e) {
      console.error("Error checking authenticated user:", e);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validate = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");
      const publicRoutes = ['/login', '/signup', '/search'];

      const isPublicRoute = publicRoutes.includes(location.pathname);

      if (isPublicRoute) {
        if (token) {
          const isAuth = await checkAuthUser();
          if (isAuth) {
            navigate('/dashboard'); // Redirect if already logged in
          }
        }
        setLoading(false);
        return;
      }

      // For protected routes
      const isAuth = await checkAuthUser();
      if (!isAuth) {
        navigate('/'); // Redirect to login
      } else {
        setLoading(false);
      }
    };

    validate();
  }, [location.pathname, navigate, isAuthenticated]); // ✅ Re-run on auth state change

  return (
    <AuthContext.Provider value={{ user, setUser, loading, isAuthenticated, checkAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export const useAuth = () => useContext(AuthContext);

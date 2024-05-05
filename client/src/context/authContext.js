import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import axios from '../services/axios'; 
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const validateSession = () => {
            axios.get('/auth/validate')
                .then(() => {
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    setIsAuthenticated(false);
                    if (window.location.pathname !== '/login') {
                        navigate('/login', { replace: true });
                    }
                });
        };
    
        validateSession();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

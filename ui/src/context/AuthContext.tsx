// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}
interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterService, ConfirmEmailService, LoginService, LogoutService } from '../services/AuthService';
import axios from 'axios';
import { toast } from 'react-toastify';
import { get } from 'http';


interface AuthContextProps {
    user: any;
    isAuthenticated: boolean;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    register: (userData: any) => Promise<{
        success: boolean; status: any; message: any
    }>;
    confirmEmail: (token: string, email: string) => Promise<void>;
    login: (credentials: any) => Promise<{ status: any; message: any }>;
    confirmTwoFA: (userId: string, verifyCode: string) => Promise<{
        token: string;
        success: boolean; status: any; message: any
    }>;
    socialLogin: (credentials: any, provider: string) => Promise<{ status: any; message: any }>;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined);


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
    const [error, setError] = useState<string | null>(null); // Initialize error state
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token }); // Replace with actual user data if available
        }
    }, []);

    const handleAuthAction = async (action: () => Promise<any>, redirectPath: string) => {
        try {
            const result = await action();
            setUser(result); // Update user state with result if needed
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`; // Set authorization header
            navigate(redirectPath);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.'); // Set error message
        }
    };


    const handleRegister = async (userData: any) => {
        try {
            const response = await axios.post('/Account/Register', userData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data;
            }
        }
    };

    const handleConfirmEmail = (token: string, email: string) => handleAuthAction(() => ConfirmEmailService(token, email), '/login');

    const handleLogin = async (credentials: any) => {
        try {
            const response = await axios.post('/Account/Login', credentials);
            setIsAuthenticated(true);
            return response.data;

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data;
            }
            return { status: false, message: 'An unexpected error occurred.' };
        }
    };

    const handleConfirmTwoFA = async (userId: string, verifyCode: string) => {
        try {
            const response = await axios.post('/Account/Verify2FA', { userId, verifyCode });
            console.log(response.data);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data;
            }
        };
    }

    const handleSocialLogin = async (credentials: any, provider: string) => {
        try {
            const response = await axios.post('/Account/SocialLogin', { accessToken: credentials, provider });
            console.log(response.data);


            const token = response.data.data.token.toString();

            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setIsAuthenticated(true);
                return { status: 'success', message: 'Login successful!' };
            } else {
                return { status: 'error', message: 'Login failed, please try again!' };
            }
        } catch (error) {
            console.log(error);

            return { status: 'error', message: 'Login failed, please try again!' };
        }
    };

    const handleLogout = () => {
        LogoutService();
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization']; // Clear authorization header
        navigate('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                setUser,
                register: handleRegister,
                confirmEmail: handleConfirmEmail,
                login: handleLogin,
                confirmTwoFA: handleConfirmTwoFA,
                socialLogin: handleSocialLogin,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

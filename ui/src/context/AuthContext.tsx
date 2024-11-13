<<<<<<< HEAD
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = (token: string) => {
        setToken(token);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout, token }}>
=======
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
    register: (userData: any) => Promise<{ status: any; message: any }>;
    confirmEmail: (token: string, email: string) => Promise<void>;
    login: (credentials: any) => Promise<{ status: any; message: any }>;
    confirmTwoFA: (userId: string, verifyCode: string) => Promise<{ status: any; message: any }>;
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

            const status = response.data.value.status;
            const message = response.data.value.message;

            if (status === 'success') {
                return { status: status, message: message };
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log("ERROR: ", error.response?.data.errors);
                return { status: error.response.data.value.status, message: error.response.data.value.message };
            }
        }
        return { status: 'error', message: 'An unexpected error occurred.' }; // Ensure a return value
    }

    const handleConfirmEmail = (token: string, email: string) => handleAuthAction(() => ConfirmEmailService(token, email), '/login');

    const handleLogin = async (credentials: any) => {
        const resultData = {
            status: '',
            message: '',
            token: '',
            twoFactorEnabled: false,
            userId: ''
        };

        try {
            const response = await axios.post('/Account/Login', credentials);
            console.log(response);

            const responseData = response.data;
            console.log("Response data from handle login: " + responseData);


            const status = responseData.status;
            const message = responseData.message;
            const token = responseData.data.token;
            const userId = responseData.data.user.id || '';
            const twoFactorEnabled = responseData.twoFactorEnabled || false;

            resultData.status = status;
            resultData.message = message;
            resultData.token = token;
            resultData.userId = userId;
            resultData.twoFactorEnabled = twoFactorEnabled;

            console.log(resultData);


            setIsAuthenticated(true);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorResponse = error.response.data.value;
                const status = errorResponse.status;
                const message = errorResponse.message;
                resultData.status = status;
                resultData.message = message;
                setIsAuthenticated(false);
            }

        }
        return resultData;
    };

    const handleConfirmTwoFA = async (userId: string, verifyCode: string) => {
        try {
            const response = await axios.post('/Account/Verify2FA', { userId, verifyCode });
            console.log(response);

            const status = response.data.status;

            if (status === 'success') {
                console.log(response.data.status);
                console.log(response.data.message);
                setIsAuthenticated(true);
                console.log({ status: "success", message: 'Login successful!' });

                return { status: "success", message: 'Login successful!' };
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return { status: error.response.data.value.status, message: error.response.data.value.message };
            }
        }
        return { status: 'error', message: 'An unexpected error occurred.' };
    };


    const handleSocialLogin = async (credentials: any, provider: string) => {
        try {
            const response = await axios.post('/Account/SocialLogin', { accessToken: credentials, provider });
            const token = response.data.token.toString();

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
>>>>>>> temp-branch
            {children}
        </AuthContext.Provider>
    );
};

<<<<<<< HEAD
export const useAuth = (): AuthContextType => {
=======
export const useAuth = (): AuthContextProps => {
>>>>>>> temp-branch
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
<<<<<<< HEAD
};
=======
};
>>>>>>> temp-branch

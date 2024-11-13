import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SocialLoginService } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';

const GoogleLoginButton: React.FC = () => {
    const navigate = useNavigate();
    const { socialLogin } = useAuth();

    const handleGoogleLogin = async (response: CredentialResponse) => {
        if (!response.credential) {
            toast.error("Google login failed: No credentials found.");
            return;
        }

        try {
            const statusMessage = await socialLogin(response.credential, 'Google');

            if (statusMessage.status === "success") {
                toast.success("Google login successful!");
                navigate('/dashboard');
            } else {
                toast.error("Google login failed: An unexpected error occurred.");
            }
        } catch (error: any) {
            console.error("Error during Google login", error);
            const errorMessage = error.response?.data?.message || "An unknown error occurred";
            toast.error(`Google login failed: ${errorMessage}`);
        }
    };

    return (
        <GoogleOAuthProvider clientId="435065019270-sjruvvvj4eo04b5vc4fkv3kbhjrg9g3r.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={handleGoogleLogin}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;

import React from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './FacebookLoginButton.css';
import logo from '../../assets/img/logo/logo-facebook.png';
import { SocialLoginService } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';

const FacebookLoginButton: React.FC = () => {
    const navigate = useNavigate();
    const { socialLogin } = useAuth();

    const handleFacebookLogin = async (response: any) => {
        if (response.status === 'unknown') {
            toast.error("Facebook login failed: No response from Facebook.");
            return;
        }

        try {
            const statusMessage = await socialLogin(response.accessToken, 'Facebook');

            if (statusMessage.status === "success") {
                toast.success("Facebook login successful!");
                navigate('/dashboard');
            } else {
                toast.error("Facebook login failed: An unexpected error occurred.");
            }
        } catch (error: any) {
            console.error("Error during Facebook login", error);
            const errorMessage = error.response?.data?.message || "An unknown error occurred";
            toast.error(`Facebook login failed: ${errorMessage}`);
        }
    };

    return (
        <div className="login-button-container">
            <FacebookLogin
                appId="2222708218116505" // Replace with your Facebook App ID
                autoLoad={false}
                fields="name,email,picture"
                onSuccess={handleFacebookLogin}
                onFail={(error) => toast.error(`Facebook login failed: ${error}`)}
                className="facebook-login-button" // Add a custom class
                render={({ onClick }) => (
                    <div className='facebook-login-button d-flex align-items-center'>
                        <button onClick={onClick} className="btn btn-facebook " style={{ padding: '8px', border: '1px solid rgb(218 220 224)' }}>
                            <img src={logo} alt="Facebook Logo" className="facebook-logo" width={20} />
                            <span className='text-center'>Login with Facebook</span>
                        </button>
                    </div>
                )}
            />
        </div>
    );
};

export default FacebookLoginButton;

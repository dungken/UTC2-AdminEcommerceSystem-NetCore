import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthResponse: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchToken = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        };

        fetchToken();
    }, [location, navigate]);

    return <div>Loading...</div>;
};

export default OAuthResponse;
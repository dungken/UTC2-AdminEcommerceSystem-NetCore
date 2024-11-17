import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ConfirmEmailService } from '../../services/AuthService';

const ConfirmEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [confirmed, setConfirmed] = useState(false);

    const getTokenAndEmail = () => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');
        return { token, email };
    };

    useEffect(() => {
        const confirmEmailProcess = async () => {
            const { token, email } = getTokenAndEmail();

            if (!token || !email) {
                toast.error('Invalid confirmation link.');
                setLoading(false);
                return;
            }

            try {
                const response = await ConfirmEmailService(token, email);
                // console.log(response);

                if (response.success) {
                    setConfirmed(true);
                    toast.success(response.message);
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }
            } catch (error: any) {
                setConfirmed(false);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        confirmEmailProcess();
    }, [location, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (confirmed) {
        return <div>Email confirmed successfully! Redirecting to login...</div>;
    }

    return null;
};

export default ConfirmEmail;
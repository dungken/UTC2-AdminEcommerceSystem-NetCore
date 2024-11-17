import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/img/logo/logo.png';
import { ForgotPasswordService } from '../../services/AuthService';
import { ValidateEmail } from '../../utils/Validation';
import axios from 'axios';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ValidateEmail(email)) {
            return;
        }
        try {
            const response = await ForgotPasswordService(email);

            if (response && response.success === true) {
                toast.info('Password reset instructions sent to your email');
            } else {
                toast.error(response.message || 'An unexpected error occurred');
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="authentication-wrapper authentication-basic container-p-y">
            <div className="authentication-inner">
                <div className="card px-sm-6 px-0 py-3" style={{ border: '1px solid #a19ed9' }}>
                    <div className="card-body py-1">
                        <div className="app-brand justify-content-center">
                            <Link to="/" className="app-brand-link gap-2 text-decoration-none">
                                <span className="app-brand-logo demo">
                                    <img src={logo} alt="brand" className="img-fluid w-px-40" />
                                </span>
                                <span className="app-brand-text demo text-heading fw-bold">Forgot Password 🔒</span>
                            </Link>
                        </div>
                        <div className="text-center">
                        </div>
                        <form id="formAuthentication" className="mb-6" onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="btn btn-primary d-grid w-100" type="submit">Send Reset Instructions</button>
                        </form>
                        <p className="text-center">
                            <span>Remember your password? </span>
                            <Link to="/login" className='text-decoration-none'>
                                <span className='text-decoration-underline'>  Sign in</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
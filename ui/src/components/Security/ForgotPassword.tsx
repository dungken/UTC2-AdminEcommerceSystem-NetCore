// src/components/Auth/ForgotPassword.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/img/logo/logo.png';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/forgot-password', { email });
            setMessage('Instructions to reset your password have been sent to your email.');
        } catch (err) {
            setError('Failed to send reset instructions. Please try again.');
        }
    };

    return (
        <div className="authentication-wrapper authentication-basic container-p-y">
            <div className="authentication-inner">
                <div className="card px-sm-6 px-0">
                    <div className="card-body">
                        <div className="app-brand justify-content-center">
                            <Link to="/" className="app-brand-link gap-2 text-decoration-none">
                                <span className="app-brand-logo demo">
                                    <img src={logo} alt="brand" className="img-fluid w-px-40" />
                                </span>
                                <span className="app-brand-text demo text-heading fw-bold">Forgot Password? 🔒</span>
                            </Link>
                        </div>
                        <p className="mb-6 text-center">Enter your email and we'll send you instructions!</p>
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
                                    autoFocus
                                    required
                                />
                            </div>
                            <button className="btn btn-primary d-grid w-100" type="submit">Send Reset Link</button>
                        </form>
                        {message && <p className="text-center text-success">{message}</p>}
                        {error && <p className="text-center text-danger">{error}</p>}
                        <div className="text-center">
                            <Link to="/login" className="d-flex justify-content-center text-decoration-none mt-4">
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
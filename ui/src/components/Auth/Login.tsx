import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { ValidatePassword } from '../../utils/Validation';
import logo from '../../assets/img/logo/logo.png';
import '../../assets/vendor/css/pages/page-auth.css';
import 'react-toastify/dist/ReactToastify.css';
import SocialLogin from './SocialLogin';

const Login: React.FC = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState(''); // Track userId for 2FA
    const [tokenStored, setTokenStored] = useState('');
    const navigate = useNavigate();
    const { login, confirmTwoFA } = useAuth();

    // Validate form inputs
    const validateForm = () => {
        if (usernameOrEmail.length < 6) {
            toast.error('Please enter your username or email.');
            return false;
        }
        if (!ValidatePassword(password, password)) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        const response: any = await login({ emailOrUsername: usernameOrEmail, password });
        console.log(response);


        if (!response) {
            toast.error('Login failed');
            setIsSubmitting(false);
            return;
        }

        const { data, success, message } = response;

        if (data != null) {
            console.log(data.token);

            setUserId(data.userId); // Update state
            setIsTwoFactorEnabled(data.twoFactorEnabled);
            setTokenStored(data.token);

            // Use direct values from `data` for immediate logic
            if (data.twoFactorEnabled && data.userId) {
                toast.info('A verification code has been sent to your email. Please enter it below.');
                setIsSubmitting(false);
                return;
            }

            console.log(data.token);
            console.log(tokenStored);



            // Normal login flow
            localStorage.setItem('token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            toast.success(message);
            setIsSubmitting(false);
            navigate('/dashboard');
        } else if (success === false) {
            toast.error(message);
            setIsSubmitting(false);
        } else {
            toast.error('Login failed');
            setIsSubmitting(false);
        }
    };


    // Handle 2FA code submission
    const handleTwoFactorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isTwoFactorEnabled && userId && twoFactorCode) {
            setIsSubmitting(true);
            try {
                const responseConfirm = await confirmTwoFA(userId, twoFactorCode);

                if (!responseConfirm) {
                    toast.error('Login failed');
                    setIsSubmitting(false);
                    return;
                }

                // console.log(responseConfirm);

                if (responseConfirm.success === true) {
                    localStorage.setItem('token', tokenStored)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenStored}`;
                    toast.success(responseConfirm.message);
                    navigate('/dashboard');
                } else {
                    toast.error(responseConfirm.message);
                }
            } catch (error) {
                toast.error('Failed to verify 2FA code.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="authentication-wrapper authentication-basic container-p-y">
            <div className="authentication-inner">
                <div className="card px-sm-6 px-0" style={{ border: '1px solid #a19ed9' }}>
                    <div className="card-body">
                        <div className="app-brand justify-content-center">
                            <Link to="/" className="app-brand-link gap-2 text-decoration-none">
                                <span className="app-brand-logo demo">
                                    <img src={logo} alt="brand" className="img-fluid w-px-40" />
                                </span>
                                <span className="app-brand-text demo text-heading fw-bold">Sign in</span>
                            </Link>
                        </div>
                        <div className="text-center">
                            <h4 className="mb-1">Welcome back! 👋</h4>
                            <p className="mb-6">Please sign in to your account</p>
                        </div>
                        <form id="formAuthentication" className="mb-6" onSubmit={isTwoFactorEnabled ? handleTwoFactorSubmit : handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="usernameOrEmail" className="form-label">Username or Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="usernameOrEmail"
                                    name="usernameOrEmail"
                                    placeholder="Enter your username or email"
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="mb-6 form-password-toggle">
                                <label className="form-label" htmlFor="password">Password</label>
                                <div className="input-group input-group-merge">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        id="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span className="input-group-text cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                                        <i className={`bx ${passwordVisible ? 'bx-show' : 'bx-hide'}`}></i>
                                    </span>
                                </div>
                            </div>
                            {isTwoFactorEnabled && (
                                <div className="mb-6">
                                    <label htmlFor="twoFactorCode" className="form-label">Verification Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="twoFactorCode"
                                        name="twoFactorCode"
                                        placeholder="Enter your verification code"
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <button type="submit" className="btn btn-primary d-grid w-100" disabled={isSubmitting}>
                                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>
                        </form>
                        <div className="row">
                            <p className="text-center col-md-6">
                                <Link to="/forgot-password">Forgot Password</Link>
                            </p>
                            <p className="text-center col-md-6">
                                <Link to="/register">Create an account</Link>
                            </p>
                        </div>
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

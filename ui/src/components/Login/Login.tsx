import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css'; // Custom CSS for additional styling

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const ValidateForm = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) {
            newErrors.email = '*';
        }
        if (!password) {
            newErrors.password = '*';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const HandleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (ValidateForm()) {
            try {
                const response = await axios.post('/api/auth/login', {
                    username: email,
                    password: password
                });

                const { token } = response.data;

                if (rememberMe) {
                    localStorage.setItem('email', email);
                    localStorage.setItem('password', password);
                } else {
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                }

                localStorage.setItem('token', token);
                // Redirect to the dashboard or another page
                console.log('Login successful', response.data);
            } catch (error) {
                console.error('Login failed', error);
                setErrors({ password: 'Invalid username or password' });
            }
        }
    };

    return (
        <div className="container-xxl d-flex align-items-center justify-content-center min-vh-100">
            <div className="authentication-wrapper authentication-basic container-p-y">
                <div className="authentication-inner">
                    <div className="card px-sm-6 px-0 shadow-lg">
                        <div className="card-body">
                            <div className="app-brand justify-content-center mb-4">
                                <a href="index.html" className="app-brand-link gap-2">
                                    <span className="app-brand-logo demo">
                                        <img src="../assets/img/logo/logo.png" alt="brand" className="img-fluid w-px-40" />
                                    </span>
                                    <span className="app-brand-text demo text-heading fw-bold">Sign in</span>
                                </a>
                            </div>
                            <div className="text-center mb-4">
                                <h4 className="mb-1">Welcome to Coolmate! 👋</h4>
                                <p className="mb-6">Please sign-in to your account and start the adventure</p>
                            </div>
                            <form id="formAuthentication" className="mb-6" onSubmit={HandleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email or Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        name="email-username"
                                        placeholder="Enter your email or username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-3 form-password-toggle">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                            aria-describedby="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                    </div>
                                </div>
                                <div className="mb-3 d-flex justify-content-between">
                                    <div className="form-check mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="remember-me"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="remember-me"> Remember Me </label>
                                    </div>
                                    <a href="forgot-password.html">
                                        <span>Forgot Password?</span>
                                    </a>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-primary d-grid w-100" type="submit">Login</button>
                                </div>
                            </form>
                            <p className="text-center">
                                <span>New on our platform?</span>
                                <a href="register.html">
                                    <span>Create an account</span>
                                </a>
                            </p>
                            <div className="row">
                                <div className="col-12">
                                    <p className="mt-5 mb-5 text-center">Or continue with</p>
                                    <div className="d-flex gap-2 gap-sm-3 justify-content-center">
                                        <a href="#!" className="btn btn-lg btn-outline-danger p-3 lh-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                            </svg>
                                        </a>
                                        <a href="#!" className="btn btn-lg btn-outline-primary p-3 lh-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                            </svg>
                                        </a>
                                        <a href="#!" className="btn btn-lg btn-outline-info p-3 lh-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                                                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                                            </svg>
                                        </a>
                                        <a href="#!" className="btn btn-lg btn-outline-dark p-3 lh-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-apple" viewBox="0 0 16 16">
                                                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
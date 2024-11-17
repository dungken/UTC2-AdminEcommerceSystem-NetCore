import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../../assets/img/logo/logo.png';
import { RegisterService } from '../../services/AuthService';
import SocialLogin from './SocialLogin';
import { ValidateEmail, ValidatePassword, ValidateUsername, ValidatePhoneNumber } from '../../utils/Validation';
import { useAuth } from '../../context/AuthContext';

const Register: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const validateForm = () => {
        if (!ValidateUsername(userName)) return false;
        if (!ValidateEmail(email)) return false;
        if (!ValidatePassword(password, password)) return false;

        if (firstName.length <= 1) {
            toast.error('First name must be at least 2 characters long.');
            return false;
        }
        if (lastName.length <= 1) {
            toast.error('Last name must be at least 2 characters long.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const userData = {
            username: userName,
            email,
            password,
            firstname: firstName,
            lastname: lastName,
        };

        try {
            const response = await register(userData);
            if (response.success === true) {
                toast.success(response.message);
                navigate('/login');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error((error as any).message);
        }
    }

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
                                <span className="app-brand-text demo text-heading fw-bold">Sign up</span>
                            </Link>
                        </div>
                        <div className="text-center">
                            <h4 className="mb-1">Adventure starts here 🚀</h4>
                            <p className="mb-6">Make your app management easy and fun!</p>
                        </div>
                        <form id="formAuthentication" className="mb-6" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="mb-6 col-md-6">
                                    <label htmlFor="firstName" className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Enter your first name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-6 col-md-6">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Enter your last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="userName" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="userName"
                                    name="userName"
                                    placeholder="Enter your username"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
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
                            <div className="mb-6 form-password-toggle">
                                <label className="form-label" htmlFor="password">Password</label>
                                <div className="input-group input-group-merge">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        id="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                        aria-describedby="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span className="input-group-text cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                                        <i className={`bx ${passwordVisible ? 'bx-show' : 'bx-hide'}`}></i>
                                    </span>
                                </div>
                            </div>
                            <button className="btn btn-primary d-grid w-100" type="submit">Sign up</button>
                        </form>
                        <p className="text-center">
                            <span>Already have an account? </span>
                            <Link to="/login" className='text-decoration-none'>
                                <span className='text-decoration-underline'>  Sign in</span>
                            </Link>
                        </p>
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Register;
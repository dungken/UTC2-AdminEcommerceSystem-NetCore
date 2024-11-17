import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/img/logo/logo.png';
import { ResetPasswordService } from '../../services/AuthService';
import { ValidatePassword } from '../../utils/Validation';
import { PasswordField } from '../../utils/Controls';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const GetTokenAndEmail = () => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');
        return { token, email };
    };

    const HandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { token, email } = GetTokenAndEmail();

        if (!token || !email) {
            toast.error('Invalid reset link.');
            return;
        }

        if (!ValidatePassword(newPassword, confirmPassword)) {
            setPasswordError('Password does not meet the criteria.');
            return;
        } else {
            setPasswordError('');
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            return;
        } else {
            setConfirmPasswordError('');
        }

        try {
            const response = await ResetPasswordService(token, email, newPassword);
            if (response.success === true) {
                toast.success(response.message);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                toast.error(response.message || 'An unexpected error occurred.');
            }
        } catch (error) {
            toast.error((error as any).message);
        }
    };

    return (
        <div className="authentication-wrapper authentication-basic container-p-y">
            <div className="authentication-inner">
                <div className="card px-sm-6 px-0 py-3" style={{ border: '1px solid #a19ed9' }}>
                    <div className="card-body text-center p-0">
                        <div className="app-brand justify-content-center">
                            <Link to="/" className="app-brand-link gap-2 text-decoration-none">
                                <span className="app-brand-logo demo">
                                    <img src={logo} alt="brand" className="img-fluid w-px-40" />
                                </span>
                                <span className="app-brand-text demo text-heading fw-bold">Reset Password 🔒</span>
                            </Link>
                        </div>
                    </div>
                    <form id="formAuthentication" className="m-3" onSubmit={HandleSubmit}>
                        <div className="row mb-2">
                            <PasswordField
                                label="New Password"
                                id="newPassword"
                                name="newPassword"
                                visible={newPasswordVisible}
                                setVisible={setNewPasswordVisible}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            {passwordError && <div className="text-danger">{passwordError}</div>}
                        </div>

                        <div className="row mb-2">
                            <PasswordField
                                label="Confirm New Password"
                                id="confirmPassword"
                                name="confirmPassword"
                                visible={confirmPasswordVisible}
                                setVisible={setConfirmPasswordVisible}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {confirmPasswordError && <div className="text-danger">{confirmPasswordError}</div>}
                        </div>

                        <button className="btn btn-primary d-grid w-100 mt-3" type="submit">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

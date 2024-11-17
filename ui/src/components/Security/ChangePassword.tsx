import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ChangePassword.css'; // Import any necessary CSS
import { ChangePasswordService } from '../../services/AuthService';
import { ValidatePassword } from '../../utils/Validation';

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const validateForm = () => {
        if (currentPassword.length < 8) {
            toast.error('Please enter your current password.');
            return false;
        }
        if (!ValidatePassword(newPassword, confirmPassword)) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await ChangePasswordService(currentPassword, newPassword);
            console.log(response);


            if (response && response.success) {
                toast.success(response.message);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                throw new Error(response.message || "An unexpected error occurred)");
            }
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="card mb-0">
            <h5 className="card-header">Change Password</h5>
            <div className="card-body pt-1">
                <form id="formAccountSettings" method="POST" onSubmit={handleSubmit} className="fv-plugins-bootstrap5 fv-plugins-framework" noValidate>
                    <div className="row">
                        <div className="mb-6 col-md-12 form-password-toggle fv-plugins-icon-container">
                            <label className="form-label" htmlFor="currentPassword">Current Password</label>
                            <div className="input-group input-group-merge has-validation">
                                <input
                                    className="form-control"
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="currentPassword"
                                    id="currentPassword"
                                    placeholder="············"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                                <span className="input-group-text cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                                    <i className={`bx ${passwordVisible ? 'bx-show' : 'bx-hide'}`}></i>
                                </span>
                            </div>
                        </div>
                        <div className="mb-6 col-md-12 form-password-toggle fv-plugins-icon-container">
                            <label className="form-label" htmlFor="newPassword">New Password</label>
                            <div className="input-group input-group-merge has-validation">
                                <input
                                    className="form-control"
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="newPassword"
                                    id="newPassword"
                                    placeholder="············"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <span className="input-group-text cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                                    <i className={`bx ${passwordVisible ? 'bx-show' : 'bx-hide'}`}></i>
                                </span>
                            </div>
                        </div>
                        <div className="mb-6 col-md-12 form-password-toggle fv-plugins-icon-container">
                            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="input-group input-group-merge has-validation">
                                <input
                                    className="form-control"
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="············"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <span className="input-group-text cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                                    <i className={`bx ${passwordVisible ? 'bx-show' : 'bx-hide'}`}></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary d-grid w-100" type="submit">Change Password</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
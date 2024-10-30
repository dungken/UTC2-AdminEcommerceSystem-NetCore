// src/components/Pages/ChangePassword.tsx
import React, { useState } from 'react';
import './ChangePassword.css'; // Import any necessary CSS

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="card mb-6">
            <h5 className="card-header">Change Password</h5>
            <div className="card-body pt-1">
                <form id="formAccountSettings" method="GET" onSubmit={handleSubmit} className="fv-plugins-bootstrap5 fv-plugins-framework" noValidate>
                    <div className="row">
                        <div className="mb-6 col-md-3 form-password-toggle fv-plugins-icon-container">
                            <label className="form-label" htmlFor="currentPassword">Current Password</label>
                            <div className="input-group input-group-merge has-validation">
                                <input
                                    className="form-control"
                                    type="password"
                                    name="currentPassword"
                                    id="currentPassword"
                                    placeholder="············"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                            </div>
                            <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                        </div>
                        <div className="mb-6 col-md-3 form-password-toggle fv-plugins-icon-container">
                            <label className="form-label" htmlFor="newPassword">New Password</label>
                            <div className="input-group input-group-merge has-validation">
                                <input
                                    className="form-control"
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="············"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                            </div>
                            <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                        </div>
                        <div className="mb-6 col-md-3 form-password-toggle fv-plugins-icon-container">
                            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="input-group input-group-merge has-validation">
                                <input
                                    className="form-control"
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="············"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                            </div>
                            <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                        </div>
                    </div>
                    <h6 className="text-body">Password Requirements:</h6>
                    <ul className="ps-4 mb-0">
                        <li className="mb-4">Minimum 8 characters long - the more, the better</li>
                        <li className="mb-4">At least one lowercase character</li>
                        <li>At least one number, symbol, or whitespace character</li>
                    </ul>
                    <div className="mt-6">
                        <button type="submit" className="btn btn-primary me-3">Save changes</button>
                        <button type="reset" className="btn btn-label-secondary">Reset</button>
                    </div>
                    <input type="hidden" />
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
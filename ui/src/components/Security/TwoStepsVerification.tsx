// src/components/Pages/TwoStepsVerification.tsx
import React, { useState } from 'react';
import './TwoStepsVerification.css'; // Import any necessary CSS

const TwoStepsVerification: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="card mb-6">
            <div className="card-body">
                <h5 className="mb-6">Two-steps verification</h5>
                <h5 className="mb-4 text-body">Two factor authentication is not enabled yet.</h5>
                <p className="w-75">
                    Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in.
                    <a href="javascript:void(0);" className="text-nowrap">Learn more.</a>
                </p>
                <button className="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#enableOTP">
                    Enable Two-Factor Authentication
                </button>
            </div>

            {/* Modal */}
            {/* Enable OTP Modal */}
            <div className="modal fade" id="enableOTP" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-simple modal-enable-otp modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <div className="text-center mb-6">
                                <h4 className="mb-2">Enable One Time Password</h4>
                                <p>Verify Your Mobile Number for SMS</p>
                            </div>
                            <p>Enter your mobile phone number with country code and we will send you a verification code.</p>
                            <form id="enableOTPForm" className="row g-6 fv-plugins-bootstrap5 fv-plugins-framework" onSubmit={handleSubmit} noValidate>
                                <div className="col-12 fv-plugins-icon-container">
                                    <label className="form-label" htmlFor="modalEnableOTPPhone">Phone Number</label>
                                    <div className="input-group has-validation">
                                        <span className="input-group-text">US (+1)</span>
                                        <input
                                            type="text"
                                            id="modalEnableOTPPhone"
                                            name="modalEnableOTPPhone"
                                            className="form-control phone-number-otp-mask"
                                            placeholder="202 555 0111"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary me-3">Submit</button>
                                    <button type="reset" className="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                </div>
                                <input type="hidden" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoStepsVerification;
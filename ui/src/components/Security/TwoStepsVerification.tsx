import React, { useState, useRef, useEffect } from 'react';
import { DisableTwoFactorVerificationService, EnabledTwoFactorVerificationService, VerifyCodeService, GetTwoFAStatusService } from '../../services/AuthService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TwoStepsVerification.css';

const TwoStepsVerification: React.FC = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Fetch the current 2FA status on component mount
    useEffect(() => {
        const checkTwoFAStatus = async () => {
            try {
                const response = await GetTwoFAStatusService();
                if (response.TwoFactorEnabled) {
                    setIsVerified(true); // 2FA is enabled
                }
            } catch (error) {
                toast.error("Failed to fetch 2FA status.");
            }
        };

        checkTwoFAStatus();
    }, []);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await EnabledTwoFactorVerificationService();
            if (response.success === true) {
                toast.success(response.message);
                setIsCodeSent(true);
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.response.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await VerifyCodeService(verificationCode);
            if (response.success === true) {
                toast.success(response.message);
                setIsVerified(true);
                setIsCodeSent(false); // Hide the verification form
                setVerificationCode(''); // Clear the input
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.response.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggle2FA = async () => {
        setIsSubmitting(true);
        try {
            if (isVerified) {
                const response = await DisableTwoFactorVerificationService();
                if (response.success === true) {
                    toast.success(response.message);
                    setIsVerified(false); // Reset the verification state
                    setIsCodeSent(false); // Optionally reset the code sent state
                    setVerificationCode(''); // Clear the input for a fresh start
                } else {
                    toast.error(response.message);
                }
            } else {
                await handleSendCode({ preventDefault: () => { } } as React.FormEvent); // Trigger the code sending function
            }
        } catch (error) {
            toast.error("An error occurred while toggling 2FA.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`row p-4 ${!(isCodeSent && !isVerified) ? 'col-md-12' : ''}`}>
            <div className="card-body col-md-4">
                <h5 className="card-title">Two-Step Verification</h5>
                <button className={`btn btn-${isVerified ? 'danger' : 'primary'} mt-2`} onClick={handleToggle2FA} disabled={isSubmitting}>
                    {isSubmitting ? (isVerified ? 'Disabling...' : 'Sending...') : (isVerified ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication')}
                </button>
            </div>

            {/* Display verification form if the code has been sent and not verified */}
            {isCodeSent && !isVerified && (
                <div className="card-body col-md-7">
                    <h5>Enter Verification Code</h5>
                    <form id="verifyCodeForm" className="row g-6 mt-4" onSubmit={handleVerifyCode} noValidate>
                        <div className="col-12">
                            <label className="form-label" htmlFor="verificationCode">Verification Code</label>
                            <input
                                ref={inputRef}
                                type="text"
                                className="form-control"
                                id="verificationCode"
                                name="verificationCode"
                                placeholder="Enter verification code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                            <button className="btn btn-primary d-grid w-100 mt-2" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TwoStepsVerification;

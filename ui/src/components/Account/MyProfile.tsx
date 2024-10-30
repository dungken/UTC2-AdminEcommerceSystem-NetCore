// src/components/Pages/MyProfile.tsx
import React, { useState } from 'react';
import './MyProfile.css'; // Import any necessary CSS
import logo from '../../assets/img/logo/logo.png';

const MyProfile: React.FC = () => {
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe');
    const [username, setUsername] = useState('joindoe123');
    const [email, setEmail] = useState('john.doe@example.com');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [isDeactivationConfirmed, setIsDeactivationConfirmed] = useState(false);

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle save changes logic here
    };

    const handleDeactivateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        if (isDeactivationConfirmed) {
            // Handle account deactivation logic here
        }
    };

    return (
        <div>
            <div className="card mb-6">
                <div className="card-body">
                    <div className="d-flex align-items-start align-items-sm-center gap-6 pb-4 border-bottom">
                        <img src={logo} alt="user-avatar" className="d-block w-px-100 h-px-100 rounded" id="uploadedAvatar" />
                        <div className="button-wrapper">
                            <label htmlFor="upload" className="btn btn-primary me-3 mb-4" tabIndex={0}>
                                <span className="d-none d-sm-block">Upload new photo</span>
                                <i className="bx bx-upload d-block d-sm-none"></i>
                                <input type="file" id="upload" className="account-file-input" hidden accept="image/png, image/jpeg" />
                            </label>
                            <button type="button" className="btn btn-outline-secondary account-image-reset mb-4">
                                <i className="bx bx-reset d-block d-sm-none"></i>
                                <span className="d-none d-sm-block">Reset</span>
                            </button>
                            <div>Allowed JPG, GIF or PNG. Max size of 800K</div>
                        </div>
                    </div>
                </div>
                <div className="card-body pt-4">
                    <form id="formAccountSettings" method="POST" onSubmit={handleSaveChanges}>
                        <div className="row g-6">
                            <div className="col-md-6">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input className="form-control" type="text" id="firstName" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoFocus />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input className="form-control" type="text" name="lastName" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input className="form-control" type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="joindoe123" />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label">E-mail</label>
                                <input className="form-control" type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                                <div className="input-group input-group-merge">
                                    <span className="input-group-text">VN (+84)</span>
                                    <input type="text" id="phoneNumber" name="phoneNumber" className="form-control" placeholder="032 *** ****" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input type="text" className="form-control" id="address" name="address" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button type="submit" className="btn btn-primary me-3">Save changes</button>
                            <button type="reset" className="btn btn-outline-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="card">
                <h5 className="card-header">Delete Account</h5>
                <div className="card-body">
                    <div className="mb-6 col-12 mb-0">
                        <div className="alert alert-warning">
                            <h5 className="alert-heading mb-1">Are you sure you want to delete your account?</h5>
                            <p className="mb-0">Once you delete your account, there is no going back. Please be certain.</p>
                        </div>
                    </div>
                    <form id="formAccountDeactivation" onSubmit={handleDeactivateAccount}>
                        <div className="form-check my-8 ms-2">
                            <input className="form-check-input" type="checkbox" name="accountActivation" id="accountActivation" checked={isDeactivationConfirmed} onChange={(e) => setIsDeactivationConfirmed(e.target.checked)} />
                            <label className="form-check-label" htmlFor="accountActivation">I confirm my account deactivation</label>
                        </div>
                        <button type="submit" className="btn btn-danger deactivate-account" disabled={!isDeactivationConfirmed}>
                            Deactivate Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
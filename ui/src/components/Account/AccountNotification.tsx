// src/components/Pages/AccountNotification.tsx
import React, { useState } from 'react';
import './AccountNotification.css'; // Import any necessary CSS

const AccountNotification: React.FC = () => {
    const [sendNotification, setSendNotification] = useState('Only when I\'m online');

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle save changes logic here
    };

    return (
        <div className="card p-3">
            {/* Notifications */}
            <div className="card-body">
                <h5 className="mb-1">Recent Devices</h5>
                <span className="card-subtitle">
                    We need permission from your browser to show notifications.
                    <span className="notificationRequest">
                        <span className="text-primary">Request Permission</span>
                    </span>
                </span>
                <div className="error"></div>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-nowrap">Type</th>
                            <th className="text-nowrap text-center">Email</th>
                            <th className="text-nowrap text-center">Browser</th>
                            <th className="text-nowrap text-center">App</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-nowrap text-heading">New for you</td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck1" defaultChecked />
                                </div>
                            </td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck2" defaultChecked />
                                </div>
                            </td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck3" defaultChecked />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-nowrap text-heading">Account activity</td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck4" defaultChecked />
                                </div>
                            </td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck5" defaultChecked />
                                </div>
                            </td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck6" defaultChecked />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-nowrap text-heading">A new browser used to sign in</td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck7" defaultChecked />
                                </div>
                            </td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck8" defaultChecked />
                                </div>
                            </td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck9" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-nowrap text-heading">A new device is linked</td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck10" defaultChecked />
                                </div>
                            </td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck11" />
                                </div>
                            </td>
                            <td>
                                <div className="form-check mb-0 d-flex justify-content-center align-items-center">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck12" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="card-body py-3 p-1">
                <h6 className="text-body mb-6">When should we send you notifications?</h6>
                <form onSubmit={handleSaveChanges}>
                    <div className="row">
                        <div className="col-sm-6 px-3">
                            <select id="sendNotification" className="form-select" name="sendNotification" value={sendNotification} onChange={(e) => setSendNotification(e.target.value)}>
                                <option>Only when I'm online</option>
                                <option>Anytime</option>
                            </select>
                        </div>
                        <div className="mt-6">
                            <button type="submit" className="btn btn-primary me-3">Save changes</button>
                            <button type="reset" className="btn btn-outline-secondary">Discard</button>
                        </div>
                    </div>
                </form>
            </div>
            {/* /Notifications */}
        </div>
    );
};

export default AccountNotification;
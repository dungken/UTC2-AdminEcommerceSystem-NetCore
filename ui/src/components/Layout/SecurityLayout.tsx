import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface SecurityLayoutProps {
    children: React.ReactNode;
}

const SecurityLayout: React.FC<SecurityLayoutProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState('/change-password');

    const handleTabClick = (path: string) => {
        setActiveTab(path);
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="nav-align-top">
                        <ul className="nav nav-pills flex-column flex-md-row mb-6">
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeTab === '/change-password' ? 'active' : ''}`}
                                    to="/change-password"
                                    onClick={() => handleTabClick('/change-password')}
                                >
                                    <i className="bx bx-sm bx-user me-1_5"></i> Change Password
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeTab === '/forgot-password' ? 'active' : ''}`}
                                    to="/forgot-password"
                                    onClick={() => handleTabClick('/forgot-password')}
                                >
                                    <i className="bx bx-sm bx-bell me-1_5"></i> Forgot Password
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeTab === '/2fa' ? 'active' : ''}`}
                                    to="/2fa"
                                    onClick={() => handleTabClick('/2fa')}
                                >
                                    <i className="bx bx-sm bx-link-alt me-1_5"></i> Two Factor Authentication
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="card">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityLayout;
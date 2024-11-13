import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SecurityLayoutProps {
    children: React.ReactNode;
}

const SecurityLayout: React.FC<SecurityLayoutProps> = ({ children }) => {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleLinkClick = (path: string) => {
        setActiveLink(path);
    };

    return (
        <div className="container-xxl flex-grow-1 py-2 ">
            <div className="row">
                <div className="col-md-12">
                    <div className="nav-align-top">
                        <ul className="nav nav-pills flex-column flex-md-row mb-6">
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === '/change-password' ? 'active' : ''}`}
                                    to="/change-password"
                                    onClick={() => handleLinkClick('/change-password')}
                                >
                                    <i className="bx bx-sm bx-user me-1_5"></i> Change Password
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === '/forgot-password' ? 'active' : ''}`}
                                    to="/forgot-password"
                                    onClick={() => handleLinkClick('/forgot-password')}
                                >
                                    <i className="bx bx-sm bx-bell me-1_5"></i> Forgot Password
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === '/2fa' ? 'active' : ''}`}
                                    to="/2fa"
                                    onClick={() => handleLinkClick('/2fa')}
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
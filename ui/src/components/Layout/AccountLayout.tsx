import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AccountLayoutProps {
    children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleLinkClick = (path: string) => {
        setActiveLink(path);
    };

    return (
        <div className="container-xxl flex-grow-1 py-2">
            <div className="row">
                <div className="col-md-12">
                    <div className="nav-align-top">
                        <ul className="nav nav-pills flex-column flex-md-row mb-6">
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === '/my-profile' ? 'active' : ''}`}
                                    to="/my-profile"
                                    onClick={() => handleLinkClick('/my-profile')}
                                >
                                    <i className="bx bx-sm bx-user me-1_5"></i> Account
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === '/account-notification' ? 'active' : ''}`}
                                    to="/account-notification"
                                    onClick={() => handleLinkClick('/account-notification')}
                                >
                                    <i className="bx bx-sm bx-bell me-1_5"></i> Notifications
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === '/account-connection' ? 'active' : ''}`}
                                    to="/account-connection"
                                    onClick={() => handleLinkClick('/account-connection')}
                                >
                                    <i className="bx bx-sm bx-link-alt me-1_5"></i> Connections
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

export default AccountLayout;
import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const handleToggle = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <ul className="menu-inner py-1">
            {/* DASHBOARD */}
            <li className={`menu-item ${openMenu === 'dashboard' ? 'active open' : ''}`}>
                <a href="javascript:void(0);" className="menu-link menu-toggle" onClick={() => handleToggle('dashboard')}>
                    <i className="menu-icon tf-icons bx bx-home-smile"></i>
                    <div className="text-truncate" data-i18n="Dashboards">Dashboards</div>
                </a>
                <ul className="menu-sub">
                    <li className="menu-item active">
                        <a href="index.html" className="menu-link">
                            <div className="text-truncate" data-i18n="Analytics">Analytics</div>
                        </a>
                    </li>
                </ul>
            </li>
            {/* ACCOUNT MANAGEMENT */}
            <li className="menu-header small text-uppercase">
                <span className="menu-header-text">User & Account</span>
            </li>
            <li className={`menu-item ${openMenu === 'users' ? 'active open' : ''}`}>
                <a href="javascript:void(0);" className="menu-link menu-toggle" onClick={() => handleToggle('users')}>
                    <i className="menu-icon tf-icons bx bx-user"></i>
                    <div className="text-truncate" data-i18n="Account Settings">Users</div>
                </a>
                <ul className="menu-sub">
                    <li className="menu-item">
                        <a href="list-user.html" className="menu-link">
                            <div className="text-truncate" data-i18n="Account">Views</div>
                        </a>
                    </li>
                </ul>
            </li>
            <li className={`menu-item ${openMenu === 'accountSettings' ? 'active open' : ''}`}>
                <a href="javascript:void(0);" className="menu-link menu-toggle" onClick={() => handleToggle('accountSettings')}>
                    <i className="menu-icon tf-icons bx bx-dock-top"></i>
                    <div className="text-truncate" data-i18n="Account Settings">Account Settings</div>
                </a>
                <ul className="menu-sub">
                    <li className="menu-item">
                        <a href="my-profile.html" className="menu-link">
                            <div className="text-truncate" data-i18n="Account">Account</div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="account-notifications.html" className="menu-link">
                            <div className="text-truncate" data-i18n="Notifications">Notifications</div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="account-connections.html" className="menu-link">
                            <div className="text-truncate" data-i18n="Connections">Connections</div>
                        </a>
                    </li>
                </ul>
            </li>
            <li className={`menu-item ${openMenu === 'authentications' ? 'active open' : ''}`}>
                <a href="javascript:void(0);" className="menu-link menu-toggle" onClick={() => handleToggle('authentications')}>
                    <i className="menu-icon tf-icons bx bx-lock-open-alt"></i>
                    <div className="text-truncate" data-i18n="Authentications">Authentications</div>
                </a>
                <ul className="menu-sub">
                    <li className="menu-item">
                        <a href="login.html" className="menu-link" target="_blank">
                            <div className="text-truncate" data-i18n="Basic">Login</div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="register.html" className="menu-link" target="_blank">
                            <div className="text-truncate" data-i18n="Basic">Register</div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="forgot-password.html" className="menu-link" target="_blank">
                            <div className="text-truncate" data-i18n="Basic">Forgot Password</div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="security.html" className="menu-link">
                            <div className="text-truncate" data-i18n="">Security</div>
                        </a>
                    </li>
                </ul>
                <li className={`menu-item ${openMenu === 'rolesPermissions' ? 'active open' : ''}`}>
                    <a href="javascript:void(0);" className="menu-link menu-toggle" onClick={() => handleToggle('rolesPermissions')}>
                        <i className="menu-icon tf-icons bx bx-check-shield"></i>
                        <div className="text-truncate" data-i18n="Account Settings">Roles & Permissions</div>
                    </a>
                    <ul className="menu-sub">
                        <li className="menu-item">
                            <a href="role-list.html" className="menu-link">
                                <div className="text-truncate" data-i18n="Account">Roles</div>
                            </a>
                        </li>
                        <li className="menu-item">
                            <a href="permissions.html" className="menu-link">
                                <div className="text-truncate" data-i18n="Notifications">Permission</div>
                            </a>
                        </li>
                    </ul>
                </li>
            </li>
            {/* PRODUCT CATEGORY MANAGEMENT */}
            <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Product Category</span>
            </li>
            {/* Crud Category */}
            <li className={`menu-item ${openMenu === 'category' ? 'active open' : ''}`}>
                <a href="javascript:void(0);" className="menu-link menu-toggle" onClick={() => handleToggle('category')}>
                    <i className="menu-icon tf-icons bx bx-layout"></i>
                    <div className="text-truncate" data-i18n="Layouts">Category</div>
                </a>
                <ul className="menu-sub">
                    <li className="menu-item">
                        <a href="" className="menu-link">
                            <div className="text-truncate" data-i18n="Without menu">Create</div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="" className="menu-link">
                            <div className="text-truncate" data-i18n="Without navbar">Edit</div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="" className="menu-link">
                            <div className="text-truncate" data-i18n="Without navbar">....</div>
                        </a>
                    </li>
                </ul>
            </li>
            {/* Hierarchy Category */}
            <li className={`menu-item ${openMenu === 'hierarchy' ? 'active open' : ''}`}>
                <a href="javascript:void(0);" className="menu-link menu-toggle" onClick={() => handleToggle('hierarchy')}>
                    <i className="menu-icon tf-icons bx bx-layout"></i>
                    <div className="text-truncate" data-i18n="Layouts">Hierarchy</div>
                </a>
            </li>

            {/* PRODUCT MANAGEMENT */}
            <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Product</span>
            </li>

            {/* ORDER MANAGEMENT */}
            <li className="menu-header small text-uppercase">
                <span className="menu-header-text">ORDER</span>
            </li>

            {/* CUSTOMER MANAGEMENT */}
            <li className="menu-header small text-uppercase">
                <span className="menu-header-text">CUSTOMER</span>
            </li>

            {/* DISCOUNT MANAGEMENT */}
            <li className="menu-header small text-uppercase">
                <span className="menu-header-text">DISCOUNT</span>
            </li>

            {/* INVENTORY MANAGEMENT */}
            <li className="menu-header small text-uppercase">
                <span className="menu-header-text">INVENTORY</span>
            </li>

            {/* SUPPORT & FEEDBACK MANAGEMENT */}
            <li className="menu-header small text-uppercase">
                <span className="menu-header-text">SUPPORT & FEEDBACK</span>
            </li>
        </ul>
    );
};

export default Sidebar;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/logo/logo.png';

const Sidebar: React.FC = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const hideMenu = () => {
        document.getElementById('layout-menu')?.classList.toggle('hidden');
    };

    return (
        <div>
            <aside id="layout-menu" className="text-decoration-none layout-menu menu-vertical menu bg-menu-theme" style={{ maxHeight: '100vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                <div className="app-brand demo">
                    <Link to="index.html" className="app-brand-link">
                        <img src={logo} alt="Brand Logo" className="img-fluid w-25" />
                        <span className="app-brand-text demo menu-text fw-bold ms-2">Coolmate</span>
                    </Link>

                    <Link to="#" onClick={hideMenu} className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                        <i className="bx bx-chevron-left bx-sm d-flex align-items-center justify-content-center"></i>
                    </Link>
                </div>

                <div className="menu-inner-shadow"></div>

                <ul className="menu-inner py-1">
                    {/* <!-- DASHBOARD --> */}
                    <li className={`menu-item ${openMenu === 'dashboard' ? 'open' : ''}`}>
                        <Link to="#" className="menu-link menu-toggle" onClick={() => toggleMenu('dashboard')}>
                            <i className="menu-icon tf-icons bx bx-home-smile"></i>
                            <div className="text-truncate" data-i18n="Dashboards">Dashboards</div>
                            <span className="badge rounded-pill bg-danger ms-auto">5</span>
                        </Link>
                        {openMenu === 'dashboard' && (
                            <ul className="menu-sub">
                                <li className="menu-item active">
                                    <Link to="index.html" className="menu-link">
                                        <div className="text-truncate" data-i18n="Analytics">Analytics</div>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* <!-- ACCOUNT  MANAGEMENT --> */}
                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">User & Account</span>
                    </li>
                    <li className={`menu-item ${openMenu === 'users' ? 'open' : ''}`}>
                        <Link to="/users" className="menu-link menu-toggle" onClick={() => toggleMenu('users')}>
                            <i className="menu-icon tf-icons bx bx-user"></i>
                            <div className="text-truncate" data-i18n="Account Settings">Users</div>
                        </Link>
                        {/* {openMenu === 'users' && (
                            <ul className="menu-sub">
                                <li className="menu-item">
                                    <Link to="/users" className="menu-link">
                                        <div className="text-truncate" data-i18n="Account">Views</div>
                                    </Link>
                                </li>
                            </ul>
                        )} */}
                    </li>
                    <li className={`menu-item ${openMenu === 'accountSettings' ? 'open' : ''}`}>
                        <Link to="/my-profile" className="menu-link menu-toggle" onClick={() => toggleMenu('accountSettings')}>
                            <i className="menu-icon tf-icons bx bx-dock-top"></i>
                            <div className="text-truncate" data-i18n="Account Settings">Account Settings</div>
                        </Link>
                        {/* {openMenu === 'accountSettings' && (
                            <ul className="menu-sub">
                                <li className="menu-item">
                                    <Link to="/my-profile" className="menu-link">
                                        <div className="text-truncate" data-i18n="Account">Account</div>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/account-notifications" className="menu-link">
                                        <div className="text-truncate" data-i18n="Notifications">Notifications</div>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/account-connections" className="menu-link">
                                        <div className="text-truncate" data-i18n="Connections">Connections</div>
                                    </Link>
                                </li>
                            </ul>
                        )} */}
                    </li>
                    <li className={`menu-item ${openMenu === 'authentications' ? 'open' : ''}`}>
                        <Link to="/change-password" className="menu-link menu-toggle" onClick={() => toggleMenu('authentications')}>
                            <i className="menu-icon tf-icons bx bx-lock-open-alt"></i>
                            <div className="text-truncate" data-i18n="Authentications">Authentications</div>
                        </Link>
                        {openMenu === 'authentications' && (
                            <ul className="menu-sub">
                                <li className="menu-item">
                                    <Link to="/login" className="menu-link">
                                        <div className="text-truncate" data-i18n="Basic">Login</div>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/register" className="menu-link">
                                        <div className="text-truncate" data-i18n="Basic">Register</div>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/change-password" className="menu-link">
                                        <div className="text-truncate" data-i18n="">Security</div>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className={`menu-item ${openMenu === 'rolesPermissions' ? 'open' : ''}`}>
                        <Link to="#" className="menu-link menu-toggle" onClick={() => toggleMenu('rolesPermissions')}>
                            <i className="menu-icon tf-icons bx bx-check-shield"></i>
                            <div className="text-truncate" data-i18n="Account Settings">Roles & Permissions</div>
                        </Link>
                        {openMenu === 'rolesPermissions' && (
                            <ul className="menu-sub">
                                <li className="menu-item">
                                    <Link to="/roles" className="menu-link">
                                        <div className="text-truncate" data-i18n="Account">Roles</div>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/permissions" className="menu-link">
                                        <div className="text-truncate" data-i18n="Notifications">Permission</div>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* <!-- PRODUCT CATEGORY MANAGEMENT --> */}
                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">Product Category</span>
                    </li>
                    {/* <!-- Crud Category --> */}
                    <li className={`menu-item ${openMenu === 'category' ? 'open' : ''}`}>
                        <Link to="#" className="menu-link menu-toggle" onClick={() => toggleMenu('category')}>
                            <i className="menu-icon tf-icons bx bx-layout"></i>
                            <div className="text-truncate" data-i18n="Layouts">Category</div>
                        </Link>
                        {openMenu === 'category' && (
                            <ul className="menu-sub">
                                <li className="menu-item">
                                    <Link to="#" className="menu-link">
                                        <div className="text-truncate" data-i18n="Without menu">Create</div>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="#" className="menu-link">
                                        <div className="text-truncate" data-i18n="Without navbar">Edit</div>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="#" className="menu-link">
                                        <div className="text-truncate" data-i18n="Without navbar">....</div>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    {/* <!-- Hierarchy Category --> */}
                    <li className={`menu-item ${openMenu === 'hierarchy' ? 'open' : ''}`}>
                        <Link to="#" className="menu-link menu-toggle" onClick={() => toggleMenu('hierarchy')}>
                            <i className="menu-icon tf-icons bx bx-layout"></i>
                            <div className="text-truncate" data-i18n="Layouts">Hierarchy</div>
                        </Link>
                    </li>

                    {/* <!-- PRODUCT MANAGEMENT --> */}
                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">Product</span>
                    </li>

                    {/* <!-- ORDER  MANAGEMENT --> */}
                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">ORDER</span>
                    </li>

                    {/* <!-- CUSTOMER MANAGEMENT --> */}
                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">CUSTOMER</span>
                    </li>

                    {/* <!-- DISCOUNT MANAGEMENT --> */}
                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">DISCOUNT</span>
                    </li>

                    {/* <!-- INVENTORY MANAGEMENT --> */}
                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">INVENTORY</span>
                    </li>

                    {/* <!-- SUPPORT & FEEDBACK MANAGEMENT --> */}
                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">SUPPORT & FEEDBACK</span>
                    </li>
                </ul>
            </aside >
        </div >
    );
}

export default Sidebar;

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
            <aside id="layout-menu" className="text-decoration-none layout-menu menu-vertical menu bg-menu-theme" style={{ maxHeight: '', overflowY: 'scroll', overflowX: 'hidden' }}>
                <div className="app-brand demo">
                    <Link to="/" className="app-brand-link">
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
                        <Link to="/dashboard" className="menu-link menu-toggle" onClick={() => toggleMenu('dashboard')}>
                            <i className="menu-icon tf-icons bx bx-home-smile"></i>
                            <div className="text-truncate" data-i18n="Dashboards">Dashboards</div>
                            <span className="badge rounded-pill bg-danger ms-auto">5</span>
                        </Link>
                    </li>

                    {/* <!-- ACCOUNT  MANAGEMENT --> */}
                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">User & Account</span>
                    </li>
                    <li className={`menu-item ${openMenu === 'User' ? 'open' : ''}`}>
                        <Link to="/user" className="menu-link menu-toggle" onClick={() => toggleMenu('User')}>
                            <i className="menu-icon tf-icons bx bx-user"></i>
                            <div className="text-truncate" data-i18n="Account Settings">User</div>
                        </Link>
                    </li>
                    <li className={`menu-item ${openMenu === 'accountSettings' ? 'open' : ''}`}>
                        <Link to="/my-profile" className="menu-link menu-toggle" onClick={() => toggleMenu('accountSettings')}>
                            <i className="menu-icon tf-icons bx bx-dock-top"></i>
                            <div className="text-truncate" data-i18n="Account Settings">Account Settings</div>
                        </Link>

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
                            <div className="text-truncate" data-i18n="Account Settings">Role & Permissions</div>
                        </Link>
                        {openMenu === 'rolesPermissions' && (
                            <ul className="menu-sub">
                                <li className="menu-item">
                                    <Link to="/role" className="menu-link">
                                        <div className="text-truncate" data-i18n="Account">Role</div>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/permission" className="menu-link">
                                        <div className="text-truncate" data-i18n="Notifications">Permission</div>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* <!-- PRODUCT CATEGORY MANAGEMENT --> */}
                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">Product Management</span>
                    </li>
                    <li className={`menu-item ${openMenu === 'category' ? 'open' : ''}`}>
                        <Link to="/product-category" className="menu-link menu-toggle" onClick={() => toggleMenu('category')}>
                            <i className="menu-icon tf-icons bx bx-layout"></i>
                            <div className="text-truncate" data-i18n="Layouts">Category</div>
                        </Link>
                    </li>
                    <li className={`menu-item ${openMenu === 'hierarchy' ? 'open' : ''}`}>
                        <Link to="/hierarchy-category" className="menu-link menu-toggle" onClick={() => toggleMenu('hierarchy')}>
                            <i className="menu-icon tf-icons bx bx-layout"></i>
                            <div className="text-truncate" data-i18n="Layouts">Hierarchy</div>
                        </Link>
                    </li>
                    <li className={`menu-item ${openMenu === 'product' ? 'open' : ''}`}>
                        <Link to="/product" className="menu-link menu-toggle" onClick={() => toggleMenu('product')}>
                            <i className="menu-icon tf-icons bx bx-layout"></i>
                            <div className="text-truncate" data-i18n="Layouts">Product</div>
                        </Link>
                        {openMenu === 'product' && (
                            <ul className="menu-sub">
                                <li className="menu-item">
                                    <Link to="/product/create" className="menu-link">
                                        <div className="text-truncate" data-i18n="Account">Create</div>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className={`menu-item ${openMenu === 'order' ? 'open' : ''}`}>
                        <Link to="/order" className="menu-link menu-toggle" onClick={() => toggleMenu('order')}>
                            <i className="menu-icon tf-icons bx bx-layout"></i>
                            <div className="text-truncate" data-i18n="Layouts">Orders</div>
                        </Link>
                    </li>
                </ul>
            </aside >
        </div >
    );
}

export default Sidebar;

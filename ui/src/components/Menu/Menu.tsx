import React from 'react';
import './Menu.css';
import Sidebar from '../Sidebar/Sidebar';

const Menu: React.FC = () => {
    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <div className="app-brand demo">
                <a href="index.html" className="app-brand-link">
                    <img src="../assets/img/logo/logo.png" alt="Brand Logo" className="img-fluid w-25" />
                    <span className="app-brand-text demo menu-text fw-bold ms-2">Coolmate</span>
                </a>

                <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                    <i className="bx bx-chevron-left bx-sm d-flex align-items-center justify-content-center"></i>
                </a>
            </div>

            <div className="menu-inner-shadow"></div>

            <div className="menu-inner">
                <Sidebar />
            </div>
        </aside>
    );
};

export default Menu;
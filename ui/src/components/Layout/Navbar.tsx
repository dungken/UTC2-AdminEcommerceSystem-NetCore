import React from 'react';
import avatarImage from '../../assets/img/avatars/1.png';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
                <a className="nav-item nav-link px-0 me-xl-6" href="#">
                    <i className="bx bx-menu bx-md"></i>
                </a>
            </div>

            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                {/* Search */}
                <div className="navbar-nav align-items-center">
                    <div className="nav-item d-flex align-items-center">
                        <i className="bx bx-search bx-md"></i>
                        <input type="text" className="form-control border-0 shadow-none ps-1 ps-sm-2" placeholder="Search..." aria-label="Search..." />
                    </div>
                </div>

                <ul className="navbar-nav flex-row align-items-center ms-auto">
                    <li className="nav-item lh-1 me-4">
                        <a className="github-button" href="https://github.com/dungken/admin-ui" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star themeselection/sneat-html-admin-template-free on GitHub">Star</a>
                    </li>

                    {/* User */}
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle hide-arrow p-0" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <div className="avatar avatar-online">
                                <img src={avatarImage} className="w-px-40 h-auto rounded-circle" alt="User Avatar" />
                            </div>
                        </a>
                        {/* <!-- Avatar Dropdown Menu --> */}
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 " aria-labelledby="userDropdown" data-bs-popper="static">
                            <li>
                                <a className="dropdown-item d-flex align-items-center py-2" href="#">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar avatar-online me-3">
                                            <img src="/static/media/1.eae03c9bb612706cf449.png" className="rounded-circle" alt="User Avatar" />
                                        </div>
                                        <div className='text-center'>
                                            <h6 className="mb-0 fw-bold">John Doe</h6>
                                            {/* <small className="text-muted">Admin</small> */}
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li className="dropdown-divider"> <hr /></li>
                            <li><Link className="dropdown-item d-flex align-items-center py-2" to="/my-profile"><i className="bx bx-user me-2 fs-5"></i> My Profile</Link></li>
                            <li><Link className="dropdown-item d-flex align-items-center py-2" to="/security"><i className="bx bx-cog me-2 fs-5"></i> Settings</Link></li>
                            {/* <li>
                                <a className="dropdown-item d-flex align-items-center justify-content-between py-2" href="#">
                                    <span><i className="bx bx-credit-card me-2 fs-5"></i> Billing Plan</span>
                                    <span className="badge bg-danger rounded-pill">4</span>
                                </a>
                            </li> */}
                            <li className="dropdown-divider"> <hr /></li>
                            <li><Link className="dropdown-item d-flex align-items-center py-2" to="/logout" data-bs-toggle="modal" data-bs-target="#logoutModal"><i className="bx bx-power-off me-2 fs-5"></i> Log Out</Link></li>
                        </ul>

                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;

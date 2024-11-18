import React, { useEffect, useState } from 'react';
import avatarImage from '../../assets/img/avatars/1.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GetPersonalInfoService } from '../../services/UserService';
import { useAvatar } from '../../context/AvatarContextType';

const Navbar: React.FC = () => {
    const { avatar } = useAvatar();
    const { logout } = useAuth();
    const [avatarFromDB, setAvatarFromDB] = useState(avatarImage);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const response = await GetPersonalInfoService();
                if (response.success) {
                    const userData = response.data.user;
                    setAvatarFromDB(userData.profilePicture || avatarImage);
                    setUsername(userData.userName);
                } else {
                    console.error('Failed to retrieve personal info:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching personal info:', error);
            }
        };

        fetchPersonalInfo();
    }, []);

    const handleLogout = () => {
        logout();
    };

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
                        <a className="github-button" href="https://github.com/dungken/admin-ui" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star themeselection/sneat-html-admin-template-free on GitHub"> <i className="bi bi-star"></i> Star</a>
                    </li>

                    {/* User */}
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle hide-arrow p-0" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <div className="avatar avatar-online">
                                {avatar ? (
                                    <img src={avatar} alt="User Avatar" className="rounded-circle" />
                                ) : (
                                    <img src={avatarFromDB} alt="User Avatar" className="rounded-circle" />
                                )}

                            </div>
                        </a>
                        {/* <!-- Avatar Dropdown Menu --> */}
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 " aria-labelledby="userDropdown" data-bs-popper="static">
                            <li>
                                <a className="dropdown-item d-flex align-items-center py-2" href="#">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar avatar-online me-3">
                                            {avatar ? (
                                                <img src={avatar} alt="User Avatar" className="rounded-circle" />
                                            ) : (
                                                <img src={avatarFromDB} alt="User Avatar" className="rounded-circle" />
                                            )}
                                        </div>
                                        <div className='text-start'>
                                            <small className="text-muted">Admin</small>
                                            <h6 className="mb-0 fw-bold">{username ?? 'username'}</h6>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li className="dropdown-divider"> <hr /></li>
                            <li><Link className="dropdown-item d-flex align-items-center py-2" to="/my-profile"><i className="bx bx-user me-2 fs-5"></i> My Profile</Link></li>
                            <li><Link className="dropdown-item d-flex align-items-center py-2" to="/change-password"><i className="bx bx-cog me-2 fs-5"></i> Settings</Link></li>
                            {/* <li>
                                <a className="dropdown-item d-flex align-items-center justify-content-between py-2" href="#">
                                    <span><i className="bx bx-credit-card me-2 fs-5"></i> Billing Plan</span>
                                    <span className="badge bg-danger rounded-pill">4</span>
                                </a>
                            </li> */}
                            <li className="dropdown-divider"> <hr /></li>
                            <li><a className="dropdown-item d-flex align-items-center py-2" href="#" onClick={handleLogout}><i className="bx bx-power-off me-2 fs-5"></i> Log Out</a></li>
                        </ul>

                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;

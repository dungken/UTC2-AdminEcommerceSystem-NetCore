// src/components/Pages/RoleList.tsx
import React, { useState } from 'react';
import RoleCard from './RoleCard';
import RoleModal from './RoleModal';
import RoleTable from './RoleTable';
// import './RoleList.css'; // Import any necessary CSS

const RoleList: React.FC = () => {
    const [roles, setRoles] = useState([
        {
            totalUsers: 4,
            roleName: 'Administrator',
            avatars: [
                '../../assets/img/avatars/5.png',
                '../../assets/img/avatars/12.png',
                '../../assets/img/avatars/6.png',
                '../../assets/img/avatars/3.png',
            ],
        },
        {
            totalUsers: 7,
            roleName: 'Manager',
            avatars: [
                '../../assets/img/avatars/4.png',
                '../../assets/img/avatars/1.png',
                '../../assets/img/avatars/2.png',
                '../../assets/img/avatars/4.png',
            ],
        },
        // Add more roles as needed
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditRole = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="mb-1">Roles List</h4>
            <p className="mb-6">
                A role provided access to predefined menus and features so that depending on assigned role an administrator can have access to what user needs.
            </p>
            <div className="row g-6">
                {roles.map((role, index) => (
                    <RoleCard
                        key={index}
                        totalUsers={role.totalUsers}
                        roleName={role.roleName}
                        avatars={role.avatars}
                        onEditRole={handleEditRole}
                    />
                ))}
                <div className="col-xl-4 col-lg-6 col-md-6">
                    <div className="card h-100">
                        <div className="row h-100">
                            <div className="col-sm-5">
                                <div className="d-flex align-items-end h-100 justify-content-center mt-sm-0 mt-4 ps-6">
                                    <img
                                        src="../../assets/img/illustrations/lady-with-laptop-light.png"
                                        className="img-fluid"
                                        alt="Image"
                                        width="120"
                                        data-app-light-img="illustrations/lady-with-laptop-light.png"
                                        data-app-dark-img="illustrations/lady-with-laptop-dark.png"
                                    />
                                </div>
                            </div>
                            <div className="col-sm-7">
                                <div className="card-body text-sm-end text-center ps-sm-0">
                                    <button
                                        data-bs-target="#addRoleModal"
                                        data-bs-toggle="modal"
                                        className="btn btn-sm btn-primary mb-4 text-nowrap add-new-role"
                                        onClick={handleEditRole}
                                    >
                                        Add New Role
                                    </button>
                                    <p className="mb-0"> Add new role, <br /> if it doesn't exist.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <h4 className="mt-6 mb-1">Total users with their roles</h4>
                <p className="mb-0">Find all of your company’s administrator accounts and their associate roles.</p>
            </div>
            <RoleTable />
            <RoleModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default RoleList;
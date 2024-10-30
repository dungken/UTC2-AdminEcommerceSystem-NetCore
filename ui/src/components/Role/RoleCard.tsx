// src/components/Pages/RoleCard.tsx
import React from 'react';
// import './RoleCard.css'; // Import any necessary CSS

interface RoleCardProps {
    totalUsers: number;
    roleName: string;
    avatars: string[];
    onEditRole: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ totalUsers, roleName, avatars, onEditRole }) => {
    return (
        <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h6 className="fw-normal mb-0 text-body">Total {totalUsers} users</h6>
                        <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
                            {avatars.map((avatar, index) => (
                                <li
                                    key={index}
                                    data-bs-toggle="tooltip"
                                    data-popup="tooltip-custom"
                                    data-bs-placement="top"
                                    className="avatar pull-up"
                                    aria-label={`Avatar ${index + 1}`}
                                    data-bs-original-title={`Avatar ${index + 1}`}
                                >
                                    <img className="rounded-circle" src={avatar} alt="Avatar" />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="d-flex justify-content-between align-items-end">
                        <div className="role-heading">
                            <h5 className="mb-1">{roleName}</h5>
                            <a href="javascript:;" data-bs-toggle="modal" data-bs-target="#addRoleModal" className="role-edit-modal" onClick={onEditRole}>
                                <span>Edit Role</span>
                            </a>
                        </div>
                        <a href="javascript:void(0);">
                            <i className="bx bx-copy bx-md text-muted"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleCard;
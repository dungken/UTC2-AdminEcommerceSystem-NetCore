// src/components/Pages/RoleModal.tsx
import React, { useState } from 'react';
// import './RoleModal.css'; // Import any necessary CSS

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose }) => {
    const [roleName, setRoleName] = useState('');
    const [permissions, setPermissions] = useState({
        selectAll: false,
        userManagementRead: false,
        userManagementWrite: false,
        userManagementCreate: false,
        contentManagementRead: false,
        contentManagementWrite: false,
        contentManagementCreate: false,
        dispManagementRead: false,
        dispManagementWrite: false,
        dispManagementCreate: false,
        dbManagementRead: false,
        dbManagementWrite: false,
        dbManagementCreate: false,
        finManagementRead: false,
        finManagementWrite: false,
        finManagementCreate: false,
        reportingRead: false,
        reportingWrite: false,
        reportingCreate: false,
        apiRead: false,
        apiWrite: false,
        apiCreate: false,
        repoRead: false,
        repoWrite: false,
        repoCreate: false,
        payrollRead: false,
        payrollWrite: false,
        payrollCreate: false,
    });

    const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [id]: checked,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="modal fade" id="addRoleModal" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-lg modal-simple modal-dialog-centered modal-add-new-role">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div className="text-center mb-6">
                            <h4 className="role-title mb-2">Add New Role</h4>
                            <p>Set role permissions</p>
                        </div>
                        <form id="addRoleForm" className="row g-6 fv-plugins-bootstrap5 fv-plugins-framework" onSubmit={handleSubmit} noValidate>
                            <div className="col-12 fv-plugins-icon-container">
                                <label className="form-label" htmlFor="modalRoleName">Role Name</label>
                                <input
                                    type="text"
                                    id="modalRoleName"
                                    name="modalRoleName"
                                    className="form-control"
                                    placeholder="Enter a role name"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                />
                                <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                            </div>
                            <div className="col-12">
                                <h5 className="mb-6">Role Permissions</h5>
                                <div className="table-responsive">
                                    <table className="table table-flush-spacing mb-0">
                                        <tbody>
                                            <tr>
                                                <td className="text-nowrap fw-medium text-heading">
                                                    Administrator Access <i className="bx bx-info-circle" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Allows a full access to the system" data-bs-original-title="Allows a full access to the system"></i>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="form-check mb-0">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="selectAll"
                                                                checked={permissions.selectAll}
                                                                onChange={handlePermissionChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="selectAll">
                                                                Select All
                                                            </label>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-nowrap fw-medium text-heading">User Management</td>
                                                <td>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="form-check mb-0 me-4 me-lg-12">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="userManagementRead"
                                                                checked={permissions.userManagementRead}
                                                                onChange={handlePermissionChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="userManagementRead">
                                                                Read
                                                            </label>
                                                        </div>
                                                        <div className="form-check mb-0 me-4 me-lg-12">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="userManagementWrite"
                                                                checked={permissions.userManagementWrite}
                                                                onChange={handlePermissionChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="userManagementWrite">
                                                                Write
                                                            </label>
                                                        </div>
                                                        <div className="form-check mb-0">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="userManagementCreate"
                                                                checked={permissions.userManagementCreate}
                                                                onChange={handlePermissionChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="userManagementCreate">
                                                                Create
                                                            </label>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Repeat similar structure for other permissions */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-12 text-center">
                                <button type="submit" className="btn btn-primary me-3">Submit</button>
                                <button type="reset" className="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                            </div>
                            <input type="hidden" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleModal;
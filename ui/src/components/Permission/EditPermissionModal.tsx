// src/components/Pages/EditPermissionModal.tsx
import React, { useState } from 'react';
// import './EditPermissionModal.css'; // Import any necessary CSS

interface EditPermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditPermissionModal: React.FC<EditPermissionModalProps> = ({ isOpen, onClose }) => {
    const [permissionName, setPermissionName] = useState('');
    const [isCorePermission, setIsCorePermission] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="modal fade" id="editPermissionModal" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-simple">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close btn-pinned" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div className="text-center mb-6">
                            <h4 className="mb-2">Edit Permission</h4>
                            <p>Edit permission as per your requirements.</p>
                        </div>
                        <div className="alert alert-warning" role="alert">
                            <span>
                                <span className="alert-heading mb-1 h5">Warning</span><br />
                                <span className="mb-0 p">By editing the permission name, you might break the system permissions functionality. Please ensure you're absolutely certain before proceeding.</span>
                            </span>
                        </div>
                        <form id="editPermissionForm" className="row pt-2 row-gap-2 gx-4 fv-plugins-bootstrap5 fv-plugins-framework" onSubmit={handleSubmit} noValidate>
                            <div className="col-sm-9 fv-plugins-icon-container">
                                <label className="form-label" htmlFor="editPermissionName">Permission Name</label>
                                <input
                                    type="text"
                                    id="editPermissionName"
                                    name="editPermissionName"
                                    className="form-control"
                                    placeholder="Permission Name"
                                    value={permissionName}
                                    onChange={(e) => setPermissionName(e.target.value)}
                                    tabIndex={-1}
                                />
                                <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                            </div>
                            <div className="col-sm-3 mb-4">
                                <label className="form-label invisible d-none d-sm-inline-block">Button</label>
                                <button type="submit" className="btn btn-primary mt-1 mt-sm-0">Update</button>
                            </div>
                            <div className="col-12">
                                <div className="form-check my-2 ms-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="editCorePermission"
                                        checked={isCorePermission}
                                        onChange={(e) => setIsCorePermission(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="editCorePermission">
                                        Set as core permission
                                    </label>
                                </div>
                            </div>
                            <input type="hidden" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPermissionModal;
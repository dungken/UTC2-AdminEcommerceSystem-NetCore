// src/components/Pages/AddPermissionModal.tsx
import React, { useState } from 'react';
// import './AddPermissionModal.css'; // Import any necessary CSS

interface AddPermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
}


const AddPermissionModal: React.FC<AddPermissionModalProps> = ({ isOpen, onClose }) => {
    const [permissionName, setPermissionName] = useState('');
    const [isCorePermission, setIsCorePermission] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="modal fade" id="addPermissionModal" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-simple">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close btn-pinned" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div className="text-center mb-6">
                            <h4 className="mb-2">Add New Permission</h4>
                            <p>Permissions you may use and assign to your users.</p>
                        </div>
                        <form id="addPermissionForm" className="row fv-plugins-bootstrap5 fv-plugins-framework" onSubmit={handleSubmit} noValidate>
                            <div className="col-12 mb-4 fv-plugins-icon-container">
                                <label className="form-label" htmlFor="modalPermissionName">Permission Name</label>
                                <input
                                    type="text"
                                    id="modalPermissionName"
                                    name="modalPermissionName"
                                    className="form-control"
                                    placeholder="Permission Name"
                                    value={permissionName}
                                    onChange={(e) => setPermissionName(e.target.value)}
                                    autoFocus
                                />
                                <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                            </div>
                            <div className="col-12 mb-2">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="corePermission"
                                        checked={isCorePermission}
                                        onChange={(e) => setIsCorePermission(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="corePermission">
                                        Set as core permission
                                    </label>
                                </div>
                            </div>
                            <div className="col-12 text-center demo-vertical-spacing">
                                <button type="submit" className="btn btn-primary me-4">Create Permission</button>
                                <button type="reset" className="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close">Discard</button>
                            </div>
                            <input type="hidden" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPermissionModal;
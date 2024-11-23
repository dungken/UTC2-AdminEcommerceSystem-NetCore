import React, { useEffect, useState } from 'react';
import PermissionTable from './PermissionTable';
import EditPermissionModal from './EditPermissionModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import PermissionModal from './PermissionModal';
import { DeletePermissionService, GetAllPermissionsService } from '../../services/RoleService';

const PermissionList: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<any | null>(null);
    const [permissionToDelete, setPermissionToDelete] = useState<any | null>(null);
    const [permissions, setPermissions] = useState<any[]>([]);

    useEffect(() => {
        // Fetch permissions from the API and set them in state
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const response = await GetAllPermissionsService();
            if (response.success) {
                // toast.success(response.message);
                setPermissions(response.data.permissions);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleOpenEditModal = (permission: any) => {
        setSelectedPermission(permission);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleDeletePermission = async () => {
        console.log('Deleting permission:', permissionToDelete);

        if (permissionToDelete) {
            try {
                const response = await DeletePermissionService(permissionToDelete.permissionId);
                if (response.success) {
                    toast.success(response.message);
                    fetchPermissions();
                    setPermissionToDelete(null);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error('Error deleting permission:', error);
            }
        }
    };

    const handlePermissionAdded = () => {
        // After a permission is added, fetch the updated list of permissions
        fetchPermissions();
        handleCloseAddModal();
    };

    return (
        <div className="container-xxl flex-grow-1 py-2 ">
            <div className="row">
                <div className="col-md-2">
                    <button className="btn btn-primary mb-4 text-end" onClick={handleOpenAddModal}>Create Permission</button>
                    <PermissionModal
                        isOpen={isAddModalOpen}
                        onClose={handleCloseAddModal}
                        onPermissionAdded={handlePermissionAdded}
                    />
                </div>
                <div className="col-md-10">
                    <PermissionTable
                        permissions={permissions}
                        onEdit={handleOpenEditModal}
                        onDelete={(permission: any) => setPermissionToDelete(permission)}
                    />
                </div>
            </div>

            <EditPermissionModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                permission={selectedPermission}
                onPermissionUpdated={() => fetchPermissions()} // Load lại danh sách sau khi cập nhật
            />

            {permissionToDelete && (
                <div className="modal fade show" tabIndex={-1} style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={() => setPermissionToDelete(null)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this permission? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={handleDeletePermission}>Delete</button>
                                <button className="btn btn-secondary" onClick={() => setPermissionToDelete(null)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};

export default PermissionList;

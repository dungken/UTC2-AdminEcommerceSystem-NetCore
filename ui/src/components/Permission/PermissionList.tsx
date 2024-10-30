// src/components/Pages/PermissionList.tsx
import React, { useState } from 'react';
import PermissionTable from './PermissionTable';
import AddPermissionModal from './AddPermissionModal';
import EditPermissionModal from './EditPermissionModal';
// import './PermissionList.css'; // Import any necessary CSS

const PermissionList: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleOpenEditModal = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="mb-1">Permissions List</h4>
            <p className="mb-6">
                Manage the permissions you may use and assign to your users.
            </p>
            <PermissionTable />
            <AddPermissionModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
            <EditPermissionModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} />
        </div>
    );
};

export default PermissionList;
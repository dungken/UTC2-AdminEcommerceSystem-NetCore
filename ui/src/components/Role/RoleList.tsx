import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoleCard from './RoleCard';
import RoleModal from './RoleModal';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import roleImage from '../../assets/img/logo/role-permission.png';
import { CreateOrUpdateRoleService, DeleteRoleService, GetAllRolesService } from '../../services/RoleService';


const RoleList: React.FC = () => {
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null); // To store the selected role data
    const [roles, setRoles] = useState<{ id: string; name: string; totalUser: number; avatars: string[]; permissions: string[] }[]>([]);


    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await GetAllRolesService();
            console.log(response);
            if (response.success) {
                // toast.success(response.message);
                setRoles(response.data.roles);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleEditRole = (roleId: string) => {
        const role = roles.find((role) => role.id === roleId); // Find the role by its ID
        setSelectedRole(role); // Set the selected role data
        setShowRoleModal(true); // Show the modal
    };

    const handleCloseModal = () => {
        setShowRoleModal(false);
        fetchRoles(); // Refresh the roles list
        setSelectedRole(null); // Reset selected role
    };

    const handleSaveRole = async (role: any) => {
        try {
            //
            const response = await CreateOrUpdateRoleService(role);
            if (response.success) {
                toast.success(response.message);
                fetchRoles(); // Refresh the roles list
                handleCloseModal(); // Close the modal
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error saving role:', error);
        }
    };

    const handleDeleteRole = async (roleId: string) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                const response = await DeleteRoleService(roleId);
                if (response.success) {
                    toast.success(response.message);
                    fetchRoles(); // Refresh the roles list after deletion
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error('Error deleting role:', error);
                toast.error('Error deleting role.');
            }
        }
    };


    return (
        <div className="container-xxl flex-grow-1 py-2 ">
            <div className="row g-4">
                <div className="col-xl-4 col-lg-6 col-md-6">
                    <div className="card h-100">
                        <div className="row h-100 d-flex align-items-center">
                            <div className="col-sm-5">
                                <div className="d-flex align-items-center h-100 justify-content-center mt-sm-0 mt-4 ps-6">
                                    <img
                                        src={roleImage}
                                        className="img-fluid"
                                        alt="Image"
                                        width="100"
                                    />
                                </div>
                            </div>
                            <div className="col-sm-7 d-flex ">
                                <div className="card-body align-items-center text-sm text-center ps-sm-0">
                                    <Button
                                        variant="primary"
                                        className="btn-lg text-nowrap add-new-role"
                                        onClick={() => {
                                            setSelectedRole(null); // Reset selected role for new role creation
                                            setShowRoleModal(true); // Show modal for adding new roles
                                        }}
                                    >
                                        Add New Role
                                    </Button>
                                    {/* <p className="m-2">Add a new role if it doesn't exist.</p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {roles.map((role, index) => (
                    <RoleCard
                        key={index}
                        roleId={role.id}
                        roleName={role.name}
                        totalUser={role.totalUser}
                        avatars={role.avatars}
                        onEditRole={() => handleEditRole(role.id)} // Pass the specific roleId to the handler
                        onDeleteRole={() => handleDeleteRole(role.id)}
                    />
                ))}

            </div>
            <RoleModal
                show={showRoleModal}
                handleClose={handleCloseModal}
                role={selectedRole} // Pass the selected role data to the modal
                onSaveRole={handleSaveRole} // Pass the save handler to the modal
            />
        </div>
    );
};

export default RoleList;

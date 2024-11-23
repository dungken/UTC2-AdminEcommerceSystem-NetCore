import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CreateOrUpdateRoleService, GetAllPermissionsService } from '../../services/RoleService';

interface Permission {
    permissionId: string;
    name: string;
    description: string;
    isCorePermission: boolean;
}

interface RoleModalProps {
    show: boolean;
    handleClose: () => void;
    role: any;
    onSaveRole: (role: any) => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ show, handleClose, role, onSaveRole }) => {
    const [roleName, setRoleName] = useState('');
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: boolean }>({});
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const response = await GetAllPermissionsService();
            console.log(response);

            if (response.success) {
                setPermissions(response.data.permissions);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    useEffect(() => {
        if (role) {
            setRoleName(role.name || '');
            const selected = role.permissions?.reduce((acc: { [key: string]: boolean }, permissionId: string) => {
                acc[permissionId] = true;
                return acc;
            }, {}) || {};
            setSelectedPermissions(selected);
        } else {
            setRoleName('');
            setSelectedPermissions({});
        }
    }, [role]);

    const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;
        setSelectedPermissions((prev) => ({
            ...prev,
            [id]: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleName) {
            toast.error('Role name is required.');
            return;
        }

        const selectedPermissionIds = Object.keys(selectedPermissions).filter((key) => selectedPermissions[key]);

        try {
            const roleData = {
                name: roleName,
                permissions: selectedPermissionIds,
            };
            const response = await CreateOrUpdateRoleService(roleData);
            if (response.success) {
                toast.success('Role saved successfully!');
                onSaveRole(response.data);
                handleClose();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Error saving role.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{role ? 'Edit Role' : 'Add New Role'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="roleName">
                        <Form.Label>Role Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <h5>Permissions</h5>
                    {isLoading ? (
                        <Spinner animation="border" />
                    ) : (
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Permission</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.map((permission) => (
                                    <tr key={permission.permissionId}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                id={permission.permissionId}
                                                checked={selectedPermissions[permission.permissionId] || false}
                                                onChange={handlePermissionChange}
                                            />
                                        </td>
                                        <td>{permission.name}</td>
                                        <td>{permission.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" className="ms-2" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Role'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default RoleModal;

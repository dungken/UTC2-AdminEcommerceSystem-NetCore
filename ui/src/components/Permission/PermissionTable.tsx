// src/components/Permission/PermissionTable.tsx
import React from 'react';

interface PermissionTableProps {
    permissions: any[];
    onEdit: (permission: any) => void;
    onDelete: (permission: any) => void; // Callback cho xóa quyền
}

const PermissionTable: React.FC<PermissionTableProps> = ({ permissions, onEdit, onDelete }) => {
    return (
        <table className="table table-bordered table-hover text-start align-middle">
            <thead className="fw-bold bg-secondary">
                <tr>
                    <th >
                        <input type="checkbox" className="form-check-input"
                        />
                    </th>
                    <th className='fw-bold'>Name</th>
                    <th className='fw-bold'>Description</th>
                    <th className='fw-bold'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {permissions.map((permission) => (
                    <tr key={permission.id}>
                        <td><input type="checkbox" className="form-check-input" /></td>
                        <td>{permission.name}</td>
                        <td>{permission.description}</td>
                        <td>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(permission)}>
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => onDelete(permission)}>
                                <i className="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PermissionTable;

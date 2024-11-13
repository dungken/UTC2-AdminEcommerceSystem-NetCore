import React, { useEffect, useState } from 'react';
import avatarImage from '../../assets/img/avatars/1.png';
import Pagination from '../../utils/Pagination';
import ConfirmationModal from './ConfirmationModal';
import { toast } from 'react-toastify';
import { DeleteAccountService, GetAllUserService } from '../../services/UserService';
import User from '../../models/User';

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ [key: number]: boolean }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUser, setTotalUser] = useState(0);
    const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);

    const fetchData = async (page: number, size: number) => {
        try {
            const response = await GetAllUserService(page, size);
            console.log(response.users);

            setUsers(response.users);
            setTotalPages(response.totalPages);
            setTotalUser(response.totalUser);

            const initialSelection = response.users.reduce((acc: { [key: number]: boolean }, user: User) => {
                acc[user.id] = false;
                return acc;
            }, {});
            setSelectedUser(initialSelection);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    console.log(users);


    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setSelectAll(isChecked);

        const updatedSelection = Object.fromEntries(
            Object.keys(selectedUser).map((key) => [key, isChecked])
        );
        setSelectedUser(updatedSelection);
    };

    const handleCheckboxChange = (userId: number) => {
        const updatedSelection = {
            ...selectedUser,
            [userId]: !selectedUser[userId],
        };
        setSelectedUser(updatedSelection);
        setSelectAll(Object.values(updatedSelection).every((isChecked) => isChecked));
    };


    const handleDeleteUser = async (user: User) => {
        try {
            const response = await DeleteAccountService(user.userName);
            if (response.status === 200) {
                toast.success('User deleted successfully.');
                fetchData(currentPage, pageSize);
            }
        } catch (error) {
            toast.error('Error deleting user: ' + error);
            console.error("Error deleting user:", error);
        }
    };

    const handleConfirmDelete = () => {
        if (deleteUser) handleDeleteUser(deleteUser);
        setDeleteUser(null);
    };

    const handleCancelDelete = () => setDeleteUser(null);

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <div className="d-flex align-items-center">
                    <span className="me-3 text-muted">Action: </span>
                    <select
                        // value={pageSize}
                        // onChange={handlePageSizeChange}
                        className="form-select form-select-sm"
                        style={{ width: '150px', borderColor: '#ced4da', borderRadius: '4px', boxShadow: 'none' }}
                    >
                        {['Select Action', 'Delete'].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                <div className='d-flex align-items-center'>
                    <span className="me-3 text-muted">Rows: </span>
                    <select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="form-select form-select-sm"
                        style={{ maxWidth: '100px', borderColor: '#ced4da', borderRadius: '4px', boxShadow: 'none' }}
                    >
                        {[10, 20, 30, 40].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="table table-bordered table-hover text-center align-middle">
                <thead>
                    <tr>
                        <th style={{ width: '3%' }}>
                            <input type="checkbox" className="form-check-input" checked={selectAll} onChange={handleSelectAllChange}
                            />
                        </th>
                        <th style={{ width: '3%' }} className='fw-bold'>Avatar</th>
                        <th style={{ width: '5%' }} className='fw-bold'>UserName</th>
                        <th style={{ width: '10%' }} className='fw-bold'>Email</th>
                        <th style={{ width: '5%' }} className='fw-bold'>Gender</th>
                        <th style={{ width: '10%' }} className='fw-bold'>Date Of Birth</th>
                        <th style={{ width: '10%' }} className='fw-bold'>Role</th>
                        <th style={{ width: '5%' }} className='fw-bold'>Status</th>
                        <th style={{ width: '10%' }} className='fw-bold'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox" className="form-check-input" /></td>
                        <td><img src="https://via.placeholder.com/50" alt="Avatar" className="rounded-circle" width="40" height="40" /></td>
                        <td>johndoe</td>
                        <td>johndoe@example.com</td>
                        <td>Male</td>
                        <td>1990-01-01</td>
                        <td>Admin</td>
                        <td><span className="badge bg-success">Active</span></td>
                        <td>
                            <button className="btn btn-sm btn-primary me-2">
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-sm btn-danger">
                                <i className="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" className="form-check-input" /></td>
                        <td><img src="https://via.placeholder.com/50" alt="Avatar" className="rounded-circle" width="40" height="40" /></td>
                        <td>janedoe</td>
                        <td>janedoe@example.com</td>
                        <td>Female</td>
                        <td>1992-05-15</td>
                        <td>User</td>
                        <td><span className="badge bg-warning">Pending</span></td>
                        <td>
                            <button className="btn btn-sm btn-primary me-2">
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-sm btn-danger">
                                <i className="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" className="form-check-input" /></td>
                        <td><img src="https://via.placeholder.com/50" alt="Avatar" className="rounded-circle" width="40" height="40" /></td>
                        <td>bobjones</td>
                        <td>bobjones@example.com</td>
                        <td>Male</td>
                        <td>1985-03-22</td>
                        <td>Moderator</td>
                        <td><span className="badge bg-secondary">Inactive</span></td>
                        <td>
                            <button className="btn btn-sm btn-primary me-2">
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-sm btn-danger">
                                <i className="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>

                    {/* {users.map(user => (
                        <tr key={user.id} className={user.isDeleted ? "table-secondary" : ""}>
                            <td>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={!!selectedUser[user.id]}
                                    onChange={() => handleCheckboxChange(user.id)}
                                />
                            </td>
                            <td>
                                <img
                                    src={user.profilePicture ?? avatarImage}
                                    alt="avatar"
                                    width={40}
                                    className="rounded-circle border border-secondary"
                                />
                            </td>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td>{['Male', 'Female'].includes(user.gender) ? user.gender : 'Other'}</td>
                            <td>{user.userRoles ?? 'User'}</td>
                            <td>
                                <span className={`badge ${user.isDeleted ? 'bg-danger' : 'bg-success'}`}>
                                    {user.isDeleted ? 'Inactive' : 'Active'}
                                </span>
                            </td>
                            <td>
                                <button className="btn btn-sm btn-light ms-2" onClick={() => handleShowDetails(user)}>
                                    <i className="bi bi-eye-fill"></i>
                                </button>
                                <button className="btn btn-sm btn-light ms-2" onClick={() => setEditUser(user)}>
                                    <i className="bx bx-edit"></i>
                                </button>
                                <button className="btn btn-sm btn-danger ms-2" onClick={() => setDeleteUser(user)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))} */}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            {deleteUser && (
                <ConfirmationModal
                    message={`Are you sure you want to delete the user ${deleteUser.userName}?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};

export default UserTable;

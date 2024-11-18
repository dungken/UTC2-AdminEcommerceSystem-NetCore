import React, { useEffect, useState } from 'react';
import avatarImage from '../../assets/img/avatars/1.png';
import Pagination from '../../utils/Pagination';
import ConfirmationModal from './ConfirmationModal';
import { toast } from 'react-toastify';
import { DeleteAccountService, GetAllUserService } from '../../services/UserService';
import User from '../../models/User';
import { json } from 'stream/consumers';
import moment from 'moment';

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
            console.log("Get all user response:", response.data.users.values);

            if (response.success === true) {
                // console.log("Users:", response.data.users);

                setUsers(response.data.users);
                setTotalPages(response.data.totalPages);
                setTotalUser(response.data.totalUser);

                const initialSelection = response.data.users.reduce((acc: { [key: number]: boolean }, user: User) => {
                    acc[user.id] = false;
                    return acc;
                }, {});
                setSelectedUser(initialSelection);
            } else {
                toast.error('Error fetching data: ' + response.message);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize]);
    // console.log(users);

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

    console.log(users);


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
                    <div className="fw-bold text-dark mx-2 px-2" style={{ fontSize: '1.1rem', width: '7em' }}>
                        Total: {totalUser}
                    </div>
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
                    {users.map(user => (
                        <tr>
                            <td><input type="checkbox" className="form-check-input" /></td>
                            <td><img src={user.profilePicture || "https://via.placeholder.com/50"} alt="Avatar" className="rounded-circle" width="40" height="40" /></td>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td>{user.gender ?? 'Other'}</td>
                            <td>{moment(user.dateOfBirth).format('DD/MM/YYYY')}</td>
                            <td>
                                {
                                    user.userRoles.length > 0 ?
                                        user.userRoles.map(role => (
                                            role.name != '' &&
                                            <span className={`badge bg-me bg-${role.name != '' ? 'primary' : 'badge'}`}>{role.name}</span>
                                        ))
                                        : 'No Role'
                                }
                                {/* <span className="badge bg-secondary"> {user.userRoles.length > 0 ? user.userRoles.map(role => role.name).join(', ') : 'Customer'}</span> */}
                            </td>
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
                    ))}
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

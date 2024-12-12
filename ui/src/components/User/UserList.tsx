import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserModal from './UserModal';
import ExportButton from './ExportButton';
import User from '../../models/User';
import { DeleteAccountService, DeleteUsersService, GetAllUserService, RestoreUsersService } from '../../services/UserService';
import { toast } from 'react-toastify';
import moment from 'moment';
import Pagination from '../../utils/Pagination';
import EditUserModal from './EditUserModal';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUser, setTotalUser] = useState(0);

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

    const [selectedStatus, setSelectedStatus] = useState<string>('Select Status');
    const [selectedRole, setSelectedRole] = useState<string>('Select Role');

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(event.target.value);
    };


    // Extract unique role names
    const roles = new Set(); // Using a set to store unique roles
    users.forEach(user => {
        user.userRoles.forEach(role => {
            roles.add(role.name); // Add role name to the set
        });
    });

    // Convert the set to an array if needed
    const roleList = Array.from(roles);
    // console.log(roleList); // Output: ['User', 'Permission Manager']

    const [searchQuery, setSearchQuery] = useState<string>('');

    // Function to handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredUsers = users.filter(user =>
        (selectedStatus === 'Select Status' || user.status === selectedStatus) &&
        (selectedRole === 'Select Role' || user.userRoles.some(role => role.name === selectedRole)) &&
        (user.userName.toLowerCase().includes(searchQuery) || user.email.toLowerCase().includes(searchQuery))
    );

    const [selectedUser, setSelectedUser] = useState<{ [key: string]: boolean }>({});
    const [selectAll, setSelectAll] = useState<boolean>(false);

    // Handle individual checkbox change
    const handleCheckboxChange = (userId: number): void => {
        setSelectedUser((prevSelected) => ({
            ...prevSelected,
            [userId]: !prevSelected[userId],
        }));
    };

    // Handle "Select All" checkbox change
    const handleSelectAllChange = (): void => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        const updatedSelection = filteredUsers.reduce((acc, user) => {
            acc[user.id] = newSelectAll;
            return acc;
        }, {} as { [key: string]: boolean });
        setSelectedUser(updatedSelection);
    };

    const [selectedAction, setSelectedAction] = useState<string>('Select Action');

    const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAction(event.target.value);
    };

    const handleAction = async (action: string) => {
        const selectedUsersIds = Object.keys(selectedUser).filter(
            (userId) => selectedUser[userId]
        );

        if (selectedUsersIds.length === 0) {
            toast.warning('No users selected');
            return;
        }

        try {
            if (action === 'Delete') {
                // console.log("Deleting....");
                // console.log(selectedUsersIds);
                const response = await DeleteUsersService(selectedUsersIds);
                // console.log(response);

                if (response.success === true) {
                    fetchData(currentPage, pageSize);
                    // toast.success('Selected users deleted successfully.');
                }
            } else if (action === 'Restore') {
                console.log(selectedUsersIds);
                // Implement restore logic here
                console.log('Restoring....');

                const response = await RestoreUsersService(selectedUsersIds);
                // console.log(response);

                if (response.success === true) {
                    fetchData(currentPage, pageSize);
                    // toast.success('Selected users deleted successfully.');
                }
            }
        } catch (error) {
            toast.error('Error executing action: ' + error);
        }
    };


    // const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const handleEditUser = (user: User) => {
        console.log("Edit User:", user);

        setEditUser(user);
    }

    console.log("User: ", users);


    const handleCloseModal = () => {
        setEditUser(null);
    }

    return (
        <div className="container-xxl flex-grow-1 py-2 ">
            <div className="row">
                <div className="mb-6 order-0">

                    <div className="card">
                        <h3 className="card-title mb-0 mt-4 text-center"> User In System 👥</h3>
                        <div className="card-header d-flex justify-content-around p-3">
                            <div className="d-flex justify-content-center align-items-center gap-5">

                                {/* Nút thêm người dùng mới */}
                                <button className="btn btn-primary rounded" data-bs-toggle="modal" data-bs-target="#createUserModel">
                                    <i className="bx bx-plus"></i> Create
                                </button>

                                {/* Search Input */}
                                <div className="form-outline" data-mdb-input-init>
                                    <input
                                        type="search"
                                        id="form1"
                                        className="form-control"
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </div>

                                {/* Modal Thêm Người Dùng */}
                                <UserModal />

                                <span className="text-muted ">Status: </span>
                                <select
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    className="form-select form-select-sm"
                                    style={{ width: '150px', borderColor: '#ced4da', borderRadius: '4px', boxShadow: 'none' }}
                                >
                                    {['Select Status', 'Active', 'Pending', 'Inactive'].map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>

                                <span className="me-3 text-muted">Role: </span>
                                <select
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                    className="form-select form-select-sm"
                                    style={{ width: '150px', borderColor: '#ced4da', borderRadius: '4px', boxShadow: 'none' }}
                                >
                                    {['Select Role', ...roleList].map(role => (
                                        <option key={role as string} value={role as string}>{role as string}</option>
                                    ))}
                                </select>
                                {/* Nút Export */}
                                <ExportButton />
                            </div>
                        </div>


                        <div className="container mt-3 mb-1">
                            <div className="d-flex justify-content-between mb-3 align-items-center">
                                <div className="d-flex align-items-center">
                                    <select
                                        value={selectedAction}
                                        onChange={handleActionChange}
                                        className="form-select form-select-sm"
                                        style={{
                                            width: '150px',
                                            borderColor: '#ced4da',
                                            borderRadius: '4px',
                                            boxShadow: 'none'
                                        }}
                                    >
                                        {['Select Action', 'Delete', 'Restore'].map((action) => (
                                            <option key={action} value={action}>{action}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleAction(selectedAction)}
                                        className="btn btn-primary ms-3"
                                        disabled={selectedAction === 'Select Action'} // Disable button if no valid action is selected
                                    >
                                        Execute Action
                                    </button>
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

                        </div>


                        <table className="table table-bordered table-hover text-center align-middle p-2">
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
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedUser[user.id] || false}
                                                onChange={() => handleCheckboxChange(user.id)}
                                            />
                                        </td>
                                        <td>
                                            <img
                                                src={user.profilePicture || "https://via.placeholder.com/50"}
                                                alt="Avatar"
                                                className="rounded-circle"
                                                width="40"
                                                height="40"
                                            />
                                        </td>
                                        <td>{user.userName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.gender ?? "Other"}</td>
                                        <td>{moment(user.dateOfBirth).format("DD/MM/YYYY")}</td>
                                        <td>
                                            {
                                                user.userRoles.length > 0 ? (
                                                    user.userRoles.map((role, index) => (
                                                        role.name !== 'Customer' ? (
                                                            <span
                                                                key={index}
                                                                className={`badge bg-primary me-1`}
                                                            >
                                                                {role.name}
                                                            </span>
                                                        ) : (
                                                            <span
                                                                key={index}
                                                                className={`badge bg-warning me-1`}
                                                            >
                                                                {role.name}
                                                            </span>
                                                        )
                                                    ))
                                                ) : (
                                                    <span className="badge bg-warning">Customer</span>
                                                )
                                            }

                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${user.status === "Active"
                                                    ? "bg-success"
                                                    : user.status === "Inactive"
                                                        ? "bg-danger"
                                                        : "bg-warning"
                                                    }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>


                                        <button
                                            className="btn btn-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#editUserModel"
                                            onClick={() => handleEditUser(user)}
                                            style={{
                                                marginTop: '10px',
                                                border: 'none',
                                                padding: '6px 8px'
                                            }}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {editUser && (
                            <EditUserModal
                                editUser={editUser}
                                backdrop="static"
                                onClose={handleCloseModal}
                                onUpdateSuccess={() => fetchData(currentPage, pageSize)}
                            />
                        )}

                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>

                </div>


            </div>
        </div>
    );
};

export default UserList;

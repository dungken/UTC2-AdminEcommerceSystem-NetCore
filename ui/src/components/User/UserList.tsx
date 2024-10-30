import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserList.css'; // Import any necessary CSS

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="mb-6 order-0">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title"> Users In System 👥</h5>
                            <div className="d-flex justify-content-end">
                                <div className="btn-group gap-2">
                                    <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="bx bx-export"></i> Export
                                    </button>
                                    <button className="btn btn-primary rounded" data-bs-toggle="modal" data-bs-target="#createUserModel">
                                        <i className="bx bx-plus"></i> Add New User
                                    </button>

                                    <div className="modal fade" id="createUserModel" tabIndex={-1} aria-labelledby="createUserModelLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-lg modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title" id="createUserModelLabel">Create User Information</h4>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <p className="text-center">Updating user details will trigger a privacy audit.</p>
                                                    <form className="row g-4">
                                                        <div className="col-md-6">
                                                            <label htmlFor="modalEditUserFirstName" className="form-label">First Name</label>
                                                            <input type="text" className="form-control" id="modalEditUserFirstName" placeholder="John" defaultValue="John" />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="modalEditUserLastName" className="form-label">Last Name</label>
                                                            <input type="text" className="form-control" id="modalEditUserLastName" placeholder="Doe" defaultValue="Doe" />
                                                        </div>
                                                        <div className="col-12">
                                                            <label htmlFor="modalEditUserName" className="form-label">Username</label>
                                                            <input type="text" className="form-control" id="modalEditUserName" placeholder="johndoe007" defaultValue="johndoe007" />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="modalEditUserEmail" className="form-label">Email</label>
                                                            <input type="email" className="form-control" id="modalEditUserEmail" placeholder="example@domain.com" defaultValue="example@domain.com" />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="modalEditUserStatus" className="form-label">Status</label>
                                                            <select id="modalEditUserStatus" className="form-select">
                                                                <option>Status</option>
                                                                <option value="1">Active</option>
                                                                <option value="2">Inactive</option>
                                                                <option value="3">Suspended</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="modalEditTaxID" className="form-label">Tax ID</label>
                                                            <input type="text" className="form-control" id="modalEditTaxID" placeholder="123 456 7890" defaultValue="123 456 7890" />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="modalEditUserPhone" className="form-label">Phone Number</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text">US (+1)</span>
                                                                <input type="tel" className="form-control" id="modalEditUserPhone" placeholder="202 555 0111" defaultValue="202 555 0111" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="modalEditUserLanguage" className="form-label">Language</label>
                                                            <select id="modalEditUserLanguage" className="form-select" multiple>
                                                                <option selected>English</option>
                                                                <option>Spanish</option>
                                                                <option>French</option>
                                                                <option>German</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="modalEditUserCountry" className="form-label">Country</label>
                                                            <select id="modalEditUserCountry" className="form-select">
                                                                <option value="">Select</option>
                                                                <option>India</option>
                                                                <option>United States</option>
                                                                <option>Canada</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="editBillingAddress" defaultChecked />
                                                                <label className="form-check-label" htmlFor="editBillingAddress">Use as billing address?</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 text-center">
                                                            <button type="submit" className="btn btn-primary me-2">Submit</button>
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="entries">Show</label>
                                    <select id="entries" className="form-select d-inline w-auto">
                                        <option value="7">7</option>
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="75">75</option>
                                        <option value="100">100</option>
                                    </select>
                                    <span> entries</span>
                                </div>
                                <div className="col-md-6 d-flex justify-content-md-end">
                                    <div className="dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-md-end justify-content-center align-items-center flex-sm-nowrap flex-wrap flex-sm-row flex-column">
                                        <div className="me-4 w-auto">
                                            <div id="DataTables_Table_0_filter" className="dataTables_filter">
                                                <label><input type="search" className="form-control" placeholder="Search User" aria-controls="DataTables_Table_0" /></label>
                                            </div>
                                        </div>
                                        <div className="user_role w-px-200 me-sm-4 mb-6 mb-sm-0">
                                            <select id="UserRole" className="form-select text-capitalize">
                                                <option value=""> Select Role </option>
                                                <option value="Admin" className="text-capitalize">Admin</option>
                                                <option value="Author" className="text-capitalize">Author</option>
                                                <option value="Editor" className="text-capitalize">Editor</option>
                                                <option value="Maintainer" className="text-capitalize">Maintainer</option>
                                                <option value="Subscriber" className="text-capitalize">Subscriber</option>
                                            </select>
                                        </div>
                                        <div className="user_role w-px-200 me-sm-4 mb-6 mb-sm-0">
                                            <select id="UserRole" className="form-select text-capitalize">
                                                <option value=""> Select Status </option>
                                                <option value="Admin" className="text-capitalize">Active</option>
                                                <option value="Author" className="text-capitalize">Pending</option>
                                            </select>
                                        </div>
                                        <div className="user_plan w-px-200 mb-6 mb-sm-0">
                                            <select id="Userplan" className="form-select text-capitalize">
                                                <option value=""> Select Plan </option>
                                                <option value="Basic" className="text-capitalize">Basic</option>
                                                <option value="Company" className="text-capitalize">Company</option>
                                                <option value="Enterprise" className="text-capitalize">Enterprise</option>
                                                <option value="Team" className="text-capitalize">Team</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" className="form-check-input" /></th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Date</th>
                                        <th>Salary</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td><input type="checkbox" className="form-check-input" /></td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>04/15/2021</td>
                                            <td>$24,973.48</td>
                                            <td><span className="badge bg-success">Professional</span></td>
                                            <td>
                                                <div className="btn-group">
                                                    <button className="btn btn-icon dropdown-toggle" data-bs-toggle="dropdown">
                                                        <i className="bx bx-dots-vertical-rounded"></i>
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-end">
                                                        <li><a className="dropdown-item" href="#">Details</a></li>
                                                        <li><a className="dropdown-item" href="#">Archive</a></li>
                                                        <li><div className="dropdown-divider"></div></li>
                                                        <li><a className="dropdown-item text-danger delete-record" data-bs-toggle="modal" data-bs-target="#deleteUserModal" href="#">Delete</a></li>
                                                    </ul>
                                                </div>
                                                <button className="btn btn-icon" data-bs-toggle="modal" data-bs-target="#editUserModal">
                                                    <i className="bx bx-edit"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="modal fade" id="editUserModal" tabIndex={-1} aria-labelledby="editUserModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h4 className="modal-title" id="editUserModalLabel">Edit User Information</h4>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <p className="text-center">Updating user details will trigger a privacy audit.</p>
                                            <form className="row g-4">
                                                <div className="col-md-6">
                                                    <label htmlFor="modalEditUserFirstName" className="form-label">First Name</label>
                                                    <input type="text" className="form-control" id="modalEditUserFirstName" placeholder="John" defaultValue="John" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="modalEditUserLastName" className="form-label">Last Name</label>
                                                    <input type="text" className="form-control" id="modalEditUserLastName" placeholder="Doe" defaultValue="Doe" />
                                                </div>
                                                <div className="col-12">
                                                    <label htmlFor="modalEditUserName" className="form-label">Username</label>
                                                    <input type="text" className="form-control" id="modalEditUserName" placeholder="johndoe007" defaultValue="johndoe007" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="modalEditUserEmail" className="form-label">Email</label>
                                                    <input type="email" className="form-control" id="modalEditUserEmail" placeholder="example@domain.com" defaultValue="example@domain.com" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="modalEditUserStatus" className="form-label">Status</label>
                                                    <select id="modalEditUserStatus" className="form-select">
                                                        <option>Status</option>
                                                        <option value="1">Active</option>
                                                        <option value="2">Inactive</option>
                                                        <option value="3">Suspended</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="modalEditTaxID" className="form-label">Tax ID</label>
                                                    <input type="text" className="form-control" id="modalEditTaxID" placeholder="123 456 7890" defaultValue="123 456 7890" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="modalEditUserPhone" className="form-label">Phone Number</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">US (+1)</span>
                                                        <input type="tel" className="form-control" id="modalEditUserPhone" placeholder="202 555 0111" defaultValue="202 555 0111" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="modalEditUserLanguage" className="form-label">Language</label>
                                                    <select id="modalEditUserLanguage" className="form-select" multiple>
                                                        <option selected>English</option>
                                                        <option>Spanish</option>
                                                        <option>French</option>
                                                        <option>German</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="modalEditUserCountry" className="form-label">Country</label>
                                                    <select id="modalEditUserCountry" className="form-select">
                                                        <option value="">Select</option>
                                                        <option>India</option>
                                                        <option>United States</option>
                                                        <option>Canada</option>
                                                    </select>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-check form-switch">
                                                        <input className="form-check-input" type="checkbox" id="editBillingAddress" defaultChecked />
                                                        <label className="form-check-label" htmlFor="editBillingAddress">Use as billing address?</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 text-center">
                                                    <button type="submit" className="btn btn-primary me-2">Submit</button>
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between">
                                <div>Showing 1 to 7 of 100 entries</div>
                                <nav>
                                    <ul className="pagination">
                                        <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                                        <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                                        <li className="page-item"><a className="page-link" href="#">Next</a></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
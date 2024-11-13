import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserModal from './UserModal';
import UserTable from './UserTable';
import ExportButton from './ExportButton';


const UserList: React.FC = () => {
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

                                {/* Form Tìm Kiếm */}
                                <div className="form-outline" data-mdb-input-init>
                                    <input
                                        type="search"
                                        id="form1"
                                        className="form-control"
                                        placeholder="Search users..."
                                    />
                                </div>

                                {/* Modal Thêm Người Dùng */}
                                <UserModal />

                                <span className="text-muted ">Status: </span>
                                <select
                                    // value={pageSize}
                                    // onChange={handlePageSizeChange}
                                    className="form-select form-select-sm"
                                    style={{ width: '150px', borderColor: '#ced4da', borderRadius: '4px', boxShadow: 'none' }}
                                >
                                    {['Select Status', 'Active', 'Inactive', 'Pending'].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>

                                <span className="me-3 text-muted">Role: </span>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: '150px', borderColor: '#ced4da', borderRadius: '4px', boxShadow: 'none' }}
                                >
                                    {['Select Role', 'User', 'Admin', 'Manager', 'CEO'].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                                {/* Nút Export */}
                                <ExportButton />
                            </div>
                        </div>
                        <UserTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;

import React, { useEffect, useState } from 'react';
import avatarImage from '../../assets/img/avatars/1.png';
import Pagination from '../../utils/Pagination';
import { toast } from 'react-toastify';
import { DeleteAccountService, GetAllUserService } from '../../services/UserService';
import { Link } from 'react-router-dom';

const ProductCategoryTable: React.FC = () => {

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <div className="d-flex align-items-center">
                    <span className="me-3 text-muted">Action: </span>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: '150px', borderColor: '#ced4da', borderRadius: '4px', boxShadow: 'none' }}
                    >
                        {['Select Action', 'Delete', 'Active', 'Inactive'].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                <div className='d-flex align-items-center'>
                    <span className="me-3 text-muted">Rows: </span>
                    <select
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
                        <th >
                            <input type="checkbox" className="form-check-input"
                            />
                        </th>
                        <th className='fw-bold'>Name</th>
                        <th className='fw-bold'>Description</th>
                        <th className='fw-bold'>Status</th>
                        <th className='fw-bold'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox" className="form-check-input" /></td>
                        <td>
                            <Link to="/children-category">Quan</Link>
                        </td>
                        <td>Danh muc quan</td>
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
                        <td>
                            <Link to="/children-category">Ao</Link>
                        </td>
                        <td>Danh muc ao</td>
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
                        <td>
                            <Link to="/children-category">Giay</Link>
                        </td>
                        <td>Danh muc giay</td>
                        <td><span className="badge bg-danger">Inactive</span></td>
                        <td>
                            <button className="btn btn-sm btn-primary me-2">
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-sm btn-danger">
                                <i className="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <Pagination currentPage={1} totalPages={2} onPageChange={() => { }} />
        </div>
    );
};

export default ProductCategoryTable;

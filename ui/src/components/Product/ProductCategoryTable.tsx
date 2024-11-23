import React, { useEffect, useState } from 'react';
import avatarImage from '../../assets/img/avatars/1.png';
import Pagination from '../../utils/Pagination';
import { toast } from 'react-toastify';
import { DeleteAccountService, GetAllUserService } from '../../services/UserService';
import { Link } from 'react-router-dom';

const ProductCategoryTable: React.FC<{ categories: any[], onEditCategory: (category: any) => void, onDeleteCategory: (id: string) => void }> = ({ categories, onEditCategory, onDeleteCategory }) => {

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
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td><input type="checkbox" className="form-check-input" /></td>
                            <td>
                                <Link to={`/children-category/${category.id}`}>{category.name}</Link>
                            </td>
                            <td>{category.description}</td>
                            <td><span className={`badge ${category.status === 'Active' ? 'bg-success' : category.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>{category.status}</span></td>
                            <td>
                                <button className="btn btn-sm btn-primary me-2" onClick={() => onEditCategory(category)}>
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => onDeleteCategory(category.id)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={1} totalPages={1} onPageChange={() => { }} />
        </div>
    );
};

export default ProductCategoryTable;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCategoryModal from './ProductCategoryModal';
import ProductCategoryTable from './ProductCategoryTable';

const ProductCategory: React.FC = () => {
    return (
        <div className="container-xxl flex-grow-1 py-2">
            <div className="row">
                <div className="mb-6 order-0">
                    <div className="card">
                        <h3 className="card-title mb-0 mt-4 text-center"> Product Category Management</h3>
                        <div className="card-header d-flex justify-content-around p-3">
                            <div className="d-flex justify-content-center align-items-center gap-5">
                                <button className="btn btn-primary rounded" data-bs-toggle="modal" data-bs-target="#createUserModel">
                                    <i className="bx bx-plus"></i> Create
                                </button>

                                <div className="form-outline" data-mdb-input-init>
                                    <input
                                        type="search"
                                        id="form1"
                                        className="form-control"
                                        placeholder="Search..."
                                    />
                                </div>

                                <ProductCategoryModal />

                                <span className="text-muted ">Filter: </span>
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

                            </div>
                        </div>
                        <ProductCategoryTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCategory;

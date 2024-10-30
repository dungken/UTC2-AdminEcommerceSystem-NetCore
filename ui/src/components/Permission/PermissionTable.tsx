// src/components/Pages/PermissionTable.tsx
import React from 'react';
// import './PermissionTable.css'; // Import any necessary CSS

const PermissionTable: React.FC = () => {
    return (
        <div className="card">
            <div className="card-datatable table-responsive">
                <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
                    <div className="row">
                        <div className="col-sm-12 col-md-3">
                            <div className="dataTables_length" id="DataTables_Table_0_length">
                                <label>
                                    Show
                                    <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-select">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-9">
                            <div className="dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-md-end justify-content-center flex-wrap">
                                <div className="me-4 mt-n6 mt-md-0">
                                    <div id="DataTables_Table_0_filter" className="dataTables_filter">
                                        <label>
                                            <input type="search" className="form-control" placeholder="Search Permissions" aria-controls="DataTables_Table_0" />
                                        </label>
                                    </div>
                                </div>
                                <div className="dt-buttons btn-group flex-wrap">
                                    <button className="btn add-new btn-primary mb-6 mb-md-0" type="button" data-bs-toggle="modal" data-bs-target="#addPermissionModal">
                                        <span>
                                            <i className="bx bx-plus bx-xs me-0 me-sm-2"></i>
                                            <span className="d-none d-sm-inline-block">Add Permission</span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="datatables-permissions table dataTable no-footer dtr-column" id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info" style={{ width: '1210px' }}>
                        <thead className="border-top">
                            <tr>
                                <th className="control sorting_disabled dtr-hidden" style={{ width: '0px', display: 'none' }} aria-label=""></th>
                                <th className="sorting sorting_desc" tabIndex={0} aria-controls="DataTables_Table_0" style={{ width: '256px' }} aria-label="Name: activate to sort column ascending" aria-sort="descending">Name</th>
                                <th className="sorting_disabled" style={{ width: '397px' }} aria-label="Assigned To">Assigned To</th>
                                <th className="sorting_disabled" style={{ width: '250px' }} aria-label="Created Date">Created Date</th>
                                <th className="sorting_disabled" style={{ width: '145px' }} aria-label="Actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="odd">
                                <td className="control" tabIndex={0} style={{ display: 'none' }}></td>
                                <td className="sorting_1">
                                    <span className="text-nowrap text-heading">Project Planning</span>
                                </td>
                                <td>
                                    <span className="text-nowrap">
                                        <a href="app-user-list.html">
                                            <span className="badge bg-label-primary me-4">Administrator</span>
                                        </a>
                                        <a href="app-user-list.html">
                                            <span className="badge bg-label-success me-4">Users</span>
                                        </a>
                                        <a href="app-user-list.html">
                                            <span className="badge bg-label-info me-4">Support</span>
                                        </a>
                                    </span>
                                </td>
                                <td>
                                    <span className="text-nowrap">14 May 2021, 12:10 PM</span>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <span className="text-nowrap">
                                            <button className="btn btn-icon me-1" data-bs-target="#editPermissionModal" data-bs-toggle="modal" data-bs-dismiss="modal">
                                                <i className="bx bx-edit bx-md"></i>
                                            </button>
                                            <a href="javascript:;" className="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                <i className="bx bx-dots-vertical-rounded bx-md"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end m-0">
                                                <a href="javascript:;" className="dropdown-item">Edit</a>
                                                <a href="javascript:;" className="dropdown-item">Suspend</a>
                                            </div>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr className="even">
                                <td className="control" tabIndex={0} style={{ display: 'none' }}></td>
                                <td className="sorting_1">
                                    <span className="text-nowrap text-heading">Only View</span>
                                </td>
                                <td>
                                    <span className="text-nowrap">
                                        <a href="app-user-list.html">
                                            <span className="badge bg-label-primary me-4">Administrator</span>
                                        </a>
                                        <a href="app-user-list.html">
                                            <span className="badge bg-label-danger me-4">Restricted User</span>
                                        </a>
                                    </span>
                                </td>
                                <td>
                                    <span className="text-nowrap">04 Dec 2021, 8:15 PM</span>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <span className="text-nowrap">
                                            <button className="btn btn-icon me-1" data-bs-target="#editPermissionModal" data-bs-toggle="modal" data-bs-dismiss="modal">
                                                <i className="bx bx-edit bx-md"></i>
                                            </button>
                                            <a href="javascript:;" className="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                <i className="bx bx-dots-vertical-rounded bx-md"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end m-0">
                                                <a href="javascript:;" className="dropdown-item">Edit</a>
                                                <a href="javascript:;" className="dropdown-item">Suspend</a>
                                            </div>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            {/* Repeat similar structure for other permissions */}
                        </tbody>
                    </table>
                    <div className="row mx-1">
                        <div className="col-sm-12 col-md-6">
                            <div className="dataTables_info" id="DataTables_Table_0_info" role="status" aria-live="polite">
                                Showing 1 to 9 of 9 entries
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <div className="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate">
                                <ul className="pagination">
                                    <li className="paginate_button page-item previous disabled" id="DataTables_Table_0_previous">
                                        <a aria-controls="DataTables_Table_0" aria-disabled="true" role="link" data-dt-idx="previous" tabIndex={-1} className="page-link">
                                            <i className="bx bx-chevron-left bx-18px"></i>
                                        </a>
                                    </li>
                                    <li className="paginate_button page-item active">
                                        <a href="#" aria-controls="DataTables_Table_0" role="link" aria-current="page" data-dt-idx="0" tabIndex={0} className="page-link">1</a>
                                    </li>
                                    <li className="paginate_button page-item next disabled" id="DataTables_Table_0_next">
                                        <a aria-controls="DataTables_Table_0" aria-disabled="true" role="link" data-dt-idx="next" tabIndex={-1} className="page-link">
                                            <i className="bx bx-chevron-right bx-18px"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermissionTable;
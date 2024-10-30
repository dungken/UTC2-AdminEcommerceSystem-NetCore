// src/components/Pages/RoleTable.tsx
import React from 'react';
// import './RoleTable.css'; // Import any necessary CSS

const RoleTable: React.FC = () => {
    return (
        <div className="col-12">
            <div className="card">
                <div className="card-datatable table-responsive">
                    <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
                        <div className="row">
                            <div className="col-sm-12 col-md-4 col-lg-6">
                                <div className="dataTables_length mb-0 mb-md-6" id="DataTables_Table_0_length">
                                    <label>
                                        <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-select mx-0">
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-8 col-lg-6">
                                <div className="dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-md-end justify-content-center align-items-center flex-sm-nowrap flex-wrap flex-sm-row flex-column">
                                    <div className="me-4">
                                        <div id="DataTables_Table_0_filter" className="dataTables_filter">
                                            <label>
                                                <input type="search" className="form-control" placeholder="Search User" aria-controls="DataTables_Table_0" />
                                            </label>
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
                        <table className="datatables-users table border-top dataTable no-footer dtr-column" id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info" style={{ width: '1210px' }}>
                            <thead>
                                <tr>
                                    <th className="control sorting_disabled dtr-hidden" style={{ width: '0px', display: 'none' }} aria-label=""></th>
                                    <th className="sorting_disabled dt-checkboxes-cell dt-checkboxes-select-all" style={{ width: '18px' }} data-col="1" aria-label="">
                                        <input type="checkbox" className="form-check-input" />
                                    </th>
                                    <th className="sorting sorting_desc" tabIndex={0} aria-controls="DataTables_Table_0" style={{ width: '291px' }} aria-label="User: activate to sort column ascending" aria-sort="descending">User</th>
                                    <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_0" style={{ width: '121px' }} aria-label="Role: activate to sort column ascending">Role</th>
                                    <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_0" style={{ width: '85px' }} aria-label="Plan: activate to sort column ascending">Plan</th>
                                    <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_0" style={{ width: '165px' }} aria-label="Billing: activate to sort column ascending">Billing</th>
                                    <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_0" style={{ width: '80px' }} aria-label="Status: activate to sort column ascending">Status</th>
                                    <th className="sorting_disabled" style={{ width: '144px' }} aria-label="Actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="odd">
                                    <td className="control" tabIndex={0} style={{ display: 'none' }}></td>
                                    <td className="dt-checkboxes-cell">
                                        <input type="checkbox" className="dt-checkboxes form-check-input" />
                                    </td>
                                    <td className="sorting_1">
                                        <div className="d-flex justify-content-left align-items-center">
                                            <div className="avatar-wrapper">
                                                <div className="avatar avatar-sm me-4">
                                                    <img src="../../assets/img/avatars/2.png" alt="Avatar" className="rounded-circle" />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <a href="app-user-view-account.html" className="text-heading text-truncate">
                                                    <span className="fw-medium">Zsazsa McCleverty</span>
                                                </a>
                                                <small>@zmcclevertye@soundcloud.com</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-truncate d-flex align-items-center text-heading">
                                            <i className="bx bx-user text-success me-2"></i>Maintainer
                                        </span>
                                    </td>
                                    <td><span className="text-heading">Enterprise</span></td>
                                    <td>Auto Debit</td>
                                    <td>
                                        <span className="badge bg-label-success" text-capitalized="">Active</span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <a href="javascript:;" className="btn btn-icon delete-record">
                                                <i className="bx bx-trash bx-md"></i>
                                            </a>
                                            <a href="app-user-view-account.html" className="btn btn-icon">
                                                <i className="bx bx-show bx-md"></i>
                                            </a>
                                            <a href="javascript:;" className="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                <i className="bx bx-dots-vertical-rounded bx-md"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end m-0">
                                                <a href="javascript:;" className="dropdown-item">Edit</a>
                                                <a href="javascript:;" className="dropdown-item">Suspend</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="even">
                                    <td className="control" tabIndex={0} style={{ display: 'none' }}></td>
                                    <td className="dt-checkboxes-cell">
                                        <input type="checkbox" className="dt-checkboxes form-check-input" />
                                    </td>
                                    <td className="sorting_1">
                                        <div className="d-flex justify-content-left align-items-center">
                                            <div className="avatar-wrapper">
                                                <div className="avatar avatar-sm me-4">
                                                    <img src="../../assets/img/avatars/7.png" alt="Avatar" className="rounded-circle" />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <a href="app-user-view-account.html" className="text-heading text-truncate">
                                                    <span className="fw-medium">Yoko Pottie</span>
                                                </a>
                                                <small>@ypottiec@privacy.gov.au</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-truncate d-flex align-items-center text-heading">
                                            <i className="bx bx-crown text-primary me-2"></i>Subscriber
                                        </span>
                                    </td>
                                    <td><span className="text-heading">Basic</span></td>
                                    <td>Auto Debit</td>
                                    <td>
                                        <span className="badge bg-label-secondary" text-capitalized="">Inactive</span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <a href="javascript:;" className="btn btn-icon delete-record">
                                                <i className="bx bx-trash bx-md"></i>
                                            </a>
                                            <a href="app-user-view-account.html" className="btn btn-icon">
                                                <i className="bx bx-show bx-md"></i>
                                            </a>
                                            <a href="javascript:;" className="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                <i className="bx bx-dots-vertical-rounded bx-md"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end m-0">
                                                <a href="javascript:;" className="dropdown-item">Edit</a>
                                                <a href="javascript:;" className="dropdown-item">Suspend</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_info" id="DataTables_Table_0_info" role="status" aria-live="polite">
                                    Showing 1 to 10 of 50 entries
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
                                        <li className="paginate_button page-item">
                                            <a href="#" aria-controls="DataTables_Table_0" role="link" data-dt-idx="1" tabIndex={0} className="page-link">2</a>
                                        </li>
                                        <li className="paginate_button page-item">
                                            <a href="#" aria-controls="DataTables_Table_0" role="link" data-dt-idx="2" tabIndex={0} className="page-link">3</a>
                                        </li>
                                        <li className="paginate_button page-item">
                                            <a href="#" aria-controls="DataTables_Table_0" role="link" data-dt-idx="3" tabIndex={0} className="page-link">4</a>
                                        </li>
                                        <li className="paginate_button page-item">
                                            <a href="#" aria-controls="DataTables_Table_0" role="link" data-dt-idx="4" tabIndex={0} className="page-link">5</a>
                                        </li>
                                        <li className="paginate_button page-item next" id="DataTables_Table_0_next">
                                            <a href="#" aria-controls="DataTables_Table_0" role="link" data-dt-idx="next" tabIndex={0} className="page-link">
                                                <i className="bx bx-chevron-right bx-18px"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '1%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleTable;
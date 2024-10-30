// src/components/Pages/AccountConnection.tsx
import React from 'react';
import './AccountConnection.css'; // Import any necessary CSS

const AccountConnection: React.FC = () => {
    return (
        <div className="card">
            <div className="row">
                <div className="col-md-6 col-12">
                    <div className="card-header">
                        <h5 className="mb-1">Connected Accounts</h5>
                        <p className="my-0 card-subtitle">Display content from your connected accounts on your site</p>
                    </div>
                    <div className="card-body">
                        <div className="d-flex mb-4 align-items-center">
                            <div className="flex-shrink-0">
                                <img src="../assets/img/icons/brands/google.png" alt="google" className="me-4" height="32" />
                            </div>
                            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                                <div className="mb-sm-0 mb-2">
                                    <h6 className="mb-0">Google</h6>
                                    <small>Calendar and contacts</small>
                                </div>
                                <div className="text-end">
                                    <div className="form-check form-switch mb-0">
                                        <input type="checkbox" className="form-check-input" defaultChecked />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-4 align-items-center">
                            <div className="flex-shrink-0">
                                <img src="../assets/img/icons/brands/slack.png" alt="slack" className="me-4" height="32" />
                            </div>
                            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                                <div className="mb-sm-0 mb-2">
                                    <h6 className="mb-0">Slack</h6>
                                    <small>Communication</small>
                                </div>
                                <div className="text-end">
                                    <div className="form-check form-switch mb-0">
                                        <input type="checkbox" className="form-check-input" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-4 align-items-center">
                            <div className="flex-shrink-0">
                                <img src="../assets/img/icons/brands/github.png" alt="github" className="me-4" height="32" />
                            </div>
                            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                                <div className="mb-sm-0 mb-2">
                                    <h6 className="mb-0">Github</h6>
                                    <small>Manage your Git repositories</small>
                                </div>
                                <div className="text-end">
                                    <div className="form-check form-switch mb-0">
                                        <input type="checkbox" className="form-check-input" defaultChecked />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-4 align-items-center">
                            <div className="flex-shrink-0">
                                <img src="../assets/img/icons/brands/mailchimp.png" alt="mailchimp" className="me-4" height="32" />
                            </div>
                            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                                <div className="mb-sm-0 mb-2">
                                    <h6 className="mb-0">Mailchimp</h6>
                                    <small>Email marketing service</small>
                                </div>
                                <div className="text-end">
                                    <div className="form-check form-switch mb-0">
                                        <input type="checkbox" className="form-check-input" defaultChecked />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                                <img src="../assets/img/icons/brands/asana.png" alt="asana" className="me-4" height="32" />
                            </div>
                            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                                <div className="mb-sm-0 mb-2">
                                    <h6 className="mb-0">Asana</h6>
                                    <small>Communication</small>
                                </div>
                                <div className="text-end">
                                    <div className="form-check form-switch mb-0">
                                        <input type="checkbox" className="form-check-input" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Connections */}
                    </div>
                </div>
                <div className="col-md-6 col-12">
                    <div className="card-header">
                        <h5 className="mb-1">Social Accounts</h5>
                        <p className="my-0 card-subtitle">Display content from social accounts on your site</p>
                    </div>
                    <div className="card-body">
                        {/* Social Accounts */}
                        <div className="d-flex mb-4 align-items-center">
                            <div className="flex-shrink-0">
                                <img src="../assets/img/icons/brands/facebook.png" alt="facebook" className="me-4" height="32" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-7">
                                    <h6 className="mb-0">Facebook</h6>
                                    <small>Not Connected</small>
                                </div>
                                <div className="col-5 text-end mt-sm-0 mt-2">
                                    <button className="btn btn-icon btn-outline-secondary">
                                        <i className="bx bx-link bx-md"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-4 align-items-center">
                            <div className="flex-shrink-0">
                                <img src="../assets/img/icons/brands/twitter.png" alt="twitter" className="me-4" height="32" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-7">
                                    <h6 className="mb-0">Twitter</h6>
                                    <a href="https://twitter.com/Theme_Selection" target="_blank" className="small">@ThemeSelection</a>
                                </div>
                                <div className="col-5 text-end mt-sm-0 mt-2">
                                    <button className="btn btn-icon btn-outline-danger">
                                        <i className="bx bx-trash bx-md"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-4 align-items-center">
                            <div className="flex-shrink-0">
                                <img src="../assets/img/icons/brands/instagram.png" alt="instagram" className="me-4" height="32" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-7">
                                    <h6 className="mb-0">Instagram</h6>
                                    <a href="https://www.instagram.com/themeselection/" target="_blank" className="small">@ThemeSelection</a>
                                </div>
                                <div className="col-5 text-end mt-sm-0 mt-2">
                                    <button className="btn btn-icon btn-outline-danger">
                                        <i className="bx bx-trash bx-md"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-4 align-items-center">
                            <div className="flex-shrink-0">
                                <img src="../assets/img/icons/brands/dribbble.png" alt="dribbble" className="me-4" height="32" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-7">
                                    <h6 className="mb-0">Dribbble</h6>
                                    <small>Not Connected</small>
                                </div>
                                <div className="col-5 text-end mt-sm-0 mt-2">
                                    <button className="btn btn-icon btn-outline-secondary">
                                        <i className="bx bx-link bx-md"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                                <img src="../assets/img/icons/brands/behance.png" alt="behance" className="me-4" height="32" />
                            </div>
                            <div className="flex-grow-1 row align-items-center">
                                <div className="col-7">
                                    <h6 className="mb-0">Behance</h6>
                                    <small>Not Connected</small>
                                </div>
                                <div className="col-5 text-end">
                                    <button className="btn btn-icon btn-outline-secondary">
                                        <i className="bx bx-link bx-md"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* /Social Accounts */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountConnection;
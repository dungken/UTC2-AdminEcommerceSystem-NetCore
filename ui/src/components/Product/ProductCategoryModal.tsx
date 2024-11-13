import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InputField, PasswordField, ConfirmPasswordField, PhoneNumberField, SelectField } from '../../utils/Controls';
import { CreateUserService } from '../../services/UserService';
import { UploadSingleFileToCloud } from '../../utils/UploadSingleFileToCloud';

const ProductCategoryModal: React.FC = () => {
    return (
        <div className="modal fade" id="createUserModel" tabIndex={-1} aria-labelledby="createUserModelLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header justify-content-center">
                        <h3 className="modal-title" id="createUserModelLabel">Create Product Category</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className="row g-4">
                            <InputField
                                label="Name"
                                id="modalCreateName"
                                name="name"
                                placeholder="Quần"
                            />
                            <InputField
                                label="Description"
                                id="modalCreateDescription"
                                name="description"
                                placeholder="Danh mục chứa các thể loại về quần"
                            />

                            <SelectField
                                label="Belong To Category"
                                id=""
                                name="belong"
                                options={[
                                    { value: 'parent', label: 'Danh mục cha' },
                                    { value: 'short', label: 'Quần short' },
                                    { value: '', label: 'Áo' },
                                    { value: '', label: 'Giày' }
                                ]}
                            />

                            <SelectField
                                label="Status"
                                id=""
                                name="status"
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'inactive', label: 'Inactive' }
                                ]}
                            />
                            <div className="col-12 text-center">
                                <button type="submit" className="btn btn-primary me-2">Submit</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};



export default ProductCategoryModal;
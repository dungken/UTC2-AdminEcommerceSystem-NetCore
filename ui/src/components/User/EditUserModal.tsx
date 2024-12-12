import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetInforAddress } from '../../utils/GetInforAddress';
import { ValidatePhoneNumber, ValidateRequiredFields } from '../../utils/Validation';
import { InputField, PhoneNumberField, SelectField } from '../../utils/Controls';
import { UpdateUserService } from '../../services/UserService';
import { GetAllRolesService } from '../../services/RoleService';
import User from '../../models/User';


interface EditUserModalProps {
    editUser: User;
    backdrop: string;
    onClose: () => void; // Callback to close the modal
    onUpdateSuccess: () => void; // Callback after successful update
}

const EditUserModal: React.FC<EditUserModalProps> = ({ editUser, onClose, onUpdateSuccess, backdrop }) => {
    console.log("Edit User Modal:", editUser);

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [communes, setCommunes] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('Select Role');
    const [roles, setRoles] = useState<Set<string>>(new Set());
    const [userData, setUserData] = useState(editUser);

    useEffect(() => {
        setUserData(editUser);
        setSelectedProvince(editUser.provinceCode || '');
        setSelectedDistrict(editUser.districtCode || '');
        setSelectedCommune(editUser.communeCode || '');
    }, [editUser]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    useEffect(() => {
        GetInforAddress('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1', setProvinces);
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            GetInforAddress(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${selectedProvince}&limit=-1`, setDistricts);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            GetInforAddress(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${selectedDistrict}&limit=-1`, setCommunes);
        }
    }, [selectedDistrict]);

    const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProvince(event.target.value);
        setDistricts([]);
        setCommunes([]);
    };

    const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDistrict(event.target.value);
        setCommunes([]);
    };

    const validateForm = async (user: { [key: string]: any }) => {
        const requiredFields = [
            { field: 'firstName', message: 'First Name is required.' },
            { field: 'lastName', message: 'Last Name is required.' },
            { field: 'phoneNumber', message: 'Phone Number is required.' },
            { field: 'gender', message: 'Gender is required.' },
            { field: 'dateOfBirth', message: 'Date of Birth is required.' },
            { field: 'provinceCode', message: 'Province is required.' },
            { field: 'districtCode', message: 'Districts is required.' },
            { field: 'communeCode', message: 'Communes is required.' },
            { field: 'fullAddress', message: 'Address is required.' },
            { field: 'roleName', message: 'Role is required.' },
            { field: 'status', message: 'Status is required.' }
        ];

        if (!ValidateRequiredFields(user, requiredFields)) return false;
        if (!ValidatePhoneNumber(user.phoneNumber)) return false;
        return true;
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Edit user data", userData);

        const userUpdate = {
            id: userData.id,
            firstName: userData.firstName ?? editUser.firstName,
            lastName: userData.lastName ?? editUser.lastName,
            userName: userData.userName,
            email: userData.email,
            phoneNumber: userData.phoneNumber ?? editUser.phoneNumber,
            gender: userData.gender ?? editUser.gender,
            dateOfBirth: userData.dateOfBirth ?? editUser.dateOfBirth,
            provinceCode: userData.provinceCode ?? editUser.provinceCode,
            districtCode: userData.districtCode ?? editUser.districtCode,
            communeCode: userData.communeCode ?? editUser.communeCode,
            fullAddress: userData.fullAddress ?? editUser.fullAddress,
            status: userData.status ?? editUser.status,
            roleName: selectedRole === 'Select Role' ? editUser.roleName : selectedRole
        };

        console.log('User Update:', userUpdate);

        if (!await validateForm(userUpdate)) return;


        try {
            await UpdateUserService(userUpdate);
            onUpdateSuccess(); // Notify parent of successful update
            onClose(); // Close modal
            // Reload the page
            window.location.reload();
        } catch (error) {
            console.error('Error updating user:', error);
        }

    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(event.target.value);
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await GetAllRolesService();
                if (response.success) {
                    setRoles(new Set(response.data.roles.map((role: any) => role.name)));
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
                toast.error('Failed to fetch roles.');
            }
        };

        fetchRoles();
    }, []);

    const roleList = Array.from(roles);

    return (
        <div className={`modal ${backdrop} fade`} id="editUserModel" tabIndex={-1} aria-labelledby="editUserModelLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header justify-content-center">
                        <h3 className="modal-title" id="editUserModelLabel">Edit User Information</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className="row g-4" onSubmit={handleSubmit}>
                            <InputField
                                label="First Name"
                                id="modalEditUserFirstName"
                                name="firstName"
                                placeholder="John"
                                value={userData.firstName}
                                onChange={handleInputChange}
                            />
                            <InputField
                                label="Last Name"
                                id="modalEditUserLastName"
                                name="lastName"
                                placeholder="Doe"
                                value={userData.lastName}
                                onChange={handleInputChange}
                            />

                            <PhoneNumberField value={userData.phoneNumber} onChange={handleInputChange} />

                            <SelectField
                                label="Gender"
                                id="modalEditUserGender"
                                name="gender"
                                options={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' }
                                ]}
                                value={userData.gender}
                                onChange={handleInputChange}
                            />

                            <InputField
                                label="Date of Birth"
                                id="modalEditUserDateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={userData.dateOfBirth}
                                onChange={handleInputChange}
                            />

                            <SelectField
                                label="Province"
                                id="province"
                                name='provinceCode'
                                value={selectedProvince}
                                onChange={(e) => {
                                    handleProvinceChange(e);
                                    handleInputChange(e);
                                }}
                                options={provinces.map(province => ({ value: province.code, label: province.name }))}
                            />
                            <SelectField
                                label="District"
                                id="district"
                                name='districtCode'
                                value={selectedDistrict}
                                onChange={(e) => {
                                    handleDistrictChange(e);
                                    handleInputChange(e);
                                }}
                                options={districts.map(district => ({ value: district.code, label: district.name_with_type }))}
                            />
                            <SelectField
                                label="Commune"
                                id="commune"
                                name='communeCode'
                                value={selectedCommune}
                                onChange={(e) => {
                                    setSelectedCommune(e.target.value);
                                    handleInputChange(e);
                                }}
                                options={communes.map(commune => ({ value: commune.code, label: commune.name_with_type }))}
                            />

                            <InputField
                                label="Address"
                                id="modalEditUserAddress"
                                name="fullAddress"
                                placeholder="175/111/16 - Đường số 2"
                                value={userData.fullAddress}
                                onChange={handleInputChange}
                            />

                            <div className="col-md-6">
                                <label className="form-label">Roles</label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => {
                                        handleRoleChange(e);
                                        handleInputChange(e);
                                    }}
                                    className="form-select"
                                    name='role'
                                    style={{ borderColor: '#ced4da', borderRadius: '4px', boxShadow: 'none' }}
                                >
                                    {['Select Role', ...roleList].map(role => (
                                        <option key={role as string} value={role as string}>{role as string}</option>
                                    ))}
                                </select>
                            </div>

                            <SelectField
                                label="Status"
                                id="modalEditUserStatus"
                                name="status"
                                options={[
                                    { value: 'Active', label: 'Active' },
                                    { value: 'Inactive', label: 'Inactive' },
                                    { value: 'Pending', label: 'Pending' }
                                ]}
                                value={userData.status}
                                onChange={handleInputChange}
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



export default EditUserModal;
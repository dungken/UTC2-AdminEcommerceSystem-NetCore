import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetInforAddress } from '../../utils/GetInforAddress';
import { CheckUsernameEmailUniqueness, ValidateEmail, ValidateFile, ValidatePassword, ValidatePhoneNumber, ValidateRequiredFields, ValidateUsername } from '../../utils/Validation';
import { InputField, PasswordField, ConfirmPasswordField, PhoneNumberField, SelectField } from '../../utils/Controls';
import { CreateUserService } from '../../services/UserService';
import { UploadSingleFileToCloud } from '../../utils/UploadSingleFileToCloud';
import { GetAllRolesService } from '../../services/RoleService';

const UserModal: React.FC = () => {
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [communes, setCommunes] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');

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
            { field: 'username', message: 'Username is required.' },
            { field: 'email', message: 'Email is required.' },
            { field: 'password', message: 'Password is required.' },
            { field: 'confirmPassword', message: 'Confirm Password is required.' },
            { field: 'phoneNumber', message: 'Phone Number is required.' },
            { field: 'gender', message: 'Gender is required.' },
            { field: 'dateOfBirth', message: 'Date of Birth is required.' },
            { field: 'provinceCode', message: 'Province is required.' },
            { field: 'districtCode', message: 'Districts is required.' },
            { field: 'communeCode', message: 'Communes is required.' },
            { field: 'fullAddress', message: 'Address is required.' },
            { field: 'profilePicture', message: 'File is required.', isFile: true },
            { field: 'role', message: 'Role is required.' },
            { field: 'status', message: 'Status is required.' }
        ];

        if (!ValidateRequiredFields(user, requiredFields)) return false;
        if (!ValidateEmail(user.email)) return false;
        if (!ValidateUsername(user.username)) return false;
        if (!ValidatePassword(user.password, user.confirmPassword)) return false;
        if (!ValidatePhoneNumber(user.phoneNumber)) return false;
        if (!ValidateFile(user.profilePicture, ['image/jpeg', 'image/png'], "Only JPEG, PNG files are allowed", 2 * 1024 * 1024, "2MB")) return false;
        if (!await CheckUsernameEmailUniqueness(user.username, user.email)) return false;
        return true;
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const user = Object.fromEntries(formData.entries());
        if (!(await validateForm(user))) return;
        try {
            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                password: user.password,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                provinceCode: user.provinceCode,
                districtCode: user.districtCode,
                communeCode: user.communeCode,
                fullAddress: user.fullAddress,
                dateOfBirth: user.dateOfBirth,
                profilePicture: null,
                roleName: user.role,
                status: user.status
            }

            console.log('User data:', userData);


            const response = await CreateUserService(userData);

            const urlUploadResponse = await UploadSingleFileToCloud(user.profilePicture as File, user.username as string);

            if (response.success && urlUploadResponse) {
                // relooad page after add user
                window.location.reload();
                toast.success('User added successfully.');
            } else {
                toast.error('Failed to add user: ' + response.data.message);
            }
        } catch (error) {
            handleError(error);
        }

    };



    const handleError = (error: any) => {
        console.error('Error adding user:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(`Failed to add user: ${error.response.data.message}`);
        } else {
            toast.error(`Failed to add user: ${error}`);
        }
    };

    const [selectedRole, setSelectedRole] = useState<string>('Select Role');
    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(event.target.value);
    };


    const [roles, setRoles] = useState<Set<string>>(new Set());
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
        <div className="modal fade" id="createUserModel" tabIndex={-1} aria-labelledby="createUserModelLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header justify-content-center">
                        <h3 className="modal-title" id="createUserModelLabel">Create User Information</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className="row g-4" onSubmit={handleSubmit}>
                            <InputField
                                label="First Name"
                                id="modalEditUserFirstName"
                                name="firstName"
                                placeholder="John"
                            />
                            <InputField
                                label="Last Name"
                                id="modalEditUserLastName"
                                name="lastName"
                                placeholder="Doe"
                            />
                            <InputField
                                label="Username"
                                id="modalEditUserName"
                                name="username"
                                placeholder="johndoe007"
                            />
                            <InputField
                                label="Email"
                                id="modalEditUserEmail"
                                name="email"
                                placeholder="example@domain.com"
                                type="email"
                            />

                            <InputField
                                label="Password"
                                id="modalEditUserPassword"
                                name="password"
                                placeholder="********"
                                type="password"
                            />

                            <InputField
                                label="Confirm Password"
                                id="modalEditUserConfirmPassword"
                                name="confirmPassword"
                                placeholder="********"
                                type="password"
                            />

                            <PhoneNumberField />

                            <SelectField
                                label="Gender"
                                id="modalEditUsertatus"
                                name="gender"
                                options={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' }
                                ]}
                            />

                            <InputField
                                label="Date of Birth"
                                id="modalEditUserDateOfBirth"
                                name="dateOfBirth"
                                type="date"
                            />
                            <InputField
                                label="Profile Picture"
                                id="modalEditUserProfilePicture"
                                name="profilePicture"
                                type="file"
                            />

                            <SelectField
                                label="Province"
                                id="province"
                                name='provinceCode'
                                value={selectedProvince}
                                onChange={handleProvinceChange}
                                options={provinces.map(province => ({ value: province.code, label: province.name }))}
                            />
                            <SelectField
                                label="District"
                                id="district"
                                name='districtCode'
                                value={selectedDistrict}
                                onChange={handleDistrictChange}
                                options={districts.map(district => ({ value: district.code, label: district.name_with_type }))}
                            />
                            <SelectField
                                label="Commune"
                                id="commune"
                                name='communeCode'
                                value={selectedCommune}
                                onChange={(e) => setSelectedCommune(e.target.value)}
                                options={communes.map(commune => ({ value: commune.code, label: commune.name_with_type }))}
                            />

                            <InputField
                                label="Address"
                                id="modalEditUserName"
                                name="fullAddress"
                                placeholder="175/111/16 - Đường số 2"
                            />

                            <div className="col-md-6">
                                <label className="form-label">Roles</label>
                                <select
                                    value={selectedRole}
                                    onChange={handleRoleChange}
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
                                id=""
                                name="status"
                                options={[
                                    { value: 'Active', label: 'Active' },
                                    { value: 'Inactive', label: 'Inactive' },
                                    { value: 'Pending', label: 'Pending' }
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



export default UserModal;
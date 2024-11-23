import React, { useEffect, useState } from 'react';
import './MyProfile.css';
import axios from 'axios';
import avatarImage from '../../assets/img/avatars/1.png';
import { InputField, SelectField } from '../../utils/Controls';
import { GetInforAddress } from '../../utils/GetInforAddress';
import { GetPersonalInfoService, UpdatePersonalInfoService } from '../../services/UserService';
import { UploadSingleFileToCloud } from '../../utils/UploadSingleFileToCloud';
import { toast } from 'react-toastify';
import { useAvatar } from '../../context/AvatarContextType';
import { CheckUsernameEmailUniqueness, ValidatePhoneNumber, ValidateUsername } from '../../utils/Validation';
import DeleteAccountComponent from './DeleteAccountComponent';

const MyProfile: React.FC = () => {
    const { setAvatarUrl } = useAvatar();

    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [avatar, setAvatar] = useState(avatarImage);

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [communes, setCommunes] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');

    // Fetch personal information when component mounts
    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const response = await GetPersonalInfoService();
                // console.log(response);

                if (response.success === true) {
                    const userData = response.data.user;

                    setUserId(userData.id);
                    setUsername(userData.userName);
                    setLastName(userData.lastName);
                    setFirstName(userData.firstName);
                    setEmail(userData.email);
                    setPhoneNumber(userData.phoneNumber);
                    setGender(userData.gender);
                    setDateOfBirth(userData.dateOfBirth.split('T')[0]);
                    setFullAddress(userData.fullAddress);
                    setAvatar(userData.profilePicture || avatarImage);
                    setSelectedProvince(userData.provinceCode);
                    setSelectedDistrict(userData.districtCode);
                    setSelectedCommune(userData.communeCode);
                } else {
                    console.error('Failed to retrieve personal info:', response.Message);
                }
            } catch (error) {
                console.error('Error fetching personal info:', error);
            }
        };

        fetchPersonalInfo();
    }, []);

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
    // console.log(communes);

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
        // console.log(user.lastName, user.firstName, user.username);
        if (lastName.length < 2) {
            toast.error('Last name must be at least 2 characters long.');
            return false;
        }
        if (firstName.length < 2) {
            toast.error('First name must be at least 2 characters long.');
            return false;
        }
        if (gender === '') {
            toast.error('Gender is required.');
            return false;
        }
        if (!ValidatePhoneNumber(phoneNumber)) return false;
        if (dateOfBirth === '') {
            toast.error('Date of birth is required.');
            return false;
        }

        return true;
    };


    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validation Form
        const user = {
            // username: username,
            lastName: lastName,
            firstName: firstName,
            phoneNumber: phoneNumber,
            gender: gender,
            // email: email,
            dateOfBirth: dateOfBirth,
            provinceCode: selectedProvince,
            districtCode: selectedDistrict,
            communeCode: selectedCommune,
            fullAddress: fullAddress,
        };

        if (!validateForm(user)) return;

        try {
            console.log(user);

            const response = await UpdatePersonalInfoService(user);
            console.log(response);

            if (response.success === true) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to update personal information.');
        };

    };


    // Function to handle avatar selection and upload
    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            try {
                // console.log(file);

                const uploadedImageUrl = await UploadSingleFileToCloud(file); // Upload image to backend
                // console.log(uploadedImageUrl);

                setAvatar(uploadedImageUrl); // Update local avatar state
                setAvatarUrl(uploadedImageUrl); // Update avatar with the uploaded image URL
                toast.success('Avatar uploaded successfully.');
            } catch (error) {
                console.error('Error uploading avatar:', error);
                alert('Failed to upload avatar. Please try again.');
            }
        }
    };

    return (
        <div>
            <div className="card">
                <div className="card-body mx-4">
                    <div className="d-flex align-items-start align-items-sm-center gap-6 pb-2 border-bottom ">
                        <img src={avatar} alt="user-avatar" className="d-block w-px-100 h-px-100 rounded border-3 border-secondary" id="uploadedAvatar" />
                        <div className="button-wrapper">
                            <label htmlFor="upload" className="btn btn-primary me-3 mb-4" tabIndex={0}>
                                <span className="d-none d-sm-block">Upload new photo</span>
                                <i className="bx bx-upload d-block d-sm-none"></i>
                                <input type="file" id="upload" className="account-file-input" hidden accept="image/png, image/jpeg" onChange={handleAvatarChange} />
                            </label>
                            <button type="button" className="btn btn-outline-secondary account-image-reset mb-4" onClick={() => setAvatar(avatarImage)}>
                                <i className="bx bx-reset d-block d-sm-none"></i>
                                <span className="d-none d-sm-block">Reset</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body py-0 mx-3">
                    <form id="formAccountSettings" className='mb-4' method="POST" onSubmit={handleSaveChanges}>
                        <div className="row g-6">
                            <InputField label="User ID" id="userId" name="userId" value={userId} disabled />
                            <InputField label="Email" id="email" name='email' value={email} disabled />
                            <InputField label="Username" id="username" name='username' value={username} disabled />
                            <InputField label="Role" id="role" name='role' value={'User'} disabled />
                            <InputField label="First Name" id="firstName" name='firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            <InputField label="Last Name" id="lastName" name='lastName' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            <InputField label="Phone Number" name='phoneNumber' id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                            <SelectField
                                label="Gender"
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                options={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' }
                                ]}
                            />
                            <InputField label="Date of Birth" name='dateOfBirth' id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                            <SelectField
                                label="Province"
                                id="province"
                                value={selectedProvince}
                                onChange={handleProvinceChange}
                                options={provinces.map(province => ({ value: province.code, label: province.name }))}
                            />
                            <SelectField
                                label="District"
                                id="district"
                                value={selectedDistrict}
                                onChange={handleDistrictChange}
                                options={districts.map(district => ({ value: district.code, label: district.name_with_type }))}
                            />
                            <SelectField
                                label="Commune"
                                id="commune"
                                value={selectedCommune}
                                onChange={(e) => setSelectedCommune(e.target.value)}
                                options={communes.map(commune => ({ value: commune.code, label: commune.name_with_type }))}
                            />
                            <InputField label="Full Address" name='fullAddress' id="fullAddress" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} />
                        </div>
                        <div className="mt-6">
                            <button type="submit" className="btn btn-primary me-3">Save changes</button>
                            <button type="reset" className="btn btn-outline-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
                <DeleteAccountComponent />
            </div>
        </div>
    );
};

export default MyProfile;

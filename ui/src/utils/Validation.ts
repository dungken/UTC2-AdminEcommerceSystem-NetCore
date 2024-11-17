import axios from 'axios';
import { toast } from 'react-toastify';

export const ValidateRequiredFields = (
    object: { [key: string]: any },
    requiredFields: { field: string; message: string; isFile?: boolean }[]
) => {
    for (const { field, message, isFile } of requiredFields) {
        const value = object[field];

        // Check for file validation
        if (isFile) {
            if (!value || !(value instanceof File) || value.size === 0) {
                toast.error(message);
                return false;
            }
        } else {
            // Check for other required fields
            if (!value) {
                toast.error(message);
                return false;
            }
        }
    }
    return true;
};

export const ValidateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        toast.error('Please enter a valid email address.');
        return false;
    }
    return true;
};

export const ValidateUsername = (username: string) => {
    // console.log(username);

    if (username.length < 6 || username.length > 20) {
        toast.error('Username must be between 6 and 20 characters.');
        return false;
    }
    return true;
};

export const ValidatePassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return false;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordPattern.test(password)) {
        toast.error('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return false;
    }
    return true;
};

export const ValidatePhoneNumber = (phone: string) => {
    const phonePattern = /^(0[3|5|7|8|9][0-9]{8})$/;
    if (!phonePattern.test(phone)) {
        toast.error('Please enter a valid Vietnamese phone number (10 digits starting with 03, 05, 07, 08, 09).');
        return false;
    }
    return true;
};

export const ValidateFile = (file: File | undefined, allowedTypes: string[], fileTypeMessage: string, maxSize: number, maxSizeMessage: string) => {
    if (!file) {
        toast.error('No file selected.');
        return false;
    }

    if (!allowedTypes.includes(file.type)) {
        toast.error(fileTypeMessage);
        return false;
    }

    if (file.size > maxSize) {
        toast.error(`File size must be less than ${maxSizeMessage}.`);
        return false;
    }

    return true;
};

export const CheckUsernameEmailUniqueness = async (username: string, email: string) => {
    const response = await axios.get(`/User/CheckUsernameEmail?username=${username}&email=${email}`);
    console.log(response.data);

    if (response.data.usernameExists) {
        toast.error('Username is already taken.');
        return false;
    }
    if (response.data.emailExists) {
        toast.error('Email is already taken.');
        return false;
    }
    return true;
}
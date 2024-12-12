import axios from 'axios';
import { toast } from 'react-toastify';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    }
}


export const CreateUserService = async (user: any) => {
    try {
        const response = await axios.post('/User/Create', user, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;

    }
};



export const GetPersonalInfoService = async () => {
    try {
        const response = await axios.get('/User/GetPersonalInfo', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}


export const UpdatePersonalInfoService = async (user: any) => {
    try {
        const response = await axios.post('/User/UpdatePersonalInfo', user, { headers: getAuthHeader() });
        // console.log("Update personal info response:", response);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
}


export const DeleteAccountService = async (username?: string) => {
    // Add `username` as a query parameter if it's provided
    const url = username ? `/User/DeleteAccount?username=${encodeURIComponent(username)}` : '/User/DeleteAccount';
    try {
        const response = await axios.post(url, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
}

export const DeleteUsersService = async (userIds: string[]) => {
    try {
        const response = await axios.post('/User/BulkSoftDelete', userIds, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
}

export const RestoreUsersService = async (userIds: string[]) => {
    try {
        const response = await axios.post('/User/BulkRestore', userIds, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
}

export const GetAllUserService = async (page: number, pageSize: number) => {
    try {
        const response = await axios.get(`/User/GetAll?page=${page}&pageSize=${pageSize}`);
        // console.log("Get all user response:", response.data);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
};

export const GetUserByIdService = async (id: string) => {
    try {
        const response = await axios.get(`/User/Get/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
};

export const UpdateUserService = async (user: any) => {
    console.log("User in User Service:", user);

    try {
        const response = await axios.post('/User/Update', user, { headers: getAuthHeader() });
        if (response.data) {
            toast.success('User updated successfully.');
        }
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.data) {
            toast.error(error.response.data.message || 'Failed to update user.');
        } else {
            toast.error('An error occurred while updating user.');
        }
        throw error;
    }
};



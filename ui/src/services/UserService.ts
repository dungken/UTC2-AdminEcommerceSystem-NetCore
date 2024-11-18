import axios from 'axios';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    }
}


export const CreateUserService = async (user: any) => {
    const response = await axios.post('/User/Create', user, { headers: getAuthHeader() });
    return response.data;
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

export const UpdateUserService = async (user: any) => {
    const response = await axios.put('/User/Update', user, { headers: getAuthHeader() });
    return response.data;
};


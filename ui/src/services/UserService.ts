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
    const response = await axios.get('/User/GetPersonalInfo', { headers: getAuthHeader() });
    // console.log(response.data);

    return response.data;
}


export const UpdatePersonalInfoService = async (user: any) => {
    const response = await axios.put('/User/UpdatePersonalInfo', user, { headers: getAuthHeader() });
    console.log(response);

    return response;
}
export const DeleteAccountService = async (username?: string) => {
    // console.log("Deleting account for:", username);

    // Add `username` as a query parameter if it's provided
    const url = username ? `/User/DeleteAccount?username=${encodeURIComponent(username)}` : '/User/DeleteAccount';

    const response = await axios.post(url, {}, { headers: getAuthHeader() });
    // console.log("Delete account response:", response);

    return response.data;
}

export const GetAllUserService = async (page: number, pageSize: number) => {
    try {
        const response = await axios.get(`/User/GetAllUser?page=${page}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
};

export const UpdateUserService = async (user: any) => {
    const response = await axios.put('/User/Update', user, { headers: getAuthHeader() });
    return response.data;
};


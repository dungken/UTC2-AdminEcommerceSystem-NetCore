import axios from 'axios';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    }
}

export const GetAllRolesService = async () => {
    try {
        const response = await axios.get('/Role/GetAll', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}
export const GetAllPermissionsService = async () => {
    try {
        const response = await axios.get('/Permission/GetAll', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}
export const CreateOrUpdateRoleService = async (role: any) => {
    try {
        const response = await axios.post('/Role/CreateOrUpdate', role, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}
export const DeleteRoleService = async (roleId: any) => {
    try {
        const response = await axios.delete(`/Role/Delete/${roleId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export const CreateOrUpdatePermissionService = async (permission: any) => {
    try {
        const response = await axios.post('/Permission/CreateOrUpdate', permission, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export const DeletePermissionService = async (permissionId: any) => {
    try {
        const response = await axios.delete(`/Permission/Delete/${permissionId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}
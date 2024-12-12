import axios from 'axios';
export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    }
}

export const GetOrdersService = async () => {
    try {
        const response = await axios.get("/Order", { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}


export const DeleteOrderByIdService = async (orderId: string) => {
    try {
        const response = await axios.delete(`/Order/${orderId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}
export const GetOrderByIdService = async (orderId: string) => {
    try {
        const response = await axios.get(`/Order/${orderId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}
export const UpdateOrderStatusService = async (orderId: string, status: string) => {
    try {
        const response = await axios.patch(`/Order/${orderId}/status`, { status }, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}



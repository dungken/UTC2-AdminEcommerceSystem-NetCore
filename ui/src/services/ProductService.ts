import axios from 'axios';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    }
}

export const CreateCategoryService = async (category: any) => {
    try {
        const response = await axios.post("/Categories", category, { headers: getAuthHeader() });
        console.log(response.data);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export const CreateProductService = async (product: any) => {
    try {
        const response = await axios.post("/Products", product, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export const UpdateCategoryService = async (category: any) => {
    try {
        const response = await axios.put(`/Categories/${category.id}`, category, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export const GetCategoryByIdService = async (categoryId: any) => {
    try {
        const response = await axios.get(`/Categories/${categoryId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export const GetAllCategoriesService = async () => {
    try {
        const response = await axios.get('/Categories', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export const GetSubCategoriesService = async (parentCategoryId: string) => {
    try {
        const response = await axios.get(`/Categories/subcategories/${parentCategoryId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export const DeleteCategoryService = async (id: string) => {
    try {
        const response = await axios.delete(`/Categories/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

import axios from 'axios';
import { Product } from '../components/Product/types';
import { get } from 'http';

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

export const AddProductService = async (product: any) => {
    try {
        const response = await axios.post('/Products/Create', product);
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        if (error instanceof Error) {
            return { success: false, message: error.message };
        }
        return { success: false, message: 'An unknown error occurred' };
    }
};

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
export const GetAllProductsService = async () => {
    try {
        const response = await axios.get(`/Products`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}


export const GetProductsByCategory = async (categoryId: any) => {
    try {
        const response = await axios.get(`/Products/Category/${categoryId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}


export const GetProductById = async (id: any) => {
    try {
        const response = await axios.get(`/Products/${id}`, { headers: getAuthHeader() });
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



export const UploadMultipleFileService = async (
    files: File[],
    productId: string,
    altText: string
) => {
    try {
        const formData = new FormData();

        // Append files to FormData
        files.forEach((file) => {
            formData.append("files", file);
        });

        // Append additional parameters
        formData.append("productId", productId);
        formData.append("altText", altText);

        const token = localStorage.getItem('token');
        // API call to the backend
        const response = await axios.post("Images/UploadMultiple",
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        // Return response data
        return response.data;
    } catch (error: any) {
        console.error("Error uploading files:", error);
        throw new Error(error.response?.data?.Message || "Failed to upload files.");
    }
};


export const UpdateProductService = async (id: any, productData: any) => {
    try {
        const response = await axios.put(`/Products/${id}`, productData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export const DeleteProductService = async (id: any) => {
    try {
        const response = await axios.delete(`/Products/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
}

import { get } from 'http';
import axios from './AxiosConfig';
import { log } from 'console';

interface UserData {
    username: string;
    email: string;
    password: string;
    lastname: string;
    firstname: string;
    isSocialLogin?: boolean;
}

interface Credentials {
    emailOrUsername: string;
    password: string;
}

// Function to get the authorization header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};


// Generic function to handle API requests
const apiRequest = async (method: 'post' | 'get', url: string, data: any = null, headers = {}) => {
    try {
        const response = await axios[method](url, data, { headers });
        if (response.data && response.data.status === "success") {
            return response.data.message;
        }
        throw new Error(response.data.message || "An unexpected error occurred.");
    } catch (error: any) {
        // Enhanced error handling to show the backend error message
        const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
        throw new Error(errorMessage);
    }
};

// Account Services
export const RegisterService = async (userData: UserData) => {
    return (await axios.post('/Account/Register', userData)).data;
};

export const SocialLoginService = async (accessToken: string, provider: string) => {
    return apiRequest('post', '/Account/SocialLogin', { accessToken, provider });
};

export const ConfirmEmailService = async (token: string, email: string) => {
    try {
        const response = await axios.post('/Account/ConfirmEmail', { token, email });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const LoginService = async (credentials: Credentials) => {
    return (await axios.post('/Account/Login', credentials)).data;
};

export const LogoutService = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
};

// Password Services
export const ForgotPasswordService = async (email: string) => {
    try {
        const response = await axios.post('/Account/ForgotPassword', { email });
        console.log(response.data);  // Kiểm tra dữ liệu trả về
        return response.data;  // Trả về response thành công
    } catch (error) {
        console.log(error);  // Kiểm tra lỗi
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;  // Trả về response lỗi
        }
        throw error;
    }
};

export const ResetPasswordService = async (token: string, email: string, newPassword: string) => {
    try {
        const response = await axios.post('/Account/ResetPassword', { token, email, newPassword });
        console.log(response.data);  // Kiểm tra dữ liệu trả về
        return response.data;  // Trả về response thành công
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
};

export const ChangePasswordService = async (currentPassword: string, newPassword: string) => {
    try {
        const response = await axios.post('/Account/ChangePassword', { currentPassword, newPassword }, getAuthHeader());
        console.log(response);

        console.log(response.data);  // Kiểm tra dữ liệu trả về

        return response.data;  // Trả về response thành công
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
};

export const EnabledTwoFactorVerificationService = async () => {
    try {
        const response = await axios.get('/Account/Enable2FA', getAuthHeader());
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
};

export const VerifyCodeService = async (verifyCode: string) => {
    try {
        const response = await axios.post('/Account/Verify2FA', { verifyCode }, getAuthHeader());
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }

    }
};

export const DisableTwoFactorVerificationService = async () => {
    try {
        const response = await axios.get('/Account/Disable2FA', getAuthHeader());
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
}

export const GetTwoFAStatusService = async () => {
    try {
        const response = await axios.get('/Account/TwoFAStatus', getAuthHeader());
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
    }
}
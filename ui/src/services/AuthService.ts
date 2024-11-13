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
    return apiRequest('post', '/Account/ConfirmEmail', { token, email });
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
        return response;  // Trả về response thành công
    } catch (error) {
        console.log(error);  // Kiểm tra lỗi

        // // Xử lý lỗi nếu có
        // if (error.response) {
        //     // Nếu có lỗi phản hồi từ server (ví dụ: lỗi 404, 500)
        //     console.error('Error response:', error.response);
        //     alert('An error occurred: ' + error.response.data.message);
        // } else if (error.request) {
        //     // Nếu không nhận được phản hồi từ server
        //     console.error('Error request:', error.request);
        //     alert('Network error. Please try again later.');
        // } else {
        //     // Lỗi khác (có thể là lỗi trong quá trình setup yêu cầu)
        //     console.error('Error:', error.message);
        //     alert('An unexpected error occurred. Please try again later.');
        // }
    }
};

export const ResetPasswordService = async (token: string, email: string, newPassword: string) => {
    return apiRequest('post', '/Account/ResetPassword', { token, email, newPassword });
};

export const ChangePasswordService = async (currentPassword: string, newPassword: string) => {
    return await axios.post('/Account/ChangePassword', { currentPassword, newPassword }, getAuthHeader());
};

export const EnabledTwoFactorVerificationService = async () => {
    return await axios.get('/Account/Enable2FA', getAuthHeader());
};

export const VerifyCodeService = async (verifyCode: string) => {
    return await axios.post('/Account/Verify2FA', { verifyCode }, getAuthHeader());
};

export const DisableTwoFactorVerificationService = async () => {
    return await axios.get('/Account/Disable2FA', getAuthHeader());
}
export const GetTwoFAStatusService = async () => {
    return await axios.get('/Account/TwoFAStatus', getAuthHeader());
}
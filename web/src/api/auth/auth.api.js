import axios from "axios";

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {
            withCredentials: true,
        }
    );

    return response.data;
};

export const register = async (name, phone, email, password) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, { name, phone, email, password }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const googleLogin = async ({ idToken, accessToken }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`, { 
            id_token: idToken,
            access_token: accessToken 
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyOtp = async (email, otp, loaiOtp = "REGISTER") => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`, {
            email,
            otp,
            loai_otp: loaiOtp
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resendOtp = async (email, loaiOtp = "REGISTER") => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-otp`, {
            email,
            loai_otp: loaiOtp
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, {
            email
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (email, otp, newPassword) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
            email,
            otp,
            new_password: newPassword
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


import axios from "axios";

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
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
        console.error("Register error:", error);
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
        console.error("Google login error:", error);
        throw error;
    }
};
import axios from "axios";
import { store } from "../../app/store";
import { setCredentials } from "../../features/auth/authSlice";

export const axiosJWT = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

// Request interceptor
axiosJWT.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response interceptor
axiosJWT.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const res = await refreshToken();

            const newAccessToken = res.data.accessToken;

            store.dispatch(setCredentials({ accessToken: newAccessToken }));

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axiosJWT(originalRequest);
        }

        return Promise.reject(error);
    }
);


export const refreshToken = async () => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`,
            {},
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi cấp token mới:", error);
        throw error;
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axiosJWT.get('/api/auth/me');
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
        throw error;
    }
}
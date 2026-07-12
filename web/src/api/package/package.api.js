import axios from "axios";
import { axiosJWT } from "../shared/aixos.api";

// API public - lấy danh sách tất cả gói cước
export const getAllPackages = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/package`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách gói cước:", error);
        throw error;
    }
};

// API public - lấy thông tin chi tiết một gói cước
export const getPackageDetails = async (idGoi) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/package/${idGoi}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy thông tin chi tiết gói cước:", error);
        throw error;
    }
};

// API admin - tạo mới gói cước
export const createPackage = async (packageData) => {
    try {
        const response = await axiosJWT.post(`/api/package`, packageData);
        return response.data;
    } catch (error) {
        console.error("Lỗi tạo gói cước mới:", error);
        throw error;
    }
};

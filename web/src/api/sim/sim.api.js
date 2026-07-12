import axios from "axios";
import { axiosJWT } from "../shared/aixos.api";

// API public - lấy thông tin chi tiết một SIM
export const getSimDetails = async (idSim) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sim/${idSim}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy thông tin SIM:", error);
        throw error;
    }
};

// API public - lấy danh sách SIM thuộc một chi nhánh
export const getSimsByBranch = async (idChiNhanh) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sim/branch/${idChiNhanh}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách SIM theo chi nhánh:", error);
        throw error;
    }
};

// API admin - tạo SIM mới
export const createSim = async (simData) => {
    try {
        const response = await axiosJWT.post(`/api/sim`, simData);
        return response.data;
    } catch (error) {
        console.error("Lỗi tạo SIM mới:", error);
        throw error;
    }
};

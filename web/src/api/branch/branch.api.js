import axios from "axios";
import { axiosJWT } from "../shared/aixos.api";

// API public - lấy danh sách tất cả các chi nhánh
export const getAllBranches = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/branch`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách chi nhánh:", error);
        throw error;
    }
};

// API public - lấy thông tin chi tiết một chi nhánh
export const getBranchDetails = async (idChiNhanh) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/branch/${idChiNhanh}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy thông tin chi nhánh:", error);
        throw error;
    }
};

// API admin - tạo mới chi nhánh
export const createBranch = async (branchData) => {
    try {
        const response = await axiosJWT.post(`/api/branch`, branchData);
        return response.data;
    } catch (error) {
        console.error("Lỗi tạo chi nhánh:", error);
        throw error;
    }
};

// API admin - cập nhật chi nhánh
export const updateBranch = async (idChiNhanh, branchData) => {
    try {
        const response = await axiosJWT.patch(`/api/branch/${idChiNhanh}`, branchData);
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật chi nhánh:", error);
        throw error;
    }
};


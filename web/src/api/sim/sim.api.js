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

// API admin - lấy toàn bộ SIM trong hệ thống
export const getAllSims = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sim`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách tất cả SIM:", error);
        throw error;
    }
};

// API admin - cập nhật thông tin SIM
export const updateSim = async (idSim, simData) => {
    try {
        const response = await axiosJWT.patch(`/api/sim/${idSim}`, simData);
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật SIM:", error);
        throw error;
    }
};

// API public - lấy danh sách tất cả loại SIM
export const getSimTypes = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sim/types`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách loại SIM:", error);
        throw error;
    }
};

// API admin - tạo mới loại SIM
export const createSimType = async (typeData) => {
    try {
        const response = await axiosJWT.post(`/api/sim/types`, typeData);
        return response.data;
    } catch (error) {
        console.error("Lỗi tạo loại SIM:", error);
        throw error;
    }
};

// API admin - cập nhật loại SIM
export const updateSimType = async (idLoaiSim, typeData) => {
    try {
        const response = await axiosJWT.patch(`/api/sim/types/${idLoaiSim}`, typeData);
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật loại SIM:", error);
        throw error;
    }
};



import { axiosJWT } from "../shared/aixos.api";

// API admin - tạo mới tài khoản nhân viên
export const createEmployee = async (employeeData) => {
    try {
        const response = await axiosJWT.post(`/api/user/employee`, employeeData);
        return response.data;
    } catch (error) {
        console.error("Lỗi tạo nhân viên:", error);
        throw error;
    }
};

// API admin - lấy danh sách tất cả nhân viên
export const getAllEmployees = async () => {
    try {
        const response = await axiosJWT.get(`/api/user/employee`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách nhân viên:", error);
        throw error;
    }
};

// API admin - lấy thông tin chi tiết một nhân viên
export const getEmployeeDetails = async (idKhachHang) => {
    try {
        const response = await axiosJWT.get(`/api/user/employee/${idKhachHang}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy chi tiết nhân viên:", error);
        throw error;
    }
};

// API admin - duyệt trạng thái hoạt động của nhân viên
export const approveEmployee = async (idKhachHang, trangThai) => {
    try {
        const response = await axiosJWT.patch(`/api/user/employee/${idKhachHang}/approve`, {
            trang_thai: trangThai
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi duyệt nhân viên:", error);
        throw error;
    }
};

// API staff - lấy danh sách tất cả khách hàng
export const getAllCustomers = async () => {
    try {
        const response = await axiosJWT.get(`/api/user/customer`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách khách hàng:", error);
        throw error;
    }
};

// API staff - lấy thông tin chi tiết của một khách hàng
export const getCustomerDetails = async (idKhachHang) => {
    try {
        const response = await axiosJWT.get(`/api/user/customer/${idKhachHang}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy chi tiết khách hàng:", error);
        throw error;
    }
};

// API admin - lấy toàn bộ tài khoản trong hệ thống
export const getAllAccounts = async () => {
    try {
        const response = await axiosJWT.get(`/api/user/account`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách tài khoản:", error);
        throw error;
    }
};

// API admin - cập nhật vai trò (role) của tài khoản
export const updateAccountRole = async (idKhachHang, vaiTro, idChiNhanh = null) => {
    try {
        const payload = { vai_tro: vaiTro };
        if (idChiNhanh) {
            payload.id_chi_nhanh = idChiNhanh;
        }
        const response = await axiosJWT.patch(`/api/user/account/${idKhachHang}/role`, payload);
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật vai trò tài khoản:", error);
        throw error;
    }
};

// API user - cập nhật thông tin cá nhân (họ tên, SĐT, CCCD, địa chỉ)
export const updateProfile = async (profileData) => {
    try {
        const response = await axiosJWT.patch(`/api/user/profile`, profileData);
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật hồ sơ:", error);
        throw error;
    }
};

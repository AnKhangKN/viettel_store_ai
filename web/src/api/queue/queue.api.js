import axios from "axios";
import { axiosJWT } from "../shared/aixos.api";

// API public - lấy danh sách tất cả các loại giao dịch đang hoạt động
export const getQueueServices = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/queue/services`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách dịch vụ quầy:", error);
        throw error;
    }
};

// API public - đăng ký phiếu xếp hàng lấy số
export const createQueueTicket = async (ticketData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/queue/ticket`, ticketData);
        return response.data;
    } catch (error) {
        console.error("Lỗi đăng ký phiếu xếp hàng:", error);
        throw error;
    }
};

// API staff - lấy danh sách hàng chờ hôm nay của chi nhánh nhân viên làm việc
export const getStaffQueueTickets = async () => {
    try {
        const response = await axiosJWT.get(`/api/queue/staff/tickets`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách hàng chờ của nhân viên:", error);
        throw error;
    }
};

// API staff - cập nhật trạng thái của phiếu (ChoXuLy -> DangPhucVu -> HoanThanh/DaHuy)
export const updateQueueTicketStatus = async (idPhieu, trangThai) => {
    try {
        const response = await axiosJWT.patch(`/api/queue/tickets/${idPhieu}/status`, { trang_thai: trangThai });
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái phiếu:", error);
        throw error;
    }
};

// API admin - tạo mới loại dịch vụ giao dịch tại quầy
export const adminCreateService = async (serviceData) => {
    try {
        const response = await axiosJWT.post(`/api/queue/services`, serviceData);
        return response.data;
    } catch (error) {
        console.error("Lỗi tạo loại dịch vụ quầy:", error);
        throw error;
    }
};

// API admin - cập nhật loại dịch vụ giao dịch tại quầy
export const adminUpdateService = async (idLoaiGiaoDich, serviceData) => {
    try {
        const response = await axiosJWT.patch(`/api/queue/services/${idLoaiGiaoDich}`, serviceData);
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật dịch vụ quầy:", error);
        throw error;
    }
};

// API admin - xóa (xóa mềm) loại dịch vụ giao dịch tại quầy
export const adminDeleteService = async (idLoaiGiaoDich) => {
    try {
        const response = await axiosJWT.delete(`/api/queue/services/${idLoaiGiaoDich}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi xóa dịch vụ quầy:", error);
        throw error;
    }
};

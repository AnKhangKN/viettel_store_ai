import axios from "axios";
import { axiosJWT } from "../shared/aixos.api";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Tạo đơn hàng mua SIM
export const createSimOrder = async ({ id_sim, id_chi_nhanh, id_khach_hang, ho_ten, so_dien_thoai, cccd, email, dia_chi, phuong_thuc }) => {
  try {
    const response = await axios.post(`${API_URL}/api/payment/sim-order`, {
      id_sim,
      id_chi_nhanh,
      id_khach_hang: id_khach_hang || undefined,
      ho_ten: ho_ten || undefined,
      so_dien_thoai: so_dien_thoai || undefined,
      cccd: cccd || undefined,
      email: email || undefined,
      dia_chi: dia_chi || undefined,
      phuong_thuc: phuong_thuc || "VNPay",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khởi tạo đơn hàng SIM:", error);
    throw error;
  }
};

// Khởi tạo liên kết thanh toán VNPay
export const createVNPaySimPayment = async ({ id_don_hang, bank_code }) => {
  try {
    const response = await axios.post(`${API_URL}/api/payment/vnpay/create-sim-payment`, {
      id_don_hang,
      bank_code: bank_code || undefined,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo link thanh toán VNPay:", error);
    throw error;
  }
};

// Xác thực kết quả VNPay Return
export const verifyVNPayReturn = async (queryParams) => {
  try {
    const response = await axios.get(`${API_URL}/api/payment/vnpay/return`, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi xác thực VNPay Return:", error);
    throw error;
  }
};

// Xác nhận khách hàng đã nhận SIM tại chi nhánh
export const confirmSimReceived = async (idThanhToan) => {
  try {
    const response = await axios.post(`${API_URL}/api/payment/confirm-received/${idThanhToan}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi xác nhận nhận SIM tại quầy:", error);
    throw error;
  }
};

// API Staff - Lấy danh sách đơn hàng SIM thuộc chi nhánh nhân viên phụ trách
export const getStaffSimOrders = async () => {
  try {
    const response = await axiosJWT.get("/api/payment/staff/orders");
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn SIM chi nhánh cho staff:", error);
    throw error;
  }
};

// API Staff - Xác nhận nhân viên đã bàn giao SIM trực tiếp cho khách tại quầy
export const confirmStaffSimReceived = async (idDonHang) => {
  try {
    const response = await axiosJWT.patch(`/api/payment/staff/orders/${idDonHang}/confirm-received`);
    return response.data;
  } catch (error) {
    console.error("Lỗi xác nhận bàn giao SIM cho khách:", error);
    throw error;
  }
};

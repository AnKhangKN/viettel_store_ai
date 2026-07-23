import { axiosJWT } from "../shared/aixos.api";

/**
 * Lấy trạng thái khóa & chọn quầy thực tế của tất cả nhân viên tại chi nhánh
 */
export const getBoothsStatus = async () => {
  const response = await axiosJWT.get("/api/queue/staff/booths");
  return response.data;
};

/**
 * Đăng ký chọn quầy làm việc (khóa quầy cho bản thân)
 * @param {string} tenQuay - Tên quầy (ví dụ: 'Quầy 1')
 */
export const selectBooth = async (tenQuay) => {
  const response = await axiosJWT.post("/api/queue/staff/booths/select", {
    ten_quay: tenQuay,
  });
  return response.data;
};

/**
 * Giải phóng quầy khi đăng xuất hoặc đổi quầy
 * @param {string} [tenQuay] - Tên quầy (tùy chọn)
 */
export const releaseBooth = async (tenQuay = null) => {
  const response = await axiosJWT.post("/api/queue/staff/booths/release", {
    ten_quay: tenQuay,
  });
  return response.data;
};

/* =====================================================
   ADMIN API: QUẢN LÝ QUẦY GIAO DỊCH (CRUD QUẦY)
   ===================================================== */

/**
 * Lấy danh sách tất cả quầy giao dịch của tất cả chi nhánh (Admin)
 */
export const getAllBoothsAdmin = async () => {
  const response = await axiosJWT.get("/api/queue/admin/booths");
  return response.data;
};

/**
 * Tạo mới quầy giao dịch cho chi nhánh (Admin)
 */
export const createBoothAdmin = async (data) => {
  const response = await axiosJWT.post("/api/queue/admin/booths", data);
  return response.data;
};

/**
 * Cập nhật thông tin quầy giao dịch (Admin)
 */
export const updateBoothAdmin = async (idQuay, data) => {
  const response = await axiosJWT.put(`/api/queue/admin/booths/${idQuay}`, data);
  return response.data;
};

/**
 * Xóa quầy giao dịch (Admin)
 */
export const deleteBoothAdmin = async (idQuay) => {
  const response = await axiosJWT.delete(`/api/queue/admin/booths/${idQuay}`);
  return response.data;
};

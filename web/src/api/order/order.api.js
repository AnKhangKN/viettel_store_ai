import { axiosJWT } from "../shared/aixos.api";

// Lấy danh sách các đơn hàng SIM của khách hàng đang đăng nhập
export const getMyOrders = async () => {
    try {
        const response = await axiosJWT.get("/api/v1/orders/my-orders");
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng của khách hàng:", error);
        throw error;
    }
};

// Lấy thông tin chi tiết một đơn hàng cụ thể
export const getOrderDetail = async (orderId) => {
    try {
        const response = await axiosJWT.get(`/api/v1/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy chi tiết đơn hàng:", error);
        throw error;
    }
};

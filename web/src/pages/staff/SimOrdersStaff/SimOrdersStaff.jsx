import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  User,
  Phone,
  FileText,
  Building2,
  RefreshCw,
  Loader2,
  DollarSign,
  ShoppingBag,
  Check,
  Globe,
  Store
} from "lucide-react";
import { getStaffSimOrders, confirmStaffSimReceived } from "../../../api/payment/payment.api";

export default function SimOrdersStaff() {
  const [orders, setOrders] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id_don_hang being updated
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'vnpay', 'cod', 'received', 'pending'

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await getStaffSimOrders();
      if (res?.success && res?.data) {
        setOrders(res.data.orders || []);
        if (res.data.orders?.length > 0) {
          setBranchName(res.data.orders[0].chi_nhanh?.ten_chi_nhanh || "");
        }
      }
    } catch (err) {
      console.error("Lỗi tải danh sách đơn SIM:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmReceived = async (idDonHang) => {
    if (!window.confirm("Xác nhận khách hàng đã xuất trình hóa đơn và nhận SIM tại quầy?")) {
      return;
    }

    try {
      setActionLoading(idDonHang);
      const res = await confirmStaffSimReceived(idDonHang);
      if (res?.success) {
        // Cập nhật lại UI cục bộ
        setOrders((prev) =>
          prev.map((o) =>
            o.id_don_hang === idDonHang
              ? {
                  ...o,
                  trang_thai_don_hang: "DaThanhToan",
                  thanh_toan: {
                    ...o.thanh_toan,
                    da_nhan: true,
                    trang_thai_thanh_toan: "ThanhCong",
                    thoi_gian_nhan: new Date().toISOString(),
                  },
                }
              : o
          )
        );
      }
    } catch (err) {
      console.error("Lỗi xác nhận bàn giao SIM:", err);
      alert(err.response?.data?.message || "Không thể xác nhận bàn giao SIM. Vui lòng thử lại.");
    } finally {
      setActionLoading(null);
    }
  };

  // Lọc danh sách đơn hàng
  const filteredOrders = orders.filter((o) => {
    const isOnline = o.thanh_toan?.phuong_thuc === "VNPay";
    const isReceived = o.thanh_toan?.da_nhan === true;

    if (filterType === "vnpay" && !isOnline) return false;
    if (filterType === "cod" && isOnline) return false;
    if (filterType === "received" && !isReceived) return false;
    if (filterType === "pending" && isReceived) return false;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      const matchSim = o.sim?.so_sim?.toLowerCase().includes(term);
      const matchName = o.khach_hang?.ho_ten?.toLowerCase().includes(term);
      const matchPhone = o.khach_hang?.so_dien_thoai?.toLowerCase().includes(term);
      const matchOrder = o.id_don_hang?.toLowerCase().includes(term);
      return matchSim || matchName || matchPhone || matchOrder;
    }

    return true;
  });

  // Thống kê nhanh
  const totalOrders = orders.length;
  const vnpayCount = orders.filter((o) => o.thanh_toan?.phuong_thuc === "VNPay").length;
  const receivedCount = orders.filter((o) => o.thanh_toan?.da_nhan === true).length;
  const pendingPickupCount = totalOrders - receivedCount;

  return (
    <div className="space-y-6">
      {/* Top Header & Refresh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-[#EE0033]" />
            Quản Lý Đơn Mua SIM
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            Chi nhánh: <span className="font-bold text-gray-800">{branchName || "Hiện tại"}</span>
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold px-4 py-2.5 rounded-xl border border-gray-200 transition cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* Cards thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng Đơn Mua SIM</p>
            <p className="text-2xl font-black text-gray-900">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Thanh Toán VNPay Online</p>
            <p className="text-2xl font-black text-blue-600">{vnpayCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Đã Bàn Giao SIM</p>
            <p className="text-2xl font-black text-green-600">{receivedCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Chờ Khách Nhận SIM</p>
            <p className="text-2xl font-black text-amber-600">{pendingPickupCount}</p>
          </div>
        </div>
      </div>

      {/* Thanh tìm kiếm & Bộ lọc */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo số SIM, tên khách, SĐT..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] text-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {[
              { id: "all", label: "Tất cả đơn", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
              { id: "vnpay", label: "Thanh toán VNPay Online", icon: <CreditCard className="w-3.5 h-3.5" /> },
              { id: "cod", label: "Thanh toán Tại Quầy", icon: <Store className="w-3.5 h-3.5" /> },
              { id: "pending", label: "Chờ nhận SIM", icon: <Clock className="w-3.5 h-3.5" /> },
              { id: "received", label: "Đã nhận SIM", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  filterType === tab.id
                    ? "bg-[#EE0033] text-white shadow-md shadow-red-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách Đơn Hàng SIM */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Đang tải danh sách đơn hàng SIM...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">Không tìm thấy đơn hàng SIM nào</h3>
          <p className="text-gray-500 text-xs">Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((item) => {
            const isOnline = item.thanh_toan?.phuong_thuc === "VNPay";
            const isPaid = item.thanh_toan?.trang_thai_thanh_toan === "ThanhCong" || item.trang_thai_don_hang === "DaThanhToan";
            const isReceived = item.thanh_toan?.da_nhan === true;

            return (
              <div
                key={item.id_don_hang}
                className={`bg-white rounded-3xl p-6 border transition-all shadow-sm hover:shadow-md ${
                  isReceived
                    ? "border-gray-200 opacity-90"
                    : isPaid
                    ? "border-green-200 bg-green-50/10"
                    : "border-amber-200 bg-amber-50/10"
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Cột 1: Thông tin SIM & Hàng hóa trong đơn */}
                  <div className="space-y-3 min-w-[280px]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-50 text-[#EE0033] border border-red-200 text-[11px] font-bold px-2 py-0.5 rounded-md uppercase">
                          {item.loai_don_hang || "Đơn Mua SIM Số Đẹp"}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-0.5 rounded-md">
                          {item.sim?.ten_loai_sim}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-[#EE0033] tracking-wider">
                        {item.sim?.so_sim}
                      </h3>
                    </div>

                    {/* Chi tiết mặt hàng trong đơn */}
                    <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 space-y-2 text-xs">
                      <p className="font-bold text-gray-700 text-[11px] uppercase tracking-wider">Hàng hóa trong đơn:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li className="flex justify-between items-center gap-2">
                          <span className="truncate">1. Số SIM: <strong className="text-gray-900">{item.sim?.so_sim}</strong></span>
                          <span className="font-semibold text-gray-800">{item.sim?.gia_sim?.toLocaleString("vi-VN")}đ</span>
                        </li>
                        <li className="flex justify-between items-center gap-2">
                          <span className="truncate">2. Phí hòa mạng Viettel:</span>
                          <span className="font-semibold text-gray-800">50.000đ</span>
                        </li>
                      </ul>
                      <div className="border-t border-gray-200 pt-1.5 flex justify-between items-center font-bold text-gray-900">
                        <span>Tổng tiền đơn hàng:</span>
                        <span className="text-[#EE0033] text-sm font-black">{item.tong_tien?.toLocaleString("vi-VN")}đ</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400 space-y-0.5">
                      <p>Mã đơn: <span className="font-semibold text-gray-700">{item.id_don_hang.slice(0, 8)}...</span></p>
                      <p>Ngày tạo: {item.ngay_dat_hang ? new Date(item.ngay_dat_hang).toLocaleString("vi-VN") : "N/A"}</p>
                    </div>
                  </div>

                  {/* Cột 2: Thông tin Khách hàng */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex-1 w-full lg:w-auto text-xs space-y-1.5">
                    <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mb-2">
                      <User className="w-4 h-4 text-[#EE0033]" />
                      {item.khach_hang?.ho_ten}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        SĐT: <span className="font-bold text-gray-800">{item.khach_hang?.so_dien_thoai}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        CCCD: <span className="font-bold text-gray-800">{item.khach_hang?.cccd}</span>
                      </p>
                    </div>
                  </div>

                  {/* Cột 3: Hình thức Thanh toán & Trạng thái Nhận SIM */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 w-full lg:w-auto">
                    {/* Badge Thanh toán */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isOnline ? (
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                          <Globe className="w-3.5 h-3.5" />
                          Thanh toán Online (VNPay)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                          <Store className="w-3.5 h-3.5" />
                          Thanh toán Tại Quầy
                        </span>
                      )}

                      {isPaid ? (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Đã TT
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-xl">
                          Chưa TT
                        </span>
                      )}
                    </div>

                    {/* Trạng thái Bàn Giao & Action Button */}
                    <div className="w-full sm:w-auto text-right">
                      {isReceived ? (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>Đã giao SIM</span>
                          {item.thanh_toan?.thoi_gian_nhan && (
                            <span className="text-[10px] text-green-600 font-normal">
                              ({new Date(item.thanh_toan.thoi_gian_nhan).toLocaleTimeString("vi-VN")})
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleConfirmReceived(item.id_don_hang)}
                          disabled={actionLoading === item.id_don_hang}
                          className="w-full sm:w-auto bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-red-500/20 transition cursor-pointer active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {actionLoading === item.id_don_hang ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          Xác nhận đã giao SIM
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

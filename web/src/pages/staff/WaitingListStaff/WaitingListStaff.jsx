import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaClock,
  FaPhoneAlt,
  FaCheck,
  FaChartLine,
  FaTimes,
  FaSync
} from "react-icons/fa";
import { getStaffQueueTickets, updateQueueTicketStatus } from "../../../api/queue/queue.api";

const WaitingListStaffPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [branchId, setBranchId] = useState(null);

  // Fetch danh sách hàng chờ từ backend
  const fetchQueueTickets = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await getStaffQueueTickets();
      if (res?.success && res?.data) {
        setTickets(res.data);
        if (res.id_chi_nhanh) {
          setBranchId(res.id_chi_nhanh);
        }
        setError(null);
      } else {
        setError("Không thể tải danh sách hàng chờ.");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Đã xảy ra lỗi khi tải dữ liệu hàng chờ.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Tải dữ liệu lần đầu và set interval tự động cập nhật hàng chờ mỗi 60 giây (dự phòng đứt WebSocket)
  useEffect(() => {
    fetchQueueTickets();

    const interval = setInterval(() => {
      fetchQueueTickets(false); // Cập nhật ngầm làm dự phòng
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Lắng nghe cập nhật qua WebSocket thời gian thực
  useEffect(() => {
    if (!branchId) return;

    // Trích xuất host và port từ backend URL
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const hostUrl = backendUrl.replace(/^https?:\/\//, "");
    
    // Sử dụng giao thức ws:// hoặc wss:// dựa trên giao thức hiện tại của web
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${hostUrl}/api/queue/ws/${branchId}`;

    console.log("Đang kết nối WebSocket đến:", wsUrl);
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("Kết nối WebSocket hàng chờ thành công!");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event === "queue_updated") {
          console.log("Phát hiện thay đổi hàng chờ qua WebSocket. Đang tự động tải lại...");
          fetchQueueTickets(false);
        }
      } catch (err) {
        console.error("Lỗi giải mã tin nhắn WebSocket:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("Lỗi kết nối WebSocket:", err);
    };

    socket.onclose = () => {
      console.log("Đã ngắt kết nối WebSocket.");
    };

    return () => {
      socket.close();
    };
  }, [branchId]);

  // Xử lý cập nhật trạng thái phiếu (Gọi khách / Hoàn thành / Hủy)
  const handleUpdateStatus = async (idPhieu, trangThai) => {
    setActionLoading(true);
    try {
      const res = await updateQueueTicketStatus(idPhieu, trangThai);
      if (res?.success) {
        // Cập nhật lại danh sách ngay lập tức
        await fetchQueueTickets(false);
      } else {
        alert(res?.message || "Cập nhật trạng thái thất bại.");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Lỗi khi cập nhật trạng thái.");
    } finally {
      setActionLoading(false);
    }
  };

  // Thống kê số lượng khách hàng hôm nay
  const waitingTickets = tickets.filter(t => t.trang_thai === "ChoXuLy");
  const servingTickets = tickets.filter(t => t.trang_thai === "DangPhucVu");
  const completedTickets = tickets.filter(t => t.trang_thai === "HoanThanh");

  const waitingCount = waitingTickets.length;
  const servingCount = servingTickets.length;
  const servedToday = completedTickets.length;

  // Tính thời gian chờ trung bình dựa trên các dịch vụ đang chờ
  const totalWaitingTime = waitingTickets.reduce((sum, t) => sum + (t.thoi_gian_xu_ly_trung_binh || 15), 0);
  const avgWaitingTime = waitingCount > 0 ? Math.round(totalWaitingTime / waitingCount) : 15;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Hàng chờ giao dịch
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và xử lý khách hàng lấy số trực tuyến tại quầy
          </p>
        </div>
        <button
          onClick={() => fetchQueueTickets(true)}
          disabled={loading || actionLoading}
          className="flex items-center gap-2 bg-white text-gray-700 hover:text-[#EE0033] px-4 py-2.5 rounded-xl border border-gray-200 font-semibold shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <FaSync className={`w-4 h-4 ${loading ? "animate-spin text-[#EE0033]" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 font-semibold text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* STATISTIC CARD SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        
        {/* KHÁCH CHỜ */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex justify-between items-center transition-all duration-300 hover:shadow-md">
          <div>
            <p className="text-sm text-gray-500">Khách đang chờ</p>
            <h2 className="text-3xl font-black mt-1 text-gray-800">{waitingCount} người</h2>
            {servingCount > 0 && (
              <span className="text-xs text-blue-600 font-medium">({servingCount} khách đang phục vụ)</span>
            )}
          </div>
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#EE0033] flex justify-center items-center">
            <FaUsers size={25} />
          </div>
        </div>

        {/* ĐÃ PHỤC VỤ */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex justify-between items-center transition-all duration-300 hover:shadow-md">
          <div>
            <p className="text-sm text-gray-500">Đã phục vụ hôm nay</p>
            <h2 className="text-3xl font-black mt-1 text-green-600">{servedToday} lượt</h2>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex justify-center items-center">
            <FaChartLine size={25} />
          </div>
        </div>

        {/* THỜI GIAN CHỜ TRUNG BÌNH */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex justify-between items-center transition-all duration-300 hover:shadow-md">
          <div>
            <p className="text-sm text-gray-500">Thời gian xử lý dự kiến</p>
            <h2 className="text-3xl font-black mt-1 text-orange-600">{avgWaitingTime} phút/khách</h2>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex justify-center items-center">
            <FaClock size={25} />
          </div>
        </div>

      </div>

      {/* QUEUE LIST */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Danh sách xếp hàng quầy giao dịch
          </h2>
          <span className="bg-red-50 text-[#EE0033] border border-red-100 px-4 py-1.5 rounded-full text-xs font-bold">
            Hàng chờ ngày hôm nay
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col justify-center items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#EE0033] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400 font-semibold">Đang tải danh sách hàng chờ...</span>
          </div>
        ) : tickets.filter((t) => t.trang_thai === "ChoXuLy" || t.trang_thai === "DangPhucVu").length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-medium">
            Hiện tại không có khách hàng nào trong hàng chờ giao dịch hôm nay.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets
              .filter((t) => t.trang_thai === "ChoXuLy" || t.trang_thai === "DangPhucVu")
              .map((item) => {
              // Phân loại style trạng thái
              let statusLabel = "";
              let statusClass = "";
              if (item.trang_thai === "ChoXuLy") {
                statusLabel = "Đang chờ";
                statusClass = "bg-yellow-50 text-yellow-700 border border-yellow-200";
              } else if (item.trang_thai === "DangPhucVu") {
                statusLabel = "Đang phục vụ";
                statusClass = "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse";
              } else if (item.trang_thai === "HoanThanh") {
                statusLabel = "Đã hoàn thành";
                statusClass = "bg-green-50 text-green-700 border border-green-200";
              } else {
                statusLabel = "Đã hủy";
                statusClass = "bg-gray-50 text-gray-600 border border-gray-200";
              }

              // Chỉ hiện nút hành động nếu phiếu là Đang chờ hoặc Đang phục vụ
              const isWaiting = item.trang_thai === "ChoXuLy";
              const isServing = item.trang_thai === "DangPhucVu";

              // Định dạng thời gian đăng ký (lấy giờ phút)
              const registerTime = new Date(item.ngay_tao).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div
                  key={item.id_phieu}
                  className={`border rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200 hover:shadow-md border-gray-100 ${
                    isServing ? "bg-blue-50/20 border-blue-200" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Số thứ tự */}
                    <div className="w-16 h-16 bg-gradient-to-br from-[#EE0033] to-[#A00022] rounded-2xl text-white flex justify-center items-center font-black text-xl shadow-sm">
                      {item.so_thu_tu}
                    </div>

                    {/* Thông tin khách hàng */}
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">{item.ho_ten}</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">{item.so_dien_thoai}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                          {item.ten_giao_dich}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-gray-400" />
                          <span>Lấy số lúc: {registerTime}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nhóm Trạng thái và Hành động */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusClass}`}>
                      {statusLabel}
                    </span>

                    {/* Nút Gọi khách (sang Đang phục vụ) */}
                    {isWaiting && (
                      <button
                        onClick={() => handleUpdateStatus(item.id_phieu, "DangPhucVu")}
                        disabled={actionLoading}
                        className="bg-[#EE0033] hover:bg-opacity-95 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        <FaPhoneAlt />
                        <span>Mời vào quầy</span>
                      </button>
                    )}

                    {/* Nút Hoàn thành giao dịch */}
                    {isServing && (
                      <button
                        onClick={() => handleUpdateStatus(item.id_phieu, "HoanThanh")}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        <FaCheck />
                        <span>Hoàn thành</span>
                      </button>
                    )}

                    {/* Nút Hủy lượt */}
                    {(isWaiting || isServing) && (
                      <button
                        onClick={() => handleUpdateStatus(item.id_phieu, "DaHuy")}
                        disabled={actionLoading}
                        className="bg-gray-100 text-gray-500 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl border border-gray-200 transition-all cursor-pointer disabled:opacity-50"
                        title="Hủy lượt xếp hàng"
                      >
                        <FaTimes size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default WaitingListStaffPage;
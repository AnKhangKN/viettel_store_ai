import React, { useState, useEffect } from "react";
import {
  Users,
  Clock,
  PhoneCall,
  CheckCircle2,
  XCircle,
  RefreshCw,
  TrendingUp,
  Sparkles,
  AlertCircle,
  Zap,
  Check,
  UserCheck
} from "lucide-react";
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

  // Tải dữ liệu lần đầu & thiết lập tự động cập nhật ngầm
  useEffect(() => {
    fetchQueueTickets();

    const interval = setInterval(() => {
      fetchQueueTickets(false);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Lắng nghe cập nhật qua WebSocket thời gian thực
  useEffect(() => {
    if (!branchId) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const hostUrl = backendUrl.replace(/^https?:\/\//, "");
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

  // Xử lý cập nhật trạng thái phiếu (Mời vào quầy / Hoàn thành / Hủy)
  const handleUpdateStatus = async (idPhieu, trangThai) => {
    setActionLoading(true);
    try {
      const res = await updateQueueTicketStatus(idPhieu, trangThai);
      if (res?.success) {
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

  // Thống kê số lượng phiếu hôm nay
  const waitingTickets = tickets.filter((t) => t.trang_thai === "ChoXuLy");
  const servingTickets = tickets.filter((t) => t.trang_thai === "DangPhucVu");
  const completedTickets = tickets.filter((t) => t.trang_thai === "HoanThanh");

  const waitingCount = waitingTickets.length;
  const servingCount = servingTickets.length;
  const servedToday = completedTickets.length;

  const totalWaitingTime = waitingTickets.reduce((sum, t) => sum + (t.thoi_gian_xu_ly_trung_binh || 15), 0);
  const avgWaitingTime = waitingCount > 0 ? Math.round(totalWaitingTime / waitingCount) : 15;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Clock className="w-8 h-8 text-[#EE0033]" />
            Hàng Chờ Giao Dịch Direct
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý và điều phối luồng khách hàng xếp hàng trực tuyến tại quầy giao dịch chi nhánh
          </p>
        </div>

        <button
          onClick={() => fetchQueueTickets(true)}
          disabled={loading || actionLoading}
          className="bg-white border border-gray-200 text-gray-700 hover:text-[#EE0033] hover:border-red-200 font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 text-xs cursor-pointer w-fit disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#EE0033]" : ""}`} />
          <span>Làm mới hàng chờ</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 font-bold text-xs shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top Statistic Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Waiting Count */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Khách đang chờ</span>
            <h2 className="text-3xl font-black text-gray-900 mt-1">{waitingCount} <span className="text-sm font-semibold text-gray-500">người</span></h2>
            {servingCount > 0 && (
              <p className="text-xs text-blue-600 font-bold mt-1">({servingCount} khách đang phục vụ)</p>
            )}
          </div>
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#EE0033] flex justify-center items-center font-bold shadow-xs">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Served Today */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Đã phục vụ hôm nay</span>
            <h2 className="text-3xl font-black text-emerald-600 mt-1">{servedToday} <span className="text-sm font-semibold text-gray-500">lượt</span></h2>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex justify-center items-center font-bold shadow-xs">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>

        {/* Avg Wait Time */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Thời gian xử lý dự kiến</span>
            <h2 className="text-3xl font-black text-amber-600 mt-1">{avgWaitingTime} <span className="text-sm font-semibold text-gray-500">phút/khách</span></h2>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex justify-center items-center font-bold shadow-xs">
            <Clock className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Main Queue List Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80 space-y-6">
        <div className="flex items-center justify-between pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Danh Sách Xếp Hàng Quầy Giao Dịch</h2>
              <p className="text-xs text-gray-500">Cập nhật danh sách phiếu thứ tự và trạng thái phục vụ thời gian thực</p>
            </div>
          </div>

          <span className="bg-red-50 text-[#EE0033] border border-red-100 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-xs inline-flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Hàng chờ trực tiếp</span>
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col justify-center items-center gap-3">
            <RefreshCw className="w-10 h-10 text-[#EE0033] animate-spin" />
            <span className="text-gray-500 font-semibold text-sm">Đang kết nối danh sách hàng chờ...</span>
          </div>
        ) : tickets.filter((t) => t.trang_thai === "ChoXuLy" || t.trang_thai === "DangPhucVu").length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-medium text-sm">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            Hiện tại không có khách hàng nào trong hàng chờ giao dịch hôm nay.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets
              .filter((t) => t.trang_thai === "ChoXuLy" || t.trang_thai === "DangPhucVu")
              .map((item) => {
                const isWaiting = item.trang_thai === "ChoXuLy";
                const isServing = item.trang_thai === "DangPhucVu";

                const registerTime = new Date(item.ngay_tao).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={item.id_phieu}
                    className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 ${
                      isServing
                        ? "bg-gradient-to-r from-blue-50/70 to-white border-blue-200 shadow-md ring-2 ring-blue-500/20"
                        : "bg-white border-gray-200/80 hover:border-red-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      {/* Ticket Number Badge */}
                      <div className="w-20 h-20 bg-gradient-to-br from-[#EE0033] to-[#A00022] rounded-2xl text-white flex flex-col justify-center items-center font-black text-2xl shadow-md flex-shrink-0">
                        <span className="text-[10px] text-red-200 font-bold uppercase tracking-wider">Số phiếu</span>
                        {item.so_thu_tu}
                      </div>

                      {/* Customer & Service Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">{item.ho_ten}</h3>
                          {isServing && (
                            <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full animate-pulse uppercase">
                              Đang phục vụ
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-semibold">{item.so_dien_thoai || "Chưa có SĐT"}</p>

                        <div className="flex flex-wrap items-center gap-3 pt-1.5 text-xs text-gray-500">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-xl font-bold border border-gray-200/80">
                            {item.ten_giao_dich || "Dịch vụ chung"}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            Lấy số lúc: <strong>{registerTime}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      {/* Call Customer Button */}
                      {isWaiting && (
                        <button
                          onClick={() => handleUpdateStatus(item.id_phieu, "DangPhucVu")}
                          disabled={actionLoading}
                          className="bg-[#EE0033] text-white font-black px-6 py-3 rounded-xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:shadow-[0_0px_0_#A00022] active:translate-y-1 transition-all duration-200 flex items-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span>Mời vào quầy</span>
                        </button>
                      )}

                      {/* Complete Ticket Button */}
                      {isServing && (
                        <button
                          onClick={() => handleUpdateStatus(item.id_phieu, "HoanThanh")}
                          disabled={actionLoading}
                          className="bg-emerald-600 text-white font-black px-6 py-3 rounded-xl shadow-[0_6px_0_#065f46] hover:shadow-[0_8px_0_#065f46] hover:-translate-y-1 active:shadow-[0_0px_0_#065f46] active:translate-y-1 transition-all duration-200 flex items-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Hoàn thành</span>
                        </button>
                      )}

                      {/* Cancel Ticket Button */}
                      {(isWaiting || isServing) && (
                        <button
                          onClick={() => handleUpdateStatus(item.id_phieu, "DaHuy")}
                          disabled={actionLoading}
                          className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-gray-200 transition-all cursor-pointer disabled:opacity-50"
                          title="Hủy lượt xếp hàng"
                        >
                          <XCircle className="w-5 h-5" />
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
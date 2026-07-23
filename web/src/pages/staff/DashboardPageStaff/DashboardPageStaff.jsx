import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Store,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowRight,
  PhoneCall,
  UserCheck,
  Zap,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Lock
} from "lucide-react";
import { getStaffQueueTickets, updateQueueTicketStatus } from "../../../api/queue/queue.api";
import { getBoothsStatus } from "../../../api/queue/booth.api";

const DashboardPageStaff = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("vi-VN"));

  // Realtime Booth Status from Backend
  const [boothsList, setBoothsList] = useState([]);

  // Realtime Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("vi-VN"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getStaffQueueTickets();
      if (res?.success && Array.isArray(res?.data)) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error("Lỗi tải hàng chờ dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const [branchId, setBranchId] = useState("default_branch");

  const fetchBooths = async () => {
    try {
      const res = await getBoothsStatus();
      if (res?.success && Array.isArray(res?.data)) {
        setBoothsList(res.data);
        if (res.id_chi_nhanh) {
          setBranchId(res.id_chi_nhanh);
        }
      }
    } catch (err) {
      console.error("Lỗi tải thông tin quầy:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchBooths();

    const handleBoothChanged = () => {
      fetchBooths();
    };

    window.addEventListener("staff_booth_changed", handleBoothChanged);
    return () => window.removeEventListener("staff_booth_changed", handleBoothChanged);
  }, []);

  // WebSocket for real-time updates
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const hostUrl = backendUrl.replace(/^https?:\/\//, "");
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${hostUrl}/api/queue/ws/${branchId}`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event === "booth_updated") {
          fetchBooths();
        } else if (message.event === "queue_updated") {
          fetchTickets();
          fetchBooths();
        }
      } catch (err) {
        console.error("Lỗi WebSocket:", err);
      }
    };

    return () => {
      socket.close();
    };
  }, [branchId]);

  // Compute Live Stats
  const waitingTickets = tickets.filter((t) => t.trang_thai === "ChoXuLy");
  const servingTickets = tickets.filter((t) => t.trang_thai === "DangPhucVu");
  const completedTickets = tickets.filter((t) => t.trang_thai === "HoanThanh");

  const waitingCount = waitingTickets.length;
  const servingCount = servingTickets.length;
  const completedCount = completedTickets.length;

  const totalWaitMinutes = waitingTickets.reduce((acc, curr) => acc + (curr.thoi_gian_xu_ly_trung_binh || 12), 0);
  const avgWaitTime = tickets.length > 0 ? Math.round(tickets.reduce((acc, curr) => acc + (curr.thoi_gian_xu_ly_trung_binh || 12), 0) / tickets.length) : 0;

  // Active booths count
  const activeBoothsCount = boothsList.filter((b) => b.trang_thai === "DangSuDung").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* 1. Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#EE0033] via-[#CC002D] to-[#A00022] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current" /> Viettel Store Staff Portal
              </span>
              <span className="bg-white/15 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-yellow-300" /> {currentTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Chào Mừng Quay Trở Lại, {user?.name || user?.ho_ten || "Nhân viên"}! 👋
            </h1>

            <p className="text-red-100 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              Theo dõi tình trạng hàng chờ, quản lý quầy giao dịch và phục vụ khách hàng trực tiếp tại Viettel Cần Thơ.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/staff/waiting-list")}
              className="bg-white text-[#EE0033] font-black px-6 py-3.5 rounded-2xl shadow-[0_6px_0_#e5e7eb] hover:shadow-[0_8px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" />
              Mời khách tiếp theo
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Statistic Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Waiting Count */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(238,0,51,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Khách đang chờ</span>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#EE0033] border border-red-100 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <h2 className="text-3xl font-black text-gray-900">{waitingCount}</h2>
            <span className="text-xs font-bold text-[#EE0033] bg-red-50 px-2.5 py-1 rounded-full border border-red-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#EE0033] rounded-full animate-ping"></span>
              Trực tiếp
            </span>
          </div>
        </div>

        {/* Active Booths */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quầy đang hoạt động</span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <h2 className="text-3xl font-black text-gray-900">{activeBoothsCount}/{boothsList.length}</h2>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              {activeBoothsCount > 0 ? `${activeBoothsCount} Quầy trực` : "Chưa chọn quầy"}
            </span>
          </div>
        </div>

        {/* Served Today */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đã phục vụ hôm nay</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <h2 className="text-3xl font-black text-gray-900">{completedCount}</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Hôm nay
            </span>
          </div>
        </div>

        {/* Avg Processing Time */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thời gian xử lý TB</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <h2 className="text-3xl font-black text-gray-900">{avgWaitTime} <span className="text-sm font-bold text-gray-500">phút</span></h2>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              Đạt chỉ tiêu
            </span>
          </div>
        </div>
      </div>

      {/* 3. Booth Status Grid (Tình trạng quầy giao dịch) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tình Trạng Các Quầy Giao Dịch</h2>
              <p className="text-xs text-gray-500">Danh sách các quầy và nhân viên đang trực theo thời gian thực</p>
            </div>
          </div>

          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl hidden sm:inline-block">
            Tổng {boothsList.length} quầy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {boothsList.map((booth) => {
            const isOccupied = booth.trang_thai === "DangSuDung";
            const isMyBooth = booth.is_my_booth;

            return (
              <div
                key={booth.ten_quay}
                className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  isMyBooth
                    ? "bg-gradient-to-b from-red-50/60 to-white border-red-200 shadow-md ring-2 ring-red-500/20"
                    : isOccupied
                    ? "bg-white border-gray-200/80 shadow-sm hover:shadow-md"
                    : "bg-gray-50/70 border-gray-200/60"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-gray-900 text-base">{booth.ten_quay}</span>
                    {isMyBooth ? (
                      <span className="bg-red-50 text-[#EE0033] border border-red-200 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#EE0033] rounded-full animate-pulse"></span>
                        Quầy của bạn
                      </span>
                    ) : isOccupied ? (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Đã có người trực
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        🟢 Sẵn sàng
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Nhân viên trực</span>
                    <p className={`text-xs font-bold mt-0.5 ${isMyBooth ? "text-[#EE0033]" : isOccupied ? "text-gray-800" : "text-gray-400 italic"}`}>
                      {isMyBooth ? `${user?.name || user?.ho_ten || "Nhân viên"} (Bạn)` : isOccupied ? booth.nhan_vien : "Chưa có nhân viên"}
                    </p>
                  </div>
                </div>

                {isMyBooth && (
                  <div className="pt-2 text-center border-t border-red-100">
                    <span className="text-[11px] font-bold text-[#EE0033]">⚡ Đang nhận khách ở quầy này</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Split Grid: Realtime Waiting Queue & Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Live Waiting Queue List */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Danh Sách Khách Đang Chờ</h2>
                <p className="text-xs text-gray-500">Các phiếu đăng ký xếp hàng trực tuyến mới nhất</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/staff/waiting-list")}
              className="text-xs font-bold text-[#EE0033] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {waitingTickets.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs font-medium">
                Hiện tại không có khách nào đang chờ trong hàng đợi.
              </div>
            ) : (
              waitingTickets.slice(0, 4).map((ticket) => (
                <div
                  key={ticket.id_phieu}
                  className="bg-gray-50/80 hover:bg-red-50/40 p-4 rounded-2xl border border-gray-200/70 hover:border-red-200 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#EE0033] text-white flex items-center justify-center text-base font-black shadow-sm flex-shrink-0">
                      {ticket.so_thu_tu}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{ticket.ho_ten}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{ticket.ten_giao_dich || "Giao dịch tổng hợp"}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-200">
                      Chờ {ticket.thoi_gian_xu_ly_trung_binh || 10} phút
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Transaction History Timeline */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Giao Dịch Gần Đây</h2>
                <p className="text-xs text-gray-500">Nhật ký xử lý hoàn tất tại các quầy</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {completedTickets.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs font-medium">
                Chưa có giao dịch nào hoàn thành hôm nay.
              </div>
            ) : (
              completedTickets.slice(0, 5).map((ticket) => {
                const formattedTime = new Date(ticket.ngay_tao).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit"
                });
                return (
                  <div
                    key={ticket.id_phieu}
                    className="flex items-center justify-between p-3.5 bg-gray-50/60 rounded-2xl border border-gray-100 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs flex-shrink-0">
                        {ticket.so_thu_tu}
                      </span>
                      <div>
                        <p className="font-bold text-gray-800">{ticket.ten_giao_dich || "Giao dịch quầy"}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Khách hàng: {ticket.ho_ten}</p>
                      </div>
                    </div>

                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px] border border-emerald-200">
                      Hoàn thành ({formattedTime})
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageStaff;

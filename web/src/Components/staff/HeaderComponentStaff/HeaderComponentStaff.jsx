import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Bell, ArrowLeft, LogOut, User, Menu, MapPin, Zap, Monitor, Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import { getBoothsStatus, selectBooth, releaseBooth } from "../../../api/queue/booth.api";

const HeaderComponentStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const isDashboard = location.pathname === "/staff/dashboard";
  const [showNotification, setShowNotification] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBoothModal, setShowBoothModal] = useState(false);
  const [boothLoading, setBoothLoading] = useState(false);

  // Live booths list from server
  const [boothsList, setBoothsList] = useState([
    { ten_quay: "Quầy 1", trang_thai: "SanSang", nhan_vien: null, is_my_booth: false },
    { ten_quay: "Quầy 2", trang_thai: "SanSang", nhan_vien: null, is_my_booth: false },
    { ten_quay: "Quầy 3", trang_thai: "SanSang", nhan_vien: null, is_my_booth: false },
    { ten_quay: "Quầy 4", trang_thai: "SanSang", nhan_vien: null, is_my_booth: false },
  ]);

  const [activeBooth, setActiveBooth] = useState(() => {
    return localStorage.getItem("staff_active_booth") || "Quầy 1";
  });

  const [isServingCustomer, setIsServingCustomer] = useState(false);
  const [servingTicketNo, setServingTicketNo] = useState(null);

  // Fetch booth status from Backend
  const fetchBooths = async () => {
    try {
      const res = await getBoothsStatus();
      if (res?.success && Array.isArray(res?.data)) {
        setBoothsList(res.data);
        setIsServingCustomer(!!res.is_serving_customer);
        setServingTicketNo(res.serving_ticket_no || null);
        if (res.my_active_booth) {
          setActiveBooth(res.my_active_booth);
          localStorage.setItem("staff_active_booth", res.my_active_booth);
          window.dispatchEvent(new Event("staff_booth_changed"));
        } else if (!localStorage.getItem("staff_active_booth")) {
          setShowBoothModal(true);
        }
      }
    } catch (err) {
      console.error("Lỗi lấy trạng thái quầy:", err);
    }
  };

  useEffect(() => {
    fetchBooths();

    const handleLocalBoothChange = () => {
      fetchBooths();
    };

    window.addEventListener("staff_booth_changed", handleLocalBoothChange);
    return () => window.removeEventListener("staff_booth_changed", handleLocalBoothChange);
  }, []);

  // WebSocket listening for real-time booth updates across all staff
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const hostUrl = backendUrl.replace(/^https?:\/\//, "");
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${hostUrl}/api/queue/ws/default_branch`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event === "booth_updated") {
          fetchBooths();
        }
      } catch (err) {
        console.error("Lỗi WebSocket booth:", err);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  // Select a booth fixed for session
  const handleSelectBooth = async (tenQuay) => {
    setBoothLoading(true);
    try {
      const res = await selectBooth(tenQuay);
      if (res?.success) {
        setActiveBooth(tenQuay);
        localStorage.setItem("staff_active_booth", tenQuay);
        window.dispatchEvent(new Event("staff_booth_changed"));
        setShowBoothModal(false);
        await fetchBooths();
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || `Không thể chọn ${tenQuay}`;
      alert(msg);
      fetchBooths();
    } finally {
      setBoothLoading(false);
    }
  };

  // Logout & release booth
  const handleLogout = async () => {
    try {
      await releaseBooth();
    } catch (err) {
      console.error("Lỗi giải phóng quầy khi logout:", err);
    } finally {
      localStorage.removeItem("staff_active_booth");
      navigate("/logout");
    }
  };

  const notifications = [
    {
      id: 1,
      title: "Khách hàng mới",
      message: "Khách A015 vừa đăng ký giao dịch.",
    },
    {
      id: 2,
      title: "Hàng chờ",
      message: "Hiện còn 5 khách đang chờ.",
    },
    {
      id: 3,
      title: "Thông báo",
      message: "Đã cập nhật thời gian chờ.",
    },
  ];

  return (
    <>
      <header className="px-6 py-4 flex items-center justify-between relative bg-white border-b border-gray-100">
        {/* Left: Brand name / Portal title & Back Button */}
        <div className="flex items-center gap-3">
          {!isDashboard && (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 hover:bg-red-50 hover:text-[#EE0033] flex items-center justify-center text-gray-500 transition-all cursor-pointer mr-2"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <button className="lg:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/staff/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="text-xl font-bold text-[#EE0033]">⚡</div>
            <span className="text-lg font-black tracking-tight text-gray-900 uppercase">
              Viettel Store <span className="text-[#EE0033] font-black">Staff</span>
            </span>
          </Link>

          {/* Branch location tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50/50 border border-red-100/50 ml-4">
            <MapPin className="w-4 h-4 text-[#EE0033]" />
            <span className="text-[#EE0033] text-xs font-bold">
              Viettel Cần Thơ
            </span>
          </div>

          {/* Fixed Counter Badge Tag */}
          <div
            onClick={() => !isServingCustomer && setShowBoothModal(true)}
            className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-2xs transition-all cursor-pointer ${
              isServingCustomer
                ? "bg-amber-50/80 border-amber-200"
                : "bg-red-50/60 border-red-200/80 hover:border-red-300"
            }`}
            title={
              isServingCustomer
                ? `🔒 Bạn đang phục vụ khách ${servingTicketNo}. Vui lòng hoàn thành giao dịch trước khi xem quầy!`
                : "Xem sơ đồ quầy cố định phiên làm việc"
            }
          >
            {isServingCustomer ? (
              <Lock className="w-4 h-4 text-amber-600" />
            ) : (
              <Monitor className="w-4 h-4 text-[#EE0033]" />
            )}
            <span className="text-xs text-gray-500 font-semibold">Vị trí trực:</span>
            <span className="text-xs font-black text-[#EE0033]">{activeBooth}</span>
            <span className="text-[10px] text-gray-400 font-bold ml-1">(Cố định)</span>
          </div>
        </div>

        {/* Right: Notifications & User profile & Logout */}
        <div className="flex items-center gap-4">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotification(!showNotification);
                setShowUserMenu(false);
              }}
              className="relative p-2.5 text-gray-500 hover:text-[#EE0033] hover:bg-red-50 rounded-xl transition-all cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EE0033]"></span>
              </span>
            </button>

            {/* Notifications Dropdown Popup */}
            {showNotification && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                <div className="px-4 py-3.5 bg-gray-50 border-b border-gray-100 font-bold text-gray-800 text-sm">
                  Thông báo mới
                </div>
                <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-3 hover:bg-gray-50/80 cursor-pointer transition-colors"
                    >
                      <p className="font-bold text-xs text-gray-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-normal">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Vertical divider */}
          <div className="h-6 w-px bg-gray-200"></div>

          {/* User profile dropdown container */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotification(false);
              }}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-200"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[11px] text-[#EE0033] font-bold leading-none flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Nhân viên {activeBooth}
                </p>
                <p className="text-sm font-bold text-gray-800 mt-1 group-hover:text-[#EE0033] transition-colors">
                  {user?.name || "Phạm Khánh Ngọc"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#EE0033] font-black shadow-sm group-hover:scale-105 transition-transform">
                {user?.name ? user.name.charAt(0).toUpperCase() : "N"}
              </div>
            </button>

            {/* User Profile Dropdown Popup */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
                  <p className="font-extrabold text-sm text-gray-900">{user?.name || "Phạm Khánh Ngọc"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{user?.email || "staff@viettel.com.vn"}</p>
                  <span className="mt-2 inline-block bg-[#EE0033] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    Nhân viên {activeBooth}
                  </span>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/staff/profile");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:text-[#EE0033] hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#EE0033]" />
                    <span>Thông tin cá nhân</span>
                  </button>

                  <div className="h-px bg-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-[#EE0033] hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-gray-400" />
                    <span>Đăng xuất (Giải phóng quầy)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL CỐ ĐỊNH QUẦY PHIÊN LÀM VIỆC */}
      {showBoothModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold mx-auto border border-red-100">
                <Monitor className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Chọn Quầy Trực Cố Định Phiên Làm Việc</h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Quầy được chọn sẽ cố định trong suốt phiên làm việc. Để đổi quầy khác, nhân viên cần thực hiện Đăng xuất.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {boothsList.map((b) => {
                const isOccupiedByOther = b.trang_thai === "DangSuDung" && !b.is_my_booth;
                const isMyBooth = b.is_my_booth;

                return (
                  <button
                    key={b.ten_quay}
                    disabled={isOccupiedByOther || boothLoading}
                    onClick={() => handleSelectBooth(b.ten_quay)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer ${
                      isMyBooth
                        ? "bg-red-50 border-[#EE0033] shadow-md ring-2 ring-red-500/20"
                        : isOccupiedByOther
                        ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                        : "bg-white border-gray-200 hover:border-red-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base text-gray-900">{b.ten_quay}</span>
                      {isMyBooth ? (
                        <CheckCircle2 className="w-5 h-5 text-[#EE0033]" />
                      ) : isOccupiedByOther ? (
                        <Lock className="w-4 h-4 text-red-500" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Trạng thái</span>
                      <p className={`text-xs font-bold mt-0.5 ${isOccupiedByOther ? "text-red-600" : isMyBooth ? "text-[#EE0033]" : "text-emerald-600"}`}>
                        {isOccupiedByOther
                          ? `Đang trực bởi ${b.nhan_vien}`
                          : isMyBooth
                          ? "Quầy của bạn"
                          : "🟢 Sẵn sàng chọn"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium">Chi nhánh: Viettel Cần Thơ</span>
              <button
                onClick={() => setShowBoothModal(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderComponentStaff;

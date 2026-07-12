import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Bell, ArrowLeft, LogOut, User, Menu, MapPin } from "lucide-react";

const HeaderComponentStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const isDashboard = location.pathname === "/staff/dashboard";
  const [showNotification, setShowNotification] = useState(false);

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
    <header className="px-6 py-4 flex items-center justify-between relative bg-white">
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
      </div>

      {/* Right: Notifications & User profile & Logout */}
      <div className="flex items-center gap-5">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotification(!showNotification)}
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

        {/* User profile details */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400 font-medium">Nhân viên quầy 1</p>
            <p className="text-sm font-bold text-gray-800">{user?.name || "Phạm Khánh Ngọc"}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#EE0033] font-bold shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : "N"}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => navigate("/logout")}
          className="p-2.5 text-gray-400 hover:text-[#EE0033] hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default HeaderComponentStaff;

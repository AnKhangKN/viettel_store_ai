import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Bell, Search, LogOut, User, Menu, Settings } from "lucide-react";

const HeaderComponentAdmin = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-gray-100 relative z-50">
      {/* Left: Brand name / Portal title */}
      <div className="flex items-center gap-3">
        <button className="md:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/admin/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="text-xl font-bold text-[#EE0033]">⚡</div>
          <span className="text-lg font-black tracking-tight text-gray-900 uppercase">
            Viettel Store <span className="text-[#EE0033] font-black">Admin</span>
          </span>
        </Link>
      </div>

      {/* Middle: Search Box */}
      <div className="hidden md:flex items-center relative w-80">
        <input
          type="text"
          placeholder="Tìm kiếm nhanh..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all placeholder:text-gray-400 text-gray-800"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
      </div>

      {/* Right: Notification & User profile */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2.5 text-gray-500 hover:text-[#EE0033] hover:bg-red-50 rounded-xl transition-all cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EE0033]"></span>
          </span>
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-gray-200"></div>

        {/* User profile dropdown container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-200"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400 font-medium">Xin chào</p>
              <p className="text-sm font-bold text-gray-800 group-hover:text-[#EE0033] transition-colors">
                {user?.name || user?.ho_ten || "Quản trị viên"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#EE0033] font-bold shadow-sm group-hover:scale-105 transition-transform">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </div>
          </button>

          {/* User Profile Dropdown Popup */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
              <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
                <p className="font-extrabold text-sm text-gray-900">{user?.name || user?.ho_ten || "Quản trị viên"}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email || "admin@viettel.com.vn"}</p>
                <span className="mt-2 inline-block bg-[#EE0033] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Quản trị hệ thống
                </span>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/admin/settings");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:text-[#EE0033] hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#EE0033]" />
                  <span>Hồ sơ & Cấu hình</span>
                </button>

                <div className="h-px bg-gray-100 my-1"></div>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/logout");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-[#EE0033] hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-gray-400" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponentAdmin;
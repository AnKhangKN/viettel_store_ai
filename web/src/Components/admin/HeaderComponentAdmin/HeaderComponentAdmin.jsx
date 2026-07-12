import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Bell, Search, LogOut, User, Menu } from "lucide-react";

const HeaderComponentAdmin = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="px-6 py-4 flex items-center justify-between">
      {/* Left: Brand name / Portal title */}
      <div className="flex items-center gap-3">
        <button className="md:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/admin" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
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

        {/* User profile details */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400 font-medium">Xin chào</p>
            <p className="text-sm font-bold text-gray-800">{user?.name || "Quản trị viên"}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#EE0033] font-bold shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
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

export default HeaderComponentAdmin;
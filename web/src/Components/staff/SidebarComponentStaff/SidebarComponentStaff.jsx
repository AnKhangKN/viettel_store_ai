import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  Package,
  CreditCard,
  Users,
  User,
  LogOut
} from "lucide-react";

const SidebarComponentStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Tổng quan",
      path: "/staff/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Hàng chờ giao dịch",
      path: "/staff/waiting-list",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Đơn mua SIM",
      path: "/staff/sim",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: "Tra cứu khách hàng",
      path: "/staff/customer",
      icon: <Users className="w-5 h-5" />,
    },
  ];


  return (
    <div className="flex flex-col h-full justify-between py-6">
      {/* Navigation Menu Links */}
      <div className="space-y-1.5 px-4">
        {menuItems.map((item, idx) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/staff/dashboard" && location.pathname.startsWith(item.path));

          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-red-50 text-[#EE0033] shadow-sm border-l-4 border-[#EE0033] rounded-l-none pl-3"
                  : "text-gray-600 hover:text-[#EE0033] hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom section: User Profile Card, Logout & Footer */}
      <div className="px-6 border-t border-gray-100 pt-6 space-y-3">
        {/* User Profile Quick Card */}
        <button
          onClick={() => navigate("/staff/profile")}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer text-left ${
            location.pathname === "/staff/profile"
              ? "bg-red-50 border border-red-200"
              : "bg-gray-50 hover:bg-red-50/60 border border-gray-100"
          }`}
          title="Xem hồ sơ cá nhân"
        >
          <div className="w-8 h-8 rounded-lg bg-white text-[#EE0033] font-bold flex items-center justify-center text-xs shadow-xs border border-red-100">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-extrabold text-gray-800 truncate">Hồ sơ cá nhân</p>
            <p className="text-[10px] text-gray-400 truncate">Xem & Cập nhật</p>
          </div>
        </button>

        <button
          onClick={async () => {
            try {
              const { releaseBooth } = await import("../../../api/queue/booth.api");
              await releaseBooth();
            } catch (err) {
              console.error(err);
            } finally {
              localStorage.removeItem("staff_active_booth");
              navigate("/logout");
            }
          }}
          className="w-full flex items-center gap-3 text-gray-400 hover:text-[#EE0033] text-xs font-semibold transition-colors cursor-pointer px-1 py-1"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>

        {/* Branding Copyright info */}
        <div className="text-[10px] text-gray-400 font-normal pt-1">
          © 2026 Viettel Telecom.
          <br />
          Staff Portal v1.0.0
        </div>
      </div>


    </div>
  );
};

export default SidebarComponentStaff;
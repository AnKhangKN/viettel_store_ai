import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  Package,
  CreditCard,
  Users,
  DollarSign,
  HelpCircle,
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
      label: "Quản lý khách hàng",
      path: "/staff/customer",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Thanh toán",
      path: "/staff/payment",
      icon: <DollarSign className="w-5 h-5" />,
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

      {/* Bottom section: Help & Footer */}
      <div className="px-6 border-t border-gray-100 pt-6 space-y-4">
        <button
          onClick={() => navigate("/support")}
          className="w-full flex items-center gap-3 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Hỗ trợ hệ thống</span>
        </button>

        <button
          onClick={() => navigate("/logout")}
          className="w-full flex items-center gap-3 text-gray-400 hover:text-[#EE0033] text-sm font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>

        {/* Branding Copyright info */}
        <div className="text-[10px] text-gray-400 font-normal pt-2">
          © 2026 Viettel Telecom.
          <br />
          Staff Portal v1.0.0
        </div>
      </div>
    </div>
  );
};

export default SidebarComponentStaff;
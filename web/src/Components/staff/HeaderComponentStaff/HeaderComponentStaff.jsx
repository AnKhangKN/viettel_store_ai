import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  FaBell,
  FaUserTie,
  FaSignOutAlt,
  FaTachometerAlt,
  FaClock,
  FaBoxOpen,
  FaSimCard,
  FaUsers,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const HeaderComponentStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/staff";

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

  const menus = [
    {
      name: "Dashboard",
      path: "/staff",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Hàng chờ",
      path: "/staff/waiting-list",
      icon: <FaClock />,
    },
    {
      name: "Gói cước",
      path: "/staff/package",
      icon: <FaBoxOpen />,
    },
    {
      name: "Đơn mua SIM",
      path: "/staff/sim",
      icon: <FaSimCard />,
    },
    {
      name: "Khách hàng",
      path: "/staff/customer",
      icon: <FaUsers />,
    },
    {
      name: "Thanh toán",
      path: "/staff/payment",
      icon: <FaMoneyCheckAlt />,
    },
  ];

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Left */}
        <div className="flex items-center gap-8">

          {!isDashboard && (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-red-800/40 hover:bg-red-800 flex items-center justify-center text-white transition"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <Link
            to="/staff"
            className="flex items-center gap-3 hover:opacity-90"
          >
            <span className="text-3xl">⚡</span>

            <h1 className="text-xl font-bold text-white whitespace-nowrap">
              Viettel Staff
            </h1>
          </Link>

          <div className="hidden xl:flex items-center px-4 py-2 rounded-lg bg-red-700/50 border border-red-500">
            <span className="text-white text-sm font-medium">
              📍 Viettel Cần Thơ
            </span>
          </div>

        </div>

        {/* Center Menu */}
        <nav className="hidden lg:flex items-center gap-2">

          {menus.map((item) => {

            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
                ${
                  active
                    ? "bg-white text-red-600 shadow-md font-semibold"
                    : "text-white hover:bg-red-500"
                }`}
              >
                <span className="text-lg">{item.icon}</span>

                <span className="text-sm whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </nav>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Notification */}
          <div className="relative">

            <button
              onClick={() => setShowNotification(!showNotification)}
              className="relative p-2 rounded-lg hover:bg-red-500 text-white transition"
            >
              <FaBell size={20} />

              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 text-red-700 text-xs font-bold flex items-center justify-center">
                {notifications.length}
              </span>

            </button>

            {showNotification && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl overflow-hidden">

                <div className="px-4 py-3 bg-gray-100 font-semibold">
                  Thông báo
                </div>

                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="font-semibold text-sm text-gray-800">
                      {item.title}
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      {item.message}
                    </p>
                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Staff */}
          <div className="flex items-center gap-3 pl-5 border-l border-red-400">

            <div className="text-right">
              <p className="text-sm font-semibold text-white">
                Phạm Khánh Ngọc
              </p>

              <p className="text-xs text-red-100">
                Nhân viên giao dịch quầy 1
              </p>
            </div>

            <button className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-white transition">
              <FaUserTie />
            </button>

          </div>

          {/* Logout */}
          <Link
            to="/logout"
            className="w-10 h-10 rounded-lg hover:bg-red-500 flex items-center justify-center text-white transition"
          >
            <FaSignOutAlt />
          </Link>

        </div>

      </div>
    </header>
  );
};

export default HeaderComponentStaff;
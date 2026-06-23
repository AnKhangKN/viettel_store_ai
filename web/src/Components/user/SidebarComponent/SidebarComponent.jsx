import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaList, FaRobot, FaUserCheck } from 'react-icons/fa';

const SidebarComponent = () => {
  const menuItems = [
    { name: 'Trang chủ', path: '/', icon: <FaHome /> },
    { name: 'Gói cước', path: '/package', icon: <FaList /> },
    { name: 'AI Chatbot', path: '/chatbot', icon: <FaRobot /> },
    { name: 'Đăng ký quầy', path: '/register-service', icon: <FaUserCheck /> },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      {/* Tiêu đề Sidebar */}
      <div className="mb-8 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg">
        <h2 className="text-xl font-bold text-white">Viettel Store</h2>
      </div>

      {/* Danh sách menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center p-3 text-gray-700 hover:bg-red-100 hover:text-red-700 font-medium rounded-lg transition-all duration-200"
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer Sidebar (tùy chọn) */}
      <div className="mt-auto px-4 py-4 text-xs text-gray-400">
        © 2026 Viettel Store AI
      </div>
    </div>
  );
};

export default SidebarComponent;
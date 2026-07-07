import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Gói cước", path: "/package" },
    { label: "AI Chatbot", path: "/chatbot" },
    { label: "Đăng ký quầy", path: "/appointment" },
    { label: "Mua sim", path: "/buysim" },
    { label: "Dịch vụ di động", path: "/mobile-services" },
    { label: "Tin tức", path: "/news" }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-16">
          {/* Menu Items */}
          <div className="flex items-center gap-6 lg:gap-10 overflow-x-auto w-full">
            {menuItems.map((item, idx) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className={`font-semibold whitespace-nowrap transition-colors duration-200 py-[18px] relative ${
                    isActive ? 'text-[#EE0033]' : 'text-gray-700 hover:text-[#EE0033]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#EE0033] shadow-sm"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;

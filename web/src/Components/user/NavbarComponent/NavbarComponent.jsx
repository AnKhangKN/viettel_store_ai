import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Smartphone, Sparkles, Calendar, CreditCard, Radio, Newspaper } from 'lucide-react';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Trang chủ", path: "/", icon: Home },
    { label: "Gói cước 4G/5G", path: "/package", icon: Smartphone },
    { label: "AI Chatbot", path: "/chatbot", icon: Sparkles, badge: "AI" },
    { label: "Đăng ký quầy", path: "/appointment", icon: Calendar },
    { label: "Mua SIM số đẹp", path: "/buysim", icon: CreditCard },
    { label: "Dịch vụ di động", path: "/mobile-services", icon: Radio },
    { label: "Tin tức", path: "/news", icon: Newspaper }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between gap-6 md:gap-10 lg:gap-12 overflow-x-auto no-scrollbar w-full py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-full text-[1.1rem] font-bold whitespace-nowrap transition-all duration-300 cursor-pointer relative ${
                    isActive
                      ? 'bg-red-50 text-red-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  
                  {item.badge && (
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ml-0.5">
                      {item.badge}
                    </span>
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

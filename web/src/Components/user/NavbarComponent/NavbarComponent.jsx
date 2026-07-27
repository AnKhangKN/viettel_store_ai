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
    <nav className="bg-white/95 shadow-xs border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12">
          <div className="flex items-center gap-1 w-full overflow-x-auto no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide">
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

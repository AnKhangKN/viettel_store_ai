import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      label: "Trang chủ", 
      path: "/", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    { 
      label: "Gói cước", 
      path: "/package", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm0 5.25h.007v.008H3.75V12Zm0 5.25h.007v.008H3.75v-.008Z" />
        </svg>
      )
    },
    { 
      label: "AI Chatbot", 
      path: "/chatbot", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
      )
    },
    { 
      label: "Đăng ký quầy", 
      path: "/register-service", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-neutral-200 flex flex-col justify-between select-none font-sans">
      <div className="w-full">
        
        {/* Khối Header Sidebar - Đỏ Đậm Đồng Bộ Sang Trọng */}
        <div className="bg-[#bd0000] p-5 border-b border-[#990000] flex items-center gap-3 shadow-sm cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xl font-black">V</div>
          <div className="text-white font-black text-lg tracking-tight">Viettel Store</div>
        </div>

        {/* Danh sách Menu Items - Cách xa nhau và chữ bự */}
        <div className="px-3 py-6 space-y-3">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={idx}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-bold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-red-50 text-[#bd0000] shadow-sm" 
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <div className={`shrink-0 ${isActive ? "text-[#bd0000]" : "text-neutral-400 group-hover:text-neutral-600"}`}>
                  {item.icon}
                </div>
                <span className="tracking-tight">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-neutral-100 text-center">
        <span className="text-[11px] text-neutral-400 font-medium">© 2026 Viettel Store AI</span>
      </div>
    </div>
  );
};

export default SidebarComponent;
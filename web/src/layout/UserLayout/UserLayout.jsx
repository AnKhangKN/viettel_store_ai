import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HeaderComponent from "../../components/user/HeaderComponent/HeaderComponent";
import SidebarComponent from "../../components/user/SidebarComponent/SidebarComponent";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col h-screen bg-[#121212] relative">
      {/* Header */}
      <HeaderComponent />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SidebarComponent />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 relative">
          {/* Floating Back Button */}
          {!isHomePage && (
            <div className="sticky top-6 z-50 ml-6 w-0 h-0 overflow-visible">
              <button
                onClick={() => navigate(-1)}
                className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group"
                title="Quay lại trang trước"
              >
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
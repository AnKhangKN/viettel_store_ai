import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HeaderComponent from "../../components/user/HeaderComponent/HeaderComponent";
import NavbarComponent from "../../components/user/NavbarComponent/NavbarComponent";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col h-screen bg-[#121212] relative">
      {/* Header */}
      <HeaderComponent />

      {/* Navbar (replaces Sidebar) */}
      <NavbarComponent />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 relative">
          {/* Professional Back Button Bar */}
          {!isHomePage && (
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
              <div className="px-6 h-14 flex items-center">
                <button 
                  onClick={() => navigate(-1)} 
                  title="Quay lại"
                  className="flex items-center justify-center text-gray-500 hover:text-[#EE0033] hover:bg-red-50 w-10 h-10 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home, MessageSquare, Sparkles } from 'lucide-react';
import HeaderComponent from "../../components/user/HeaderComponent/HeaderComponent";
import NavbarComponent from "../../components/user/NavbarComponent/NavbarComponent";
import FooterComponent from "../../components/user/FooterComponent/FooterComponent";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isChatbotPage = location.pathname === '/chatbot';

  // Map path to friendly page name for breadcrumb
  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/package')) return 'Gói cước 4G/5G';
    if (pathname.startsWith('/buysim')) return 'Kho SIM Số đẹp';
    if (pathname.startsWith('/appointment')) return 'Đặt lịch quầy giao dịch';
    if (pathname.startsWith('/chatbot')) return 'Trợ lý AI Chatbot';
    if (pathname.startsWith('/mobile-services')) return 'Dịch vụ di động';
    if (pathname.startsWith('/news')) return 'Tin tức & Khuyến mãi';
    if (pathname.startsWith('/profile')) return 'Hồ sơ cá nhân';
    if (pathname.startsWith('/support')) return 'Trung tâm hỗ trợ';
    if (pathname.startsWith('/store-locator')) return 'Hệ thống chi nhánh';
    if (pathname.startsWith('/lookup')) return 'Tra cứu dịch vụ';
    if (pathname.startsWith('/payment')) return 'Thanh toán đơn hàng';
    return 'Viettel Store';
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans antialiased relative">
      {/* Header */}
      <HeaderComponent />

      {/* Navbar Navigation */}
      <NavbarComponent />

      {/* Sticky Top Bar with Back Button & Breadcrumb (for Subpages) */}
      {!isHomePage && (
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-14 z-30 shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                title="Quay lại trang trước"
                className="flex items-center justify-center text-slate-500 hover:text-[#EE0033] hover:bg-red-50 w-8 h-8 rounded-full transition-colors cursor-pointer border border-slate-200 hover:border-red-200"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Link to="/" className="hover:text-[#EE0033] flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" /> Trang chủ
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-900 font-bold">{getPageTitle(location.pathname)}</span>
              </nav>
            </div>

            <Link
              to="/chatbot"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Hỏi AI tư vấn</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        {children}
      </main>

      {/* Shared Footer */}
      <FooterComponent />

      {/* Floating AI Chatbot Button (Hidden on /chatbot page) */}
      {!isChatbotPage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <Link
            to="/chatbot"
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-3.5 sm:p-4 rounded-full shadow-[0_10px_25px_-5px_rgba(147,51,234,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(147,51,234,0.6)] hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center group relative border-2 border-white/40 backdrop-blur-sm"
          >
            <Sparkles className="w-6 h-6 animate-spin-slow" />
            
            {/* Pulsing indicator ring */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500 border-2 border-white"></span>
            </span>

            {/* Hover Tooltip */}
            <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl pointer-events-none border border-slate-700">
              Trợ lý AI Viettel tư vấn 24/7 ✨
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserLayout;
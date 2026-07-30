import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, User, LogOut, ChevronDown, ShieldCheck, Menu, X, Home, Smartphone, Package, MapPin, Bot, HelpCircle, ShoppingBag } from 'lucide-react';

import { useSelector } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';

const HeaderComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowDropdown((prev) => !prev);
  };

  const handleNavigateProfile = () => {
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    if (user?.role === 'staff') {
      navigate('/staff/profile');
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/profile');
    }
  };

  const navLinks = [
    { path: '/', label: 'Trang Chủ', icon: Home },
    { path: '/buysim', label: 'Kho SIM', icon: Smartphone },
    { path: '/package', label: 'Gói Cước', icon: Package },
    { path: '/store-locator', label: 'Cửa Hàng', icon: MapPin },
    { path: '/chatbot', label: 'Tư Vấn AI', icon: Bot },
    { path: '/support', label: 'Hỗ Trợ', icon: HelpCircle },
  ];

  return (
    <header className="bg-gradient-to-r from-[#EE0033] via-[#D0002C] to-[#A00022] text-white shadow-md relative z-50 border-b border-red-500/20 no-print">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

        {/* Brand & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white drop-shadow-sm">viettel</span>
                <span className="text-[#FBBF24] font-black text-lg sm:text-xl">STORE</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-red-100/90 font-extrabold tracking-widest uppercase -mt-0.5">
                AI Customer Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-white/20 text-white shadow-xs border border-white/20'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-300" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Account & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 relative" ref={dropdownRef}>
          {/* Theme Dark/Light Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            className="p-2 rounded-2xl bg-black/20 hover:bg-black/30 border border-white/20 text-yellow-300 hover:text-white transition-all cursor-pointer shadow-xs flex items-center justify-center"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-300 animate-in spin-in-90 duration-300" /> : <Moon className="w-4 h-4 text-amber-200 animate-in spin-in-90 duration-300" />}
          </button>

          {user ? (
            <>
              {/* User Profile Pill Trigger */}
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 bg-black/20 hover:bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 hover:border-white/40 transition-all cursor-pointer shadow-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 border border-white/80 flex items-center justify-center text-slate-900 font-bold shadow-md group-hover:scale-105 transition-transform text-xs overflow-hidden">
                  {(user?.anh_dai_dien || user?.avatar || user?.picture) ? (
                    <img 
                      src={user?.anh_dai_dien || user?.avatar || user?.picture} 
                      alt={user?.name || 'User'} 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    user?.name ? user.name.charAt(0).toUpperCase() : <FaUser size={13} />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] text-red-200 font-medium leading-none">Xin chào</p>
                  <p className="text-xs text-white font-bold max-w-[110px] lg:max-w-[130px] truncate leading-tight mt-0.5">
                    {user?.name || user?.ho_ten || 'Khách hàng'}
                  </p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-red-200 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Popup */}
              {showDropdown && (
                <div className="absolute right-0 top-12 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-150">
                  <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-b border-slate-100">
                    <p className="font-extrabold text-sm text-slate-900 truncate">{user?.name || user?.ho_ten}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{user?.email || 'Tài khoản Viettel'}</p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="bg-[#EE0033] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        {user?.role === 'staff' ? 'Nhân viên' : user?.role === 'admin' ? 'Quản trị' : 'Thành viên'}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Đã xác thực
                      </span>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <button
                      onClick={handleNavigateProfile}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#EE0033] hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#EE0033]" />
                      <span>Thông tin cá nhân</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/my-orders');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#EE0033] hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#EE0033]" />
                      <span>Lịch sử đơn hàng</span>
                    </button>

                    <div className="h-px bg-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/logout');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>

                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="bg-white hover:bg-red-50 !text-[#EE0033] font-black text-xs px-3.5 sm:px-4.5 py-2 rounded-xl transition-all shadow-md border border-white/90 active:scale-95 flex items-center justify-center whitespace-nowrap"
                style={{ color: '#EE0033' }}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-amber-400 hover:bg-amber-300 !text-slate-900 font-black text-xs px-3.5 sm:px-4.5 py-2 rounded-xl transition-all shadow-md border border-amber-300 active:scale-95 tracking-wide flex items-center justify-center whitespace-nowrap hidden sm:flex"
                style={{ color: '#0f172a' }}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-out Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-gradient-to-b from-[#EE0033] to-[#A00022] text-white p-6 shadow-2xl flex flex-col justify-between h-full z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">viettel</span>
                  <span className="text-amber-300 font-black text-lg">STORE</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                        isActive
                          ? 'bg-white/20 text-white shadow-sm border border-white/20'
                          : 'text-white/90 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-amber-300" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Account Action */}
            <div className="border-t border-white/20 pt-6">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 font-bold flex items-center justify-center">
                      {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-white truncate">{user?.name || user?.ho_ten}</p>
                      <p className="text-xs text-red-100 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNavigateProfile}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Trang cá nhân</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="py-3 bg-white text-[#EE0033] font-bold text-center text-xs rounded-xl shadow-md"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="py-3 bg-amber-400 text-slate-900 font-bold text-center text-xs rounded-xl shadow-md"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
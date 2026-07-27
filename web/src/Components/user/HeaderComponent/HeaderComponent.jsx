import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Zap, ChevronDown, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';

const HeaderComponent = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);
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

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowDropdown((prev) => !prev);
  };

  const handleNavigateProfile = () => {
    setShowDropdown(false);
    if (user?.role === 'staff') {
      navigate('/staff/profile');
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/profile');
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#EE0033] via-[#D0002C] to-[#A00022] text-white shadow-md relative z-50 border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            {/* <Zap className="w-8 h-8 text-[#FBBF24] fill-current drop-shadow-md group-hover:scale-110 transition-transform" /> */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tighter text-white drop-shadow-sm">viettel</span>
                <span className="text-[#FBBF24] font-black text-lg">STORE</span>
              </div>
              <p className="text-[10px] text-red-100/90 font-extrabold tracking-widest uppercase -mt-0.5">
                AI Customer Portal
              </p>
            </div>
          </Link>
        </div>

        {/* User Account & Actions */}
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          {user ? (
            <>
              {/* User Profile Pill Trigger */}
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2.5 bg-black/20 hover:bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 hover:border-white/40 transition-all cursor-pointer shadow-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 border border-white/80 flex items-center justify-center text-slate-900 font-bold shadow-md group-hover:scale-105 transition-transform text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser size={13} />}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] text-red-200 font-medium leading-none">Xin chào</p>
                  <p className="text-xs text-white font-bold max-w-[130px] truncate leading-tight mt-0.5">
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
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="bg-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-[0_4px_0_#cbd5e1] hover:shadow-[0_6px_0_#94a3b8] hover:-translate-y-0.5 active:shadow-none active:translate-y-0.5 border border-slate-100"
                style={{ color: '#EE0033' }}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-[#FBBF24] text-slate-900 font-black text-xs px-4 py-2 rounded-xl transition-all shadow-[0_4px_0_#d97706] hover:shadow-[0_6px_0_#b45309] hover:-translate-y-0.5 active:shadow-none active:translate-y-0.5"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
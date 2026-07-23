import React, { useState, useRef, useEffect } from 'react'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { ArrowLeft, User, LogOut } from 'lucide-react'
import { useSelector } from 'react-redux'

const HeaderComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const user = useSelector((state) => state.auth.user)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowDropdown((prev) => !prev)
  }

  const handleNavigateProfile = () => {
    setShowDropdown(false)
    if (user?.role === 'staff') {
      navigate('/staff/profile')
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard')
    } else {
      navigate('/profile')
    }
  }

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-md relative z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Back Button & Logo - Trái */}
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center">
            {!isHomePage && (
              <button
                onClick={() => navigate(-1)}
                className="mr-4 w-9 h-9 flex items-center justify-center text-white bg-red-800/30 hover:bg-red-800/60 border border-red-500/30 rounded-full transition-all cursor-pointer"
                title="Quay lại"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="text-2xl font-bold text-white">⚡</div>
              <h1 className="text-xl font-bold text-white hidden sm:block">Viettel Store</h1>
            </Link>
          </div>

          {/* Branch Selector */}
          <div className="hidden md:flex items-center bg-red-700/50 rounded-lg px-3 py-1.5 border border-red-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-100 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <select className="bg-transparent text-[#212529] text-sm focus:outline-none cursor-pointer appearance-none outline-none font-medium">
              <option className="text-gray-900" value="all">Tất cả chi nhánh (63 Tỉnh/Thành)</option>
              <option className="text-gray-900" value="hanoi">Hà Nội</option>
              <option className="text-gray-900" value="hcm">TP. Hồ Chí Minh</option>
              <option className="text-gray-900" value="danang">Đà Nẵng</option>
              <option className="text-gray-900" value="cantho">Cần Thơ</option>
            </select>
          </div>
        </div>

        {/* User Menu - Phải */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* User Profile Trigger */}
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-red-500/40 transition-all cursor-pointer border border-transparent hover:border-red-400/30"
          >
            <div className="text-right">
              <p className="text-xs text-red-100 font-medium">Xin chào</p>
              <p className="text-sm text-white font-bold">{user?.name || user?.ho_ten || 'Khách'}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white shadow-sm">
              <FaUser size={16} />
            </div>
          </button>

          {/* Dropdown Menu Popup */}
          {showDropdown && user && (
            <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
              <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
                <p className="font-extrabold text-sm text-gray-900">{user?.name || user?.ho_ten}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'Tài khoản Viettel'}</p>
                <span className="mt-2 inline-block bg-[#EE0033] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {user?.role === 'staff' ? 'Nhân viên' : user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                </span>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={handleNavigateProfile}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:text-[#EE0033] hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#EE0033]" />
                  <span>Thông tin cá nhân</span>
                </button>

                <div className="h-px bg-gray-100 my-1"></div>

                <button
                  onClick={() => {
                    setShowDropdown(false)
                    navigate('/logout')
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-[#EE0033] hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-gray-400" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}

          {/* Direct Logout shortcut */}
          {user && (
            <Link
              to="/logout"
              className="p-2 text-white hover:text-red-100 hover:bg-red-500/40 rounded-lg transition-colors flex items-center justify-center border-l border-red-500/30 pl-3"
              title="Đăng xuất"
            >
              <FaSignOutAlt size={18} />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default HeaderComponent
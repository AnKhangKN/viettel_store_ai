import React from 'react'
import { FaUser, FaSignOutAlt, FaBell } from 'react-icons/fa'

const HeaderComponent = () => {
  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo - Trái */}
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-white">⚡</div>
          <h1 className="text-xl font-bold text-white">Viettel Store</h1>
        </div>

        {/* User Menu - Phải */}
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <button className="relative p-2 text-white hover:text-red-100 hover:bg-red-500 rounded-lg transition-colors">
            <FaBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-red-500">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Xin chào</p>
              <p className="text-xs text-red-100">Vy</p>
            </div>
            <button className="p-2 text-white hover:text-red-100 hover:bg-red-500 rounded-lg transition-colors">
              <FaUser size={20} />
            </button>
          </div>

          {/* Logout */}
          <button className="p-2 text-white hover:text-red-100 hover:bg-red-500 rounded-lg transition-colors" title="Đăng xuất">
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default HeaderComponent
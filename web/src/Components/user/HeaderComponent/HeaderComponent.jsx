import React, { useState, useEffect } from 'react'
import { FaUser, FaSignOutAlt, FaBell } from 'react-icons/fa'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const HeaderComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Mock fetch for notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/notifications/')
        const data = await res.json()
        if (data.status === 'success') {
          setNotifications(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err)
      }
    }
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Back Button & Logo - Trái */}
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center">
            {!isHomePage && (
              <button 
                onClick={() => navigate(-1)} 
                className="mr-4 w-9 h-9 flex items-center justify-center text-white bg-red-800/30 hover:bg-red-800/60 border border-red-500/30 rounded-full transition-all"
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
            <select className="bg-transparent text-white text-sm focus:outline-none cursor-pointer appearance-none outline-none font-medium">
              <option className="text-gray-900" value="all">Tất cả chi nhánh (63 Tỉnh/Thành)</option>
              <option className="text-gray-900" value="hanoi">Hà Nội</option>
              <option className="text-gray-900" value="hcm">TP. Hồ Chí Minh</option>
              <option className="text-gray-900" value="danang">Đà Nẵng</option>
              <option className="text-gray-900" value="cantho">Cần Thơ</option>
            </select>
          </div>
        </div>

        {/* User Menu - Phải */}
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              className="relative p-2 text-white hover:text-red-100 hover:bg-red-500 rounded-lg transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold flex items-center justify-center bg-yellow-400 text-red-900 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800">Thông báo của bạn</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Không có thông báo nào.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notif.is_read ? 'bg-red-50/50' : ''}`}>
                        <h4 className="text-sm font-semibold text-gray-800">{notif.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                        <span className="text-[10px] text-gray-400 mt-2 block">
                          {new Date(notif.created_at).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
          <Link 
            to="/logout"
            className="p-2 text-white hover:text-red-100 hover:bg-red-500 rounded-lg transition-colors flex items-center justify-center" 
            title="Đăng xuất"
          >
            <FaSignOutAlt size={20} />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default HeaderComponent
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../api/auth/auth.api';
import { clearCredentials } from '../../../features/auth/authSlice';

const LogoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } catch (err) {
        console.error("Lỗi đăng xuất API:", err);
      } finally {
        localStorage.removeItem("staff_active_booth");
        dispatch(clearCredentials());
      }
    };
    handleLogout();
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden p-4">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#EE0033] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100 p-8 md:p-12 text-center">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-4 drop-shadow-sm">Đăng Xuất Thành Công</h2>
        <p className="text-gray-500 text-base mb-8">
          Bạn đã đăng xuất khỏi hệ thống an toàn. Hẹn gặp lại bạn sớm!
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#EE0033] text-white font-black py-4 rounded-2xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:shadow-[0_0px_0_#A00022] active:translate-y-1 transition-all duration-200 text-lg"
          >
            Đăng Nhập Lại
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white border-2 border-gray-200 text-gray-800 font-bold py-4 rounded-2xl shadow-[0_4px_0_#e5e7eb] hover:shadow-[0_6px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 hover:border-gray-300 transition-all"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;

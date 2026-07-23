import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../../../api/auth/auth.api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../features/auth/authSlice';
import { decodeToken } from '../../../utils/jwt';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      if (res.success && res.data) {
        const { accessToken, user } = res.data;
        const decoded = decodeToken(accessToken);
        const role = decoded?.quyen || 'user';

        localStorage.removeItem("staff_active_booth");
        dispatch(setCredentials({
          accessToken,
          user: { ...user, role }
        }));

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'staff') {
          navigate('/staff/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message || 'Đăng nhập không thành công.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden p-4">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#EE0033] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="flex w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100">

        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-5/12 flex-col justify-center items-start text-left p-16 bg-gradient-to-br from-[#EE0033] to-[#A00022] text-white relative overflow-hidden">
          {/* Glassmorphism decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center mb-10 opacity-90">
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-white mr-2" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 L 15 85 L 15 50 A 35 35 0 0 1 50 15 Z" />
              </svg>
              <h1 className="text-4xl font-black tracking-tighter drop-shadow-md">viettel</h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight drop-shadow-lg">Đăng Nhập <br />Hệ Thống</h2>
            <p className="text-lg text-white/90 max-w-sm leading-relaxed mb-12">
              Quản lý gói cước, mua SIM và trải nghiệm hệ sinh thái dịch vụ số thông minh nhất.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-lg">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-sm font-bold text-sm">✓</div>
                <span className="font-medium text-white/95">Quản lý đơn hàng dễ dàng</span>
              </div>
              <div className="flex items-center gap-4 text-lg">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-sm font-bold text-sm">✓</div>
                <span className="font-medium text-white/95">Hỗ trợ AI tư vấn 24/7</span>
              </div>
              <div className="flex items-center gap-4 text-lg">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-sm font-bold text-sm">✓</div>
                <span className="font-medium text-white/95">Bảo mật giao dịch tối đa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-16 lg:px-24 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại! 👋</h2>
            <p className="text-gray-500 text-base">Vui lòng đăng nhập để tiếp tục quản lý tài khoản</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-[#EE0033] border border-red-200 px-5 py-4 rounded-2xl text-sm font-bold animate-fade-in-up">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ví dụ: viettel@gmail.com"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#EE0033] focus:bg-white transition-all text-gray-800 font-medium placeholder-gray-400"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mật Khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 pr-14 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#EE0033] focus:bg-white transition-all text-gray-800 font-medium placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EE0033] transition-colors text-xl"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-2">
              <a
                href="/forget-password"
                className="text-sm text-[#EE0033] hover:text-[#A00022] font-bold transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EE0033] text-white font-black py-4 rounded-2xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:shadow-[0_0px_0_#A00022] active:translate-y-1 transition-all duration-200 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Hoặc tiếp tục với</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="flex items-center justify-center w-full bg-white border-2 border-gray-200 text-gray-800 font-bold py-4 rounded-2xl shadow-[0_4px_0_#e5e7eb] hover:shadow-[0_6px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 hover:border-gray-300 transition-all mb-4"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6 mr-3" />
              Đăng nhập bằng Google
            </button>

            {/* Register Link */}
            <div className="text-center mt-6">
              <span className="text-gray-500 font-medium mr-2">Chưa có tài khoản?</span>
              <a
                href="/register"
                className="text-[#EE0033] font-bold hover:text-[#A00022] transition-colors"
              >
                Tạo tài khoản mới
              </a>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-sm font-medium text-gray-400 mt-10">
            © 2026 Viettel Store AI | <a href="#" className="hover:text-gray-600 transition">Bảo mật & Riêng tư</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
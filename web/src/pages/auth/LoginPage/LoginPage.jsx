import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center text-center pr-8">
        <div className="text-7xl font-black text-red-600 mb-6">⚡</div>
        <h1 className="text-5xl font-bold text-red-700 mb-4">Viettel Store</h1>
        <p className="text-xl text-gray-700 max-w-sm leading-relaxed">
          Hệ thống quản lý gói cước, mua SIM và dịch vụ Viettel hiện đại, thông minh
        </p>
        <div className="mt-12 space-y-3 text-left">
          <div className="flex items-center gap-3 text-lg">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700">Quản lý đơn hàng dễ dàng</span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700">Hỗ trợ AI 24/7</span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700">Giao dịch nhanh chóng</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng Nhập</h2>
            <p className="text-gray-500">Quản lý tài khoản Viettel Store của bạn</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            // Navigate to home page after successful login
            navigate('/');
          }} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-all text-gray-700 hover:border-gray-300"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Mật Khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-all text-gray-700 hover:border-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors text-lg"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="/forget-password"
                className="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 rounded-xl hover:from-red-700 hover:to-red-800 hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
            >
              Đăng Nhập
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Chưa có tài khoản?</span>
              </div>
            </div>

            {/* Register Link */}
            <a
              href="/register"
              className="block w-full text-center bg-gray-100 text-gray-800 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Đăng Ký Tài Khoản
            </a>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-8">
            © 2026 Viettel Store AI | Bảo mật & Riêng tư
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
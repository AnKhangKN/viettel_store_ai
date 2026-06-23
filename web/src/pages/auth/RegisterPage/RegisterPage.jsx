import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) {
      alert('Vui lòng đồng ý với điều khoản sử dụng');
      return;
    }
    console.log('Register:', formData);
    // Navigate to login page after successful registration
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-700 mb-2">Viettel Store</h1>
          <p className="text-gray-600">Tạo tài khoản để bắt đầu</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Title */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Đăng Ký Tài Khoản</h2>
            <p className="text-gray-500 text-base">Cung cấp thông tin để tạo tài khoản Viettel Store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Họ và Tên
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-all text-gray-700 hover:border-gray-300"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-all text-gray-700 hover:border-gray-300"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Số Điện Thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-all text-gray-700 hover:border-gray-300"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Địa Chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-all text-gray-700 hover:border-gray-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Mật Khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              <p className="text-xs text-gray-500 mt-2">Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Xác Nhận Mật Khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-all text-gray-700 hover:border-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors text-lg"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 p-5 bg-red-50 rounded-xl border-2 border-red-200">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-red-600 border-2 border-red-300 rounded focus:ring-2 focus:ring-red-500 cursor-pointer"
              />
              <label htmlFor="agree" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                Tôi đồng ý với{' '}
                <a href="#" className="text-red-600 font-semibold hover:underline">
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="#" className="text-red-600 font-semibold hover:underline">
                  Chính sách bảo mật
                </a>{' '}
                của Viettel Store
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 rounded-xl hover:from-red-700 hover:to-red-800 hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
            >
              Tạo Tài Khoản
            </button>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Đã có tài khoản?</span>
              </div>
            </div>

            {/* Login Link */}
            <a
              href="/login"
              className="block w-full text-center bg-gray-100 text-gray-800 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Đăng nhập
            </a>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-10">
            © 2026 Viettel Store AI | Bảo mật & Riêng tư
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
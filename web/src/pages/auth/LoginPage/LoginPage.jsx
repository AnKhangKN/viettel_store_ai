import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import { login, googleLogin } from '../../../api/auth/auth.api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../features/auth/authSlice';
import { decodeToken } from '../../../utils/jwt';
import GoogleLoginButton from '../../../components/common/GoogleLoginButton/GoogleLoginButton';


const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requireOtpEmail, setRequireOtpEmail] = useState('');


  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    setError('');
    try {
      const res = await googleLogin({ accessToken: tokenResponse.access_token });
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
        setError(res.message || 'Đăng nhập Google không thành công.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đăng nhập bằng Google.');
    } finally {
      setLoading(false);
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (err) => {
      console.error("Google Login Error:", err);
      setError("Đã hủy hoặc xảy ra lỗi khi đăng nhập bằng Google.");
    }
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRequireOtpEmail('');
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
        const status = res?.status || res?.code;
        const message = res?.message || res?.detail || 'Đăng nhập không thành công.';
        if (status === 401) {
          setError('Sai email hoặc mật khẩu. Vui lòng kiểm tra lại.');
        } else if (status === 404) {
          setError('Không tìm thấy tài khoản. Có thể bạn chưa đăng ký.');
        } else {
          setError(message);
        }
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message || err.response?.data?.detail;
      let msg = serverMessage || err.message || 'Có lỗi xảy ra trong quá trình đăng nhập.';

      if (status === 401) {
        msg = serverMessage || 'Sai email hoặc mật khẩu. Vui lòng kiểm tra lại.';
      } else if (status === 404) {
        msg = serverMessage || 'Không tìm thấy tài khoản. Có thể bạn chưa đăng ký.';
      } else if (status === 403 || err.response?.data?.details?.require_otp) {
        setRequireOtpEmail(email);
      }

      setError(msg);
      if (status === 403 || err.response?.data?.details?.require_otp) {
        setRequireOtpEmail(email);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden p-4">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#EE0033] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="flex w-full max-w-lg md:max-w-6xl bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100 my-4 sm:my-8">

        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-5/12 flex-col justify-between p-10 lg:p-16 bg-gradient-to-br from-[#EE0033] to-[#A00022] text-white relative overflow-hidden">
          {/* Glassmorphism decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center mb-8 opacity-90 cursor-pointer" onClick={() => navigate('/')}>
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-white mr-2" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 L 15 85 L 15 50 A 35 35 0 0 1 50 15 Z" />
              </svg>
              <h1 className="text-3xl font-black tracking-tighter drop-shadow-md">viettel</h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight drop-shadow-lg">Chào Mừng <br />Trở Lại</h2>
            <p className="text-lg text-white/90 max-w-sm leading-relaxed mb-8">
              Trải nghiệm dịch vụ viễn thông thông minh, quản lý gói cước và đặt số thứ tự ưu tiên với AI.
            </p>
          </div>

          <div className="relative z-10 space-y-4 text-sm font-medium opacity-90 border-t border-white/20 pt-6">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="font-medium text-white/95">Đăng nhập nhanh với Google OAuth</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="font-medium text-white/95">Bảo mật giao dịch tối đa</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 md:p-14 lg:px-20 flex flex-col justify-center bg-white">
          <div className="mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Chào mừng trở lại! 👋</h2>
            <p className="text-gray-500 text-xs sm:text-base">Vui lòng đăng nhập để tiếp tục quản lý tài khoản</p>
          </div>


          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-[#EE0033] border-2 border-red-200 px-5 py-4 rounded-2xl text-sm font-bold animate-fade-in-up flex items-start space-x-3">
                <FaExclamationCircle className="text-xl flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{error}</span>
                  {requireOtpEmail && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => navigate('/verify-otp', { state: { email: requireOtpEmail } })}
                        className="bg-[#EE0033] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#a00022] transition-colors text-xs inline-block shadow-md cursor-pointer"
                      >
                        Xác Thực Email Ngay →
                      </button>
                    </div>
                  )}
                </div>
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
              <Link
                to="/forget-password"
                className="text-sm text-[#EE0033] hover:text-[#A00022] font-bold transition-colors cursor-pointer"
              >
                Quên mật khẩu?
              </Link>
            </div>


            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[56px] flex items-center justify-center bg-[#EE0033] text-white font-black px-6 py-3 rounded-2xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:shadow-[0_0px_0_#A00022] active:translate-y-1 transition-all duration-200 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed whitespace-normal"
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
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={(err) => {
                console.error("Google Login Error:", err);
                setError("Đã hủy hoặc xảy ra lỗi khi đăng nhập bằng Google.");
              }}
              loading={loading}
              text="Đăng nhập bằng Google"
            />


            {/* Register Link */}
            <div className="text-center mt-6">
              <span className="text-gray-500 font-medium mr-2">Chưa có tài khoản?</span>
              <Link
                to="/register"
                className="text-[#EE0033] font-extrabold hover:text-[#A00022] underline underline-offset-4 transition-colors"
              >
                Đăng ký tài khoản mới
              </Link>
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
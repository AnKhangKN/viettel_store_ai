import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaRedoAlt, FaCheckCircle } from 'react-icons/fa';
import { verifyOtp, resendOtp } from '../../../api/auth/auth.api';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  // Cooldown timer cho nút Gửi lại mã
  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động chuyển focus sang ô tiếp theo
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    if (!email) {
      setError('Thiếu thông tin Email. Vui lòng quay lại trang Đăng ký.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await verifyOtp(email, otpCode, 'REGISTER');
      if (res.success) {
        setVerifiedSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(res.message || 'Xác thực không thành công.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || resendLoading) return;
    if (!email) {
      setError('Vui lòng nhập địa chỉ Email để gửi lại mã.');
      return;
    }

    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await resendOtp(email, 'REGISTER');
      if (res.success) {
        setMessage('Mã OTP mới đã được gửi về Email của bạn!');
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
      } else {
        setError(res.message || 'Không thể gửi lại mã OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi gửi lại mã OTP. Vui lòng thử lại sau.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden p-4">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#EE0033] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="flex w-full max-w-lg md:max-w-5xl bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100 my-4 sm:my-8">
        
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-5/12 flex-col justify-center items-start text-left p-10 lg:p-12 bg-gradient-to-br from-[#EE0033] to-[#A00022] text-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-8 opacity-90 cursor-pointer" onClick={() => navigate('/')}>
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-white mr-2" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 L 15 85 L 15 50 A 35 35 0 0 1 50 15 Z" />
              </svg>
              <h1 className="text-3xl font-black tracking-tighter drop-shadow-md">viettel</h1>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black mb-4 leading-tight drop-shadow-lg">Xác Thực <br/>Tài Khoản</h2>
            <p className="text-base text-white/90 max-w-sm leading-relaxed">
              Nhập mã 6 chữ số gửi về Email của bạn để hoàn tất kích hoạt tài khoản Viettel Store.
            </p>
          </div>
        </div>

        {/* Right Side - Verification Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 md:p-12 lg:px-16 flex flex-col justify-center bg-white relative">
          
          <button onClick={() => navigate('/login')} className="relative sm:absolute sm:top-6 sm:left-8 mb-4 sm:mb-0 text-gray-500 hover:text-[#EE0033] transition flex items-center font-bold text-xs sm:text-sm cursor-pointer z-20">
            <FaArrowLeft className="mr-2" /> Quay lại Đăng nhập
          </button>


          {verifiedSuccess ? (
            <div className="animate-fade-in-up text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-5xl text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3">Xác Thực Thành Công!</h2>
              <p className="text-gray-600 text-lg mb-6">Tài khoản của bạn đã được kích hoạt thành công.</p>
              <p className="text-sm text-gray-400">Đang tự động chuyển hướng đến trang Đăng nhập...</p>
            </div>
          ) : (
            <div className="animate-fade-in-up mt-8">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <FaShieldAlt className="text-3xl text-[#EE0033]" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">Nhập Mã Xác Thực OTP</h2>
              <p className="text-gray-500 text-base mb-2">
                Mã xác thực đã được gửi đến địa chỉ Email: <br/>
                <span className="font-bold text-[#EE0033]">{email || 'của bạn'}</span>
              </p>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl mb-6 inline-block font-medium">
                ⏱️ Mã OTP có hiệu lực trong <strong>10 phút</strong> kể từ khi phát hành.
              </p>


              {error && (
                <div className="bg-red-50 text-[#EE0033] border border-red-200 px-5 py-3 rounded-2xl text-sm font-bold mb-6 animate-fade-in-up">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 text-green-700 border border-green-200 px-5 py-3 rounded-2xl text-sm font-bold mb-6 animate-fade-in-up">
                  {message}
                </div>
              )}

              {!email && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn..."
                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#EE0033] focus:bg-white outline-none transition-all text-gray-800"
                  />
                </div>
              )}

              <form onSubmit={handleVerifySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Mã OTP (6 chữ số)</label>
                  <div className="flex justify-between gap-1.5 sm:gap-3 max-w-sm mx-auto">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#EE0033] focus:bg-white outline-none transition-all text-gray-900 shadow-sm"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#EE0033] text-white font-black py-4 rounded-2xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_0px_0_#A00022] transition-all text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xác thực...' : 'Xác Nhận Kích Hoạt'}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <p className="text-gray-500 text-sm mb-3">Bạn chưa nhận được mã xác thực?</p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || resendLoading}
                  className="inline-flex items-center text-sm font-bold text-[#EE0033] hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer"
                >
                  <FaRedoAlt className={`mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
                  {canResend ? 'Gửi lại mã OTP' : `Gửi lại mã sau (${countdown}s)`}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

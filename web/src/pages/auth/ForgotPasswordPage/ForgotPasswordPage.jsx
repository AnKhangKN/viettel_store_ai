import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaKey, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { forgotPassword, verifyOtp, resetPassword } from '../../../api/auth/auth.api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Vui lòng nhập Email của bạn.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setMessage('Mã OTP khôi phục đã được gửi về Email của bạn!');
        setStep(2);
      } else {
        setError(res.message || 'Không thể gửi mã khôi phục.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email này chưa được đăng ký trong hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await verifyOtp(email, code, 'FORGOT_PASSWORD');
      if (res.success) {
        setMessage('Mã OTP chính xác! Vui lòng nhập mật khẩu mới.');
        setStep(3);
      } else {
        setError(res.message || 'Mã OTP không chính xác.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    const code = otp.join('');
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await resetPassword(email, code, newPassword);
      if (res.success) {
        alert('Đổi mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.');
        navigate('/login');
      } else {
        setError(res.message || 'Đổi mật khẩu thất bại.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động nhảy sang ô nhập tiếp theo
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden p-4">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#EE0033] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="flex w-full max-w-lg md:max-w-6xl bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100 my-4 sm:my-8">
        
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-5/12 flex-col justify-center items-start text-left p-10 lg:p-16 bg-gradient-to-br from-[#EE0033] to-[#A00022] text-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-10 opacity-90 cursor-pointer" onClick={() => navigate('/')}>
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-white mr-2" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 L 15 85 L 15 50 A 35 35 0 0 1 50 15 Z" />
              </svg>
              <h1 className="text-4xl font-black tracking-tighter drop-shadow-md">viettel</h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight drop-shadow-lg">Khôi Phục <br/>Mật Khẩu</h2>
            <p className="text-lg text-white/90 max-w-sm leading-relaxed">
              Bảo mật tài khoản tuyệt đối với hệ thống xác nhận danh tính qua Email OTP.
            </p>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 md:p-14 lg:px-20 flex flex-col justify-center bg-white relative">
          
          <button onClick={() => navigate('/login')} className="relative sm:absolute sm:top-8 sm:left-8 mb-4 sm:mb-0 text-gray-500 hover:text-[#EE0033] transition flex items-center font-bold text-xs sm:text-sm cursor-pointer z-20">
            <FaArrowLeft className="mr-2" /> Quay lại
          </button>


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

          {step === 1 && (
            <div className="animate-fade-in-up">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <FaEnvelope className="text-2xl text-[#EE0033]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Quên Mật Khẩu?</h2>
              <p className="text-gray-500 text-base mb-8">Hãy nhập email đã đăng ký, chúng tôi sẽ gửi mã xác thực 6 số (OTP) cho bạn.</p>

              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ví dụ: viettel@gmail.com"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#EE0033] focus:bg-white transition-all text-gray-800 font-medium placeholder-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[56px] flex items-center justify-center bg-[#EE0033] text-white font-black px-6 py-3 rounded-2xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:translate-y-1 transition-all duration-200 text-lg cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Đang gửi mã...' : 'Nhận Mã Xác Thực (OTP)'}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <FaKey className="text-2xl text-[#EE0033]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Nhập Mã Xác Thực</h2>
              <p className="text-gray-500 text-base mb-2">Chúng tôi vừa gửi mã gồm 6 chữ số đến email <span className="font-bold text-gray-800">{email}</span></p>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl mb-6 inline-block font-medium">
                ⏱️ Mã OTP có hiệu lực trong <strong>10 phút</strong> kể từ khi phát hành.
              </p>


              <form onSubmit={handleVerifyOTP} className="space-y-8">
                <div className="flex justify-between gap-1.5 sm:gap-3 max-w-sm mx-auto">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#EE0033] focus:bg-white transition-all text-gray-800 outline-none"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[56px] flex items-center justify-center bg-[#EE0033] text-white font-black px-6 py-3 rounded-2xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:translate-y-1 transition-all duration-200 text-lg cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Đang xác thực...' : 'Xác Nhận Mã OTP'}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <FaLock className="text-2xl text-[#EE0033]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo Mật Khẩu Mới</h2>
              <p className="text-gray-500 text-base mb-8">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mật Khẩu Mới</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 pr-14 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#EE0033] focus:bg-white transition-all text-gray-800 font-medium placeholder-gray-400"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EE0033] transition-colors text-xl">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Xác Nhận Mật Khẩu Mới</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#EE0033] focus:bg-white transition-all text-gray-800 font-medium placeholder-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[56px] flex items-center justify-center bg-[#EE0033] text-white font-black px-6 py-3 rounded-2xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:translate-y-1 transition-all duration-200 text-lg cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
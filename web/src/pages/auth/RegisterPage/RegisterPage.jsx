import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle, FaFacebook } from 'react-icons/fa';
import { register } from '../../../api/auth/auth.api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setError('Vui lòng đồng ý với điều khoản sử dụng');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await register(
        formData.fullName,
        formData.phone,
        formData.email,
        formData.password
      );
      if (res.success) {
        setStep(2);
      } else {
        setError(res.message || 'Đăng ký không thành công.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đăng ký.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden p-4">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#EE0033] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="flex w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100 h-[85vh] lg:h-auto min-h-[700px]">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:flex w-5/12 flex-col justify-center items-start text-left p-16 bg-gradient-to-br from-[#EE0033] to-[#A00022] text-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-10 opacity-90 cursor-pointer" onClick={() => navigate('/')}>
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-white mr-2" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 L 15 85 L 15 50 A 35 35 0 0 1 50 15 Z" />
              </svg>
              <h1 className="text-4xl font-black tracking-tighter drop-shadow-md">viettel</h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight drop-shadow-lg">Mở Khóa <br/>Đặc Quyền</h2>
            <p className="text-lg text-white/90 max-w-sm leading-relaxed mb-12">
              Trở thành thành viên Viettel Store để nhận ngay hàng ngàn ưu đãi Data và cước gọi độc quyền.
            </p>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="w-full lg:w-7/12 p-8 md:p-12 lg:px-16 flex flex-col justify-center bg-white overflow-y-auto relative">
          
          <button onClick={() => navigate('/login')} className="absolute top-6 left-8 text-gray-400 hover:text-[#EE0033] transition flex items-center font-medium z-20">
            <FaArrowLeft className="mr-2" /> Quay lại Đăng Nhập
          </button>

          {step === 1 && (
            <div className="animate-fade-in-up mt-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo Tài Khoản Mới</h2>
                <p className="text-gray-500 text-base">Đăng ký nhanh chóng để trải nghiệm dịch vụ</p>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button type="button" className="flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-2xl hover:border-gray-300 transition-all shadow-sm">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Google
                </button>
                <button type="button" className="flex items-center justify-center bg-[#1877F2] text-white font-bold py-3 rounded-2xl hover:bg-[#166fe5] transition-all shadow-sm">
                  <FaFacebook className="w-5 h-5 mr-2" />
                  Facebook
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500 font-medium">Hoặc đăng ký bằng Email</span></div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5 pb-8">
                {error && (
                  <div className="bg-red-50 text-[#EE0033] border border-red-200 px-5 py-4 rounded-2xl text-sm font-bold animate-fade-in-up">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ và Tên</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#EE0033] focus:bg-white outline-none transition-all text-gray-800" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="098..." className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#EE0033] focus:bg-white outline-none transition-all text-gray-800" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@viettel.com" className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#EE0033] focus:bg-white outline-none transition-all text-gray-800" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mật Khẩu</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full px-5 pr-12 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#EE0033] focus:bg-white outline-none transition-all text-gray-800" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EE0033] text-lg">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Xác nhận Mật Khẩu</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full px-5 pr-12 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#EE0033] focus:bg-white outline-none transition-all text-gray-800" required />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-2 bg-red-50 p-4 rounded-xl border border-red-100">
                  <input type="checkbox" id="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#EE0033] border-gray-300 rounded cursor-pointer" />
                  <label htmlFor="agree" className="text-sm text-gray-600 cursor-pointer">
                    Tôi đồng ý với <span className="text-[#EE0033] font-bold hover:underline">Điều khoản</span> và <span className="text-[#EE0033] font-bold hover:underline">Chính sách bảo mật</span> của Viettel Store
                  </label>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#EE0033] text-white font-black py-4 rounded-2xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_0px_0_#A00022] transition-all text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Đang đăng ký...' : 'Tiếp Tục'}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up flex flex-col justify-center h-full">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <FaCheckCircle className="text-3xl text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng Ký Thành Công!</h2>
              <p className="text-gray-500 text-base mb-8 leading-relaxed">
                Tài khoản của bạn đã được tạo thành công với email <br/>
                <span className="font-bold text-[#EE0033]">{formData.email}</span>. Vui lòng tiến hành đăng nhập để trải nghiệm dịch vụ.
              </p>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-[#EE0033] text-white font-black py-4 rounded-2xl shadow-[0_6px_0_#A00022] hover:-translate-y-1 active:translate-y-1 transition-all text-lg flex items-center justify-center cursor-pointer"
              >
                Đăng Nhập Ngay
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
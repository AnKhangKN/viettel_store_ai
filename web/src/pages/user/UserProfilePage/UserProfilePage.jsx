import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../../features/auth/authSlice';
import { updateProfile, changePassword } from '../../../api/user/user.api';
import { User, Phone, MapPin, CreditCard, Mail, Edit2, Check, X, Loader2, Lock, KeyRound, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    cccd: '',
    dia_chi: ''
  });

  const [passData, setPassData] = useState({
    mat_khau_cu: '',
    mat_khau_moi: '',
    xac_nhan_mat_khau: ''
  });
  const [isPassLoading, setIsPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        ho_ten: user.name || user.ho_ten || '',
        so_dien_thoai: user.phone || user.so_dien_thoai || '',
        email: user.email || '',
        cccd: user.cccd || '',
        dia_chi: user.dia_chi || user.address || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      await updateProfile({
        ho_ten: formData.ho_ten,
        so_dien_thoai: formData.so_dien_thoai,
        email: formData.email,
        cccd: formData.cccd,
        dia_chi: formData.dia_chi
      });
      
      dispatch(setCredentials({ 
        user: { 
          ...user, 
          name: formData.ho_ten,
          phone: formData.so_dien_thoai,
          email: formData.email,
          cccd: formData.cccd,
          dia_chi: formData.dia_chi
        } 
      }));
      
      setMessage({ text: 'Cập nhật thông tin thành công!', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMessage({ text: '', type: '' });

    if (passData.mat_khau_moi.length < 6) {
      setPassMessage({ text: 'Mật khẩu mới phải có ít nhất 6 ký tự', type: 'error' });
      return;
    }

    if (passData.mat_khau_moi !== passData.xac_nhan_mat_khau) {
      setPassMessage({ text: 'Xác nhận mật khẩu mới không khớp', type: 'error' });
      return;
    }

    setIsPassLoading(true);
    try {
      await changePassword({
        mat_khau_cu: passData.mat_khau_cu,
        mat_khau_moi: passData.mat_khau_moi
      });

      setPassMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
      setPassData({ mat_khau_cu: '', mat_khau_moi: '', xac_nhan_mat_khau: '' });
    } catch (error) {
      setPassMessage({ text: error.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ.', type: 'error' });
    } finally {
      setIsPassLoading(false);
    }
  };

  const avatarUrl = user?.anh_dai_dien || user?.avatar || user?.picture;
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen py-10 pb-20 text-slate-800 font-sans antialiased">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-[#EE0033] border border-red-100 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Quản lý tài khoản
          </span>
          <h1 className="text-3xl font-black text-slate-900">HỒ SƠ CÁ NHÂN</h1>
          <p className="text-slate-500 text-xs mt-1">Cập nhật thông tin chính chủ và bảo mật tài khoản của bạn</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xs overflow-hidden border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3">
            
            {/* Left Sidebar - Profile Avatar Overview */}
            <div className="bg-gradient-to-br from-red-50 via-white to-orange-50/40 p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="relative group mb-4">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#EE0033] to-[#A00022] p-1 shadow-md">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white text-[#EE0033] font-black text-4xl">
                    {avatarUrl && !imageError ? (
                      <img 
                        src={avatarUrl} 
                        alt={formData.ho_ten} 
                        className="w-full h-full object-cover rounded-full"
                        onError={() => setImageError(true)}
                      />
                    ) : formData.ho_ten ? (
                      formData.ho_ten.charAt(0).toUpperCase()
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-black text-slate-900">{formData.ho_ten || 'Khách hàng Viettel'}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{formData.email || 'Chưa cập nhật email'}</p>
              
              <div className="mt-3 flex items-center gap-1.5">
                <span className="bg-[#EE0033] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                  Thành viên Viettel
                </span>
              </div>
            </div>

            {/* Right Content - Form */}
            <div className="p-6 sm:p-8 md:col-span-2">
              
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <User className="text-[#EE0033] w-5 h-5" />
                  Thông tin cá nhân
                </h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-xs font-extrabold text-[#EE0033] hover:bg-red-50 px-3.5 py-1.5 rounded-xl border border-red-100 transition cursor-pointer"
                  >
                    <Edit2 size={14} />
                    Chỉnh sửa
                  </button>
                )}
              </div>

              {message.text && (
                <div className={`mb-5 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {message.type === 'success' ? <Check size={16} /> : <X size={16} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Họ và tên */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <User size={13} className="text-slate-400" /> Họ và tên
                    </label>
                    <input
                      type="text"
                      name="ho_ten"
                      value={formData.ho_ten}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition disabled:opacity-75 outline-none"
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400" /> Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="so_dien_thoai"
                      value={formData.so_dien_thoai}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition disabled:opacity-75 outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail size={13} className="text-slate-400" /> Email liên hệ
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition disabled:opacity-75 outline-none"
                    />
                  </div>

                  {/* CCCD */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <CreditCard size={13} className="text-slate-400" /> Số CCCD / CMND
                    </label>
                    <input
                      type="text"
                      name="cccd"
                      value={formData.cccd}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition disabled:opacity-75 outline-none"
                    />
                  </div>

                  {/* Địa chỉ */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400" /> Địa chỉ thường trú
                    </label>
                    <textarea
                      name="dia_chi"
                      value={formData.dia_chi}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="2"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition disabled:opacity-75 outline-none resize-none"
                    ></textarea>
                  </div>

                </div>

                {isEditing && (
                  <div className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          ho_ten: user.name || user.ho_ten || '',
                          so_dien_thoai: user.phone || user.so_dien_thoai || '',
                          email: user.email || '',
                          cccd: user.cccd || '',
                          dia_chi: user.dia_chi || user.address || ''
                        });
                        setMessage({ text: '', type: '' });
                      }}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                      disabled={isLoading}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#EE0033] hover:bg-red-700 text-white font-extrabold px-6 py-2 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Đang cập nhật...
                        </>
                      ) : (
                        'Lưu thay đổi'
                      )}
                    </button>
                  </div>
                )}
              </form>

              <div className="my-8 h-px bg-slate-100"></div>

              {/* Change Password Section */}
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-4">
                  <Lock className="text-[#EE0033] w-5 h-5" />
                  Đổi mật khẩu tài khoản
                </h3>

                {passMessage.text && (
                  <div className={`mb-4 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    passMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {passMessage.type === 'success' ? <Check size={16} /> : <X size={16} />}
                    {passMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <KeyRound size={12} className="text-slate-400" /> Mật khẩu cũ
                      </label>
                      <input
                        type="password"
                        value={passData.mat_khau_cu}
                        onChange={(e) => setPassData(prev => ({ ...prev, mat_khau_cu: e.target.value }))}
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Lock size={12} className="text-slate-400" /> Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={passData.mat_khau_moi}
                        onChange={(e) => setPassData(prev => ({ ...prev, mat_khau_moi: e.target.value }))}
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Lock size={12} className="text-slate-400" /> Xác nhận mật khẩu
                      </label>
                      <input
                        type="password"
                        value={passData.xac_nhan_mat_khau}
                        onChange={(e) => setPassData(prev => ({ ...prev, xac_nhan_mat_khau: e.target.value }))}
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isPassLoading}
                      className="bg-slate-900 hover:bg-black text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isPassLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Đang lưu mật khẩu...
                        </>
                      ) : (
                        'Đổi mật khẩu'
                      )}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../../features/auth/authSlice';
import { updateProfile, changePassword } from '../../../api/user/user.api';
import { User, Phone, MapPin, CreditCard, Mail, Edit2, Check, X, Loader2, Lock, KeyRound } from 'lucide-react';

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

  return (
    <div className="bg-[#f4f5f7] py-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-500 mt-2">Quản lý thông tin cá nhân và bảo mật tài khoản của bạn</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3">
            
            {/* Left Sidebar - Profile Overview */}
            <div className="bg-gradient-to-br from-red-50 to-white p-8 border-r border-gray-100 flex flex-col items-center justify-center md:col-span-1">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#EE0033] to-[#A00022] p-1 shadow-[0_8px_20px_rgba(238,0,51,0.25)]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                    <User size={48} className="text-[#EE0033]" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                  <Edit2 size={24} className="text-white" />
                </div>
              </div>
              <h2 className="mt-6 text-xl font-bold text-gray-900 text-center">{formData.ho_ten || 'Khách hàng'}</h2>
              <span className="mt-2 bg-red-100 text-[#EE0033] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Thành viên Viettel
              </span>
            </div>

            {/* Right Content - Form */}
            <div className="p-8 md:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="text-[#EE0033]" size={24} />
                  Thông tin liên hệ
                </h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-[#EE0033] hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                  >
                    <Edit2 size={16} />
                    Chỉnh sửa
                  </button>
                )}
              </div>

              {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-[#EE0033] border border-red-200'}`}>
                  {message.type === 'success' ? <Check size={18} /> : <X size={18} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Họ và tên */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User size={14} className="text-gray-400" /> Họ và tên
                    </label>
                    <input
                      type="text"
                      name="ho_ten"
                      value={formData.ho_ten}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#EE0033]/20 focus:border-[#EE0033] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" /> Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="so_dien_thoai"
                      value={formData.so_dien_thoai}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#EE0033]/20 focus:border-[#EE0033] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#EE0033]/20 focus:border-[#EE0033] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* CCCD */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CreditCard size={14} className="text-gray-400" /> Số CCCD/CMND
                    </label>
                    <input
                      type="text"
                      name="cccd"
                      value={formData.cccd}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#EE0033]/20 focus:border-[#EE0033] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* Địa chỉ */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" /> Địa chỉ liên hệ
                    </label>
                    <textarea
                      name="dia_chi"
                      value={formData.dia_chi}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#EE0033]/20 focus:border-[#EE0033] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Actions */}
                {isEditing && (
                  <div className="pt-4 flex gap-4 justify-end border-t border-gray-100">
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
                      className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                      disabled={isLoading}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#EE0033] text-white font-bold px-8 py-2.5 rounded-xl shadow-[0_4px_0_#A00022] hover:shadow-[0_6px_0_#A00022] hover:-translate-y-0.5 active:shadow-[0_0px_0_#A00022] active:translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Đang lưu...
                        </>
                      ) : (
                        'Lưu thay đổi'
                      )}
                    </button>
                  </div>
                )}
              </form>

              {/* Divider */}
              <div className="my-8 h-px bg-gray-100"></div>

              {/* Change Password Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <Lock className="text-[#EE0033]" size={24} />
                  Bảo mật & Đổi mật khẩu
                </h3>

                {passMessage.text && (
                  <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${passMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-[#EE0033] border border-red-200'}`}>
                    {passMessage.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    {passMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <KeyRound size={14} className="text-gray-400" /> Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        value={passData.mat_khau_cu}
                        onChange={(e) => setPassData(prev => ({ ...prev, mat_khau_cu: e.target.value }))}
                        required
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#EE0033]/20 focus:border-[#EE0033] focus:bg-white transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock size={14} className="text-gray-400" /> Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={passData.mat_khau_moi}
                        onChange={(e) => setPassData(prev => ({ ...prev, mat_khau_moi: e.target.value }))}
                        required
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#EE0033]/20 focus:border-[#EE0033] focus:bg-white transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock size={14} className="text-gray-400" /> Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={passData.xac_nhan_mat_khau}
                        onChange={(e) => setPassData(prev => ({ ...prev, xac_nhan_mat_khau: e.target.value }))}
                        required
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#EE0033]/20 focus:border-[#EE0033] focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isPassLoading}
                      className="bg-gray-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                    >
                      {isPassLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Đang xử lý...
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

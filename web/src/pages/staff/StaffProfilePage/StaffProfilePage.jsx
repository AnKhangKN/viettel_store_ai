import React, { useState, useEffect } from "react";
import {
  User,
  Building,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Save,
  RefreshCw,
  Clock,
  Sparkles,
  AlertCircle,
  X
} from "lucide-react";
import { getStaffProfile, updateStaffProfile } from "../../../api/user/user.api";

const StaffProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    ho_ten: "",
    so_dien_thoai: "",
    cccd: "",
    dia_chi: "",
    gioi_tinh: "Nam",
    ngay_sinh: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getStaffProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData({
          ho_ten: res.data.ho_ten || "",
          so_dien_thoai: res.data.so_dien_thoai || "",
          cccd: res.data.cccd || "",
          dia_chi: res.data.dia_chi || "",
          gioi_tinh: res.data.gioi_tinh || "Nam",
          ngay_sinh: res.data.ngay_sinh || "",
        });
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Không thể tải thông tin hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateStaffProfile(formData);
      if (res.success) {
        showToast("success", "Cập nhật thông tin cá nhân thành công!");
        setIsEditing(false);
        fetchProfile();
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <RefreshCw className="w-10 h-10 text-[#EE0033] animate-spin" />
        <p className="text-gray-500 font-semibold text-sm">Đang tải thông tin nhân viên...</p>
      </div>
    );
  }

  const chiNhanh = profile?.chi_nhanh;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-bold transition-all transform animate-bounce-short ${toast.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700"
            }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast({ show: false, type: "", message: "" })} className="ml-2 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Overview Banner */}
      <div className="bg-gradient-to-r from-[#EE0033] via-[#CC002D] to-[#A00022] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative patterns */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Avatar Circle */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-3xl font-black shadow-inner">
                {profile?.ho_ten ? profile.ho_ten.charAt(0).toUpperCase() : "S"}
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-md"
                title="Đang hoạt động"
              >
                <span className="w-2 h-2 bg-white rounded-full"></span>
              </span>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">{profile?.ho_ten}</h1>
                <span className="bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Staff Portal
                </span>
              </div>
              <p className="text-red-100 font-medium text-sm flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-red-200" /> {profile?.email}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3 pt-1 text-xs text-red-100/90 flex-wrap">
                <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                  Mã nhân viên: <strong>{profile?.id_khach_hang?.substring(0, 8).toUpperCase()}</strong>
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-yellow-300" />
                  {chiNhanh?.ten_chi_nhanh || "Chưa phân công chi nhánh"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-[#EE0033] font-black px-6 py-3 rounded-xl shadow-[0_6px_0_#e5e7eb] hover:shadow-[0_8px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa thông tin
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-white/20 text-white hover:bg-white/30 font-bold px-5 py-3 rounded-xl backdrop-blur-md transition-all text-sm cursor-pointer"
              >
                Hủy bỏ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Personal Information Form / View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Thông tin cá nhân</h2>
                  <p className="text-xs text-gray-500">Quản lý và cập nhật thông tin cá nhân nhân viên</p>
                </div>
              </div>

              {isEditing && (
                <span className="text-xs font-bold text-[#EE0033] bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  Đang chỉnh sửa
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Họ tên */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Họ và tên <span className="text-[#EE0033]">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="ho_ten"
                      value={formData.ho_ten}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                      placeholder="Nhập họ tên nhân viên"
                    />
                  ) : (
                    <div className="bg-gray-50/80 border border-gray-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {profile?.ho_ten || "—"}
                    </div>
                  )}
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Số điện thoại <span className="text-[#EE0033]">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="so_dien_thoai"
                      value={formData.so_dien_thoai}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="bg-gray-50/80 border border-gray-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {profile?.so_dien_thoai || "—"}
                    </div>
                  )}
                </div>

                {/* Email (Readonly) */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Email tài khoản
                  </label>
                  <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 flex items-center gap-2 cursor-not-allowed">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {profile?.email}
                  </div>
                </div>

                {/* Số CCCD/CMND */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Số CCCD / CMND
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="cccd"
                      value={formData.cccd}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                      placeholder="Số CCCD 12 chữ số"
                    />
                  ) : (
                    <div className="bg-gray-50/80 border border-gray-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      {profile?.cccd || "Chưa cập nhật"}
                    </div>
                  )}
                </div>

                {/* Giới tính */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Giới tính
                  </label>
                  {isEditing ? (
                    <select
                      name="gioi_tinh"
                      value={formData.gioi_tinh}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  ) : (
                    <div className="bg-gray-50/80 border border-gray-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800">
                      {profile?.gioi_tinh || "Nam"}
                    </div>
                  )}
                </div>

                {/* Ngày sinh */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Ngày sinh
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="ngay_sinh"
                      value={formData.ngay_sinh}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                    />
                  ) : (
                    <div className="bg-gray-50/80 border border-gray-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {profile?.ngay_sinh || "Chưa cập nhật"}
                    </div>
                  )}
                </div>
              </div>

              {/* Địa chỉ thường trú */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Địa chỉ thường trú
                </label>
                {isEditing ? (
                  <textarea
                    name="dia_chi"
                    rows="3"
                    value={formData.dia_chi}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all resize-none"
                    placeholder="Nhập địa chỉ nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
                  ></textarea>
                ) : (
                  <div className="bg-gray-50/80 border border-gray-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{profile?.dia_chi || "Chưa cập nhật địa chỉ"}</span>
                  </div>
                )}
              </div>

              {/* Save Form Actions */}
              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#EE0033] text-white font-black px-8 py-3 rounded-xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:shadow-[0_0px_0_#A00022] active:translate-y-1 transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right 1 Col: Branch & System Info */}
        <div className="space-y-6">
          {/* Working Branch Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Chi nhánh trực thuộc</h3>
                <p className="text-xs text-gray-500">Thông tin nơi công tác hiện tại</p>
              </div>
            </div>

            {chiNhanh ? (
              <div className="space-y-3.5">
                <div>
                  <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Tên cửa hàng</span>
                  <p className="text-base font-extrabold text-gray-900 mt-0.5">{chiNhanh.ten_chi_nhanh}</p>
                </div>

                <div>
                  <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Địa chỉ chi nhánh</span>
                  <p className="text-xs font-semibold text-gray-700 mt-0.5 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-4 h-4 text-[#EE0033] flex-shrink-0 mt-0.5" />
                    {chiNhanh.dia_chi_chi_nhanh || "Đang cập nhật"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Hotline</span>
                    <p className="text-xs font-extrabold text-[#EE0033] mt-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {chiNhanh.hotline_chi_nhanh || "1800 8198"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Giờ làm việc</span>
                    <p className="text-xs font-extrabold text-gray-800 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-yellow-600" />
                      {chiNhanh.gio_lam_viec_chi_nhanh || "08:00 - 20:00"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl text-xs font-medium text-yellow-800">
                Nhân viên hiện chưa được gán vào chi nhánh cụ thể nào. Vui lòng liên hệ Admin để cập nhật chi nhánh.
              </div>
            )}
          </div>

          {/* Account Security Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Quyền & Bảo mật</h3>
                <p className="text-xs text-gray-500">Thông tin phân quyền hệ thống</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-medium text-gray-600">
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span>Vai trò tài khoản:</span>
                <span className="bg-red-50 text-[#EE0033] font-bold px-2.5 py-0.5 rounded-full border border-red-100 uppercase text-[10px]">
                  {profile?.vai_tro || "Staff"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span>Trạng thái tài khoản:</span>
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-100 text-[10px]">
                  {profile?.trang_thai || "HoatDong"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span>Lần đăng nhập cuối:</span>
                <span className="font-semibold text-gray-800">
                  {profile?.lan_dang_nhap_cuoi ? new Date(profile.lan_dang_nhap_cuoi).toLocaleString("vi-VN") : "Gần đây"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span>Ngày tạo tài khoản:</span>
                <span className="font-semibold text-gray-800">
                  {profile?.ngay_tao ? new Date(profile.ngay_tao).toLocaleDateString("vi-VN") : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfilePage;

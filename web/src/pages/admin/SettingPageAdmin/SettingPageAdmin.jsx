import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../../features/auth/authSlice";
import { updateProfile, changePassword } from "../../../api/user/user.api";
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  CheckCircle2,
  Edit3,
  Save,
  Lock,
  KeyRound,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  Sliders,
  Bell,
  RefreshCw
} from "lucide-react";

const SettingPageAdmin = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "security" | "system"
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    ho_ten: "",
    so_dien_thoai: "",
    email: "",
    cccd: "",
    dia_chi: "",
  });

  const [passData, setPassData] = useState({
    mat_khau_cu: "",
    mat_khau_moi: "",
    xac_nhan_mat_khau: "",
  });
  const [passSaving, setPassSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ho_ten: user.name || user.ho_ten || "",
        so_dien_thoai: user.phone || user.so_dien_thoai || "",
        email: user.email || "",
        cccd: user.cccd || "",
        dia_chi: user.dia_chi || user.address || "",
      });
    }
  }, [user]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({
        ho_ten: formData.ho_ten,
        so_dien_thoai: formData.so_dien_thoai,
        email: formData.email,
        cccd: formData.cccd,
        dia_chi: formData.dia_chi,
      });

      dispatch(
        setCredentials({
          user: {
            ...user,
            name: formData.ho_ten,
            phone: formData.so_dien_thoai,
            email: formData.email,
            cccd: formData.cccd,
            dia_chi: formData.dia_chi,
          },
        })
      );

      showToast("success", "Cập nhật hồ sơ Quản trị viên thành công!");
      setIsEditing(false);
    } catch (error) {
      showToast(
        "error",
        error?.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (passData.mat_khau_moi.length < 6) {
      showToast("error", "Mật khẩu mới phải có tối thiểu 6 ký tự");
      return;
    }
    if (passData.mat_khau_moi !== passData.xac_nhan_mat_khau) {
      showToast("error", "Xác nhận mật khẩu mới không khớp");
      return;
    }

    try {
      setPassSaving(true);
      await changePassword({
        mat_khau_cu: passData.mat_khau_cu,
        mat_khau_moi: passData.mat_khau_moi,
      });

      showToast("success", "Đổi mật khẩu thành công!");
      setPassData({ mat_khau_cu: "", mat_khau_moi: "", xac_nhan_mat_khau: "" });
    } catch (error) {
      showToast(
        "error",
        error?.response?.data?.message || "Không thể đổi mật khẩu. Kiểm tra lại mật khẩu cũ."
      );
    } finally {
      setPassSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-bold transition-all transform animate-bounce-short ${
            toast.type === "success"
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
          <button
            onClick={() => setToast({ show: false, type: "", message: "" })}
            className="ml-2 hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Overview Banner */}
      <div className="bg-gradient-to-r from-[#EE0033] via-[#CC002D] to-[#A00022] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-3xl font-black shadow-inner">
              {formData.ho_ten ? formData.ho_ten.charAt(0).toUpperCase() : "A"}
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  {formData.ho_ten || "Quản trị viên"}
                </h1>
                <span className="bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> System Admin
                </span>
              </div>
              <p className="text-red-100 font-medium text-sm flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-red-200" /> {formData.email || "admin@viettel.com.vn"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#EE0033] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <User className="w-4 h-4" />
          Hồ sơ Admin
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === "security"
              ? "bg-[#EE0033] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Lock className="w-4 h-4" />
          Bảo mật & Đổi mật khẩu
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Thông tin cá nhân Quản trị viên</h2>
                <p className="text-xs text-gray-500">Chỉnh sửa thông tin hồ sơ lưu trên hệ thống</p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-sm font-semibold text-[#EE0033] hover:bg-red-50 px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            ) : (
              <span className="text-xs font-bold text-[#EE0033] bg-red-50 px-3 py-1 rounded-full border border-red-100">
                Đang chỉnh sửa
              </span>
            )}
          </div>

          <form onSubmit={handleSubmitProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ tên */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Họ và tên <span className="text-[#EE0033]">*</span>
                </label>
                <input
                  type="text"
                  name="ho_ten"
                  value={formData.ho_ten}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed outline-none"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Số điện thoại <span className="text-[#EE0033]">*</span>
                </label>
                <input
                  type="text"
                  name="so_dien_thoai"
                  value={formData.so_dien_thoai}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Email tài khoản <span className="text-[#EE0033]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed outline-none"
                />
              </div>

              {/* Số CCCD */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Số CCCD / CMND
                </label>
                <input
                  type="text"
                  name="cccd"
                  value={formData.cccd}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed outline-none"
                />
              </div>

              {/* Địa chỉ */}
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Địa chỉ
                </label>
                <textarea
                  name="dia_chi"
                  rows="3"
                  value={formData.dia_chi}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed outline-none resize-none"
                ></textarea>
              </div>
            </div>

            {/* Actions */}
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
                      <Loader2 className="w-4 h-4 animate-spin" />
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
      )}

      {/* Tab 2: Security */}
      {activeTab === "security" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Đổi mật khẩu tài khoản Admin</h2>
              <p className="text-xs text-gray-500">Bảo mật tài khoản quản trị hệ thống</p>
            </div>
          </div>

          <form onSubmit={handleSubmitPassword} className="space-y-6 max-w-2xl">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Mật khẩu hiện tại <span className="text-[#EE0033]">*</span>
                </label>
                <input
                  type="password"
                  value={passData.mat_khau_cu}
                  onChange={(e) => setPassData((prev) => ({ ...prev, mat_khau_cu: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Mật khẩu mới <span className="text-[#EE0033]">*</span>
                </label>
                <input
                  type="password"
                  value={passData.mat_khau_moi}
                  onChange={(e) => setPassData((prev) => ({ ...prev, mat_khau_moi: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Xác nhận mật khẩu mới <span className="text-[#EE0033]">*</span>
                </label>
                <input
                  type="password"
                  value={passData.xac_nhan_mat_khau}
                  onChange={(e) => setPassData((prev) => ({ ...prev, xac_nhan_mat_khau: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={passSaving}
                className="bg-[#EE0033] text-white font-black px-8 py-3 rounded-xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:shadow-[0_0px_0_#A00022] active:translate-y-1 transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50"
              >
                {passSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Cập nhật mật khẩu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingPageAdmin;
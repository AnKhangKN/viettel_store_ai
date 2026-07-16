import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, ShieldCheck, Truck, Loader2, Building2, X, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { getSimDetails } from "../../../api/sim/sim.api";
import { updateProfile } from "../../../api/user/user.api";

export default function SimCheckoutPage() {
  const { id } = useParams(); // id_sim
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.user);

  const [sim, setSim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [cccd, setCccd] = useState("");
  const [address, setAddress] = useState("");

  // Điền sẵn thông tin khi khách hàng đã đăng nhập
  useEffect(() => {
    if (loggedInUser) {
      setFullname(loggedInUser.ho_ten || loggedInUser.name || "");
      setPhone(loggedInUser.so_dien_thoai || loggedInUser.phone || "");
      setCccd(loggedInUser.cccd || "")
      setAddress(loggedInUser.dia_chi || loggedInUser.address || "");
    }
  }, [loggedInUser]);

  useEffect(() => {
    const fetchSim = async () => {
      try {
        setLoading(true);
        const res = await getSimDetails(id);
        if (res?.success && res?.data) {
          setSim(res.data);
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết SIM:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchSim();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Cập nhật thông tin cá nhân nếu người dùng đã đăng nhập
      if (loggedInUser) {
        await updateProfile({
          ho_ten: fullname,
          so_dien_thoai: phone,
          cccd: cccd || undefined,
          dia_chi: address || undefined,
        });
      }
    } catch (err) {
      console.error("Không cập nhật được hồ sơ:", err);
      // Vẫn hiển thị thành công đặt SIM kể cả khi cập nhật hồ sơ thất bại
    } finally {
      setSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    navigate("/buysim");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-[#EE0033] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!sim) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lỗi Đơn Hàng</h2>
          <p className="text-gray-500 mb-6">Không tìm thấy thông tin số SIM này hoặc số SIM đã được bán.</p>
          <button
            onClick={() => navigate("/buysim")}
            className="w-full bg-[#EE0033] text-white py-3 rounded-xl font-bold hover:bg-[#CC002D] transition cursor-pointer"
          >
            Quay lại kho SIM
          </button>
        </div>
      </div>
    );
  }

  const giaSim = sim.gia_ban;
  const phiHoaMang = 50000;
  const tongCong = giaSim + phiHoaMang;
  const tenChiNhanh = sim.chi_nhanh?.ten_chi_nhanh || "Hệ thống Viettel Store";
  const diaChiChiNhanh = sim.chi_nhanh?.dia_chi || "";
  const mapUrl = sim.chi_nhanh?.map_url || null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* ========= MODAL THÀNH CÔNG (overlay, chỉ tắt khi click Close) ========= */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-2xl border border-gray-100 relative animate-fade-in">
            {/* Nút đóng */}
            <button
              onClick={handleCloseSuccess}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon thành công */}
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 text-center">
              Đặt Mua Thành Công!
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed text-center mb-6">
              Cảm ơn quý khách <span className="font-bold text-gray-900">{fullname}</span> đã đặt mua số{" "}
              <span className="font-bold text-[#EE0033]">{sim.so_sim}</span>.
            </p>

            {/* Thông tin chi nhánh cần đến */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
              <p className="text-xs font-bold text-[#EE0033] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Bước tiếp theo — Đến chi nhánh
              </p>
              <p className="text-sm font-black text-gray-900 mb-1">{tenChiNhanh}</p>
              {diaChiChiNhanh && (
                <p className="text-xs text-gray-500 mb-2">{diaChiChiNhanh}</p>
              )}
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition mb-2"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Xem chỉ đường trên Google Maps
                </a>
              )}
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Vui lòng mang theo <span className="font-semibold text-gray-900">CCCD/CMND gốc</span> và đến chi nhánh trên để hoàn tất các thủ tục kích hoạt & đăng ký chính chủ số SIM của bạn.
              </p>
            </div>

            <button
              onClick={handleCloseSuccess}
              className="w-full bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold py-3.5 rounded-xl text-base shadow-lg shadow-red-500/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              Đã hiểu, Đóng thông báo
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Thanh Toán Đơn Hàng</h1>
          <p className="text-gray-500">Hoàn tất thông tin để sở hữu số thuê bao bạn mong muốn</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái: Form thông tin */}
          <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center">
              <span className="w-8 h-8 bg-red-100 text-[#EE0033] rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span>
              Thông tin cá nhân
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên *</label>
                  <input
                    required
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] outline-none transition text-sm"
                    placeholder="Nhập họ tên đầy đủ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại liên hệ *</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] outline-none transition text-sm"
                    placeholder="SĐT để nhân viên gọi xác nhận..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số CCCD / CMND *</label>
                <input
                  required
                  type="text"
                  value={cccd}
                  onChange={(e) => setCccd(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] outline-none transition text-sm"
                  placeholder="Nhập số căn cước công dân của bạn..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ giao hàng (Tùy chọn)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] outline-none transition text-sm"
                  placeholder="Nhập địa chỉ nhận SIM..."
                />
              </div>

              {/* Thông tin chi nhánh quản lý */}
              <div className="bg-red-50 text-[#EE0033] p-5 rounded-2xl text-xs font-semibold border border-red-100 flex items-start gap-3 mt-4">
                <Building2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  Số SIM này hiện đang thuộc quản lý của chi nhánh:{" "}
                  <span className="font-bold underline">{tenChiNhanh}</span>.
                  <br />
                  Sau khi đặt mua thành công, bạn vui lòng đến chi nhánh trên để nhận SIM & hoàn tất thủ tục đăng ký chính chủ.
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-red-500/30 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận & Thanh toán"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">Tóm tắt đơn hàng</h2>

              <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100 text-center">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-2">Số thuê bao</p>
                <h3 className="text-3xl font-black text-[#EE0033] tracking-wider">{sim.so_sim}</h3>
                <span className="inline-block bg-white text-gray-600 px-3 py-1 rounded-lg text-xs font-semibold mt-3 shadow-sm">
                  {sim.loai_sim?.ten_loai_sim || "Chưa phân loại"}
                </span>
              </div>

              <div className="space-y-4 mb-6 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Giá SIM</span>
                  <span className="font-semibold text-gray-900">{sim.gia_ban.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Chi nhánh quản lý</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[180px] truncate" title={tenChiNhanh}>
                    {tenChiNhanh}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí hòa mạng</span>
                  <span className="font-semibold text-gray-900">{phiHoaMang.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold">Tổng cộng</span>
                  <span className="text-2xl font-black text-[#EE0033]">{tongCong.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <ShieldCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Giao dịch an toàn và bảo mật tuyệt đối 100%
                </div>
                <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Truck className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                  Giao SIM tận nhà miễn phí toàn quốc
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

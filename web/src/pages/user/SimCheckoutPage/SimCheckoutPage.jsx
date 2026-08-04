import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, ShieldCheck, Truck, Loader2, Building2, X, MapPin, CreditCard, Store, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { getSimDetails } from "../../../api/sim/sim.api";
import { getAllBranches } from "../../../api/branch/branch.api";
import { updateProfile } from "../../../api/user/user.api";
import { createSimOrder, createVNPaySimPayment } from "../../../api/payment/payment.api";

// Hàm trích xuất link nhúng iframe
const getMapEmbedUrl = (rawUrl) => {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith("<iframe")) {
    const match = trimmed.match(/src=["']([^"']+)["']/);
    return match ? match[1] : null;
  }
  if (trimmed.includes("google.com/maps/embed")) {
    return trimmed;
  }
  return null;
};

// Hàm sinh link tìm kiếm Google Maps ngoài
const getSearchMapUrl = (address, name) => {
  const query = address || name || "Viettel Store";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export default function SimCheckoutPage() {
  const { id } = useParams(); // id_sim
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.user);

  const [sim, setSim] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vnpay"); // 'vnpay' hoặc 'cod'

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
      setCccd(loggedInUser.cccd || "");
      setAddress(loggedInUser.dia_chi || loggedInUser.address || "");
    }
  }, [loggedInUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [simRes, branchesRes] = await Promise.all([
          getSimDetails(id),
          getAllBranches()
        ]);

        if (simRes?.success && simRes?.data) {
          setSim(simRes.data);
        }
        if (branchesRes?.success && branchesRes?.data) {
          const activeBranches = branchesRes.data.filter(b => b.trang_thai === "HoatDong");
          setBranches(activeBranches.length > 0 ? activeBranches : branchesRes.data);
          if (activeBranches.length > 0) {
            setSelectedBranch(activeBranches[0].id_chi_nhanh);
          } else if (branchesRes.data.length > 0) {
            setSelectedBranch(branchesRes.data[0].id_chi_nhanh);
          }
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const validateOrderForm = () => {
    const nameClean = fullname.trim();
    if (!nameClean || nameClean.length < 2) {
      return "Vui lòng nhập Họ và tên đầy đủ (tối thiểu 2 ký tự)!";
    }

    const phoneClean = phone.trim();
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phoneClean)) {
      return "Số điện thoại liên hệ không hợp lệ! Vui lòng nhập SĐT 10 chữ số chuẩn nhà mạng Việt Nam (bắt đầu bằng 03, 05, 07, 08, 09).";
    }

    const cccdClean = cccd.trim();
    const cccdRegex = /^[0-9]{12}$/;
    if (!cccdRegex.test(cccdClean)) {
      return "Số CCCD không hợp lệ! Số CCCD/CMND dùng đăng ký chính chủ phải chứa đúng 12 chữ số.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const branchId = selectedBranch || (branches.length > 0 ? branches[0].id_chi_nhanh : "");
    const simId = sim?.id_sim || id;

    if (!branchId) {
      alert("Vui lòng chọn chi nhánh Viettel Store bạn muốn đến nhận SIM.");
      return;
    }
    if (!simId) {
      alert("Không tìm thấy thông tin số SIM.");
      return;
    }

    const validationError = validateOrderForm();
    if (validationError) {
      alert(validationError);
      return;
    }


    setSubmitting(true);
    try {
      if (loggedInUser) {
        try {
          await updateProfile({
            ho_ten: fullname,
            so_dien_thoai: phone,
            cccd: cccd || undefined,
            dia_chi: address || undefined,
          });
        } catch (err) {
          console.error("Không cập nhật được hồ sơ:", err);
        }
      }

      const orderRes = await createSimOrder({
        id_sim: simId,
        id_chi_nhanh: branchId,
        id_khach_hang: (loggedInUser?.vai_tro === "user" && loggedInUser?.id_khach_hang) ? loggedInUser.id_khach_hang : undefined,
        ho_ten: fullname || undefined,
        so_dien_thoai: phone || undefined,
        cccd: cccd || undefined,
        email: loggedInUser?.email || undefined,
        dia_chi: address || undefined,
        phuong_thuc: paymentMethod === "cod" ? "TienMat" : "VNPay",
      });

      const orderId = orderRes?.data?.id_don_hang;

      if (paymentMethod === "vnpay") {
        const payRes = await createVNPaySimPayment({ id_don_hang: orderId });
        if (payRes?.data?.payment_url) {
          window.location.href = payRes.data.payment_url;
          return;
        }
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Lỗi đặt mua SIM:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng SIM. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    navigate("/buysim");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-xs">Đang khởi tạo đơn hàng SIM...</p>
      </div>
    );
  }

  const simStatus = (sim?.trang_thai || "").trim().toLowerCase();
  const isAvailable = simStatus === "conhang" || simStatus === "dangban";

  if (!sim || !isAvailable) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2">SIM này không còn sẵn có</h2>
          <p className="text-slate-500 text-xs mb-6">Số SIM này đã được khách hàng khác đặt mua thành công hoặc không còn có sẵn trong hệ thống.</p>
          <button
            onClick={() => navigate("/buysim")}
            className="w-full bg-[#EE0033] text-white py-3 rounded-xl font-bold text-xs hover:bg-red-700 transition cursor-pointer"
          >
            Quay lại chọn số SIM khác
          </button>
        </div>
      </div>
    );
  }


  const giaSim = sim.gia_ban;
  const phiHoaMang = 50000;
  const tongCong = giaSim + phiHoaMang;

  const selectedBranchObj = branches.find(b => b.id_chi_nhanh === selectedBranch) || {};
  const tenChiNhanh = selectedBranchObj.ten_chi_nhanh || "Viettel Store";
  const diaChiChiNhanh = selectedBranchObj.dia_chi || "";
  const mapUrl = selectedBranchObj.map_url || null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-20">
      
      {/* MODAL SUCCESS (Cửa hàng / Tiền mặt) */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={handleCloseSuccess}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">
              Đặt Mua Thành Công!
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed text-center mb-6">
              Cảm ơn quý khách <span className="font-bold text-slate-900">{fullname}</span> đã lựa chọn số đẹp{" "}
              <span className="font-bold text-[#EE0033]">{sim.so_sim}</span>.
            </p>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
              <p className="text-[11px] font-black text-[#EE0033] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Địa điểm làm thủ tục nhận SIM
              </p>
              <p className="text-sm font-black text-slate-900 mb-1">{tenChiNhanh}</p>
              {diaChiChiNhanh && <p className="text-xs text-slate-500 mb-3">{diaChiChiNhanh}</p>}
              
              {getMapEmbedUrl(mapUrl) ? (
                <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200 my-2 shadow-inner">
                  <iframe
                    src={getMapEmbedUrl(mapUrl)}
                    title={tenChiNhanh}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              ) : null}

              <a
                href={getSearchMapUrl(diaChiChiNhanh, tenChiNhanh)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition mb-2"
              >
                <MapPin className="w-3.5 h-3.5" />
                Xem bản đồ dẫn đường &rarr;
              </a>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Vui lòng mang theo <span className="font-bold text-slate-900">CCCD/CMND gốc</span> khi đến quầy giao dịch.
              </p>
            </div>

            <button
              onClick={handleCloseSuccess}
              className="w-full bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-sm shadow-md transition cursor-pointer"
            >
              Đã hiểu, Quay lại kho SIM
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-1">XÁC NHẬN ĐƠN HÀNG SIM</h1>
          <p className="text-slate-500 text-xs">Hoàn tất các bước đăng ký để sở hữu số thuê bao Viettel mong muốn</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cột trái: Form thông tin */}
          <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Bước 1: Thông tin cá nhân */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-red-100 text-[#EE0033] rounded-full flex items-center justify-center text-xs font-black">1</span>
                  Thông tin người đăng ký chính chủ
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                      <input
                        required
                        type="text"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white outline-none transition"
                        placeholder="Nhập họ tên đầy đủ..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại liên hệ *</label>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white outline-none transition"
                        placeholder="SĐT nhận thông báo SMS..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Số CCCD / CMND *</label>
                    <input
                      required
                      type="text"
                      value={cccd}
                      onChange={(e) => setCccd(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white outline-none transition"
                      placeholder="Dùng để đăng ký SIM chính chủ..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ (Tùy chọn)</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white outline-none transition"
                      placeholder="Địa chỉ liên hệ..."
                    />
                  </div>
                </div>
              </div>

              {/* Bước 2: Chọn Chi nhánh nhận SIM */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-red-100 text-[#EE0033] rounded-full flex items-center justify-center text-xs font-black">2</span>
                  Chọn điểm giao dịch nhận SIM
                </h2>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Cửa hàng Viettel Store nhận SIM *
                  </label>
                  <select
                    required
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 px-3.5 focus:ring-2 focus:ring-[#EE0033] outline-none text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    {branches.map((b) => (
                      <option key={b.id_chi_nhanh} value={b.id_chi_nhanh}>
                        {b.ten_chi_nhanh} — {b.dia_chi}
                      </option>
                    ))}
                  </select>

                  {selectedBranchObj && selectedBranchObj.dia_chi && (
                    <div className="bg-red-50 text-[#EE0033] p-3.5 rounded-2xl text-xs font-semibold border border-red-100 flex items-start gap-2.5">
                      <Building2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        Đã chọn: <span className="font-extrabold">{tenChiNhanh}</span> ({diaChiChiNhanh}).
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bước 3: Hình thức thanh toán */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-red-100 text-[#EE0033] rounded-full flex items-center justify-center text-xs font-black">3</span>
                  Phương thức thanh toán
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod("vnpay")}
                    className={`border-2 rounded-2xl p-4 flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === "vnpay"
                        ? "border-[#EE0033] bg-red-50/40 shadow-xs"
                        : "border-slate-200 hover:border-red-200 bg-white"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-slate-900 text-sm">Cổng VNPay</span>
                        <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Online</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Thanh toán qua QR Code, Thẻ ATM Nội địa, Visa / Mastercard.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`border-2 rounded-2xl p-4 flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#EE0033] bg-red-50/40 shadow-xs"
                        : "border-slate-200 hover:border-red-200 bg-white"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-slate-900 text-sm">Thanh toán tại Quầy</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Thanh toán trực tiếp bằng tiền mặt khi nhận SIM tại cửa hàng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl text-base shadow-md transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý đơn hàng...
                    </>
                  ) : paymentMethod === "vnpay" ? (
                    "Thanh toán ngay qua VNPay"
                  ) : (
                    "Xác nhận đặt mua SIM"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 sticky top-28">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">Tóm tắt đơn hàng</h2>

              <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Số thuê bao đã chọn</p>
                <h3 className="text-2xl font-black text-[#EE0033] tracking-wide">{sim.so_sim}</h3>
                <span className="inline-block bg-white text-slate-600 px-2.5 py-0.5 rounded-md text-xs font-bold mt-2 border border-slate-200">
                  {sim.loai_sim?.ten_loai_sim || "SIM Số Đẹp"}
                </span>
              </div>

              <div className="space-y-3 mb-4 text-xs text-slate-600">
                <div className="flex justify-between items-center">
                  <span>Giá SIM:</span>
                  <span className="font-bold text-slate-900">{sim.gia_ban.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí hòa mạng:</span>
                  <span className="font-bold text-slate-900">{phiHoaMang.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Thanh toán:</span>
                  <span className="font-extrabold text-[#EE0033]">
                    {paymentMethod === "vnpay" ? "VNPay Online" : "Tại quầy"}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 font-bold text-xs">Tổng cộng:</span>
                  <span className="text-xl font-black text-[#EE0033]">{tongCong.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <div className="space-y-2.5 text-[11px] text-slate-500 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Bảo mật giao dịch tuyệt đối
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  Đăng ký chính chủ ngay tại quầy
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

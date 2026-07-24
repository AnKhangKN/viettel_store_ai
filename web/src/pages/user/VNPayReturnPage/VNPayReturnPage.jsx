import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, ShieldCheck, Phone, MapPin, ExternalLink, Sparkles } from "lucide-react";
import { verifyVNPayReturn } from "../../../api/payment/payment.api";

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

const getSearchMapUrl = (address, name) => {
  const query = address || name || "Viettel Store";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export default function VNPayReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const checkPayment = async () => {
      try {
        setLoading(true);
        const paramsObj = Object.fromEntries([...searchParams]);
        if (!paramsObj || Object.keys(paramsObj).length === 0) {
          setErrorMsg("Không tìm thấy thông tin giao dịch VNPay");
          setLoading(false);
          return;
        }

        const res = await verifyVNPayReturn(paramsObj);
        if (res?.data) {
          setResult(res.data);
        } else {
          setErrorMsg(res?.message || "Không thể xác thực giao dịch thanh toán");
        }
      } catch (err) {
        console.error("Lỗi xác nhận thanh toán VNPay:", err);
        setErrorMsg(err.response?.data?.message || "Xác thực giao dịch thanh toán thất bại");
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xs border border-slate-200 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin mb-4" />
          <h2 className="text-lg font-black text-slate-900 mb-1">Đang xác thực thanh toán VNPay...</h2>
          <p className="text-slate-500 text-xs">Vui lòng không đóng trình duyệt trong giây lát.</p>
        </div>
      </div>
    );
  }

  const isSuccess = result?.success === true;
  const embedUrl = getMapEmbedUrl(result?.chi_nhanh?.map_url);
  const searchMapUrl = getSearchMapUrl(result?.chi_nhanh?.dia_chi, result?.chi_nhanh?.ten_chi_nhanh);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xs overflow-hidden border border-slate-200 p-8 sm:p-10 text-center animate-in zoom-in-95 duration-300">
          
          {isSuccess ? (
            <>
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-2">THANH TOÁN THÀNH CÔNG!</h1>
              <p className="text-slate-600 text-xs mb-6 leading-relaxed">
                Đơn hàng chọn số SIM của bạn đã được thanh toán hoàn tất thành công qua cổng **VNPay**.
              </p>

              <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Loại đơn hàng:</span>
                  <span className="font-bold text-[#EE0033]">Mua SIM Số Đẹp</span>
                </div>
                {result?.so_sim && (
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Số thuê bao:</span>
                    <span className="font-black text-[#EE0033] text-base">{result.so_sim}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Mã giao dịch VNPay:</span>
                  <span className="font-bold text-blue-600">{result?.ma_giao_dich || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Số tiền thanh toán:</span>
                  <span className="font-black text-slate-900 text-sm">
                    {result?.so_tien ? `${result.so_tien.toLocaleString("vi-VN")}đ` : "N/A"}
                  </span>
                </div>
              </div>

              {/* Hướng dẫn nhận SIM */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 text-left space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-black text-[#EE0033]">
                  <MapPin className="w-4 h-4" />
                  Hướng dẫn làm thủ tục nhận SIM
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Vui lòng mang theo <span className="font-bold text-slate-900">CCCD/CMND bản gốc</span> đến chi nhánh Viettel Store để nhận SIM & đăng ký chính chủ:
                </p>

                {result?.chi_nhanh && (
                  <div className="bg-white rounded-xl p-3 border border-red-200 space-y-2 mt-2">
                    <p className="font-extrabold text-slate-900 text-xs">
                      {result.chi_nhanh.ten_chi_nhanh || "Viettel Store"}
                    </p>
                    {result.chi_nhanh.dia_chi && (
                      <p className="text-[11px] text-slate-500 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#EE0033] flex-shrink-0 mt-0.5" />
                        <span>{result.chi_nhanh.dia_chi}</span>
                      </p>
                    )}

                    {embedUrl && (
                      <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200">
                        <iframe
                          src={embedUrl}
                          title={result.chi_nhanh.ten_chi_nhanh || "Bản đồ"}
                          className="w-full h-full border-0"
                          loading="lazy"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/buysim")}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
                >
                  Kho SIM
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-xs transition cursor-pointer"
                >
                  Trang chủ Viettel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-2">Thanh Toán Thất Bại</h1>
              <p className="text-slate-600 text-xs mb-6 leading-relaxed">
                {errorMsg || result?.message || "Giao dịch thanh toán qua VNPay của bạn đã bị hủy."}
              </p>

              <button
                onClick={() => navigate("/buysim")}
                className="w-full bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                Thử lại đặt mua SIM khác
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

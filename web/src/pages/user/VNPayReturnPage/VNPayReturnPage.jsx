import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, ShieldCheck, Phone, MapPin, ExternalLink } from "lucide-react";
import { verifyVNPayReturn } from "../../../api/payment/payment.api";

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

// Hàm sinh link tìm kiếm Google Maps ngoài (mở tab mới an toàn)
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100 flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-[#EE0033] animate-spin mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Đang xác thực giao dịch VNPay...</h2>
          <p className="text-gray-500 text-sm">Vui lòng không đóng trình duyệt trong quá trình này.</p>
        </div>
      </div>
    );
  }

  const isSuccess = result?.success === true;
  const embedUrl = getMapEmbedUrl(result?.chi_nhanh?.map_url);
  const searchMapUrl = getSearchMapUrl(result?.chi_nhanh?.dia_chi, result?.chi_nhanh?.ten_chi_nhanh);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12 text-center animate-in zoom-in-95 duration-500">
          
          {isSuccess ? (
            <>
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Thanh Toán SIM Thành Công!</h1>
              <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                Cảm ơn bạn đã tin tưởng dịch vụ Viettel. Đơn hàng mua SIM của bạn đã được thanh toán hoàn tất thành công qua cổng **VNPay**.
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100 space-y-3.5 text-sm">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-500">Loại giao dịch</span>
                  <span className="font-bold text-[#EE0033]">Đơn Mua SIM Số Đẹp</span>
                </div>
                {result?.so_sim && (
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-500">Số thuê bao chọn mua</span>
                    <span className="font-black text-[#EE0033] text-lg tracking-wide">{result.so_sim}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-500">Mã đơn hàng SIM</span>
                  <span className="font-bold text-gray-900">{result?.id_don_hang?.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-500">Mã giao dịch VNPay</span>
                  <span className="font-bold text-blue-600">{result?.ma_giao_dich || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-500">Số tiền thanh toán</span>
                  <span className="font-black text-gray-900 text-base">
                    {result?.so_tien ? `${result.so_tien.toLocaleString("vi-VN")}đ` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Phương thức</span>
                  <span className="font-semibold text-gray-900">VNPay Online</span>
                </div>
              </div>

              {/* Hướng dẫn nhận SIM kèm iframe map trực quan */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 text-left space-y-3">
                <div className="flex items-center gap-2 font-bold text-[#EE0033] text-sm">
                  <MapPin className="w-4 h-4" />
                  Hướng dẫn nhận SIM chính chủ
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Vui lòng mang theo <span className="font-bold text-gray-900">CCCD/CMND bản gốc</span> đến chi nhánh Viettel Store dưới đây để xuất trình hóa đơn, nhận SIM & kích hoạt chính chủ:
                </p>

                {result?.chi_nhanh && (
                  <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm space-y-3">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {result.chi_nhanh.ten_chi_nhanh || "Chi nhánh Viettel Store"}
                      </p>
                      {result.chi_nhanh.dia_chi && (
                        <p className="text-xs text-gray-600 flex items-start gap-1.5 mt-1 leading-relaxed">
                          <MapPin className="w-3.5 h-3.5 text-[#EE0033] flex-shrink-0 mt-0.5" />
                          <span>{result.chi_nhanh.dia_chi}</span>
                        </p>
                      )}
                    </div>

                    {/* Google Maps iframe nhúng trực tiếp */}
                    {embedUrl && (
                      <div className="w-full h-44 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                        <iframe
                          src={embedUrl}
                          title={result.chi_nhanh.ten_chi_nhanh || "Bản đồ chi nhánh"}
                          className="w-full h-full border-0"
                          loading="lazy"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Nút mở ứng dụng/tab Google Maps mới */}
                    <div className="pt-1">
                      <a
                        href={searchMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Mở bản đồ trong tab mới &rarr;
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/buysim")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 px-6 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Về Kho SIM
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-red-500/30 transition cursor-pointer"
                >
                  Trang chủ Viettel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <XCircle className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Thanh Toán Thất Bại</h1>
              <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                {errorMsg || result?.message || "Giao dịch thanh toán qua VNPay của bạn đã bị hủy hoặc không thành công."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/buysim")}
                  className="flex-1 bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition cursor-pointer"
                >
                  Thử lại mua SIM khác
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

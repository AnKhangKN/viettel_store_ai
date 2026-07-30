import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ShoppingBag,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Building2,
  Printer,
  FileText,
  Eye,
  Loader2,
  AlertCircle,
  ExternalLink,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  X,
  QrCode,
  Download
} from "lucide-react";

import { getMyOrders } from "../../../api/order/order.api";
import { createVNPaySimPayment } from "../../../api/payment/payment.api";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL"); // ALL | ChoThanhToan | DaThanhToan | DaGiao | DaHuy

  // Modal Detail state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPayLoading, setIsPayLoading] = useState(false);

  const printRef = useRef(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyOrders();
      if (res?.success && Array.isArray(res?.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const simNum = order.so_sim ? order.so_sim.replace(/[^0-9]/g, "") : "";
    const orderId = order.id_don_hang ? order.id_don_hang.toLowerCase() : "";
    const searchClean = searchQuery.trim().toLowerCase().replace(/[^0-9a-z]/g, "");

    const matchesSearch =
      !searchQuery.trim() ||
      simNum.includes(searchClean) ||
      orderId.includes(searchClean);

    if (selectedStatus === "ALL") return matchesSearch;
    if (selectedStatus === "DaThanhToan") {
      return matchesSearch && (order.trang_thai_don_hang === "DaThanhToan" || order.thanh_toan?.trang_thai === "ThanhCong");
    }
    if (selectedStatus === "ChoThanhToan") {
      return matchesSearch && order.trang_thai_don_hang === "ChoThanhToan" && order.thanh_toan?.trang_thai !== "ThanhCong";
    }
    if (selectedStatus === "DaHuy") {
      return matchesSearch && order.trang_thai_don_hang === "DaHuy";
    }
    return matchesSearch;
  });

  // Calculate statistics
  const totalOrdersCount = orders.length;
  const paidOrdersCount = orders.filter(o => o.trang_thai_don_hang === "DaThanhToan" || o.thanh_toan?.trang_thai === "ThanhCong").length;
  const pendingOrdersCount = orders.filter(o => o.trang_thai_don_hang === "ChoThanhToan" && o.thanh_toan?.trang_thai !== "ThanhCong").length;
  const cancelledOrdersCount = orders.filter(o => o.trang_thai_don_hang === "DaHuy").length;

  // Handle VNPay payment retry
  const handlePayNow = async (orderId) => {
    setIsPayLoading(true);
    try {
      const payRes = await createVNPaySimPayment({ id_don_hang: orderId });
      if (payRes?.data?.payment_url) {
        window.location.href = payRes.data.payment_url;
      } else {
        alert("Không thể khởi tạo thanh toán VNPay. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Lỗi khởi tạo cổng thanh toán.");
    } finally {
      setIsPayLoading(false);
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);

  // Generate clean isolated 1-page HTML invoice document
  const generateCleanInvoiceHTML = (order) => {
    const isPaid = order.trang_thai_don_hang === "DaThanhToan" || order.thanh_toan?.trang_thai === "ThanhCong";
    const dateStr = order.ngay_dat_hang ? new Date(order.ngay_dat_hang).toLocaleString("vi-VN") : "";
    const giaSim = order.gia_sim ? order.gia_sim.toLocaleString("vi-VN") + "đ" : "0đ";
    const phiHoaMang = (order.phi_hoa_mang || 50000).toLocaleString("vi-VN") + "đ";
    const tongTien = order.tong_tien ? order.tong_tien.toLocaleString("vi-VN") + "đ" : "0đ";
    const ptt = order.thanh_toan?.phuong_thuc === "VNPay" ? "VNPay QR Code Online" : "Thanh toán Tiền mặt tại Quầy Viettel";

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Hóa Đơn Điện Tử Viettel Store - ${order.so_sim}</title>
  <style>
    @page { size: A4 portrait; margin: 8mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    html, body { width: 100%; height: auto; }
    body { background: #ffffff; color: #1e293b; font-size: 13px; line-height: 1.5; padding: 10px; overflow: visible !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .invoice-card { max-width: 750px; margin: 0 auto; border: 2px solid #e2e8f0; border-radius: 20px; padding: 26px; background: #fff; overflow: visible !important; page-break-inside: avoid; break-inside: avoid; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #ee0033; padding-bottom: 16px; margin-bottom: 18px; gap: 18px; }
    .brand { color: #ee0033; font-size: 24px; font-weight: 900; letter-spacing: -1px; }
    .subtext { font-size: 11px; color: #64748b; margin-top: 2px; }
    .inv-title { font-size: 18px; font-weight: 900; text-transform: uppercase; color: #0f172a; text-align: right; }
    .order-id { font-family: monospace; font-size: 11px; color: #64748b; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; margin-bottom: 18px; }
    .sec-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #ee0033; margin-bottom: 6px; letter-spacing: 0.5px; }
    .info-line { margin-bottom: 3px; }
    .info-label { font-weight: 700; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; page-break-inside: avoid; break-inside: avoid; }
    th { background: #f1f5f9; padding: 10px 14px; text-align: left; font-weight: 700; font-size: 12px; color: #334155; border-bottom: 1px solid #e2e8f0; }
    td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
    .total-row { background: #fef2f2; font-weight: 900; color: #ee0033; font-size: 15px; }
    .footer-box { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 14px 18px; border-radius: 14px; border: 1px solid #e2e8f0; page-break-inside: avoid; break-inside: avoid; }
    .badge { display: inline-block; background: #d1fae5; color: #065f46; font-weight: 800; font-size: 11px; padding: 5px 14px; border-radius: 20px; border: 1px solid #a7f3d0; }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand">⚡ VIETTEL STORE</div>
        <div class="subtext">Tập đoàn Công nghiệp - Viễn thông Quân đội Viettel</div>
        <div class="subtext">Hotline CSKH: 1800 8098 (Miễn phí)</div>
      </div>
      <div>
        <div class="inv-title">HÓA ĐƠN MUA SIM</div>
        <div class="order-id">Mã DH: #${order.id_don_hang}</div>
        <div class="subtext" style="text-align:right;">Ngày: ${dateStr}</div>
      </div>
    </div>

    <div class="grid">
      <div>
        <div class="sec-title">👤 Thông tin khách hàng</div>
        <div class="info-line"><span class="info-label">Họ và tên:</span> ${order.khach_hang?.ho_ten || 'Khách hàng'}</div>
        <div class="info-line"><span class="info-label">Số điện thoại:</span> ${order.khach_hang?.so_dien_thoai || ''}</div>
        ${order.khach_hang?.cccd ? `<div class="info-line"><span class="info-label">Số CCCD:</span> ${order.khach_hang.cccd}</div>` : ''}
        ${order.khach_hang?.email ? `<div class="info-line"><span class="info-label">Email:</span> ${order.khach_hang.email}</div>` : ''}
      </div>

      <div>
        <div class="sec-title">🏬 Địa điểm nhận SIM</div>
        <div class="info-line"><span class="info-label">Cửa hàng:</span> <strong>${order.chi_nhanh?.ten_chi_nhanh || 'Viettel Store'}</strong></div>
        <div class="info-line"><span class="info-label">Địa chỉ:</span> ${order.chi_nhanh?.dia_chi || ''}</div>
        <div class="info-line"><span class="info-label">Hotline cửa hàng:</span> ${order.chi_nhanh?.hotline || '1800 8098'}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Sản phẩm / Dịch vụ</th>
          <th>Loại SIM</th>
          <th style="text-align:right;">Đơn giá</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Thẻ SIM Số Đẹp <span style="color:#ee0033;">${order.so_sim}</span></strong></td>
          <td>${order.ten_loai_sim || 'SIM Số Đẹp'}</td>
          <td style="text-align:right; font-weight:700;">${giaSim}</td>
        </tr>
        <tr>
          <td>Phí hòa mạng thuê bao</td>
          <td>Gói trả trước / trả sau</td>
          <td style="text-align:right; font-weight:700;">${phiHoaMang}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="total-row">
          <td colspan="2">TỔNG CỘNG THANH TOÁN:</td>
          <td style="text-align:right;">${tongTien}</td>
        </tr>
      </tfoot>
    </table>

    <div class="footer-box">
      <div>
        <div class="info-line"><span class="info-label">Phương thức thanh toán:</span> ${ptt}</div>
        <div class="info-line"><span class="info-label">Trạng thái:</span> ${isPaid ? 'ĐÃ THANH TOÁN HOÀN TẤT' : 'CHỜ LÀM THỦ TỤC TẠI CỬA HÀNG'}</div>
        ${order.thanh_toan?.ma_giao_dich ? `<div class="subtext">Mã GD VNPay: ${order.thanh_toan.ma_giao_dich}</div>` : ''}
      </div>
      <div style="text-align:right;">
        <div class="badge">✓ ĐÃ XÁC THỰC VIETTEL STORE</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  // Trigger clean popup print window (Exactly 1 A4 sheet, no site headers)
  const handlePrintInvoice = () => {
    if (!selectedOrder) return;
    const printWin = window.open("", "_blank", "width=850,height=1100");
    if (!printWin) {
      alert("Vui lòng cho phép mở cửa sổ popup để thực hiện in hóa đơn!");
      return;
    }
    printWin.document.write(generateCleanInvoiceHTML(selectedOrder));
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
      printWin.close();
    }, 400);
  };

  // Trigger instant PDF download to user's device (Uses clean hex CSS to prevent oklch color parser crash)
  const handleDownloadPDF = async () => {
    if (!selectedOrder) return;
    setIsDownloading(true);
    let container = null;
    try {
      if (!window.html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // Create a temporary container with pure hex CSS colors (avoiding Tailwind v4 oklch colors)
      container = document.createElement("div");
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.right = "0";
      container.style.width = "750px";
      container.style.height = "auto";
      container.style.overflow = "visible";
      container.style.zIndex = "999999";
      container.style.background = "#ffffff";
      container.innerHTML = generateCleanInvoiceHTML(selectedOrder);
      document.body.appendChild(container);

      const targetEl = container.querySelector(".invoice-card") || container;
      const simClean = selectedOrder.so_sim ? selectedOrder.so_sim.replace(/[^0-9]/g, "") : selectedOrder.id_don_hang.slice(0, 8);

      const opt = {
        margin: 8,
        filename: `HoaDon_Viettel_${simClean}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          scrollY: 0,
          windowHeight: targetEl.scrollHeight
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await window.html2pdf().set(opt).from(targetEl).save();
    } catch (err) {
      console.error("Lỗi xuất file Hóa đơn PDF:", err);
      // Fallback to instant HTML Blob download if PDF canvas fails
      const simClean = selectedOrder.so_sim ? selectedOrder.so_sim.replace(/[^0-9]/g, "") : selectedOrder.id_don_hang.slice(0, 8);
      const htmlContent = generateCleanInvoiceHTML(selectedOrder);
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `HoaDon_Viettel_${simClean}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
      setIsDownloading(false);
    }
  };






  const getStatusBadge = (order) => {
    const isPaid = order.trang_thai_don_hang === "DaThanhToan" || order.thanh_toan?.trang_thai === "ThanhCong";
    const isCancelled = order.trang_thai_don_hang === "DaHuy";
    const isCOD = order.thanh_toan?.phuong_thuc === "TienMat" || order.thanh_toan?.phuong_thuc === "cod";

    if (isCancelled) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full">
          <XCircle className="w-3.5 h-3.5" /> Đã hủy
        </span>
      );
    }
    if (isPaid) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" /> Đã thanh toán
        </span>
      );
    }
    if (isCOD) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full">
          <Building2 className="w-3.5 h-3.5" /> Thanh toán tại quầy
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
        <Clock className="w-3.5 h-3.5" /> Chờ thanh toán VNPay
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-xs">Đang tải lịch sử đơn hàng của bạn...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-20">

      {/* Printable Invoice Container (Only visible during print) */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-modal-overlay {
            position: absolute !important;
            inset: 0 !important;
            background: #ffffff !important;
            padding: 0 !important;
            z-index: 999999 !important;
            display: block !important;
          }
          #printable-modal-card {
            box-shadow: none !important;
            border: none !important;
            max-height: none !important;
            height: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            border-radius: 0 !important;
          }
          #printable-invoice {
            padding: 20px !important;
            margin: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
            min-height: auto !important;
            height: auto !important;
          }
          #printable-invoice * {
            overflow: visible !important;
          }
          #printable-invoice .space-y-6 > * + * {
            margin-top: 1.5rem !important;
          }
          #printable-invoice table,
          #printable-invoice .border,
          #printable-invoice .rounded-2xl {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>


      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 no-print">


        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden mb-8">
          <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-[#EE0033] border border-red-500/30 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
                <ShoppingBag className="w-3.5 h-3.5" /> Quản Lý Đơn Hàng Mua SIM
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">LỊCH SỬ ĐƠN HÀNG CỦA BẠN</h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Theo dõi tình trạng xử lý đơn hàng, xem chi tiết hóa đơn điện tử và thông tin địa điểm nhận SIM tại quầy Viettel Store.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-3 text-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-extrabold text-white">Bảo mật giao dịch 100%</p>
                <p className="text-slate-300">Đăng ký chính chủ ngay tại quầy Viettel</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 STAT CARDS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tất cả đơn hàng</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{totalOrdersCount}</span>
              <span className="text-xs font-bold text-slate-500">Đơn</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Đã thanh toán</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600">{paidOrdersCount}</span>
              <span className="text-xs font-bold text-emerald-600">Đơn</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Chờ thanh toán</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">{pendingOrdersCount}</span>
              <span className="text-xs font-bold text-amber-600">Đơn</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Đã hủy</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-rose-600">{cancelledOrdersCount}</span>
              <span className="text-xs font-bold text-rose-600">Đơn</span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm theo số SIM hoặc Mã đơn hàng (VD: 098, DH...)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-[#EE0033] focus:bg-white outline-none text-xs font-bold transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { label: "Tất cả", value: "ALL" },
                { label: "Đã thanh toán", value: "DaThanhToan" },
                { label: "Chờ thanh toán", value: "ChoThanhToan" },
                { label: "Đã hủy", value: "DaHuy" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedStatus(tab.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${selectedStatus === tab.value
                    ? "bg-[#EE0033] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ORDER LIST CONTAINER */}
        {error ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-2xs">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-sm mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-[#EE0033] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-red-700 transition cursor-pointer"
            >
              Tải lại trang
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs">
            <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có đơn hàng nào</h3>
            <p className="text-xs text-slate-500 mb-6">Bạn chưa có đơn hàng đặt mua SIM nào phù hợp với bộ lọc hiện tại.</p>
            <a
              href="/buysim"
              className="inline-flex items-center gap-2 bg-[#EE0033] hover:bg-red-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs transition shadow-md"
            >
              <span>Khám phá Kho SIM số đẹp</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isPaid = order.trang_thai_don_hang === "DaThanhToan" || order.thanh_toan?.trang_thai === "ThanhCong";
              const isPendingVNPay = order.trang_thai_don_hang === "ChoThanhToan" && order.thanh_toan?.phuong_thuc === "VNPay";

              return (
                <div
                  key={order.id_don_hang}
                  className="bg-white rounded-3xl p-6 border-2 border-slate-100 hover:border-red-100 shadow-2xs hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-black text-xs shrink-0">
                        SIM
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">MÃ ĐƠN HÀNG</span>
                        <span className="text-xs font-mono font-bold text-slate-800">#{order.id_don_hang.slice(0, 13)}...</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(order)}
                      <span className="text-xs text-slate-400">
                        {order.ngay_dat_hang ? new Date(order.ngay_dat_hang).toLocaleString("vi-VN") : ""}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                    {/* SIM Information */}
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">SỐ THUÊ BAO ĐÃ CHỌN</span>
                      <h3 className="text-2xl font-black text-[#EE0033] tracking-wide">{order.so_sim}</h3>
                      <span className="inline-block bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-[11px] font-bold mt-1">
                        {order.ten_loai_sim || "SIM Số Đẹp"}
                      </span>
                    </div>

                    {/* Store Branch Information */}
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">CỬA HÀNG NHẬN SIM</span>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#EE0033] shrink-0" />
                        {order.chi_nhanh?.ten_chi_nhanh}
                      </p>
                      <p className="text-slate-500 text-[11px] whitespace-normal break-words leading-relaxed">{order.chi_nhanh?.dia_chi}</p>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">TỔNG TIỀN</span>
                        <span className="text-xl font-black text-[#EE0033]">{order.tong_tien?.toLocaleString("vi-VN")}đ</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {isPendingVNPay && (
                          <button
                            onClick={() => handlePayNow(order.id_don_hang)}
                            disabled={isPayLoading}
                            className="flex-1 sm:flex-initial bg-[#EE0033] hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Thanh toán VNPay</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>Chi tiết & Hóa đơn</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ORDER DETAIL & INVOICE MODAL */}
      {selectedOrder && createPortal(
        <div id="printable-modal-overlay" className="fixed inset-0 z-[99999] flex items-start justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div id="printable-modal-card" className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col overflow-visible my-auto animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#EE0033]" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Hóa Đơn Điện Tử Viettel Store</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Printable Content */}
            <div id="printable-invoice" ref={printRef} className="p-6 sm:p-8 flex-1 min-h-0 overflow-visible space-y-6 text-xs text-slate-700 bg-white">

              {/* Header Branding */}
              <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-5 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-black text-[#EE0033]">⚡ VIETTEL STORE</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Tập đoàn Công nghiệp - Viễn thông Quân đội Viettel</p>
                  <p className="text-[11px] text-slate-500">Hotline tư vấn & CSKH: 1800 8098 (Miễn phí)</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-slate-900 uppercase block">HÓA ĐƠN MUA SIM</span>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">Mã DH: #{selectedOrder.id_don_hang}</p>
                  <p className="text-[11px] text-slate-500">
                    Ngày tạo: {selectedOrder.ngay_dat_hang ? new Date(selectedOrder.ngay_dat_hang).toLocaleString("vi-VN") : ""}
                  </p>
                </div>
              </div>

              {/* Grid 2 Column Info: Customer & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="min-w-0">
                  <h4 className="font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#EE0033]" /> Thông tin khách hàng đăng ký
                  </h4>
                  <p className="break-words"><strong className="text-slate-800">Họ và tên:</strong> {selectedOrder.khach_hang?.ho_ten || "Khách hàng"}</p>
                  <p className="break-words"><strong className="text-slate-800">Số điện thoại:</strong> {selectedOrder.khach_hang?.so_dien_thoai || "Chưa cập nhật"}</p>
                  <p className="break-words"><strong className="text-slate-800">Số CCCD/CMND:</strong> {selectedOrder.khach_hang?.cccd || "Chưa cập nhật"}</p>
                  <p className="break-words"><strong className="text-slate-800">Email:</strong> {selectedOrder.khach_hang?.email || "Chưa cập nhật"}</p>
                </div>

                <div className="min-w-0">
                  <h4 className="font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#EE0033]" /> Địa điểm nhận SIM trực tiếp
                  </h4>
                  <p className="font-bold text-slate-900 break-words">{selectedOrder.chi_nhanh?.ten_chi_nhanh || "Cửa hàng Viettel Store"}</p>
                  <p className="text-slate-500 mt-0.5 break-words leading-relaxed">{selectedOrder.chi_nhanh?.dia_chi || "Hệ thống Viettel Store"}</p>
                  <p className="mt-1 break-words"><strong className="text-slate-800">Hotline cửa hàng:</strong> {selectedOrder.chi_nhanh?.hotline || "1800 8098"}</p>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-wider mb-2">Chi tiết sản phẩm dịch vụ</h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                        <th className="py-2.5 px-4">Sản phẩm / Dịch vụ</th>
                        <th className="py-2.5 px-4">Loại SIM</th>
                        <th className="py-2.5 px-4 text-right">Đơn giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          Thẻ SIM Số Đẹp <span className="text-[#EE0033] font-black">{selectedOrder.so_sim}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{selectedOrder.ten_loai_sim || "SIM Số Đẹp"}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          {selectedOrder.gia_sim?.toLocaleString("vi-VN")}đ
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-slate-700" colSpan={2}>
                          Phí hòa mạng thuê bao trả trước / trả sau
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          {(selectedOrder.phi_hoa_mang || 50000).toLocaleString("vi-VN")}đ
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-red-50/50 font-black text-slate-900 border-t border-slate-200">
                        <td className="py-3 px-4" colSpan={2}>TỔNG CỘNG THANH TOÁN:</td>
                        <td className="py-3 px-4 text-right text-base text-[#EE0033]">
                          {selectedOrder.tong_tien?.toLocaleString("vi-VN")}đ
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Method Status & Verification Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-200 pt-4 bg-slate-50 p-4 rounded-2xl border break-inside-avoid page-break-inside-avoid">
                <div>
                  <p><strong className="text-slate-800">Phương thức thanh toán:</strong> {selectedOrder.thanh_toan?.phuong_thuc === "VNPay" ? "VNPay QR Code Online" : "Thanh toán Tiền mặt tại Quầy"}</p>
                  <p><strong className="text-slate-800">Trạng thái:</strong> {selectedOrder.trang_thai_don_hang === "DaThanhToan" ? "ĐÃ THANH TOÁN HOÀN TẤT" : "CHỜ LÀM THỦ TỤC TẠI CỬA HÀNG"}</p>
                  {selectedOrder.thanh_toan?.ma_giao_dich && (
                    <p className="font-mono text-[11px] text-slate-500">Mã GD VNPay: {selectedOrder.thanh_toan.ma_giao_dich}</p>
                  )}
                </div>
                <div className="text-center sm:text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Dấu xác thực điện tử</span>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> ĐÃ XÁC THỰC VIETTEL STORE
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Đóng lại
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Hóa Đơn</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="bg-[#EE0033] hover:bg-red-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tạo PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Tải Hóa Đơn PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

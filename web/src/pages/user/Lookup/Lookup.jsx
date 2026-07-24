import React, { useState } from 'react';
import { Search, Phone, ShieldCheck, Wifi, Clock, CreditCard, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Lookup = () => {
  const [phone, setPhone] = useState('');
  const [lookupType, setLookupType] = useState('package'); // 'package' | 'sim' | 'ticket'
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);

  const handleLookup = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      alert('Vui lòng nhập số điện thoại Viettel hợp lệ');
      return;
    }

    setLoading(true);
    setResultData(null);

    setTimeout(() => {
      setLoading(false);
      if (lookupType === 'package') {
        setResultData({
          type: 'package',
          soDienThoai: phone,
          tenGoi: 'SD135',
          dungLuongConLai: '4.5 GB / 5 GB',
          ngayHetHan: '30/10/2026',
          trangThai: 'Hoạt động',
          giaCuoc: '135.000đ / tháng'
        });
      } else if (lookupType === 'sim') {
        setResultData({
          type: 'sim',
          soDienThoai: phone,
          hoTen: 'Nguyễn Văn A',
          cccd: '001095xxx123',
          ngayKichHoat: '15/01/2025',
          loaiThueBao: 'Trả trước',
          trangThaiChinhChu: 'Đã xác thực sinh trắc học'
        });
      } else {
        setResultData({
          type: 'ticket',
          soDienThoai: phone,
          maSo: 'V-042',
          chiNhanh: 'Viettel Store - Hai Bà Trưng',
          thoiGianHen: '14:30 - Hôm nay',
          trangThaiTicket: 'Đang trong hàng chờ (Dự kiến 10 phút)'
        });
      }
    }, 800);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 text-slate-800 font-sans antialiased">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-[#EE0033] border border-red-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Công Cụ Tra Cứu Trực Tuyến
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">TRA CỨU DỊCH VỤ VIETTEL</h1>
          <p className="text-slate-400 text-sm mt-1 font-normal max-w-xl mx-auto">
            Kiểm tra thông tin gói cước, dung lượng Data, trạng thái thuê bao chính chủ và số thứ tự hàng chờ.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-6 sm:p-8">
          
          {/* Lookup Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-100 pb-4">
            <button
              onClick={() => { setLookupType('package'); setResultData(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                lookupType === 'package' ? 'bg-[#EE0033] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" /> Gói Cước & Data
            </button>

            <button
              onClick={() => { setLookupType('sim'); setResultData(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                lookupType === 'sim' ? 'bg-[#EE0033] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Thông Tin Chính Chủ
            </button>

            <button
              onClick={() => { setLookupType('ticket'); setResultData(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                lookupType === 'ticket' ? 'bg-[#EE0033] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Số Thứ Tự Quầy
            </button>
          </div>

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Số điện thoại thuê bao Viettel *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="Nhập số điện thoại (VD: 098...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tra cứu dữ liệu...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Tra cứu thông tin
                </>
              )}
            </button>
          </form>

          {/* Result Card */}
          {resultData && (
            <div className="mt-6 bg-red-50/50 border border-red-100 rounded-2xl p-5 text-xs animate-in fade-in duration-200 space-y-3">
              
              <div className="flex items-center justify-between border-b border-red-100 pb-3">
                <span className="font-black text-[#EE0033] uppercase text-xs">Kết quả tra cứu: {resultData.soDienThoai}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {resultData.trangThai || resultData.trangThaiChinhChu || 'Cập nhật'}
                </span>
              </div>

              {resultData.type === 'package' && (
                <div className="space-y-2 text-slate-700">
                  <p><strong className="text-slate-900">Gói cước hiện tại:</strong> {resultData.tenGoi}</p>
                  <p><strong className="text-slate-900">Dung lượng tốc độ cao còn lại:</strong> <span className="text-[#EE0033] font-bold">{resultData.dungLuongConLai}</span></p>
                  <p><strong className="text-slate-900">Thời hạn sử dụng:</strong> {resultData.ngayHetHan}</p>
                  <p><strong className="text-slate-900">Cước phí:</strong> {resultData.giaCuoc}</p>
                </div>
              )}

              {resultData.type === 'sim' && (
                <div className="space-y-2 text-slate-700">
                  <p><strong className="text-slate-900">Họ và tên chủ thuê bao:</strong> {resultData.hoTen}</p>
                  <p><strong className="text-slate-900">Số CCCD đã đăng ký:</strong> {resultData.cccd}</p>
                  <p><strong className="text-slate-900">Loại thuê bao:</strong> {resultData.loaiThueBao}</p>
                  <p><strong className="text-slate-900">Ngày kích hoạt:</strong> {resultData.ngayKichHoat}</p>
                </div>
              )}

              {resultData.type === 'ticket' && (
                <div className="space-y-2 text-slate-700">
                  <p><strong className="text-slate-900">Mã số thứ tự:</strong> <span className="text-[#EE0033] font-black text-sm">{resultData.maSo}</span></p>
                  <p><strong className="text-slate-900">Cửa hàng:</strong> {resultData.chiNhanh}</p>
                  <p><strong className="text-slate-900">Thời gian đặt hẹn:</strong> {resultData.thoiGianHen}</p>
                  <p><strong className="text-slate-900">Trạng thái:</strong> {resultData.trangThaiTicket}</p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Lookup;
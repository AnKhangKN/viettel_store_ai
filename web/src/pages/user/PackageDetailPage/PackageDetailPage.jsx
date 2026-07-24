import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Zap, HelpCircle, Loader2, AlertCircle, RefreshCw, ArrowLeft, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { getPackageDetails } from '../../../api/package/package.api';

// Định dạng giá tiền từ số → chuỗi VNĐ
const formatPrice = (price) => {
  if (!price && price !== 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

// Định dạng dung lượng GB
const formatData = (gb) => {
  if (!gb && gb !== 0) return 'Không giới hạn';
  if (gb === 0) return 'Thoại / SMS';
  return `${gb}GB`;
};

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const fetchPackageDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPackageDetails(id);
      if (res?.success && res?.data) {
        setPkg(res.data);
      } else {
        setError('Không tìm thấy thông tin gói cước.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải dữ liệu gói cước. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPackageDetail();
    }
  }, [id]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('Vui lòng nhập số điện thoại Viettel hợp lệ');
      return;
    }
    setRegisterSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-[#EE0033] mb-4" />
        <p className="text-sm font-bold">Đang tải thông tin gói cước...</p>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-red-100 shadow-sm max-w-xl mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <p className="text-slate-800 font-bold text-base mb-4">{error || 'Gói cước không tồn tại.'}</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/package')}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
            >
              Quay lại danh sách
            </button>
            <button
              onClick={fetchPackageDetail}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#EE0033] text-white rounded-xl text-xs font-bold hover:bg-red-700 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tự động sinh danh sách đặc quyền dựa trên dữ liệu thật của gói cước
  const chiTietUuDai = [];
  if (pkg.dung_luong_gb > 0) {
    chiTietUuDai.push(`Sở hữu ngay ${formatData(pkg.dung_luong_gb)} data tốc độ cao mỗi ngày/tháng.`);
  }
  if (pkg.so_phut_goi > 0) {
    chiTietUuDai.push(`Miễn phí ${pkg.so_phut_goi} phút gọi điện trong chu kỳ sử dụng.`);
  }
  if (pkg.so_sms > 0) {
    chiTietUuDai.push(`Ưu đãi tặng kèm ${pkg.so_sms} tin nhắn SMS miễn phí.`);
  }
  chiTietUuDai.push(`Chu kỳ sử dụng ưu đãi trong vòng ${pkg.thoi_han_ngay || 30} ngày.`);
  chiTietUuDai.push('Tự động gia hạn khi tài khoản chính có đủ số dư cần thiết.');

  return (
    <div className="bg-slate-50 min-h-screen py-10 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left: Package Summary */}
            <div className="lg:w-5/12 p-8 lg:p-10 bg-gradient-to-br from-red-50 via-pink-50/30 to-white border-b lg:border-b-0 lg:border-r border-red-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#EE0033] text-white font-extrabold px-3 py-1 rounded-lg text-xs uppercase tracking-wider shadow-xs">
                    Gói Cước Khuyên Dùng
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">5G READY</span>
                </div>

                <h1 className="text-4xl font-black text-slate-900 mb-2">{pkg.ten_goi}</h1>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{pkg.mo_ta || 'Gói cước ưu đãi Data tốc độ cao Viettel.'}</p>
                
                {/* Price & Specs Box */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-red-100 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium text-xs">Giá cước niêm yết:</span>
                    <span className="text-3xl font-black text-[#EE0033]">{formatPrice(pkg.gia_cuoc)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">Lưu lượng Data:</span>
                    <span className="text-sm font-extrabold text-slate-900 bg-red-50 text-[#EE0033] px-2.5 py-0.5 rounded-md border border-red-100">
                      {formatData(pkg.dung_luong_gb)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Chu kỳ sử dụng:</span>
                    <span className="text-sm font-bold text-slate-800">{pkg.thoi_han_ngay || 30} ngày</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="w-full bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl text-base transition-all shadow-lg hover:shadow-red-500/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>Đăng ký ngay</span>
                </button>
                
                <button
                  onClick={() => navigate('/package')}
                  className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs border border-slate-300 transition cursor-pointer"
                >
                  Trở lại danh sách
                </button>
              </div>
            </div>

            {/* Right: Privileges & FAQ */}
            <div className="lg:w-7/12 p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" /> Đặc quyền ưu đãi nổi bật
                </h3>
                
                <ul className="space-y-3.5 mb-8">
                  {chiTietUuDai.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-xs sm:text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" /> Cú pháp hỗ trợ nhanh
                </h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                  <p>• Cú pháp đăng ký qua SMS: <strong className="text-slate-900">{pkg.ten_goi} gửi 191</strong></p>
                  <p>• Tra cứu lưu lượng Data còn lại: <strong className="text-slate-900">KTTK gửi 191</strong></p>
                  <p>• Cú pháp hủy gia hạn tự động: <strong className="text-slate-900">HUY gửi 191</strong></p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <ShieldCheck className="w-4 h-4" /> Hệ thống chính thức Viettel
                </span>
                <span className="flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5" /> Hotline: 1800 8098
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* MODAL ĐĂNG KÝ GÓI CƯỚC */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => { setShowRegisterModal(false); setRegisterSuccess(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            {!registerSuccess ? (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Đăng ký gói {pkg.ten_goi}</h3>
                <p className="text-xs text-slate-500 mb-4">Nhập số điện thoại Viettel của bạn để tiến hành kích hoạt gói cước.</p>
                
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Số điện thoại thuê bao:</label>
                    <input
                      type="tel"
                      required
                      placeholder="098x xxx xxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                    />
                  </div>

                  <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-xs text-[#EE0033]">
                    Phí dịch vụ: <strong>{formatPrice(pkg.gia_cuoc)}</strong> sẽ được trừ trực tiếp vào tài khoản chính của bạn.
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-sm transition shadow-md cursor-pointer"
                  >
                    Xác nhận đăng ký
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Gửi yêu cầu thành công!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Yêu cầu đăng ký gói cước <strong>{pkg.ten_goi}</strong> cho thuê bao <strong>{phoneNumber}</strong> đã được hệ thống ghi nhận. Cú pháp xác nhận SMS sẽ được gửi về máy bạn trong giây lát.
                </p>
                <button
                  onClick={() => { setShowRegisterModal(false); setRegisterSuccess(false); }}
                  className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer mt-2"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetailPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Zap, HelpCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-[#EE0033] mb-4" />
        <p className="text-base font-medium">Đang tải thông tin chi tiết gói cước...</p>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-red-100 shadow-sm max-w-xl mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
          <p className="text-gray-700 font-semibold text-base mb-4">{error || 'Gói cước không tồn tại.'}</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/package')}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition"
            >
              Quay lại danh sách
            </button>
            <button
              onClick={fetchPackageDetail}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#EE0033] text-white rounded-xl text-sm font-bold hover:bg-red-700 transition"
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
    chiTietUuDai.push(`Sở hữu ngay ${formatData(pkg.dung_luong_gb)} data tốc độ cao, lướt web cực mượt.`);
  }
  if (pkg.so_phut_goi > 0) {
    chiTietUuDai.push(`Miễn phí ${pkg.so_phut_goi} phút gọi điện trong chu kỳ sử dụng.`);
  }
  if (pkg.so_sms > 0) {
    chiTietUuDai.push(`Ưu đãi tặng kèm ${pkg.so_sms} tin nhắn SMS miễn phí.`);
  }
  chiTietUuDai.push(`Chu kỳ sử dụng ưu đãi trong vòng ${pkg.thoi_han_ngay || 30} ngày.`);
  chiTietUuDai.push('Hệ thống tự động gia hạn khi tài khoản chính đủ số dư cần thiết.');

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#EE0033]">Trang chủ</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/package')} className="hover:text-[#EE0033]">Gói cước</button>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">{pkg.ten_goi}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row">
            
            {/* Left: Summary */}
            <div className="md:w-1/2 p-8 md:p-12 bg-red-50/50 border-b md:border-b-0 md:border-r border-red-100">
              <div className="inline-block bg-[#EE0033] text-white font-bold px-3 py-1 rounded-full text-xs mb-4 uppercase tracking-wider font-sans">
                Gói Cước Viettel
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">{pkg.ten_goi}</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">{pkg.mo_ta || 'Không có mô tả chi tiết cho gói cước này.'}</p>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 border border-red-50">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Giá cước</span>
                  <span className="text-3xl font-black text-[#EE0033]">{formatPrice(pkg.gia_cuoc)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Lưu lượng</span>
                  <span className="text-xl font-bold text-gray-900">{formatData(pkg.dung_luong_gb)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Chu kỳ</span>
                  <span className="text-lg font-semibold text-gray-900">{pkg.thoi_han_ngay || 30} ngày</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/package')}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg flex items-center justify-center group"
              >
                Quay lại danh sách gói cước
              </button>
            </div>

            {/* Right: Detailed Info */}
            <div className="md:w-1/2 p-8 md:p-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap className="w-6 h-6 text-yellow-500 mr-2" /> Đặc quyền gói cước
              </h3>
              
              <ul className="space-y-4 mb-10">
                {chiTietUuDai.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="w-6 h-6 text-blue-500 mr-2" /> Lưu ý khi sử dụng
              </h3>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm text-gray-600 space-y-2">
                <p>- Để tra cứu lưu lượng còn lại, soạn <strong>KTTK gửi 191</strong>.</p>
                <p>- Hủy gia hạn: Soạn <strong>HUY gửi 191</strong>.</p>
                <p>- Hủy gói (mất Data còn lại): Soạn <strong>HUYDATA gửi 191</strong>.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;

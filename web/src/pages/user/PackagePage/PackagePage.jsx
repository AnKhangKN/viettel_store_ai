import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  MessageSquare,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getAllPackages } from '../../../api/package/package.api';

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

export default function PackagePage() {
  const navigate = useNavigate();

  // State dữ liệu từ API
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quản lý tìm kiếm và bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRange, setSelectedRange] = useState('Tất cả');

  // Danh sách bộ lọc theo khoảng giá
  const priceRanges = [
    { label: 'Tất cả', min: 0, max: Infinity },
    { label: 'Dưới 100k', min: 0, max: 100000 },
    { label: '100k - 200k', min: 100000, max: 200000 },
    { label: '200k - 300k', min: 200000, max: 300000 },
    { label: 'Trên 300k', min: 300000, max: Infinity },
  ];

  // Gọi API lấy danh sách gói cước
  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllPackages();
      if (res?.success && Array.isArray(res.data)) {
        setPackages(res.data);
      } else {
        setError('Không thể tải danh sách gói cước.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Logic lọc và tìm kiếm
  const currentRange = priceRanges.find((r) => r.label === selectedRange) || priceRanges[0];
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.ten_goi?.toLowerCase().includes(searchTerm.toLowerCase());
    const price = pkg.gia_cuoc || 0;
    const matchesRange = price >= currentRange.min && price < currentRange.max;
    return matchesSearch && matchesRange;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">

      {/* TIÊU ĐỀ TRANG */}
      <section className="bg-gradient-to-r from-gray-900 to-slate-800 text-white py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">DANH SÁCH GÓI CƯỚC VIETTEL</h1>
          <p className="text-gray-400 text-base mt-2 font-light">Tìm kiếm và lựa chọn gói cước Data, Thoại, Combo phù hợp nhất với nhu cầu sử dụng của bạn.</p>
        </div>
      </section>

      {/* BỘ LỌC VÀ TÌM KIẾM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* Ô Tìm Kiếm */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên gói cước..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-11 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Bộ Lọc Khoảng Giá */}
          <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-gray-500 mr-2 flex items-center">
              <Filter className="w-4 h-4 mr-1" /> Khoảng giá:
            </span>
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => setSelectedRange(range.label)}
                className={`px-5 py-2 rounded-xl text-base font-semibold transition-all ${
                  selectedRange === range.label
                    ? 'bg-[#EE0033] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* GRID GÓI CƯỚC */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Trạng thái loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-[#EE0033] mb-4" />
            <p className="text-base font-medium">Đang tải danh sách gói cước...</p>
          </div>
        )}

        {/* Trạng thái lỗi */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-red-100 shadow-sm max-w-xl mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
            <p className="text-gray-700 font-semibold text-base">{error}</p>
            <button
              onClick={fetchPackages}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#EE0033] text-white rounded-xl text-base font-bold hover:bg-red-700 transition"
            >
              <RefreshCw className="w-4 h-4" /> Thử lại
            </button>
          </div>
        )}

        {/* Danh sách gói cước */}
        {!loading && !error && (
          filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id_goi}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6">
                    {/* Tên Gói & Giá */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="text-xl font-black tracking-wide text-gray-900">{pkg.ten_goi}</h3>
                        {pkg.trang_thai && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                            pkg.trang_thai === 'DangApDung'
                              ? 'bg-green-50 text-green-600 border border-green-200'
                              : 'bg-gray-100 text-gray-400 border border-gray-200'
                          }`}>
                            {pkg.trang_thai === 'DangApDung' ? '● Đang áp dụng' : '○ Ngưng áp dụng'}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-[#EE0033]">{formatPrice(pkg.gia_cuoc)}</span>
                        <span className="text-base text-gray-400 block font-medium">/ {pkg.thoi_han_ngay || 30} ngày</span>
                      </div>
                    </div>

                    {/* Chi tiết */}
                    <div className="space-y-2.5 my-4">
                      <div className="flex items-center text-base">
                        <span className="text-gray-400 font-medium w-28 flex-shrink-0">Dung lượng:</span>
                        <span className="text-gray-900 font-bold bg-red-50 text-[#EE0033] px-2.5 py-0.5 rounded-md text-base border border-red-100">
                          {formatData(pkg.dung_luong_gb)}
                        </span>
                      </div>
                      <div className="flex items-center text-base">
                        <span className="text-gray-400 font-medium w-28 flex-shrink-0">Thời hạn:</span>
                        <span className="text-gray-900 font-semibold">{pkg.thoi_han_ngay || 30} ngày</span>
                      </div>
                      {pkg.mo_ta && (
                        <div className="flex items-start text-base mt-3 pt-2 border-t border-gray-50">
                          <span className="text-gray-400 font-medium w-28 flex-shrink-0">Mô tả:</span>
                          <p className="text-gray-600 text-base leading-relaxed font-normal">{pkg.mo_ta}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nút Xem chi tiết */}
                  <div className="p-4 md:p-6 pt-0 bg-gray-50/50 border-t border-gray-100">
                    <button
                      translate="no"
                      onClick={() => navigate(`/package/${pkg.id_goi}`)}
                      className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-2.5 md:py-3 rounded-xl text-sm md:text-base hover:bg-gray-50 transition shadow-sm flex items-center justify-center whitespace-nowrap"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Không tìm thấy */
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto">
              <p className="text-gray-400 font-medium text-lg">Không tìm thấy gói cước phù hợp</p>
              <p className="text-gray-400 text-base mt-1">Vui lòng thử lại với từ khóa hoặc bộ lọc khoảng giá khác.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedRange('Tất cả'); }}
                className="mt-4 text-base font-bold text-[#EE0033] hover:underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 pt-12 pb-6 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
          <div>
            <span className="text-2xl font-black tracking-wider text-white">viettel</span>
            <p className="mt-4 text-base text-gray-400 leading-relaxed">Tập đoàn Công nghiệp - Viễn thông Quân đội.<br />Cơ quan chủ quản: Bộ Quốc phòng.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-2 text-base">
              <li>Chăm sóc khách hàng di động: <span className="text-white font-semibold">1800 8098</span></li>
              <li>Hỗ trợ Internet cáp quang: <span className="text-white font-semibold">1800 8168</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Ứng dụng hỗ trợ</h4>
            <div className="text-base text-gray-400">Tải ngay MyViettel trên App Store hoặc Google Play để cập nhật nhanh chóng các biến động tài khoản.</div>
          </div>
        </div>
        <p className="text-center text-base text-gray-500 pt-6">© 2026 Viettel Telecom. All rights reserved.</p>
      </footer>

      {/* AI CHATBOT FLOAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center group relative">
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-14 bg-gray-900 text-white text-base font-semibold px-4 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md pointer-events-none">
            Hỏi AI Viettel ngay! ✨
          </span>
        </button>
      </div>

    </div>
  );
}
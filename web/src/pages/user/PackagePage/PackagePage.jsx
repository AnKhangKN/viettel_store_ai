import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowRight
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-16">

      {/* TIÊU ĐỀ TRANG (HERO HEADER) */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-14 px-4 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center md:text-left relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-[#EE0033] border border-red-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" /> Ưu đãi Data 4G / 5G
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">DANH SÁCH GÓI CƯỚC VIETTEL</h1>
            <p className="text-slate-400 text-sm mt-2 font-normal max-w-2xl leading-relaxed">
              Khám phá và đăng ký các gói cước Data tốc độ cao, Gọi thoại miễn phí với ưu đãi hấp dẫn nhất dành cho bạn.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 self-center md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-[#EE0033] text-white flex items-center justify-center font-black text-xl shadow-md">
              5G
            </div>
            <div className="text-left text-xs">
              <p className="font-extrabold text-white">Trải nghiệm tốc độ 5G</p>
              <p className="text-slate-300">Không giới hạn dung lượng truy cập</p>
            </div>
          </div>
        </div>
      </section>

      {/* BỘ LỌC VÀ TÌM KIẾM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col lg:flex-row gap-4 items-center justify-between">

          {/* Ô Tìm Kiếm */}
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên gói cước (VD: SD90, 5G150...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 w-5 h-5 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Bộ Lọc Khoảng Giá */}
          <div className="w-full lg:w-auto flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#EE0033]" /> Giá cước:
            </span>
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => setSelectedRange(range.label)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRange === range.label
                    ? 'bg-[#EE0033] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* GRID GÓI CƯỚC */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-[#EE0033] mb-4" />
            <p className="text-sm font-bold">Đang tải danh sách gói cước Viettel...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-red-100 shadow-sm max-w-xl mx-auto text-center px-6">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
            <p className="text-slate-800 font-bold text-base mb-1">{error}</p>
            <p className="text-xs text-slate-500 mb-4">Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.</p>
            <button
              onClick={fetchPackages}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#EE0033] text-white rounded-xl text-xs font-bold hover:bg-red-700 transition shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Thử lại
            </button>
          </div>
        )}

        {/* Package Grid */}
        {!loading && !error && (
          filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id_goi}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Header Card */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-red-50 text-[#EE0033] font-black px-3 py-1 rounded-lg text-lg tracking-wide border border-red-100">
                            {pkg.ten_goi}
                          </span>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">HOT</span>
                        </div>
                        {pkg.trang_thai && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${
                            pkg.trang_thai === 'DangApDung'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                            {pkg.trang_thai === 'DangApDung' ? '● Đang áp dụng' : '○ Ngưng áp dụng'}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-[#EE0033]">{formatPrice(pkg.gia_cuoc)}</span>
                        <span className="text-xs text-slate-400 block font-medium">/ {pkg.thoi_han_ngay || 30} ngày</span>
                      </div>
                    </div>

                    {/* Features & Data */}
                    <div className="space-y-3 my-4 text-xs">
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-500 font-medium">Dung lượng tốc độ cao:</span>
                        <span className="text-[#EE0033] font-extrabold text-sm bg-white px-2.5 py-1 rounded-lg shadow-2xs border border-red-100">
                          {formatData(pkg.dung_luong_gb)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-slate-600 px-1">
                        <span className="text-slate-400">Thời hạn sử dụng:</span>
                        <span className="font-bold text-slate-800">{pkg.thoi_han_ngay || 30} ngày</span>
                      </div>

                      {pkg.mo_ta && (
                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-slate-600 leading-relaxed line-clamp-2">{pkg.mo_ta}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/package/${pkg.id_goi}`)}
                      className="w-full bg-white border-2 border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs hover:border-[#EE0033] hover:text-[#EE0033] hover:bg-red-50/40 transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Xem chi tiết & Đăng ký</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-xl mx-auto px-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-slate-800 font-bold text-base">Không tìm thấy gói cước nào phù hợp</p>
              <p className="text-xs text-slate-500 mt-1">Vui lòng kiểm tra từ khóa tìm kiếm hoặc chọn lại bộ lọc khoảng giá.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedRange('Tất cả'); }}
                className="mt-4 text-xs font-extrabold text-[#EE0033] hover:underline cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )
        )}
      </main>

    </div>
  );
}
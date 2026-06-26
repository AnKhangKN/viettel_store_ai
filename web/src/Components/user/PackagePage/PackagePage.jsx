import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Phone,
  User,
  Filter,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function PackagePage() {
  // Dữ liệu mock dựa trên cấu trúc bảng GoiCuoc
  const initialGoiCuoc = [
    { maGoi: 'ST90', tenGoi: 'ST90', giaTien: '90.000đ', dungLuong: '30GB', thoiHan: '30 ngày', moTa: 'Ưu đãi sinh viên, miễn phí Data truy cập Tiktok', loai: 'Data' },
    { maGoi: 'V200C', tenGoi: 'COMBO V200C', giaTien: '200.000đ', dungLuong: '120GB', thoiHan: '30 ngày', moTa: 'Data & Thoại. Miễn phí gọi nội mạng < 20 phút', loai: 'Combo' },
    { maGoi: '5GFAST', tenGoi: '5GFAST', giaTien: '300.000đ', dungLuong: '200GB', thoiHan: '30 ngày', moTa: 'Tốc độ 5G siêu tốc, xem video 4K/8K không giật lag', loai: '5G' },
    { maGoi: 'ST60N', tenGoi: 'ST60N', giaTien: '60.000đ', dungLuong: '60GB', thoiHan: '30 ngày', moTa: '2GB/Ngày tốc độ cao. Hết dung lượng dừng truy cập', loai: 'Data' },
    { maGoi: 'MP70X', tenGoi: 'MP70X', giaTien: '70.000đ', dungLuong: 'Thoại thả ga', thoiHan: '30 ngày', moTa: 'Miễn phí tối đa 500 phút gọi nội mạng Viettel', loai: 'Thoại' },
    { maGoi: '5G150', tenGoi: '5G150', giaTien: '150.000đ', dungLuong: '180GB', thoiHan: '30 ngày', moTa: 'Trải nghiệm mạng 5G thế hệ mới, chu kỳ tháng', loai: '5G' },
  ];

  // State quản lý tìm kiếm và bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tất cả');

  // Danh sách danh mục lọc
  const categories = ['Tất cả', 'Data', 'Thoại', 'Combo', '5G'];

  // Logic lọc và tìm kiếm dữ liệu
  const filteredPackages = initialGoiCuoc.filter(pkg => {
    const matchesSearch = pkg.tenGoi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.maGoi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Tất cả' || pkg.loai === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">

      {/* HEADER ĐỒNG BỘ VỚI HOMEPAGE */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Viettel */}
            <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => window.location.href='/'}>
              <span className="text-[2.5rem] font-black tracking-tighter text-[#EE0033] drop-shadow-sm group-hover:text-[#A00022] transition-colors duration-300">viettel</span>
              <div className="w-2.5 h-2.5 bg-[#EE0033] rounded-full ml-1 mt-4 group-hover:animate-bounce shadow-sm"></div>
            </div>
            <nav className="hidden md:flex items-center gap-8 font-medium">
              <Link to="/" className="text-gray-600 hover:text-[#EE0033] transition">Trang chủ</Link>
              <Link to="/package" className="text-[#EE0033] border-b-2 border-[#EE0033] pb-1">Gói cước</Link>
              <a href="#" className="text-gray-600 hover:text-[#EE0033] transition">Dịch vụ di động</a>
              <a href="#" className="text-gray-600 hover:text-[#EE0033] transition">Tin tức</a>
            </nav>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-[#EE0033] font-bold bg-red-50 px-4 py-2 rounded-full border border-red-100">
                <Phone className="w-4 h-4 mr-2" />
                <span>Tổng đài: 1800 8098</span>
              </div>
              <button className="text-gray-600 hover:text-[#EE0033]"><User className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </header>

      {/* TIÊU ĐỀ TRANG TẬP TRUNG */}
      <section className="bg-gradient-to-r from-gray-900 to-slate-800 text-white py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">DANH SÁCH GÓI CƯỚC VIETTEL</h1>
          <p className="text-gray-400 text-base mt-2 font-light">Tìm kiếm và lựa chọn gói cước Data, Thoại, Combo phù hợp nhất với nhu cầu sử dụng của bạn.</p>
        </div>
      </section>

      {/* KHU VỰC BỘ LỌC VÀ TÌM KIẾM (FILTER BAR) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* Ô Tìm Kiếm */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã gói (Ví dụ: ST90, V200C)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-11 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-4.5" />
          </div>

          {/* Nhóm Bộ Lọc Loại Gói */}
          <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-gray-500 mr-2 flex items-center">
              <Filter className="w-4 h-4 mr-1" /> Loại gói:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedType(cat)}
                className={`px-5 py-2 rounded-xl text-base font-semibold transition-all ${selectedType === cat
                    ? 'bg-[#EE0033] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* GRID HIỂN THỊ CÁC THẺ GÓI CƯỚC DỰA TRÊN DỮ LIỆU BẢNG GOICUOC */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.maGoi}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Mã Gói & Giá */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="text-sm uppercase font-bold tracking-wider text-gray-400 mb-0.5">Mã Gói: {pkg.maGoi}</div>
                      <h3 className="text-xl font-black tracking-wide text-gray-900">{pkg.tenGoi}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#EE0033]">{pkg.giaTien}</span>
                      <span className="text-base text-gray-400 block font-medium">/ {pkg.thoiHan}</span>
                    </div>
                  </div>

                  {/* Chi tiết dữ liệu có cấu trúc */}
                  <div className="space-y-2.5 my-4">
                    <div className="flex items-center text-base">
                      <span className="text-gray-400 font-medium w-28 flex-shrink-0">Dung lượng:</span>
                      <span className="text-gray-900 font-bold bg-red-50 text-[#EE0033] px-2.5 py-0.5 rounded-md text-base border border-red-100">
                        {pkg.dungLuong}
                      </span>
                    </div>
                    <div className="flex items-center text-base">
                      <span className="text-gray-400 font-medium w-28 flex-shrink-0">Thời hạn:</span>
                      <span className="text-gray-900 font-semibold">{pkg.thoiHan}</span>
                    </div>
                    <div className="flex items-start text-base mt-3 pt-2 border-t border-gray-50">
                      <span className="text-gray-400 font-medium w-28 flex-shrink-0">Mô tả:</span>
                      <p className="text-gray-600 text-base leading-relaxed font-normal">{pkg.moTa}</p>
                    </div>
                  </div>
                </div>

                {/* Các nút Chức năng: Xem chi tiết & Đăng ký gói cước */}
                <div className="p-6 pt-0 grid grid-cols-2 gap-4 bg-gray-50/50 border-t border-gray-100">
                  <button className="w-full bg-white border border-gray-300 text-gray-600 font-bold py-2.5 rounded-xl text-base hover:bg-gray-100 transition shadow-sm">
                    Xem chi tiết
                  </button>
                  <button className="w-full bg-[#EE0033] text-white font-bold py-2.5 rounded-xl text-base hover:bg-[#CC002D] transition shadow-md shadow-red-600/10 flex items-center justify-center">
                    Đăng ký gói cước
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Trạng thái không tìm thấy dữ liệu */
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto">
            <p className="text-gray-400 font-medium text-lg">Không tìm thấy gói cước phù hợp</p>
            <p className="text-gray-400 text-base mt-1">Vui lòng thử lại với từ khóa hoặc bộ lọc loại gói khác.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedType('Tất cả'); }}
              className="mt-4 text-base font-bold text-[#EE0033] hover:underline"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </main>

      {/* FOOTER ĐỒNG BỘ */}
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
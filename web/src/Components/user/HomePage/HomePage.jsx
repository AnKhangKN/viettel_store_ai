import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  Search,
  User,
  CreditCard,
  Smartphone,
  Clock,
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';

export default function HomePage() {
  // Dữ liệu gói cước nổi bật
  const hotPackages = [
    { maGoi: 'ST90N', tenGoi: 'ST90N', giaTien: '90.000đ', dungLuong: '4GB/Ngày', thoiHan: '30 ngày', moTa: 'Miễn phí data truy cập Tiktok' },
    { maGoi: 'V200C', tenGoi: 'V200C', giaTien: '200.000đ', dungLuong: '4GB/Ngày', thoiHan: '30 ngày', moTa: 'Miễn phí gọi nội mạng dưới 20 phút + 100 phút ngoại mạng' },
    { maGoi: '5G150', tenGoi: '5G150', giaTien: '150.000đ', dungLuong: '6GB/Ngày', thoiHan: '30 ngày', moTa: 'Trải nghiệm data 5G siêu tốc độ cao' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">

      {/* 1. TOP BAR & HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo Viettel */}
            <div className="flex-shrink-0 flex items-center cursor-pointer group">
              <span className="text-[2.5rem] font-black tracking-tighter text-[#EE0033] drop-shadow-sm group-hover:text-[#A00022] transition-colors duration-300">viettel</span>
              <div className="w-2.5 h-2.5 bg-[#EE0033] rounded-full ml-1 mt-4 group-hover:animate-bounce shadow-sm"></div>
            </div>

            {/* Menu chính */}
            <nav className="hidden md:flex items-center gap-8 font-medium">
              <Link to="/" className="text-[#EE0033] border-b-2 border-[#EE0033] pb-1">Trang chủ</Link>
              <Link to="/package" className="text-gray-600 hover:text-[#EE0033] transition">Gói cước</Link>
              <a href="#" className="text-gray-600 hover:text-[#EE0033] transition">Dịch vụ di động</a>
              <a href="#" className="text-gray-600 hover:text-[#EE0033] transition">Tin tức</a>
            </nav>

            {/* Số tổng đài & Tiện ích */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-[#EE0033] font-bold bg-red-50 px-4 py-2 rounded-full border border-red-100">
                <Phone className="w-4 h-4 mr-2 animate-pulse" />
                <span>Tổng đài: 1800 8098</span>
              </div>
              <button className="text-gray-600 hover:text-[#EE0033]">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-[#EE0033]">
                <User className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. BANNER CÁC GÓI CƯỚC NỔI BẬT (HERO SECTION) */}
      <section className="relative bg-gradient-to-r from-[#EE0033] to-[#A00022] text-white py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          <div className="space-y-6">
            <span className="bg-white/20 text-white text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-sm">
              Công nghệ tiên phong
            </span>
            <h1 className="text-4xl md:text-5xl font-black leading-snug">
              BÙNG NỔ TRẢI NGHIỆM <br />
              <span className="text-yellow-300">5G SIÊU TỐC ĐỘ</span>
            </h1>
            <p className="text-lg text-white/90 font-light max-w-md mt-4 leading-relaxed">
              Đăng ký ngay hôm nay để nhận ưu đãi lên đến 6GB Data tốc độ cao mỗi ngày. Lướt web, xem phim, chiến game thả ga không lo ngắt quãng!
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button className="bg-white text-[#EE0033] font-black px-8 py-3.5 rounded-xl shadow-[0_6px_0_#e5e7eb] hover:shadow-[0_8px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all flex items-center group">
                Đăng ký ngay
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white/80 text-white font-bold px-8 py-3.5 rounded-lg hover:bg-white/10 transition">
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          {/* Khối minh họa Banner */}
          <div className="hidden md:flex justify-center relative" style={{ perspective: '1000px' }}>
            <div className="w-72 h-72 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full absolute -top-4 opacity-30 blur-2xl animate-pulse"></div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border-t border-l border-white/40 border-r border-b border-white/10 shadow-[20px_20px_40px_-10px_rgba(0,0,0,0.5)] text-center w-80 relative z-10 transition-all duration-500 hover:shadow-[30px_30px_50px_-15px_rgba(0,0,0,0.6)] hover:rotate-0" style={{ transform: 'rotateX(15deg) rotateY(-20deg) translateZ(50px)', transformStyle: 'preserve-3d' }}>
              <div style={{ transform: 'translateZ(40px)' }}>
                <span className="text-base font-bold tracking-widest text-yellow-300 uppercase drop-shadow-md">Gói Cước Hot Nhất</span>
                <h3 className="text-6xl font-black my-4 drop-shadow-xl text-white">5G150</h3>
                <p className="text-xl font-semibold text-white/90 drop-shadow-md">180 GB / Tháng</p>
                <div className="border-t border-white/20 my-4 shadow-[0_2px_0_rgba(255,255,255,0.1)]"></div>
                <p className="text-base text-white/80 drop-shadow-sm">Chỉ 150.000đ cho 30 ngày sử dụng</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. KHU VỰC NÚT CHỨC NĂNG CHÍNH (QUICK ACTIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <button className="flex items-center p-4 rounded-xl bg-white border-2 border-red-100 shadow-[0_6px_0_#fecaca] hover:shadow-[0_8px_0_#fca5a5] hover:-translate-y-1 active:shadow-[0_0px_0_#fca5a5] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-4 rounded-xl bg-[#EE0033] text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 group-hover:text-[#EE0033] transition">Xem gói cước</h4>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Tra cứu ưu đãi Data, Thoại</p>
            </div>
          </button>

          <button className="flex items-center p-4 rounded-xl bg-white border-2 border-red-100 shadow-[0_6px_0_#fecaca] hover:shadow-[0_8px_0_#fca5a5] hover:-translate-y-1 active:shadow-[0_0px_0_#fca5a5] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-4 rounded-xl bg-[#EE0033] text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 group-hover:text-[#EE0033] transition">Mua SIM online</h4>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Chọn số đẹp, giao tận nhà</p>
            </div>
          </button>

          <button className="flex items-center p-4 rounded-xl bg-white border-2 border-red-100 shadow-[0_6px_0_#fecaca] hover:shadow-[0_8px_0_#fca5a5] hover:-translate-y-1 active:shadow-[0_0px_0_#fca5a5] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-4 rounded-xl bg-[#EE0033] text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 group-hover:text-[#EE0033] transition">Đặt lịch tại quầy</h4>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Hẹn giờ trước, không lo đợi</p>
            </div>
          </button>

          <button className="flex items-center p-4 rounded-xl bg-white border-2 border-purple-200 shadow-[0_6px_0_#e9d5ff] hover:shadow-[0_8px_0_#d8b4fe] hover:-translate-y-1 active:shadow-[0_0px_0_#d8b4fe] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition flex items-center">
                Chat với AI
                <span className="ml-1.5 flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              </h4>
              <p className="text-base text-gray-500 mt-1">Trợ lý ảo hỗ trợ 24/7</p>
            </div>
          </button>

        </div>
      </section>

      {/* 4. DANH SÁCH GÓI CƯỚC NỔI BẬT (DỮ LIỆU) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-base font-bold text-[#EE0033] tracking-wider uppercase">Gợi ý dành cho bạn</span>
            <h2 className="text-3xl font-black text-gray-900 mt-1">Các Gói Cước Thịnh Hành Nhất</h2>
          </div>
          <a href="#" className="text-[#EE0033] font-bold flex items-center mt-4 md:mt-0 hover:underline">
            Xem tất cả gói cước <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Grid danh sách */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hotPackages.map((pkg) => (
            <div key={pkg.maGoi} className="bg-white rounded-2xl border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(238,0,51,0.25)] hover:-translate-y-3 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <div className="p-6">
                {/* Header Card */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-red-50 text-[#EE0033] font-black px-4 py-2 rounded-lg text-lg tracking-wide border border-red-100">
                    {pkg.tenGoi}
                  </span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">{pkg.giaTien}</p>
                    <p className="text-base text-gray-400 font-medium">/ {pkg.thoiHan}</p>
                  </div>
                </div>

                {/* Data Info */}
                <div className="bg-gray-50 rounded-xl p-4 my-4 flex items-center justify-between">
                  <span className="text-base text-gray-500">Dung lượng tốc độ cao:</span>
                  <span className="font-bold text-[#EE0033] text-lg">{pkg.dungLuong}</span>
                </div>

                <p className="text-base text-gray-600 line-clamp-3 mt-4 font-normal leading-loose">
                  {pkg.moTa}
                </p>
              </div>

              {/* Footer Card Action */}
              <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/50 group-hover:bg-white transition-colors">
                <button className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl shadow-[0_4px_0_#e5e7eb] hover:shadow-[0_6px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 hover:border-gray-300 transition-all">
                  Đăng ký gói
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LIÊN HỆ & CHÂN TRANG (FOOTER) */}
      <footer className="bg-gray-900 text-gray-400 mt-24 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
          <div>
            <div className="flex items-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer inline-flex group">
              <span className="text-4xl font-black tracking-tighter text-white drop-shadow-md">viettel</span>
              <div className="w-2.5 h-2.5 bg-white rounded-full ml-1 mt-4 group-hover:animate-bounce"></div>
            </div>
            <p className="mt-6 text-base text-gray-400 leading-loose">
              Tập đoàn Công nghiệp - Viễn thông Quân đội. <br />
              Cơ quan chủ quản: Bộ Quốc phòng.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-4 text-base">
              <li>Chăm sóc khách hàng di động: <span className="text-white font-semibold">1800 8098</span></li>
              <li>Hỗ trợ Internet cáp quang: <span className="text-white font-semibold">1800 8168</span></li>
              <li>Email: cskh@viettel.com.vn</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Tải ứng dụng MyViettel</h4>
            <div className="flex gap-4">
              <div className="bg-gray-800 p-3 rounded-lg text-center text-base text-white cursor-pointer hover:bg-gray-700 w-32">App Store</div>
              <div className="bg-gray-800 p-3 rounded-lg text-center text-base text-white cursor-pointer hover:bg-gray-700 w-32">Google Play</div>
            </div>
          </div>
        </div>
        <p className="text-center text-base text-gray-500 pt-6">© 2026 Viettel Telecom. All rights reserved.</p>
      </footer>

      {/* AI FLOAT BUTTON BLOCK (Chat nhanh góc màn hình) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link to="/chatbot" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-[0_8px_0_#4c1d95] hover:shadow-[0_12px_0_#4c1d95] hover:-translate-y-2 active:shadow-[0_0px_0_#4c1d95] active:translate-y-1 transition-all duration-200 flex items-center justify-center group relative">
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-14 bg-gray-900 text-white text-base font-semibold px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md pointer-events-none">
            Hỏi AI Viettel ngay! ✨
          </span>
        </Link>
      </div>

    </div>
  );
}
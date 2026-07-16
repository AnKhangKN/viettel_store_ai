import React, { useState, useEffect } from 'react';
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
  Bot,
  MapPin
} from 'lucide-react';
import { getAllBranches } from "../../../api/branch/branch.api";
import BranchMapSection from "./components/BranchMapSection";

export default function HomePage() {
  const [branchStores, setBranchStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await getAllBranches();
        if (res?.success && res?.data && res.data.length > 0) {
          const formattedStores = res.data.map(store => ({
            name: store.ten_chi_nhanh,
            address: store.dia_chi,
            mapUrl: store.map_url || "",
            phone: store.so_hotline
          }));
          setBranchStores(formattedStores);
          setSelectedStore(formattedStores[0]);
        }
      } catch (error) {
        console.error("Lỗi fetch chi nhánh ở HomePage:", error);
      }
    };
    fetchStores();
  }, []);

  // Dữ liệu gói cước nổi bật
  const hotPackages = [
    { maGoi: 'ST90N', tenGoi: 'ST90N', giaTien: '90.000đ', dungLuong: '4GB/Ngày', thoiHan: '30 ngày', moTa: 'Miễn phí data truy cập Tiktok' },
    { maGoi: 'V200C', tenGoi: 'V200C', giaTien: '200.000đ', dungLuong: '4GB/Ngày', thoiHan: '30 ngày', moTa: 'Miễn phí gọi nội mạng dưới 20 phút + 100 phút ngoại mạng' },
    { maGoi: '5G150', tenGoi: '5G150', giaTien: '150.000đ', dungLuong: '6GB/Ngày', thoiHan: '30 ngày', moTa: 'Trải nghiệm data 5G siêu tốc độ cao' },
  ];

  const backgroundImages = [
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  ];

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">



      {/* 2. BANNER CÁC GÓI CƯỚC NỔI BẬT (HERO SECTION) */}
      <section className="relative bg-gradient-to-r from-[#EE0033] to-[#A00022] text-white py-28 px-4 overflow-hidden" style={{ perspective: '1200px' }}>
        {backgroundImages.map((img, index) => {
          let transformClass = '';
          if (index === currentBg) {
            transformClass = 'translate-x-0 opacity-20 scale-100 z-10';
          } else if (index === (currentBg - 1 + backgroundImages.length) % backgroundImages.length) {
            // Outgoing image slides to the right
            transformClass = 'translate-x-full opacity-0 scale-90 z-0';
          } else {
            // Incoming image comes from the left
            transformClass = '-translate-x-full opacity-0 scale-90 z-0';
          }

          return (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-[1500ms] ease-in-out ${transformClass}`}
              style={{
                backgroundImage: `url('${img}')`,
              }}
            ></div>
          );
        })}
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
              <Link to="/package" className="bg-white font-black px-8 py-3.5 rounded-xl shadow-[0_6px_0_#e5e7eb] hover:shadow-[0_8px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all flex items-center group" style={{ color: '#EE0033' }}>
                Dịch vụ gói cước
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
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

          <Link to="/package" className="flex items-center p-4 rounded-xl bg-white border-2 border-red-100 shadow-[0_6px_0_#fecaca] hover:shadow-[0_8px_0_#fca5a5] hover:-translate-y-1 active:shadow-[0_0px_0_#fca5a5] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-4 rounded-xl bg-[#EE0033] text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 group-hover:text-[#EE0033] transition">Xem gói cước</h4>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Tra cứu ưu đãi Data, Thoại</p>
            </div>
          </Link>

          <Link to="/buysim" className="flex items-center p-4 rounded-xl bg-white border-2 border-red-100 shadow-[0_6px_0_#fecaca] hover:shadow-[0_8px_0_#fca5a5] hover:-translate-y-1 active:shadow-[0_0px_0_#fca5a5] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-4 rounded-xl bg-[#EE0033] text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 group-hover:text-[#EE0033] transition">Mua SIM online</h4>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Chọn số đẹp, giao tận nhà</p>
            </div>
          </Link>

          <Link to="/appointment" className="flex items-center p-4 rounded-xl bg-white border-2 border-red-100 shadow-[0_6px_0_#fecaca] hover:shadow-[0_8px_0_#fca5a5] hover:-translate-y-1 active:shadow-[0_0px_0_#fca5a5] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-4 rounded-xl bg-[#EE0033] text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 group-hover:text-[#EE0033] transition">Đặt lịch tại quầy</h4>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Hẹn giờ trước, không lo đợi</p>
            </div>
          </Link>

          <Link to="/chatbot" className="flex items-center p-4 rounded-xl bg-white border-2 border-purple-200 shadow-[0_6px_0_#e9d5ff] hover:shadow-[0_8px_0_#d8b4fe] hover:-translate-y-1 active:shadow-[0_0px_0_#d8b4fe] active:translate-y-1 transition-all duration-200 text-left group">
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
          </Link>

        </div>
      </section>

      {/* 4. DANH SÁCH GÓI CƯỚC NỔI BẬT (DỮ LIỆU) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-base font-bold text-[#EE0033] tracking-wider uppercase">Gợi ý dành cho bạn</span>
            <h2 className="text-3xl font-black text-gray-900 mt-1">Các Gói Cước Thịnh Hành Nhất</h2>
          </div>
          <Link to="/package" className="text-[#EE0033] font-bold flex items-center mt-4 md:mt-0 hover:underline">
            Xem tất cả gói cước <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
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
                <Link to={`/package/${pkg.maGoi}`} className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl shadow-[0_4px_0_#e5e7eb] hover:shadow-[0_6px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 hover:border-gray-300 transition-all flex items-center justify-center">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE VIETTEL SECTION */}
      <section className="bg-white py-20 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#EE0033] font-bold tracking-widest uppercase text-sm mb-2 block">Giá trị đích thực</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Vì sao nên chọn Viettel?</h2>
            <div className="w-20 h-1.5 bg-[#EE0033] mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-red-100">
                <Sparkles className="w-10 h-10 text-[#EE0033]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#EE0033] transition-colors">Sóng khỏe mọi nơi</h3>
              <p className="text-gray-600 leading-relaxed">
                Phủ sóng 99% diện tích Việt Nam. Dù bạn ở miền núi, hải đảo hay vùng sâu vùng xa, Viettel luôn đồng hành cùng bạn.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-blue-100">
                <Smartphone className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Công nghệ 5G tiên phong</h3>
              <p className="text-gray-600 leading-relaxed">
                Trải nghiệm internet siêu tốc độ với mạng 5G hàng đầu. Tải phim, chiến game thả ga không độ trễ.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-green-100">
                <User className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">Chăm sóc 24/7</h3>
              <p className="text-gray-600 leading-relaxed">
                Đội ngũ tổng đài viên và trợ lý ảo AI luôn sẵn sàng hỗ trợ bạn bất kể ngày đêm, mọi lúc mọi nơi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#EE0033] font-bold tracking-widest uppercase text-sm mb-2 block">Trải nghiệm không giới hạn</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Khám Phá Công Nghệ Viettel</h2>
            <div className="w-20 h-1.5 bg-[#EE0033] mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl border-4 border-white aspect-video bg-black group">
            {/* Play button overlay (optional, since youtube has one, but can add polish) */}
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/5dmLpdy3Lr8?si=O39kM2-W8q8y9QzN&amp;controls=1&amp;rel=0&amp;autoplay=1&amp;mute=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen>
            </iframe>
          </div>
          <p className="text-center text-gray-500 mt-6 italic">Viettel - Theo cách của bạn</p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-[#EE0033] py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-2 drop-shadow-md">70M+</div>
              <div className="text-red-100 font-medium text-sm md:text-base uppercase tracking-wide">Khách hàng tin dùng</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-2 drop-shadow-md">99%</div>
              <div className="text-red-100 font-medium text-sm md:text-base uppercase tracking-wide">Phủ sóng toàn quốc</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-2 drop-shadow-md">63</div>
              <div className="text-red-100 font-medium text-sm md:text-base uppercase tracking-wide">Tỉnh thành & Đảo xa</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-2 drop-shadow-md">24/7</div>
              <div className="text-red-100 font-medium text-sm md:text-base uppercase tracking-wide">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* UTILITY SERVICES SECTION */}
      <section className="bg-gray-50 py-24 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#EE0033] font-bold tracking-widest uppercase text-sm mb-2 block">Hệ sinh thái đa dạng</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Dịch vụ Tiện ích Hàng đầu</h2>
            <div className="w-20 h-1.5 bg-[#EE0033] mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Gói cước */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7 text-[#EE0033]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gói cước di động</h3>
              <p className="text-gray-500 mb-6">Đa dạng gói Data, Thoại, Combo siêu ưu đãi phù hợp mọi nhu cầu.</p>
              <Link to="/package" className="text-[#EE0033] font-bold flex items-center group-hover:underline">Khám phá <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>

            {/* 2. Kho SIM */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kho SIM số đẹp</h3>
              <p className="text-gray-500 mb-6">Sở hữu ngay SIM VIP, phong thủy, thần tài với giá cực kỳ hấp dẫn.</p>
              <Link to="/buysim" className="text-blue-600 font-bold flex items-center group-hover:underline">Khám phá <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>

            {/* 3. AI Chatbot */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trợ lý AI Chatbot</h3>
              <p className="text-gray-500 mb-6">Giải đáp thắc mắc, tư vấn gói cước tự động 24/7 thông minh.</p>
              <Link to="/chatbot" className="text-purple-600 font-bold flex items-center group-hover:underline">Khám phá <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>

            {/* 4. Đặt lịch */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Đặt lịch tại quầy</h3>
              <p className="text-gray-500 mb-6">Chủ động thời gian, không lo xếp hàng chờ đợi khi đến giao dịch.</p>
              <Link to="/appointment" className="text-orange-600 font-bold flex items-center group-hover:underline">Khám phá <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD SECTION */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center border border-red-100">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[#EE0033] font-bold text-sm shadow-sm mb-6 border border-red-100">
                <Bot className="w-5 h-5" /> Siêu ứng dụng My Viettel
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                Mọi tiện ích Viettel <br /> nay đã nằm trong <span className="text-[#EE0033]">tầm tay bạn</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-lg leading-relaxed">
                Quản lý cước phí, đăng ký gói data, mua sắm thả ga và nhận vô vàn voucher khuyến mãi mỗi ngày. Tải ứng dụng ngay!
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.55-.86 1.48-.07 2.76.67 3.56 1.6-3.05 1.73-2.54 5.31.25 6.34-.69 1.77-1.49 3.65-2.44 5.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                  <div>
                    <div className="text-[10px] uppercase font-medium">Download on the</div>
                    <div className="text-lg leading-none">App Store</div>
                  </div>
                </button>
                <button className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.6 20.9l11.8-6.8-4-3.9-7.8 10.7zM2 3.1v17.8c0 .4.2.7.5.8l8-10.9L2 3.1zM16.6 13.4l4.5-2.6c.7-.4.7-1.1 0-1.5l-4.5-2.6-2.5 2.5 2.5 2.6zM11.4 10L3.3 2.1c-.2-.1-.4-.1-.6-.1-.3 0-.6.1-.7.4l9.4 7.6z" /></svg>
                  <div>
                    <div className="text-[10px] uppercase font-medium">GET IT ON</div>
                    <div className="text-lg leading-none">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center relative">
              <div className="w-72 h-72 bg-gradient-to-br from-red-400 to-pink-500 rounded-full blur-3xl opacity-30 absolute top-10 animate-pulse"></div>
              {/* Mockup Frame */}
              <div className="w-64 h-[500px] bg-white border-[8px] border-gray-900 rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col">
                <div className="w-32 h-6 bg-gray-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-3xl z-20"></div>
                <div className="bg-[#EE0033] h-40 w-full p-4 text-white pt-10">
                  <div className="font-bold">Viettel Store</div>
                  <div className="text-2xl font-black mt-2">12,500 Điểm</div>
                </div>
                <div className="flex-1 bg-gray-50 p-4">
                  <div className="w-full h-24 bg-white rounded-xl shadow-sm mb-4"></div>
                  <div className="w-full h-24 bg-white rounded-xl shadow-sm mb-4"></div>
                  <div className="w-full h-24 bg-white rounded-xl shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-10">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.83L18.17 20H5.83L12 5.83z" /></svg>
          </div>

          <div className="relative z-10 md:w-2/3 mb-8 md:mb-0">
            <div className="inline-block bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-md text-sm mb-4">Ưu đãi độc quyền</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Giảm ngay 20% khi <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">mua SIM số đẹp</span> online
            </h2>
            <p className="text-gray-300 text-lg">Chương trình áp dụng duy nhất trong tháng này. Giao SIM tận nhà miễn phí 100%.</p>
          </div>

          <div className="relative z-10">
            <Link to="/buysim" className="bg-[#EE0033] hover:bg-red-700 text-white font-black px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(238,0,51,0.5)] flex items-center hover:scale-105">
              Chọn số ngay
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* MAP & BRANCHES SECTION */}
      <BranchMapSection
        branchStores={branchStores}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
      />

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
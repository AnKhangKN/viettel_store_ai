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
  MapPin,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Tv,
  Play
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
    { maGoi: 'ST90N', tenGoi: 'ST90N', giaTien: '90.000đ', dungLuong: '4GB/Ngày', thoiHan: '30 ngày', moTa: 'Miễn phí data truy cập Tiktok & gọi nội mạng' },
    { maGoi: 'V200C', tenGoi: 'V200C', giaTien: '200.000đ', dungLuong: '4GB/Ngày', thoiHan: '30 ngày', moTa: 'Miễn phí gọi nội mạng dưới 20 phút + 100 phút ngoại mạng' },
    { maGoi: '5G150', tenGoi: '5G150', giaTien: '150.000đ', dungLuong: '6GB/Ngày', thoiHan: '30 ngày', moTa: 'Trải nghiệm data 5G siêu tốc độ cao không lo gián đoạn' },
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">

      {/* BANNER CÁC GÓI CƯỚC NỔI BẬT (HERO SECTION - TỶ LỆ CHUẨN) */}
      <section className="relative bg-gradient-to-r from-[#EE0033] via-[#D0002C] to-[#A00022] text-white py-24 px-4 overflow-hidden" style={{ perspective: '1200px' }}>
        {backgroundImages.map((img, index) => {
          let transformClass = '';
          if (index === currentBg) {
            transformClass = 'translate-x-0 opacity-20 scale-100 z-10';
          } else if (index === (currentBg - 1 + backgroundImages.length) % backgroundImages.length) {
            transformClass = 'translate-x-full opacity-0 scale-90 z-0';
          } else {
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
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-md border border-white/30 shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" /> Công nghệ tiên phong 5G Viettel
            </span>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight drop-shadow-md tracking-tight">
              BÙNG NỔ TRẢI NGHIỆM <br />
              <span className="text-[#FBBF24] drop-shadow-lg">5G SIÊU TỐC ĐỘ</span>
            </h1>
            <p className="text-base sm:text-lg text-white/95 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-xs">
              Đăng ký ngay hôm nay để nhận ưu đãi lên đến 6GB Data tốc độ cao mỗi ngày. Lướt web, xem phim 4K, chiến game mượt mà không lo ngắt quãng!
            </p>
            <div className="flex flex-wrap gap-4 pt-2 justify-center lg:justify-start">
              <Link to="/package" className="bg-white text-[#EE0033] font-black px-8 py-3.5 rounded-xl text-sm sm:text-base shadow-[0_6px_0_#e5e7eb] hover:shadow-[0_8px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all flex items-center group">
                Khám phá gói cước
                <ArrowRight className="w-4.5 h-4.5 ml-2 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link to="/buysim" className="border-2 border-white/80 text-white font-bold px-8 py-3.5 rounded-xl text-sm sm:text-base hover:bg-white/15 transition backdrop-blur-xs flex items-center">
                Chọn SIM số đẹp
              </Link>
            </div>
          </div>

          {/* Khối minh họa Banner 3D */}
          <div className="hidden lg:flex justify-center relative" style={{ perspective: '1000px' }}>
            <div className="w-72 h-72 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full absolute -top-4 opacity-35 blur-3xl animate-pulse"></div>
            <div className="bg-white/15 backdrop-blur-md p-6 rounded-3xl border-t-2 border-l-2 border-white/50 border-r border-b border-white/20 shadow-[20px_20px_40px_-10px_rgba(0,0,0,0.5)] text-center w-80 relative z-10 transition-all duration-500 hover:shadow-[30px_30px_50px_-15px_rgba(0,0,0,0.6)] hover:rotate-0" style={{ transform: 'rotateX(15deg) rotateY(-20deg) translateZ(50px)', transformStyle: 'preserve-3d' }}>
              <div style={{ transform: 'translateZ(40px)' }}>
                <span className="text-xs font-black tracking-widest text-yellow-300 uppercase drop-shadow-md">Gói Cước Hot Nhất</span>
                <h3 className="text-6xl font-black my-4 drop-shadow-xl text-white tracking-tight">5G150</h3>
                <p className="text-xl font-black text-white/95 drop-shadow-md">180 GB / Tháng</p>
                <div className="border-t border-white/20 my-4 shadow-[0_2px_0_rgba(255,255,255,0.1)]"></div>
                <p className="text-sm font-bold text-white/90 drop-shadow-sm">Chỉ 150.000đ cho 30 ngày sử dụng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS SECTION (TỶ LỆ CHUẨN XÁC, THOÁNG MẮT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <Link to="/package" className="flex items-center p-4.5 rounded-2xl bg-white border-2 border-red-100 shadow-[0_6px_0_#fecaca] hover:shadow-[0_8px_0_#fca5a5] hover:-translate-y-1 active:shadow-[0_0px_0_#fca5a5] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-3.5 rounded-2xl bg-[#EE0033] text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 group-hover:text-[#EE0033] transition">Gói Cước 4G/5G</h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">Tra cứu ưu đãi Data, Thoại</p>
            </div>
          </Link>

          <Link to="/buysim" className="flex items-center p-4.5 rounded-2xl bg-white border-2 border-red-100 shadow-[0_6px_0_#fecaca] hover:shadow-[0_8px_0_#fca5a5] hover:-translate-y-1 active:shadow-[0_0px_0_#fca5a5] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-3.5 rounded-2xl bg-[#EE0033] text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 group-hover:text-[#EE0033] transition">SIM Số Đẹp</h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">Chọn số VIP, giao tận nhà</p>
            </div>
          </Link>

          <Link to="/appointment" className="flex items-center p-4.5 rounded-2xl bg-white border-2 border-red-100 shadow-[0_6px_0_#fecaca] hover:shadow-[0_8px_0_#fca5a5] hover:-translate-y-1 active:shadow-[0_0px_0_#fca5a5] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-3.5 rounded-2xl bg-[#EE0033] text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 group-hover:text-[#EE0033] transition">Đặt Số Quầy</h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">Hẹn giờ trước, không đợi</p>
            </div>
          </Link>

          <Link to="/chatbot" className="flex items-center p-4.5 rounded-2xl bg-white border-2 border-purple-200 shadow-[0_6px_0_#e9d5ff] hover:shadow-[0_8px_0_#d8b4fe] hover:-translate-y-1 active:shadow-[0_0px_0_#d8b4fe] active:translate-y-1 transition-all duration-200 text-left group">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white mr-4 shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 group-hover:text-purple-600 transition flex items-center">
                Trợ Lý AI
                <span className="ml-1.5 flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Tư vấn thông minh 24/7</p>
            </div>
          </Link>

        </div>
      </section>

      {/* DANH SÁCH GÓI CƯỚC NỔI BẬT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-black text-[#EE0033] tracking-widest uppercase bg-red-50 px-3.5 py-1 rounded-full border border-red-100">Gợi ý ưu đãi 2026</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">Gói Cước Thịnh Hành Nhất</h2>
          </div>
          <Link to="/package" className="text-[#EE0033] font-bold text-sm flex items-center mt-3 md:mt-0 hover:underline">
            Xem tất cả gói cước <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Grid gói cước */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotPackages.map((pkg) => (
            <div key={pkg.maGoi} className="bg-white rounded-2xl border-2 border-slate-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(238,0,51,0.25)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-red-50 text-[#EE0033] font-black px-4 py-1.5 rounded-xl text-lg tracking-wide border border-red-100">
                    {pkg.tenGoi}
                  </span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">{pkg.giaTien}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">/ {pkg.thoiHan}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 my-4 flex items-center justify-between border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Dung lượng tốc độ cao:</span>
                  <span className="font-extrabold text-[#EE0033] text-base">{pkg.dungLuong}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 font-medium leading-relaxed">
                  {pkg.moTa}
                </p>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 bg-slate-50/50 group-hover:bg-white transition-colors">
                <Link to={`/package/${pkg.maGoi}`} className="w-full bg-white border-2 border-slate-200 text-slate-800 font-extrabold py-2.5 rounded-xl text-xs shadow-[0_3px_0_#e5e7eb] hover:shadow-[0_5px_0_#d1d5db] hover:-translate-y-0.5 active:shadow-[0_0px_0_#d1d5db] active:translate-y-0.5 hover:border-slate-300 transition-all flex items-center justify-center">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE VIETTEL SECTION */}
      <section className="bg-white py-20 relative overflow-hidden border-y border-slate-100">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-[#EE0033] font-bold tracking-widest uppercase text-xs mb-1.5 block">Giá trị đích thực</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Vì Sao Chọn Viettel Telecom?</h2>
            <div className="w-16 h-1.5 bg-[#EE0033] mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100">
              <div className="w-20 h-20 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-5 group-hover:-translate-y-1.5 transition-transform duration-300 shadow-sm border border-red-100">
                <Zap className="w-10 h-10 text-[#EE0033]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#EE0033] transition-colors">Sóng Khỏe Mọi Nơi</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Phủ sóng 99% diện tích Việt Nam. Dù bạn ở hải đảo hay vùng sâu vùng xa, Viettel luôn đồng hành bên bạn.
              </p>
            </div>

            <div className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100">
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:-translate-y-1.5 transition-transform duration-300 shadow-sm border border-blue-100">
                <Smartphone className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Công Nghệ 5G Tiên Phong</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Trải nghiệm internet siêu tốc độ với hạ tầng 5G hàng đầu thế giới. Tải phim 4K, chiến game không độ trễ.
              </p>
            </div>

            <div className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100">
              <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 group-hover:-translate-y-1.5 transition-transform duration-300 shadow-sm border border-emerald-100">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">Chăm Sóc 24/7</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Đội ngũ tổng đài viên chuyên nghiệp và Trợ lý AI sẵn sàng giải đáp thắc mắc của bạn 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO QUẢNG CÁO NỔI BẬT */}
      <section className="bg-slate-900 text-white py-20 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <span className="text-[#FBBF24] font-bold tracking-widest uppercase text-xs mb-1.5 block flex items-center justify-center gap-1.5">
              <Tv className="w-4 h-4 text-yellow-400" /> Trải nghiệm viễn thông đột phá
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">Khám Phá Công Nghệ Viettel 5G</h2>
            <div className="w-16 h-1 bg-[#EE0033] mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20 aspect-video bg-black group">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/5dmLpdy3Lr8?si=O39kM2-W8q8y9QzN&amp;controls=1&amp;rel=0&amp;autoplay=1&amp;mute=1"
              title="Viettel Telecom Promo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen>
            </iframe>
          </div>
          <p className="text-center text-slate-400 text-xs mt-4 font-medium italic">Viettel - Theo cách của bạn</p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-gradient-to-r from-[#EE0033] via-[#D0002C] to-[#A00022] py-16 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-1.5 drop-shadow-md tracking-tight">70M+</div>
              <div className="text-red-100 font-bold text-xs md:text-sm uppercase tracking-wider">Khách hàng tin dùng</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-1.5 drop-shadow-md tracking-tight">99%</div>
              <div className="text-red-100 font-bold text-xs md:text-sm uppercase tracking-wider">Phủ sóng toàn quốc</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-1.5 drop-shadow-md tracking-tight">63</div>
              <div className="text-red-100 font-bold text-xs md:text-sm uppercase tracking-wider">Tỉnh thành & Đảo xa</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-1.5 drop-shadow-md tracking-tight">24/7</div>
              <div className="text-red-100 font-bold text-xs md:text-sm uppercase tracking-wider">Trợ lý AI hỗ trợ</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP & BRANCHES SECTION */}
      <BranchMapSection
        branchStores={branchStores}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
      />

    </div>
  );
}
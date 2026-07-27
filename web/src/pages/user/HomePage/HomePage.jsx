import React, { useState, useEffect, useRef } from 'react';
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
  Play,
  Wifi,
  Headphones
} from 'lucide-react';
import { getAllBranches } from "../../../api/branch/branch.api";
import BranchMapSection from "./components/BranchMapSection";

// Custom Hook for Number Counter Animation
const useCountUp = (end, startAnimating, duration = 2500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startAnimating) return;
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, startAnimating]);
  return count;
};

const StatItem = ({ end, suffix, label }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Ngừng theo dõi sau khi đã xuất hiện
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(end, isVisible);
  return (
    <div ref={ref} className="px-4 py-8 group relative">
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl"></div>
      <div className="text-5xl md:text-6xl font-black mb-3 drop-shadow-xl tracking-tighter text-white group-hover:scale-110 group-hover:text-yellow-300 transition-all duration-500 relative z-10">
        {count}{suffix}
      </div>
      <div className="text-red-100/80 font-bold text-xs md:text-sm uppercase tracking-[0.2em] relative z-10">{label}</div>
    </div>
  );
};

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

  const hotPackages = [
    { maGoi: 'ST90N', tenGoi: 'ST90N', giaTien: '90.000đ', dungLuong: '4GB/Ngày', thoiHan: '30 ngày', moTa: 'Miễn phí data truy cập Tiktok & gọi nội mạng' },
    { maGoi: 'V200C', tenGoi: 'V200C', giaTien: '200.000đ', dungLuong: '4GB/Ngày', thoiHan: '30 ngày', moTa: 'Miễn phí gọi nội mạng dưới 20 phút + 100 phút ngoại mạng' },
    { maGoi: '5G150', tenGoi: '5G150', giaTien: '150.000đ', dungLuong: '6GB/Ngày', thoiHan: '30 ngày', moTa: 'Trải nghiệm data 5G siêu tốc độ cao không lo gián đoạn' },
  ];

  const backgroundImages = [
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  ];

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased overflow-hidden">
      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50% { transform: translateX(150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      {/* 1. HERO SECTION (GLASSMORPHISM & MESH GRADIENT) */}
      <section className="relative bg-slate-950 text-white pt-28 pb-32 px-4 overflow-hidden">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-red-600/40 rounded-full blur-[120px] mix-blend-screen animate-blob z-0 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-purple-700/40 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000 z-0 pointer-events-none"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[40%] bg-blue-600/30 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-4000 z-0 pointer-events-none"></div>

        {/* Dynamic Image Background with Heavy Glass Overlay */}
        {backgroundImages.map((img, index) => {
          const isActive = index === currentBg;
          return (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-30' : 'opacity-0'} z-0`}
              style={{ backgroundImage: `url('${img}')` }}
            >
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"></div>
            </div>
          );
        })}

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-bold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-2xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Tiên phong công nghệ 2026
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tighter drop-shadow-2xl">
              KẾT NỐI <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 animate-gradient">
                TƯƠNG LAI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Trải nghiệm viễn thông không giới hạn với hạ tầng mạng 5G siêu tốc độ. Đăng ký ngay để nhận đặc quyền Data khủng.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link to="/package" className="h-14 bg-white font-black px-8 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group text-base" style={{ color: '#0f172a' }}>
                Khám phá gói cước
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link to="/chatbot" className="h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-8 rounded-2xl hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-base">
                <Bot className="w-5 h-5 text-purple-300" /> Hỏi AI ngay
              </Link>
            </div>
          </div>

          {/* Floating 3D Premium Card */}
          <div className="lg:col-span-5 hidden lg:flex justify-center relative perspective-[2000px]">
            <div className="w-80 relative animate-float" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-purple-600 rounded-[2.5rem] blur-2xl opacity-40"></div>
              <Link to="/package/5G150" className="block bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border-t border-l border-white/40 border-r border-b border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex justify-between items-start mb-12">
                  <Wifi className="w-10 h-10 text-white drop-shadow-md" />
                  <span className="bg-red-500/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                    HOT
                  </span>
                </div>

                <h3 className="text-5xl font-black text-white drop-shadow-lg tracking-tighter mb-2">5G150</h3>
                <p className="text-slate-300 font-medium mb-8">Trải nghiệm tốc độ ánh sáng</p>

                <div className="pt-6 border-t border-white/20 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-black text-white">150K</p>
                    <p className="text-xs text-slate-400 font-medium">/ 30 ngày</p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENTO GRID (QUICK ACTIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* Bento Item 1: Large */}
          <Link to="/package" className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-slate-200/60 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EE0033] to-[#A00022] text-white flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-500">
                <Smartphone className="w-7 h-7" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#EE0033] transition-colors">Gói Cước & Data</h3>
                <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed max-w-sm">
                  Truy cập kho ưu đãi khổng lồ với các gói cước được thiết kế riêng cho bạn.
                </p>
              </div>
            </div>
          </Link>

          {/* Bento Item 2 */}
          <Link to="/buysim" className="bg-white/90 backdrop-blur-xl border border-slate-200/60 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <CreditCard className="w-7 h-7" />
            </div>
            <div className="mt-8 relative z-10">
              <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">SIM Phong Thủy</h3>
              <p className="text-slate-500 mt-2 text-xs font-medium">Kho số độc quyền, giao tận nhà.</p>
            </div>
          </Link>

          {/* Bento Item 3 (Dark mode style for AI) */}
          <Link to="/chatbot" className="bg-slate-900 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden relative border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full group-hover:bg-purple-500/40 transition-colors duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="mt-8 relative z-10">
              <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">Trợ Lý AI</h3>
              <p className="text-slate-400 mt-2 text-xs font-medium">Giải đáp tức thì mọi thắc mắc.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. PREMIUM PACKAGE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 py-20 relative">
        {/* Background Decals */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-red-100/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <span className="inline-block text-[#EE0033] font-bold tracking-[0.15em] uppercase text-xs mb-3 bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
            Độc quyền Viettel 2026
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Đặc Quyền Hội Viên</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {hotPackages.map((pkg, idx) => (
            <div key={pkg.maGoi} className="relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(238,0,51,0.12)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between overflow-hidden group">
              {/* Animated Shimmer Line */}
              <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transform -skew-x-12 z-20 pointer-events-none"></div>

              <div className="p-8 md:p-10 relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <Zap className={`w-6 h-6 ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-blue-500' : 'text-[#EE0033]'}`} />
                  </div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Gói Cước</span>
                </div>

                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{pkg.tenGoi}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-2xl font-black text-[#EE0033]">{pkg.giaTien}</span>
                  <span className="text-sm text-slate-400 font-medium">/ {pkg.thoiHan}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">{pkg.dungLuong} data tốc độ cao</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 line-clamp-2">{pkg.moTa}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 relative z-10">
                <Link to={`/package/${pkg.maGoi}`} className="w-full bg-slate-900 hover:bg-[#EE0033] font-bold py-4 rounded-2xl transition-colors duration-300 flex items-center justify-center gap-2 shadow-md" style={{ color: '#ffffff' }}>
                  Đăng ký ngay <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURES SECTION (FLOATING ICONS) */}
      <section className="bg-slate-900 py-24 relative overflow-hidden text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Vì Sao Chọn Viettel?</h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto">Cam kết mang lại chất lượng mạng lưới tốt nhất cùng dịch vụ chăm sóc khách hàng đẳng cấp quốc tế.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10', title: 'Tốc Độ Tiên Phong', desc: 'Trải nghiệm mạng 5G nhanh nhất Việt Nam, không độ trễ, tải phim 4K trong tích tắc.' },
              { icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Phủ Sóng Toàn Quốc', desc: 'Sóng khỏe mọi lúc mọi nơi. Từ thành thị đến miền núi, từ đất liền đến hải đảo xa.' },
              { icon: Headphones, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Hỗ Trợ Siêu Tốc', desc: 'Trợ lý AI và đội ngũ chuyên viên sẵn sàng hỗ trợ bạn 24/7 không ngày nghỉ.' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center group">
                <div className={`w-24 h-24 mx-auto ${feature.bg} rounded-[2rem] flex items-center justify-center mb-8 animate-float shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-white/10`} style={{ animationDelay: `${idx * 0.5}s` }}>
                  <feature.icon className={`w-12 h-12 ${feature.color} drop-shadow-lg group-hover:scale-110 transition-transform duration-500`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VIDEO QUẢNG CÁO NỔI BẬT */}
      <section className="bg-slate-950 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-yellow-400 font-bold tracking-[0.2em] uppercase text-xs mb-3 inline-flex items-center justify-center gap-2 bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/20">
              <Tv className="w-4 h-4" /> Trải nghiệm đột phá 2026
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Kỷ Nguyên Mạng 5G Viettel</h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto">Tốc độ ánh sáng, kết nối không giới hạn. Xem ngay video giới thiệu công nghệ độc quyền của Viettel.</p>
          </div>

          <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 aspect-video bg-black group">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-purple-500/20 mix-blend-overlay pointer-events-none z-10"></div>
            <iframe
              className="absolute top-0 left-0 w-full h-full z-0"
              src="https://www.youtube.com/embed/5dmLpdy3Lr8?si=O39kM2-W8q8y9QzN&amp;controls=1&amp;rel=0&amp;autoplay=1&amp;mute=1"
              title="Viettel Telecom Promo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </section>

      {/* 6. ANIMATED STATS SECTION */}
      <section className="bg-gradient-to-r from-[#EE0033] to-[#A00022] py-20 relative overflow-hidden shadow-[inset_0_10px_30px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <StatItem end={70} suffix="M+" label="Khách Hàng" />
            <StatItem end={99} suffix="%" label="Phủ Sóng" />
            <StatItem end={63} suffix="" label="Tỉnh Thành" />
            <StatItem end={24} suffix="/7" label="Hỗ Trợ AI" />
          </div>
        </div>
      </section>

      {/* 7. MAP & BRANCHES SECTION */}
      <BranchMapSection
        branchStores={branchStores}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
      />

    </div>
  );
}
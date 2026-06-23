import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-10 py-10 space-y-16 text-gray-800 antialiased select-none bg-[#f8f9fa]">
      
      {/* 1. HERO BANNER - PREMIUM VERSION */}
      <section className="w-full bg-gradient-to-r from-[#b30000] via-[#cc0000] to-[#e60000] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden flex items-center min-h-[380px]">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 text-left">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-yellow-300">
              Hệ sinh thái số Viettel AI
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
              Xác thực thông tin <br />
              <span className="text-yellow-400">Bảo vệ SIM chính chủ</span>
            </h1>
            <p className="text-sm md:text-base text-red-50/90 max-w-2xl leading-relaxed font-medium">
              Trải nghiệm nền tảng viễn thông thông minh. Hỗ trợ chuẩn hóa thông tin thuê bao trực tuyến, 
              đăng ký gói cước nhanh chóng và giải đáp dịch vụ tự động bằng AI thế hệ mới.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => navigate('/chatbot')}
                className="bg-white hover:bg-yellow-400 text-[#bd0000] font-black text-sm md:text-base px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-black/10 active:scale-95"
              >
                Quét xác thực ngay
              </button>
              <button 
                onClick={() => navigate('/package')}
                className="bg-transparent hover:bg-white/10 text-white font-bold text-sm md:text-base px-6 py-3.5 rounded-xl border-2 border-white/60 hover:border-white transition-all duration-200 active:scale-95"
              >
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {[
              { value: "99.4%", label: "CHÍNH XÁC", desc: "Công nghệ AI" },
              { value: "Realtime", label: "HỖ TRỢ 24/7", desc: "Tự động phản hồi", highlight: true },
              { value: "100k+", label: "KHÁCH HÀNG", desc: "Tin dùng mỗi ngày" },
              { value: "3 giây", label: "XỬ LÝ LỆNH", desc: "Tối ưu tốc độ" }
            ].map((badge, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  badge.highlight 
                    ? "bg-yellow-400/10 border-yellow-400/40" 
                    : "bg-white/5 border-white/10 backdrop-blur-sm"
                }`}
              >
                <div className={`text-xl md:text-2xl font-black ${badge.highlight ? "text-yellow-400" : "text-white"}`}>
                  {badge.value}
                </div>
                <div className="text-[10px] font-black tracking-wider text-red-200 mt-1 uppercase">
                  {badge.label}
                </div>
                <div className="text-[11px] text-white/60 font-medium mt-0.5">
                  {badge.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-8 flex items-center gap-2">
          <span className="w-6 h-1.5 rounded-full bg-white transition-all"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
        </div>

        <div className="absolute bottom-6 right-8 flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-all active:scale-90">❮</button>
          <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-all active:scale-90">❯</button>
        </div>
      </section>

      {/* 2. MENU CHỨC NĂNG CHÍNH - BỎ ICON HOÀN TOÀN, THIẾT KẾ CLEAN VÀ SANG CHẢNH */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Xem gói cước", path: "/package" },
          { label: "Mua SIM online", path: "/" },
          { label: "Đăng ký tại quầy", path: "/register-service" },
          { label: "Chat với AI", path: "/chatbot" },
        ].map((btn, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(btn.path)}
            className="bg-white border border-neutral-200/80 hover:border-[#bd0000] py-6 px-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(189,0,0,0.08)] transition-all duration-300 flex items-center justify-center cursor-pointer group text-center min-h-[80px]"
          >
            <h3 className="font-extrabold text-neutral-800 text-sm md:text-base group-hover:text-[#bd0000] transition-colors tracking-tight">
              {btn.label}
            </h3>
          </div>
        ))}
      </section>

      {/* 3. SECTION GÓI CƯỚC NỔI BẬT */}
      <section className="space-y-8 pt-4">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">Ưu đãi hấp dẫn nhất</h2>
          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">Gói cước data siêu tốc độc quyền</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'V120B', desc: 'Combo quốc dân: 1.5GB/ngày tốc độ cao, miễn phí cuộc gọi nội mạng dưới 10 phút, tặng thêm 50 phút ngoại mạng.', price: '120.000', tag: 'Bán chạy nhất' },
            { name: 'MXH120', desc: 'Giải trí bất tận: Miễn phí 100% dung lượng data TikTok, YouTube, Facebook, Messenger + 30GB data dùng chung.', price: '120.000', tag: 'Ưu đãi MXH' },
            { name: 'SD135', desc: 'Siêu data bứt phá: Sở hữu ngay 5GB/ngày (150GB/tháng) lướt web, làm việc tốc độ cao 4G/5G thả ga cực mượt.', price: '135.000', tag: 'Siêu tốc độ' }
          ].map((pkg) => (
            <div key={pkg.name} className="bg-white border-t-[3px] border-t-[#bd0000] border-x border-b border-neutral-200/70 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-red-600/20 transition-all duration-300 flex flex-col justify-between relative group">
              <div className="space-y-3 text-left">
                <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold text-[#bd0000] bg-red-50 rounded uppercase tracking-wide">
                  {pkg.tag}
                </span>
                <h3 className="text-2xl font-black text-neutral-900 group-hover:text-[#bd0000] transition-colors tracking-tight">{pkg.name}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed min-h-[54px] font-normal">{pkg.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between w-full">
                <div className="text-left shrink-0">
                  <span className="text-xl font-black text-[#bd0000] tracking-tight">{pkg.price}đ</span>
                  <span className="text-[10px] text-neutral-400 font-medium ml-0.5">/ tháng</span>
                </div>
                <button 
                  onClick={() => navigate('/package')}
                  className="font-bold text-xs text-white bg-[#bd0000] hover:bg-[#990000] px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 shrink-0"
                >
                  Đăng ký
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center pt-2">
          <button onClick={() => navigate('/package')} className="text-xs font-bold text-[#bd0000] hover:text-[#990000] transition-colors inline-flex items-center gap-1 mx-auto">
            Xem tất cả gói cước khác ➔
          </button>
        </div>
      </section>

      {/* 4. SECTION TÍNH NĂNG TRỢ LÝ AI - ĐÃ BỎ TOÀN BỘ ICON EMOJI, THIẾT KẾ PHẲNG SANG TRỌNG */}
      <section className="bg-neutral-50 border border-neutral-200/60 rounded-3xl p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center shadow-inner">
        <div className="space-y-3 lg:col-span-1 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[#bd0000] rounded text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-[#bd0000] rounded-full animate-pulse"></span>
            AI Ecosystem
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Trợ lý ảo thông minh</h2>
          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-normal">
            Hệ thống trợ lý thông minh vận hành liên tục, xử lý và phân tích tự động các yêu cầu viễn thông trực tuyến.
          </p>
        </div>
        
        {/* Khối danh sách: Loại bỏ hoàn toàn emoji, dịch chữ sang trái, tăng khoảng cách */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-2">
          {[
            { title: "Phân tích tiêu dùng", text: "Gợi ý gói cước tối ưu theo lịch sử data thực tế." },
            { title: "Tìm số phong thủy", text: "Quét kho số triệu SIM theo ngày sinh tự động." },
            { title: "Giải đáp tức thì", text: "Trả lời câu hỏi chính sách viễn thông 24/7." },
            { title: "Đẩy lệnh hệ thống", text: "Đăng ký dịch vụ tự động đẩy thẳng lên nhà mạng." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-neutral-200/50 py-5 px-6 rounded-2xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-red-600/20 transition-all duration-300 cursor-pointer group text-left flex flex-col justify-center">
              <h4 className="font-black text-neutral-900 text-sm md:text-base group-hover:text-[#bd0000] transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-neutral-400 font-medium leading-normal mt-1">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SECTION HOTLINE TỔNG ĐÀI - BỎ ICON ĐIỆN THOẠI, SẮP XẾP PHẲNG TOÁN DIỆN */}
      <section className="bg-white border border-neutral-200/80 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="text-center md:text-left space-y-0.5">
          <h2 className="text-sm md:text-base font-black text-gray-900 tracking-tight">
            Tổng đài Chăm sóc khách hàng toàn quốc (Miễn phí)
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Hỗ trợ tra cứu ưu đãi, xử lý sự cố kỹ thuật đường truyền 24/7.
          </p>
        </div>
        <a 
          href="tel:18008098"
          className="text-lg font-black text-[#bd0000] bg-red-50 hover:bg-red-100 px-6 py-2.5 rounded-xl border border-red-100/50 tracking-wide transition-all text-center block"
        >
          1800 8098
        </a>
      </section>

    </div>
  );
};

export default HomePage;
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Headphones, Smartphone } from 'lucide-react';

const FooterComponent = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t border-slate-800 relative overflow-hidden no-print">

      {/* Background glow highlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Cột 1: Thương hiệu Viettel */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="text-3xl font-black tracking-tighter text-white drop-shadow-md">viettel</span>
              <div className="w-2.5 h-2.5 bg-[#EE0033] rounded-full mt-3 animate-pulse"></div>
              <span className="bg-red-500/20 text-[#EE0033] text-xs font-black px-2.5 py-1 rounded-md border border-red-500/30 uppercase ml-1">Store AI</span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel). <br />
              Cơ quan chủ quản: Bộ Quốc phòng.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-300 text-sm font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Hệ thống tư vấn & Đặt lịch chính thức 24/7</span>
            </div>
          </div>

          {/* Cột 2: Danh mục dịch vụ */}
          <div>
            <h4 className="text-white font-black text-lg mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#EE0033]" /> Dịch vụ Nổi bật
            </h4>
            <ul className="space-y-3 text-sm text-slate-300 font-medium">
              <li>
                <Link to="/package" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Gói cước 4G / 5G Siêu tốc
                </Link>
              </li>
              <li>
                <Link to="/buysim" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Kho SIM Số đẹp - Phong thủy
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Đặt lịch & Lấy số quầy giao dịch
                </Link>
              </li>
              <li>
                <Link to="/mobile-services" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Dịch vụ di động & Chuyển mạng
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Trợ lý trí tuệ nhân tạo AI Viettel
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ & Hotline */}
          <div>
            <h4 className="text-white font-black text-lg mb-4 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-[#EE0033]" /> Tổng đài Hỗ trợ
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs font-semibold">CSKH Di động (Miễn phí):</p>
                  <p className="text-white font-black text-lg">1800 8098</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs font-semibold">CSKH Internet / Cáp quang:</p>
                  <p className="text-white font-black text-lg">1800 8168</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm pt-1 font-semibold">
                <Mail className="w-4.5 h-4.5 text-purple-400 flex-shrink-0" />
                <span>cskh@viettel.com.vn</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Tải app MyViettel */}
          <div>
            <h4 className="text-white font-black text-lg mb-4">Tải ứng dụng MyViettel</h4>
            <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed font-medium">
              Quản lý tài khoản, kiểm tra dung lượng data và nhận ưu đãi độc quyền trên di động.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-white p-3.5 rounded-2xl transition flex items-center gap-3 border border-slate-700/60"
              >
                <div className="w-9 h-9 rounded-xl bg-black/40 flex items-center justify-center font-black text-lg"></div>
                <div>
                  <div className="text-[11px] uppercase text-slate-400 font-bold">Tải về trên</div>
                  <div className="text-sm font-black leading-tight">App Store</div>
                </div>
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-white p-3.5 rounded-2xl transition flex items-center gap-3 border border-slate-700/60"
              >
                <div className="w-9 h-9 rounded-xl bg-black/40 flex items-center justify-center font-black text-lg">▶</div>
                <div>
                  <div className="text-[11px] uppercase text-slate-400 font-bold">Tải về trên</div>
                  <div className="text-sm font-black leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Chân trang bản quyền */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-400 font-medium gap-4">
          <p>© 2026 Viettel Telecom. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-6 font-bold">
            <Link to="/support" className="hover:text-white transition">Trung tâm hỗ trợ</Link>
            <Link to="/store-locator" className="hover:text-white transition">Tìm siêu thị Viettel</Link>
            <Link to="/lookup" className="hover:text-white transition">Tra cứu dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;

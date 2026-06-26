import React from 'react';
import { useNavigate } from 'react-router-dom';

const STAT_CARDS = [
  { value: '99.4%',    label: 'CHÍNH XÁC',   desc: 'Nhận diện FaceID',  hl: false },
  { value: 'Realtime', label: 'HỖ TRỢ 24/7', desc: 'Bot xử lý lỗi',     hl: true  },
  { value: '100k+',    label: 'KHÁCH HÀNG',  desc: 'Tin dùng mỗi ngày', hl: false },
  { value: '3 giây',   label: 'XỬ LÝ LỆNH',  desc: 'Băng thông lõi',    hl: false },
];

const QUICK_LINKS = [
  { emoji: '📱', bg: 'bg-blue-100',   title: 'Xem gói cước',      desc: 'Data siêu tốc & thoại',      num: '01', path: '/package'         },
  { emoji: '🛒', bg: 'bg-orange-100', title: 'Mua SIM online',    desc: 'Kho số đẹp phong thủy',      num: '02', path: '/'                },
  { emoji: '🏪', bg: 'bg-green-100',  title: 'Đăng ký tại quầy', desc: 'Đặt lịch hẹn hỗ trợ nhanh', num: '03', path: '/register-service' },
  { emoji: '🤖', bg: 'bg-red-100',    title: 'Chat với AI',       desc: 'Giải đáp nghiệp vụ 24/7',   num: '04', path: '/chatbot'          },
];

const PACKAGES = [
  { topBar: 'bg-red-600',    badge: 'Bán chạy nhất', badgeClass: 'bg-red-50 text-red-700',       name: 'V120B',  desc: '1.5GB/ngày tốc độ cao, miễn phí cuộc gọi nội mạng dưới 10 phút, tặng thêm 50 phút ngoại mạng.', price: '120.000đ' },
  { topBar: 'bg-blue-700',   badge: 'Ưu đãi MXH',   badgeClass: 'bg-blue-50 text-blue-700',     name: 'MXH120', desc: 'Miễn phí 100% data TikTok, YouTube, Facebook, Messenger + 30GB data dùng chung mỗi tháng.',       price: '120.000đ' },
  { topBar: 'bg-orange-600', badge: 'Siêu tốc độ',  badgeClass: 'bg-orange-50 text-orange-700', name: 'SD135',  desc: '5GB/ngày (150GB/tháng) lướt web, làm việc tốc độ cao 4G/5G thả ga, không giới hạn tốc độ.',     price: '135.000đ' },
];

const AI_FEATURES = [
  { title: 'Phân tích tiêu dùng', desc: 'Gợi ý gói cước tối ưu theo lịch sử data thực tế.'  },
  { title: 'Tìm số phong thủy',   desc: 'Quét kho số triệu SIM theo ngày sinh tự động.'      },
  { title: 'Giải đáp tức thì',    desc: 'Trả lời câu hỏi chính sách viễn thông 24/7.'        },
  { title: 'Đẩy lệnh hệ thống',  desc: 'Đăng ký dịch vụ tự động đẩy thẳng lên nhà mạng.'   },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen pb-8">

      {/* 1. HERO BANNER */}
      <section className="mx-4 mt-4 bg-gradient-to-br from-[#b80000] via-[#cc0000] to-[#e00000] rounded-2xl px-8 py-8 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-3 py-1.5 mb-6 text-[11px] font-medium text-white uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          Hệ sinh thái số Viettel AI 2026
        </div>
        <div className="flex flex-row items-start justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white leading-tight">Xác thực thông tin</h1>
            <h1 className="text-3xl font-bold text-[#FFB300] leading-tight">Bảo vệ SIM chính chủ</h1>
            <p className="text-sm text-white/80 leading-relaxed max-w-xs mt-3">
              Chuẩn hóa thông tin thuê bao trực tuyến bằng mô hình AI học sâu. Tự động nhận diện tài liệu, quét khuôn mặt thời gian thực và kích hoạt gói cước tức thì.
            </p>
            <div className="flex flex-row gap-3 mt-5">
              <button onClick={() => navigate('/chatbot')} className="bg-white text-[#cc0000] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                Quét xác thực ngay →
              </button>
              <button onClick={() => navigate('/package')} className="bg-transparent border border-white text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-[280px] shrink-0">
            {STAT_CARDS.map((c, i) => (
              <div key={i} className={`rounded-xl px-4 py-3 border ${c.hl ? 'bg-[#FFB300] border-[#FFB300]' : 'bg-white/15 border-white/20'}`}>
                <p className="text-2xl font-bold text-white">{c.value}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${c.hl ? 'text-white/80' : 'text-white/70'}`}>{c.label}</p>
                <p className={`text-xs mt-0.5 ${c.hl ? 'text-white/70' : 'text-white/55'}`}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. QUICK ACCESS */}
      <section className="px-4 pt-6 pb-2">
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Truy cập nhanh</p>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_LINKS.map((q, i) => (
            <div key={i} onClick={() => navigate(q.path)} className="bg-white rounded-xl p-4 cursor-pointer group border border-neutral-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[130px] relative">
              <div className={`w-10 h-10 rounded-xl ${q.bg} flex items-center justify-center mb-3 text-xl`}>{q.emoji}</div>
              <div>
                <p className="text-base font-bold text-neutral-800 group-hover:text-[#cc0000]">{q.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{q.desc}</p>
              </div>
              <span className="absolute bottom-3 right-4 text-xs font-bold text-neutral-200 group-hover:text-neutral-300">{q.num}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-neutral-200 mx-4 my-4" />

      {/* 3. PACKAGES */}
      <section className="px-4 pb-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="w-7 h-0.5 bg-[#c00000] rounded-full mb-1.5" />
            <h2 className="text-xl font-bold text-neutral-900">Gói cước HOT nhất</h2>
          </div>
          <button onClick={() => navigate('/package')} className="text-sm text-[#c00000] hover:underline cursor-pointer">Xem tất cả →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PACKAGES.map((pkg, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-[#c00000] hover:-translate-y-1 transition-all flex flex-col">
              <div className={`h-1 w-full ${pkg.topBar}`} />
              <div className="p-5 flex-1 space-y-3">
                <span className={`inline-block text-[10px] font-medium px-2.5 py-1 rounded uppercase ${pkg.badgeClass}`}>{pkg.badge}</span>
                <p className="text-2xl font-bold text-neutral-900">{pkg.name}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">{pkg.desc}</p>
              </div>
              <div className="flex justify-between items-center px-5 py-4 border-t border-neutral-100">
                <div>
                  <span className="text-lg font-bold text-[#c00000]">{pkg.price}</span>
                  <span className="text-xs text-neutral-400 ml-1">/ tháng</span>
                </div>
                <button onClick={() => navigate('/package')} className="border border-[#c00000] text-[#c00000] px-4 py-2 rounded-lg text-sm hover:bg-[#c00000] hover:text-white transition-colors cursor-pointer">Đăng ký</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/package')} className="mt-4 w-full text-sm text-neutral-500 hover:text-[#c00000] border border-neutral-200 hover:border-[#c00000] rounded-lg py-3 transition-colors cursor-pointer">
          Xem tất cả gói cước khác →
        </button>
      </section>

      <div className="border-t border-neutral-200 mx-4 my-4" />

      {/* 4. AI ASSISTANT */}
      <section className="px-4 pb-2">
        <div className="mb-6">
          <div className="w-7 h-0.5 bg-[#c00000] rounded-full mb-1.5" />
          <h2 className="text-xl font-bold text-neutral-900">Trợ lý ảo thông minh</h2>
        </div>
        <div className="bg-[#0d1117] rounded-2xl p-7 flex flex-col lg:flex-row gap-8 items-start">
          <div className="lg:flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[10px] text-red-400 uppercase tracking-widest font-medium">AI Core Console</span>
            </div>
            <h3 className="text-xl font-bold text-white leading-snug">Xử lý tự động<br />bằng tác vụ AI</h3>
            <p className="text-sm text-white/45 leading-relaxed">Phân tích lưu lượng, gợi ý kho số đẹp phong thủy và duyệt lệnh realtime thẳng lên hệ thống nhà mạng.</p>
          </div>
          <div className="lg:flex-[1.3] grid grid-cols-2 gap-3 w-full">
            {AI_FEATURES.map((f, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 hover:border-red-500/35 hover:bg-red-500/5 transition-all cursor-pointer">
                <p className="text-sm font-medium text-white mb-1.5">{f.title}</p>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-neutral-200 mx-4 my-4" />

      {/* 5. HOTLINE */}
      <section className="mx-4">
        <div className="bg-white border border-neutral-200 rounded-xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-neutral-900">Tổng đài chăm sóc khách hàng toàn quốc (Miễn phí)</p>
            <p className="text-sm text-neutral-400 mt-1 leading-relaxed">Hỗ trợ giải đáp ưu đãi, khắc phục sự cố kỹ thuật và hướng dẫn thủ tục hạ tầng mạng viễn thông 24/7.</p>
          </div>
          <a href="tel:18008098" className="text-xl font-bold text-[#c00000] bg-red-50 border border-red-100 px-7 py-3 rounded-lg tracking-widest whitespace-nowrap hover:bg-[#c00000] hover:text-white transition-colors">
            1800 8098
          </a>
        </div>
      </section>

    </div>
  );
}
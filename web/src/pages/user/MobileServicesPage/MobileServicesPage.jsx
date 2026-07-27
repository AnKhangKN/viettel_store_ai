import React from 'react';
import { Smartphone, Globe, Shield, Wifi, CreditCard, Headset, ArrowRight, Sparkles, RefreshCw, Repeat, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileServicesPage = () => {
  const services = [
    {
      id: 1,
      title: 'Gói Cước Data 4G / 5G',
      description: 'Lướt web thả ga với các gói data tốc độ cao, đa dạng dung lượng phù hợp mọi nhu cầu.',
      icon: <Wifi className="w-7 h-7 text-[#EE0033]" />,
      features: ['Data 5G tốc độ cao', 'Không giới hạn dung lượng', 'Giá cước ưu đãi chỉ từ 70k']
    },
    {
      id: 2,
      title: 'Kho SIM Số Đẹp Phong Thủy',
      description: 'Khẳng định đẳng cấp với kho SIM số đẹp lộc phát, thần tài, tứ quý chính chủ Viettel.',
      icon: <Smartphone className="w-7 h-7 text-[#EE0033]" />,
      features: ['SIM Lộc Phát / Tứ Quý', 'Giao SIM tận nhà miễn phí', 'Đăng ký chính chủ 100%']
    },
    {
      id: 3,
      title: 'Chuyển Mạng Giữ Số (MNP)',
      description: 'Chuyển sang mạng Viettel giữ nguyên số cũ siêu tốc, nhận ngay gói cước khuyến mãi.',
      icon: <Repeat className="w-7 h-7 text-[#EE0033]" />,
      features: ['Giữ nguyên số điện thoại cũ', 'Thủ tục online đơn giản', 'Tặng gói ưu đãi Data 5G']
    },
    {
      id: 4,
      title: 'Đổi SIM 4G / 5G & eSIM',
      description: 'Nâng cấp SIM điện thoại lên chuẩn 5G siêu tốc độ hoặc eSIM tiện lợi cho iPhone, Android.',
      icon: <Radio className="w-7 h-7 text-[#EE0033]" />,
      features: ['Cấp eSIM QR Code tức thì', 'Miễn phí chuyển đổi tại quầy', 'Tốc độ gấp 10 lần 4G']
    },
    {
      id: 5,
      title: 'Thanh Toán Tiện Lợi & VNPay',
      description: 'Nạp tiền, thanh toán cước nhanh chóng, an toàn qua cổng VNPay và nạp thẻ trực tuyến.',
      icon: <CreditCard className="w-7 h-7 text-[#EE0033]" />,
      features: ['Chiết khấu 3-5% nạp thẻ', 'Thanh toán VNPay QR', 'Tự động gia hạn cước']
    },
    {
      id: 6,
      title: 'Hỗ Trợ Khách Hàng 24/7',
      description: 'Đội ngũ hỗ trợ chuyên nghiệp và Trợ lý AI sẵn sàng giải đáp thắc mắc của bạn mọi lúc.',
      icon: <Headset className="w-7 h-7 text-[#EE0033]" />,
      features: ['Hotline 1800 8098 miễn phí', 'Hỏi đáp AI Chatbot 24/7', 'Hỗ trợ tại 63 tỉnh thành']
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16 text-slate-800 font-sans antialiased">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center md:text-left relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-[#EE0033] border border-red-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Hệ sinh thái dịch vụ Viettel
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">DỊCH VỤ DI ĐỘNG VIETTEL</h1>
            <p className="text-slate-400 text-sm mt-2 font-normal max-w-xl leading-relaxed">
              Trải nghiệm viễn thông đẳng cấp với kết nối mượt mà, dịch vụ đa dạng và vô vàn ưu đãi hấp dẫn.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3 text-xs">
            <Shield className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-extrabold text-white">Bảo mật & Chất lượng số 1</p>
              <p className="text-slate-300">Mạng di động phủ sóng 99% Việt Nam</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-3xl shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col justify-between group">
              <div className="p-8">
                <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-100">
                  {service.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#EE0033] transition-colors">{service.title}</h3>
                <p className="text-slate-600 text-xs mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs text-slate-600 font-medium">
                      <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0">
                <Link to={`/mobile-services/${service.id}`} className="w-full bg-slate-900 hover:bg-black font-bold py-3 px-4 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs" style={{ color: '#ffffff' }}>
                  <span>Chi tiết dịch vụ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Call to action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
          <div className="text-left mb-6 md:mb-0">
            <h2 className="text-2xl font-black mb-1">Bạn cần hỗ trợ tư vấn trực tiếp?</h2>
            <p className="text-red-100 text-xs">Đội ngũ chuyên viên và Trợ lý AI Viettel sẵn sàng giải đáp 24/7.</p>
          </div>
          <Link to="/chatbot" className="bg-white text-[#EE0033] hover:bg-slate-100 font-extrabold py-3 px-6 rounded-xl transition text-xs shadow-md whitespace-nowrap">
            Trò chuyện với AI Viettel ✨
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileServicesPage;

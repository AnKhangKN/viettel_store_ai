import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Smartphone, Globe, Shield, Wifi, CreditCard, Headset, ArrowLeft, CheckCircle } from 'lucide-react';

const servicesData = [
  {
    id: 1,
    title: 'Gói Cước Data',
    description: 'Lướt web thả ga với các gói data tốc độ cao, đa dạng dung lượng phù hợp mọi nhu cầu.',
    fullDescription: 'Dịch vụ Gói Cước Data của Viettel mang đến cho bạn trải nghiệm Internet tốc độ cao không giới hạn. Cho dù bạn là học sinh sinh viên cần data để học tập, hay dân văn phòng cần kết nối liên tục để làm việc, chúng tôi đều có gói cước phù hợp. Tận hưởng tốc độ 4G/5G mượt mà, xem video 4K không giật lag và chia sẻ khoảnh khắc mọi lúc mọi nơi.',
    icon: <Wifi className="w-12 h-12 text-white" />,
    features: ['Data tốc độ cao 4G/5G', 'Nhiều lựa chọn dung lượng từ 1GB đến Không giới hạn', 'Giá cước ưu đãi chỉ từ 5.000đ/ngày', 'Đăng ký và hủy gói dễ dàng qua SMS hoặc App'],
    benefits: ['Luôn giữ kết nối với bạn bè, đối tác', 'Thoải mái giải trí, xem phim, nghe nhạc', 'Tiết kiệm chi phí so với dùng data mặc định'],
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
    registerLink: '/package'
  },
  {
    id: 2,
    title: 'Sim Số Đẹp',
    description: 'Khẳng định đẳng cấp với kho sim số đẹp, đa dạng nhà mạng, dễ nhớ, mang lại may mắn.',
    fullDescription: 'Kho Sim Số Đẹp của Viettel sở hữu hàng triệu số với đa dạng chủng loại: Sim lục quý, ngũ quý, tứ quý, tam hoa, lộc phát, thần tài, năm sinh... Mỗi con số mang một ý nghĩa phong thủy riêng, không chỉ giúp bạn dễ nhớ mà còn mang lại may mắn, tài lộc và khẳng định đẳng cấp cá nhân hoặc thương hiệu doanh nghiệp của bạn.',
    icon: <Smartphone className="w-12 h-12 text-white" />,
    features: ['Kho sim lớn nhất Việt Nam với hơn 5 triệu số', 'Tìm kiếm thông minh theo phong thủy, đầu số', 'Đăng ký chính chủ ngay khi mua', 'Giao sim tận nhà miễn phí trên toàn quốc'],
    benefits: ['Tạo ấn tượng chuyên nghiệp với đối tác', 'Mang lại may mắn, thuận lợi trong kinh doanh', 'Giá trị sim tăng theo thời gian'],
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200',
    registerLink: '/buysim'
  },
  {
    id: 3,
    title: 'Chuyển Vùng Quốc Tế',
    description: 'Kết nối liên tục mọi lúc mọi nơi trên thế giới với dịch vụ Roaming giá cước cực rẻ.',
    fullDescription: 'Dịch vụ Chuyển Vùng Quốc Tế (Roaming) của Viettel giúp bạn giữ nguyên số điện thoại khi ra nước ngoài. Bất kể bạn đi công tác hay du lịch, bạn vẫn có thể nghe gọi, nhắn tin và truy cập Internet tốc độ cao mà không cần thay sim mới. Viettel hiện đã phủ sóng Roaming tại hơn 200 quốc gia và vùng lãnh thổ với cước phí rẻ nhất thị trường.',
    icon: <Globe className="w-12 h-12 text-white" />,
    features: ['Phủ sóng hơn 200 quốc gia và vùng lãnh thổ', 'Các gói data Roaming trọn gói chỉ từ 50.000đ/ngày', 'Tự động cảnh báo cước phát sinh', 'Hỗ trợ mạng 5G tại nhiều quốc gia'],
    benefits: ['Không bỏ lỡ cuộc gọi quan trọng từ Việt Nam', 'Tiện lợi, không cần mua sim tại nước sở tại', 'Quản lý chi phí dễ dàng với gói cước trọn gói'],
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1200',
    registerLink: '/roaming'
  },
  {
    id: 4,
    title: 'Dịch Vụ GTGT',
    description: 'Trải nghiệm hàng ngàn tiện ích hấp dẫn: Nhạc chờ, thông báo cuộc gọi nhỡ, chữ ký cuộc gọi...',
    fullDescription: 'Dịch vụ Giá trị gia tăng (GTGT) của Viettel mang đến những tiện ích tuyệt vời giúp tối ưu hóa trải nghiệm sử dụng điện thoại của bạn. Từ dịch vụ Nhạc chờ Imuzik thể hiện cá tính, Thông báo cuộc gọi nhỡ MCA giúp bạn không bỏ lỡ thông tin, đến dịch vụ Chữ ký cuộc gọi hiển thị thông điệp riêng, tất cả đều được thiết kế để cuộc sống của bạn thêm phong phú.',
    icon: <Shield className="w-12 h-12 text-white" />,
    features: ['Kho nhạc chờ Imuzik hàng triệu bài hát', 'Dịch vụ thông báo cuộc gọi nhỡ MCA', 'Dịch vụ Chữ ký cuộc gọi', 'Các tiện ích bảo mật và lưu trữ dữ liệu'],
    benefits: ['Thể hiện cá tính và phong cách riêng', 'Đảm bảo kết nối không gián đoạn', 'Nâng cao tính bảo mật cho thiết bị'],
    imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1200',
    registerLink: '/vas'
  },
  {
    id: 5,
    title: 'Thanh Toán Tiện Lợi',
    description: 'Nạp tiền, thanh toán cước nhanh chóng, an toàn qua đa dạng kênh thanh toán điện tử.',
    fullDescription: 'Hệ sinh thái Thanh Toán của Viettel giúp bạn giải quyết các hóa đơn viễn thông trong chớp mắt. Tích hợp liền mạch với Viettel Money, các ví điện tử phổ biến (Momo, ZaloPay...) và các ngân hàng, bạn có thể thanh toán mọi lúc mọi nơi một cách an toàn nhất. Đặc biệt, luôn có những chương trình ưu đãi, chiết khấu cực sâu khi thanh toán online.',
    icon: <CreditCard className="w-12 h-12 text-white" />,
    features: ['Thanh toán qua Viettel Money, Thẻ cào, BankPlus', 'Hỗ trợ thanh toán tự động hàng tháng (AutoPay)', 'Chiết khấu lên đến 10% khi nạp tiền/thanh toán', 'Bảo mật giao dịch tiêu chuẩn quốc tế PCI DSS'],
    benefits: ['Tiết kiệm thời gian, không cần ra cửa hàng', 'Nhận ưu đãi hấp dẫn mỗi lần giao dịch', 'Kiểm soát chi tiêu rõ ràng qua lịch sử giao dịch'],
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200',
    registerLink: '/payment'
  },
  {
    id: 6,
    title: 'Chăm Sóc Khách Hàng',
    description: 'Đội ngũ hỗ trợ chuyên nghiệp, tận tâm, giải đáp mọi thắc mắc của bạn 24/7.',
    fullDescription: 'Dịch vụ Chăm sóc khách hàng Viettel tự hào là đơn vị tiên phong ứng dụng công nghệ AI để hỗ trợ khách hàng nhanh nhất. Với hệ thống tổng đài 24/7 hoàn toàn miễn phí, đa kênh liên hệ từ gọi điện, nhắn tin mạng xã hội đến chatbot thông minh, mọi vấn đề của bạn đều được lắng nghe và xử lý triệt để với thái độ phục vụ tận tâm nhất.',
    icon: <Headset className="w-12 h-12 text-white" />,
    features: ['Tổng đài miễn cước 1800 8098 hoạt động 24/7', 'Hỗ trợ đa kênh: Zalo, Facebook, App MyViettel', 'Hệ thống cửa hàng phân bổ rộng khắp cả nước', 'Khách hàng Viettel Privilege được ưu tiên phục vụ'],
    benefits: ['Được giải quyết vấn đề nhanh chóng, kịp thời', 'Phục vụ mọi lúc mọi nơi kể cả ngày Lễ Tết', 'Trải nghiệm chất lượng dịch vụ chuyên nghiệp'],
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    registerLink: '/support'
  }
];

const MobileServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập gọi API
    setLoading(true);
    const foundService = servicesData.find(s => s.id === parseInt(id));
    setTimeout(() => {
      setService(foundService);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy dịch vụ</h2>
        <button 
          onClick={() => navigate('/mobile-services')}
          className="text-red-600 hover:text-red-700 font-semibold flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại trang Dịch vụ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative h-[400px]">
        <img 
          src={service.imageUrl} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <button 
              onClick={() => navigate('/mobile-services')}
              className="text-white hover:text-red-300 font-medium flex items-center mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Dịch vụ di động
            </button>
            <div className="flex items-center">
              <div className="bg-red-600 p-4 rounded-xl shadow-lg mr-6">
                {service.icon}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {service.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Giới thiệu dịch vụ</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {service.fullDescription}
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tính năng nổi bật</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start bg-gray-50 p-4 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Lợi ích mang lại</h3>
              <ul className="space-y-4">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 rounded-2xl shadow-md p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Đăng ký ngay hôm nay</h3>
              <p className="text-gray-400 mb-6">Trải nghiệm những tiện ích tuyệt vời từ dịch vụ {service.title} của Viettel.</p>
              <button 
                onClick={() => navigate(service.registerLink)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors duration-200 shadow-lg mb-4"
              >
                Đăng ký dịch vụ
              </button>
              <button 
                onClick={() => navigate('/support')}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 rounded-xl transition-colors duration-200 border border-gray-700 text-center"
              >
                Liên hệ tổng đài tư vấn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileServiceDetailPage;

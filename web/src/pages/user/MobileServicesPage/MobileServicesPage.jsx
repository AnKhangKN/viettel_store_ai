import React from 'react';
import { Smartphone, Globe, Shield, Wifi, CreditCard, Headset } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileServicesPage = () => {
  const services = [
    {
      id: 1,
      title: 'Gói Cước Data',
      description: 'Lướt web thả ga với các gói data tốc độ cao, đa dạng dung lượng phù hợp mọi nhu cầu.',
      icon: <Wifi className="w-8 h-8 text-red-600" />,
      features: ['Data tốc độ cao', 'Không giới hạn dung lượng', 'Giá cước ưu đãi']
    },
    {
      id: 2,
      title: 'Sim Số Đẹp',
      description: 'Khẳng định đẳng cấp với kho sim số đẹp, đa dạng nhà mạng, dễ nhớ, mang lại may mắn.',
      icon: <Smartphone className="w-8 h-8 text-red-600" />,
      features: ['Sim lộc phát', 'Sim tứ quý', 'Giao sim tận nhà']
    },

    {
      id: 5,
      title: 'Thanh Toán Tiện Lợi',
      description: 'Nạp tiền, thanh toán cước nhanh chóng, an toàn qua đa dạng kênh thanh toán điện tử.',
      icon: <CreditCard className="w-8 h-8 text-red-600" />,
      features: ['Hỗ trợ ví điện tử', 'Tự động thanh toán', 'Chiết khấu cao']
    },
    {
      id: 6,
      title: 'Chăm Sóc Khách Hàng',
      description: 'Đội ngũ hỗ trợ chuyên nghiệp, tận tâm, giải đáp mọi thắc mắc của bạn 24/7.',
      icon: <Headset className="w-8 h-8 text-red-600" />,
      features: ['Hỗ trợ 24/7', 'Đa kênh liên hệ', 'Giải quyết nhanh chóng']
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Dịch Vụ Di Động
          </h1>
          <p className="text-lg md:text-xl text-red-100 max-w-3xl mx-auto">
            Trải nghiệm viễn thông đẳng cấp với kết nối mượt mà, dịch vụ đa dạng và ưu đãi bất tận. Chúng tôi luôn đồng hành cùng bạn mọi lúc, mọi nơi.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
              <div className="p-8">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={`/mobile-services/${service.id}`} className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-center">
                  Khám phá ngay
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Call to action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gray-900 rounded-2xl p-10 text-center flex flex-col md:flex-row items-center justify-between">
            <div className="text-left mb-6 md:mb-0">
                <h2 className="text-3xl font-bold text-white mb-2">Bạn cần tư vấn thêm?</h2>
                <p className="text-gray-400">Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
            </div>
            <button className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg whitespace-nowrap">
                Liên hệ tư vấn viên
            </button>
        </div>
      </div>
    </div>
  );
};

export default MobileServicesPage;

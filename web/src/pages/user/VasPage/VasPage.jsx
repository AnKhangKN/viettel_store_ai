import React from 'react';
import { Music, PhoneCall, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const VasPage = () => {
  const vasServices = [
    { name: 'Báo cuộc gọi nhỡ (MCA)', desc: 'Không bỏ lỡ bất kỳ cuộc gọi quan trọng nào', icon: <PhoneCall className="w-6 h-6 text-green-500" />, link: '/vas/mca' },
    { name: 'Chữ ký cuộc gọi', desc: 'Hiển thị thông điệp riêng trên máy người nhận', icon: <Star className="w-6 h-6 text-yellow-500" />, link: '/vas/signature' },
    { name: 'Bảo mật thiết bị', desc: 'Bảo vệ dữ liệu an toàn tuyệt đối', icon: <Shield className="w-6 h-6 text-blue-500" />, link: '/vas/security' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Dịch Vụ Giá Trị Gia Tăng (GTGT)</h1>
          <p className="text-xl text-gray-600">Thêm tiện ích, thêm niềm vui cho chiếc dế yêu của bạn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vasServices.map((service, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
              <p className="text-gray-500 mb-6 flex-grow">{service.desc}</p>
              <Link to={service.link} className="w-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors block">
                Đăng ký
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VasPage;

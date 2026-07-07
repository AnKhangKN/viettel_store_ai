import React from 'react';
import { PhoneCall, Bell, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const McaPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-green-600 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <PhoneCall className="w-16 h-16 mx-auto mb-4 text-green-200" />
        <h1 className="text-4xl font-extrabold mb-4">Báo Cuộc Gọi Nhỡ (MCA)</h1>
        <p className="text-xl text-green-100 max-w-2xl mx-auto">
          Không bao giờ bỏ lỡ bất kỳ cuộc gọi quan trọng nào, ngay cả khi tắt máy hay hết pin.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-green-500">
            <h2 className="text-2xl font-bold mb-6">Tính năng nổi bật</h2>
            <ul className="space-y-4">
              <li className="flex"><CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" /> <span className="text-gray-700">Nhận bản tin thông báo các cuộc gọi nhỡ qua SMS</span></li>
              <li className="flex"><CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" /> <span className="text-gray-700">Tích hợp hộp thư thoại để người gọi để lại lời nhắn</span></li>
              <li className="flex"><CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" /> <span className="text-gray-700">Nhận thông báo qua Email (tính năng mở rộng)</span></li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col justify-center items-center text-center">
            <Bell className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold mb-2">Chỉ 5.500đ / tháng</h3>
            <p className="text-gray-500 mb-6">Trải nghiệm dịch vụ với chi phí siêu rẻ</p>
            <Link to="/payment" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors block text-center">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default McaPage;

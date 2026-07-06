import React from 'react';
import { Shield, Lock, Smartphone, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const DeviceSecurityPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-600 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-blue-200" />
        <h1 className="text-4xl font-extrabold mb-4">Bảo Mật Thiết Bị</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Giải pháp bảo vệ toàn diện cho điện thoại và dữ liệu cá nhân của bạn khỏi các mối đe dọa trực tuyến.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Bảo vệ dữ liệu</h3>
            <p className="text-gray-500 text-sm">Mã hóa an toàn các tập tin, hình ảnh nhạy cảm.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <Smartphone className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Chống virus</h3>
            <p className="text-gray-500 text-sm">Quét và diệt malware theo thời gian thực.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Sao lưu đồng bộ</h3>
            <p className="text-gray-500 text-sm">Lưu trữ đám mây an toàn, phục hồi nhanh chóng.</p>
          </div>
        </div>

        <div className="bg-gray-900 text-white rounded-3xl p-10 text-center max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4">An tâm tuyệt đối khi lướt net</h2>
          <p className="text-gray-400 mb-8">Chỉ với 10.000đ/tháng, thiết bị của bạn sẽ luôn được bảo vệ 24/7 bởi hệ thống an ninh mạng hàng đầu của Viettel.</p>
          <Link to="/payment" className="bg-blue-600 hover:bg-blue-700 font-bold py-4 px-12 rounded-xl text-lg transition-colors inline-block text-center">
            Đăng ký sử dụng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeviceSecurityPage;

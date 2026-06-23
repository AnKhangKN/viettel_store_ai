import React from 'react';

const HomePage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 pb-6 border-b-2 border-red-600">
        <h1 className="text-3xl font-bold text-red-700">Chào mừng quay lại, Vy!</h1>
        <p className="text-gray-600 mt-2">Dưới đây là các tính năng chính của hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-red-600 hover:shadow-lg hover:border-l-red-700 transition-all">
          <h3 className="text-lg font-semibold text-gray-800">Quản lý Đơn hàng</h3>
          <p className="text-gray-500 mt-2 text-sm">Xem và xử lý các đơn hàng mới từ khách hàng.</p>
          <a href="/orders" className="inline-block mt-4 text-red-600 font-medium hover:text-red-800 hover:underline">
            Đi tới đơn hàng →
          </a>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-red-600 hover:shadow-lg hover:border-l-red-700 transition-all">
          <h3 className="text-lg font-semibold text-gray-800">Thông tin hệ thống</h3>
          <p className="text-gray-500 mt-2 text-sm">Xem chi tiết thông tin về dự án và phiên bản.</p>
          <a href="/about" className="inline-block mt-4 text-red-600 font-medium hover:text-red-800 hover:underline">
            Xem chi tiết →
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
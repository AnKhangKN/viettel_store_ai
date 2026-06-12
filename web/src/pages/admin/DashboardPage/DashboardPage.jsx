import React from 'react';
import { FaUsers, FaShoppingCart, FaChartLine, FaBox } from 'react-icons/fa';

const DashboardPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan quản trị</h1>
        <p className="text-gray-500">Chào mừng bạn quay lại bảng điều khiển Admin.</p>
      </div>

      {/* Các ô thống kê (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Người dùng", value: "1,250", icon: <FaUsers />, color: "bg-blue-500" },
          { title: "Đơn hàng", value: "345", icon: <FaShoppingCart />, color: "bg-green-500" },
          { title: "Doanh thu", value: "2.5 tỷ", icon: <FaChartLine />, color: "bg-purple-500" },
          { title: "Sản phẩm", value: "89", icon: <FaBox />, color: "bg-orange-500" },
        ].map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`${item.color} text-white p-4 rounded-lg`}>{item.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h3 className="text-xl font-bold text-gray-800">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Bảng dữ liệu mẫu */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng gần đây</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-3 font-semibold text-gray-600">Khách hàng</th>
              <th className="pb-3 font-semibold text-gray-600">Sản phẩm</th>
              <th className="pb-3 font-semibold text-gray-600">Giá trị</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">Nguyễn Võ Thuý Vy</td>
              <td className="py-3">Laptop Dell</td>
              <td className="py-3 text-blue-600 font-medium">20.000.000đ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
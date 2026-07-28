import React from 'react';
import { FaUsers, FaShoppingCart, FaChartLine, FaBox } from 'react-icons/fa';
import TableComponent from '../../../components/shared/TableComponent/TableComponent';

const DashboardPageAdmin = () => {
  // Dữ liệu mock phong phú cho đơn hàng gần đây để test phân trang & tìm kiếm
  const mockOrders = [
    { id: 1, khachHang: "Nguyễn Võ Thuý Vy", sanPham: "SIM Số Đẹp 0988xxxx88", giaTri: "500.000đ", trangThai: "Đã thanh toán" },
    { id: 2, khachHang: "Phan Văn Trị", sanPham: "Gói cước V200C", giaTri: "200.000đ", trangThai: "Chờ thanh toán" },
    { id: 3, khachHang: "Lê Thị Hồng Nhung", sanPham: "SIM Số Đẹp 0868xxxx68", giaTri: "1.200.000đ", trangThai: "Đã thanh toán" },
    { id: 4, khachHang: "Trần Minh Hoàng", sanPham: "SIM VIP 0909xxxx99", giaTri: "2.500.000đ", trangThai: "Đã thanh toán" },
    { id: 5, khachHang: "Phạm Hải Đăng", sanPham: "Gói cước ST90N", giaTri: "90.000đ", trangThai: "Chờ thanh toán" },
    { id: 6, khachHang: "Vũ Hoàng My", sanPham: "Gói cước 5G150", giaTri: "150.000đ", trangThai: "Đã thanh toán" },
    { id: 7, khachHang: "Đặng Hoàng Long", sanPham: "SIM Thần Tài 0399xxxx39", giaTri: "950.000đ", trangThai: "Chờ thanh toán" },
    { id: 8, khachHang: "Trương Mỹ Nhân", sanPham: "SIM Tam Hoa 0977xxxx77", giaTri: "800.000đ", trangThai: "Đã thanh toán" },
  ];

  // Định nghĩa các cột hiển thị trong bảng
  const columns = [
    {
      header: "Khách hàng",
      accessor: "khachHang",
      sortable: true
    },
    {
      header: "Sản phẩm dịch vụ",
      accessor: "sanPham",
      sortable: true
    },
    {
      header: "Giá trị đơn hàng",
      accessor: "giaTri",
      sortable: true,
      render: (row) => <span className="text-gray-900 font-bold">{row.giaTri}</span>
    },
    {
      header: "Trạng thái",
      accessor: "trangThai",
      sortable: true,
      render: (row) => (
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            row.trangThai === "Đã thanh toán"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.trangThai}
        </span>
      ),
    }
  ];

  // Cấu hình bộ lọc
  const filterConfigs = [
    {
      field: "trangThai",
      label: "Trạng thái",
      options: [
        { label: "Đã thanh toán", value: "Đã thanh toán" },
        { label: "Chờ thanh toán", value: "Chờ thanh toán" }
      ]
    }
  ];

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

      {/* Bảng dữ liệu dùng chung */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Đơn hàng gần đây</h2>
        <TableComponent
          data={mockOrders}
          columns={columns}
          searchPlaceholder="Tìm theo tên khách hàng, sản phẩm..."
          searchFields={["khachHang", "sanPham"]}
          filterConfigs={filterConfigs}
          defaultItemsPerPage={5}
        />
      </div>
    </div>
  );
};

export default DashboardPageAdmin;
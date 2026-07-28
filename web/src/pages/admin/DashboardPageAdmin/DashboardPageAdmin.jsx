import React, { useEffect, useMemo, useState } from 'react';
import { FaUsers, FaShoppingCart, FaChartLine, FaBox } from 'react-icons/fa';
import TableComponent from '../../../components/shared/TableComponent/TableComponent';
import { getAllAccounts } from '../../../api/user/user.api';
import { getAllSims } from '../../../api/sim/sim.api';
import { getAllPackages } from '../../../api/package/package.api';
import { getAllBranches } from '../../../api/branch/branch.api';
import { getStaffSimOrders } from '../../../api/payment/payment.api';

const formatCurrency = (value) => {
  const number = Number(value || 0);
  return new Intl.NumberFormat('vi-VN').format(number) + 'đ';
};

const DashboardPageAdmin = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    products: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = useMemo(() => [
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
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${row.trangThai === "Đã thanh toán"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {row.trangThai}
        </span>
      ),
    }
  ], []);

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

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [accountsRes, simsRes, packagesRes, branchesRes, ordersRes] = await Promise.allSettled([
          getAllAccounts(),
          getAllSims(),
          getAllPackages(),
          getAllBranches(),
          getStaffSimOrders(),
        ]);

        const accounts = accountsRes.status === 'fulfilled' ? (accountsRes.value?.data || accountsRes.value || []) : [];
        const sims = simsRes.status === 'fulfilled' ? (simsRes.value?.data || simsRes.value || []) : [];
        const packages = packagesRes.status === 'fulfilled' ? (packagesRes.value?.data || packagesRes.value || []) : [];
        const branches = branchesRes.status === 'fulfilled' ? (branchesRes.value?.data || branchesRes.value || []) : [];
        const orders = ordersRes.status === 'fulfilled' ? (ordersRes.value?.data || ordersRes.value || []) : [];

        const mappedOrders = Array.isArray(orders)
          ? orders.slice(0, 8).map((order, index) => ({
            id: order.id_don_hang || order.id_thanh_toan || index + 1,
            khachHang: order.ho_ten || order.ten_khach_hang || order.email || 'Khách hàng',
            sanPham: order.ten_san_pham || order.ten_sim || order.ten_goi || order.so_sim || 'Đơn hàng',
            giaTri: formatCurrency(order.so_tien || order.tong_tien || order.gia_ban || 0),
            trangThai: order.trang_thai === 'ThanhCong' || order.trang_thai === 'DaThanhToan'
              ? 'Đã thanh toán'
              : 'Chờ thanh toán',
          }))
          : [];

        setStats({
          users: Array.isArray(accounts) ? accounts.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          revenue: Array.isArray(orders)
            ? orders.reduce((sum, item) => sum + Number(item.so_tien || item.tong_tien || 0), 0)
            : 0,
          products: (Array.isArray(sims) ? sims.length : 0) + (Array.isArray(packages) ? packages.length : 0) + (Array.isArray(branches) ? branches.length : 0),
        });

        setRecentOrders(mappedOrders);
      } catch (error) {
        console.error('Lỗi tải dữ liệu dashboard admin:', error);
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan quản trị</h1>
        <p className="text-gray-500">Dữ liệu được lấy trực tiếp từ hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Người dùng", value: stats.users.toLocaleString('vi-VN'), icon: <FaUsers />, color: "bg-blue-500" },
          { title: "Đơn hàng", value: stats.orders.toLocaleString('vi-VN'), icon: <FaShoppingCart />, color: "bg-green-500" },
          { title: "Doanh thu", value: formatCurrency(stats.revenue), icon: <FaChartLine />, color: "bg-purple-500" },
          { title: "Sản phẩm", value: stats.products.toLocaleString('vi-VN'), icon: <FaBox />, color: "bg-orange-500" },
        ].map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`${item.color} text-white p-4 rounded-lg`}>{item.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h3 className="text-xl font-bold text-gray-800">{loading ? 'Đang tải...' : item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Đơn hàng gần đây</h2>
        <TableComponent
          data={recentOrders}
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

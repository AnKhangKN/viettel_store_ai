import React, { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const PackagePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Tất cả');

  // Dữ liệu mẫu (sau này bạn thay bằng dữ liệu lấy từ API Python nhé)
  const packages = [
    { id: 1, name: 'V120B', price: '120.000đ', data: '4GB/ngày', type: 'Combo' },
    { id: 2, name: 'MXH120', price: '120.000đ', data: '1GB/ngày', type: 'Data' },
    { id: 3, name: 'SD135', price: '135.000đ', data: '7GB/ngày', type: '5G' },
  ];

  const filteredPackages = packages.filter(pkg => 
    (filter === 'Tất cả' || pkg.type === filter) &&
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Danh sách gói cước</h2>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tên gói..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 rounded-lg border bg-white"
          onChange={(e) => setFilter(e.target.value)}
        >
          {['Tất cả', 'Data', 'Thoại', 'Combo', '5G'].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Grid hiển thị gói cước */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPackages.map(pkg => (
          <div key={pkg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="text-red-500 font-bold mb-2">{pkg.type}</div>
            <h3 className="text-xl font-bold">{pkg.name}</h3>
            <p className="text-gray-500 my-2">{pkg.data}</p>
            <div className="text-2xl font-black text-gray-800 my-4">{pkg.price}</div>
            <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700">
              Đăng ký ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagePage;
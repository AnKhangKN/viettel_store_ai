import React, { useState } from "react";
import { Search, ShoppingCart, Eye } from "lucide-react";

const BuySim = () => {
  const simList = [
    {
      maSim: "SIM001",
      soSim: "0988xxxx88",
      loaiSim: "Số đẹp",
      giaBan: "500.000đ",
      trangThai: "Còn hàng",
    },
    {
      maSim: "SIM002",
      soSim: "0977xxxx77",
      loaiSim: "Tam hoa",
      giaBan: "800.000đ",
      trangThai: "Còn hàng",
    },
    {
      maSim: "SIM003",
      soSim: "0868xxxx68",
      loaiSim: "Lộc phát",
      giaBan: "1.200.000đ",
      trangThai: "Còn hàng",
    },
    {
      maSim: "SIM004",
      soSim: "0909xxxx99",
      loaiSim: "VIP",
      giaBan: "2.500.000đ",
      trangThai: "Còn hàng",
    },
    {
      maSim: "SIM005",
      soSim: "0399xxxx39",
      loaiSim: "Thần tài",
      giaBan: "950.000đ",
      trangThai: "Còn hàng",
    },
    {
      maSim: "SIM006",
      soSim: "0888xxxx68",
      loaiSim: "Số đẹp",
      giaBan: "650.000đ",
      trangThai: "Còn hàng",
    },
  ];

  const [keyword, setKeyword] = useState("");
  const [selectedType, setSelectedType] = useState("Tất cả");

  const types = ["Tất cả", "Số đẹp", "Tam hoa", "Lộc phát", "Thần tài", "VIP"];

  const filteredSim = simList.filter((sim) => {
    const search = sim.soSim.toLowerCase().includes(keyword.toLowerCase());

    const type = selectedType === "Tất cả" || sim.loaiSim === selectedType;

    return search && type;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-[#EE0033] mb-2">
          Mua SIM Online
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Chọn số đẹp và đặt mua trực tuyến
        </p>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-5 justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />

              <input
                type="text"
                placeholder="Tìm số SIM..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2 rounded-xl font-semibold transition ${
                    selectedType === type
                      ? "bg-[#EE0033] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSim.map((sim) => (
            <div
              key={sim.maSim}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6"
            >
              {/* Số SIM */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#EE0033]">
                  {sim.soSim}
                </h2>
              </div>

              {/* Thông tin */}
              <div className="space-y-4 mb-7">
                <div className="flex justify-between">
                  <span className="text-gray-500">Loại SIM</span>

                  <span className="font-semibold text-[#EE0033]">
                    {sim.loaiSim}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Giá</span>

                  <span className="font-bold text-green-600">{sim.giaBan}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái</span>

                  <span className="font-semibold text-green-600">
                    {sim.trangThai}
                  </span>
                </div>
              </div>

              {/* Nút */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 hover:bg-gray-100 transition">
                  <Eye size={18} />
                  Chi tiết
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 bg-[#EE0033] text-white rounded-xl py-3 hover:bg-red-700 transition">
                  <ShoppingCart size={18} />
                  Đặt mua
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSim.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-500">
              Không tìm thấy số SIM
            </h2>

            <p className="text-gray-400 mt-2">Vui lòng thử từ khóa khác.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuySim;

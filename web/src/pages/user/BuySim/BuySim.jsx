import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllSims, getSimTypes } from "../../../api/sim/sim.api";

const BuySim = () => {
  const [simList, setSimList] = useState([]);
  const [types, setTypes] = useState(["Tất cả"]);
  const [keyword, setKeyword] = useState("");
  const [selectedType, setSelectedType] = useState("Tất cả");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Tải danh sách Loại SIM
        const typesRes = await getSimTypes();
        if (typesRes?.success && typesRes?.data) {
          const typeNames = ["Tất cả", ...typesRes.data.map(t => t.ten_loai_sim)];
          setTypes(typeNames);
        }
        
        // 2. Tải danh sách SIM
        const simsRes = await getAllSims();
        if (simsRes?.success && simsRes?.data) {
          const formattedSims = simsRes.data.map(sim => ({
            maSim: sim.id_sim,
            soSim: sim.so_sim,
            loaiSim: sim.loai_sim?.ten_loai_sim || "Chưa phân loại",
            giaBan: sim.gia_ban.toLocaleString("vi-VN") + "đ",
            trangThai: sim.trang_thai === "ConHang" ? "Còn hàng" : sim.trang_thai === "GiuSo" ? "Đang giữ số" : "Đã bán",
            rawStatus: sim.trang_thai
          }));
          setSimList(formattedSims);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu SIM:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSim = simList.filter((sim) => {
    // Chuẩn hóa chuỗi số điện thoại để tìm kiếm thông minh hơn
    const cleanSimNumber = sim.soSim.replace(/[^0-9]/g, "");
    const cleanKeyword = keyword.replace(/[^0-9]/g, "");
    const search = cleanSimNumber.includes(cleanKeyword) || sim.soSim.includes(keyword);

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
          <div className="flex flex-col lg:flex-row gap-5 justify-between items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm số SIM..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                />
              </div>
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin mb-4" />
            <p className="text-gray-500 font-medium text-sm">Đang tải danh sách SIM số đẹp...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSim.map((sim) => (
                <div
                  key={sim.maSim}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    {/* Số SIM */}
                    <div className="text-center mb-6">
                      <h2 className="text-3xl font-black text-[#EE0033] tracking-wide">
                        {sim.soSim}
                      </h2>
                    </div>

                    {/* Thông tin */}
                    <div className="space-y-3.5 mb-7 text-sm">
                      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="text-gray-400 font-medium">Loại SIM</span>
                        <span className="font-bold text-[#EE0033]">
                          {sim.loaiSim}
                        </span>
                      </div>

                      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="text-gray-400 font-medium">Giá bán</span>
                        <span className="font-extrabold text-green-600 text-base">{sim.giaBan}</span>
                      </div>

                      <div className="flex justify-between items-center pb-1">
                        <span className="text-gray-400 font-medium">Trạng thái</span>
                        <span className={`font-bold ${sim.rawStatus === "ConHang" ? "text-green-600" : "text-amber-500"}`}>
                          {sim.trangThai}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nút */}
                  <div className="flex gap-3">
                    <Link to={`/buysim/${sim.maSim}`} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-xs font-bold hover:bg-gray-50 transition text-gray-700 shadow-sm cursor-pointer">
                      <Eye size={16} />
                      Chi tiết
                    </Link>

                    <Link to={`/buysim/${sim.maSim}`} className="flex-1 flex items-center justify-center gap-2 bg-[#EE0033] text-white rounded-xl py-3 text-xs font-bold hover:bg-[#A00022] transition shadow-md cursor-pointer">
                      <ShoppingCart size={16} />
                      Đặt mua
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredSim.length === 0 && (
              <div className="bg-white rounded-2xl shadow p-16 text-center border border-gray-100">
                <h2 className="text-xl font-bold text-gray-500">
                  Không tìm thấy số SIM phù hợp
                </h2>
                <p className="text-gray-400 text-sm mt-2">Vui lòng thử tìm kiếm bằng một từ khóa khác.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuySim;

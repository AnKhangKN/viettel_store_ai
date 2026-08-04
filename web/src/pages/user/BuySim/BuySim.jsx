import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Eye, Loader2, Sparkles, Filter, ShieldCheck, PhoneCall, Star } from "lucide-react";
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
            loaiSim: sim.loai_sim?.ten_loai_sim || "SIM Số Đẹp",
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
    const status = (sim.rawStatus || "").trim().toLowerCase();
    // Ẩn hoàn toàn các SIM đã bán (DaBan, DaThanhToan), đã đặt (DaDat), hoặc không sẵn có
    const isAvailable = status === "conhang" || status === "dangban";
    const cleanSimNumber = sim.soSim.replace(/[^0-9]/g, "");
    const cleanKeyword = keyword.replace(/[^0-9]/g, "");
    const search = cleanSimNumber.includes(cleanKeyword) || sim.soSim.includes(keyword);
    const type = selectedType === "Tất cả" || sim.loaiSim === selectedType;
    return isAvailable && search && type;
  });



  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-20">
      
      {/* HERO BANNER KHO SIM */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-14 px-4 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center md:text-left relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-[#EE0033] border border-red-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Kho SIM Số Đẹp Viettel
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">MUA SIM VIETTEL ONLINE</h1>
            <p className="text-slate-400 text-sm mt-2 font-normal max-w-xl leading-relaxed">
              Chọn số phong thủy, lộc phát, thần tài hoặc năm sinh. Giao SIM tận nhà miễn phí toàn quốc.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3 text-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-extrabold text-white">Đăng ký chính chủ 100%</p>
              <p className="text-slate-300">Hỗ trợ eSIM hoặc SIM vật lý tận nơi</p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-5 justify-between items-start lg:items-center">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nhập số SIM cần tìm (VD: 098, 888...)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-[#EE0033] focus:bg-white outline-none text-xs font-bold transition-all"
              />
              {keyword && (
                <button
                  onClick={() => setKeyword('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#EE0033]" /> Phân loại:
              </span>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedType === type
                      ? "bg-[#EE0033] text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* LOADING & SIM LIST GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xs border border-slate-100">
            <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin mb-4" />
            <p className="text-slate-500 font-bold text-xs">Đang tải kho SIM số đẹp Viettel...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSim.map((sim) => (
                <div
                  key={sim.maSim}
                  className="bg-white rounded-3xl shadow-[0_6px_20px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(238,0,51,0.2)] hover:-translate-y-2 transition-all duration-300 p-6 border-2 border-slate-100 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-red-50 to-amber-50 text-[#EE0033] text-[10px] font-black px-3.5 py-1 rounded-bl-2xl border-l border-b border-red-100 uppercase tracking-widest flex items-center gap-1.5 shadow-2xs">
                    <Star className="w-3 h-3 fill-current text-amber-500 animate-pulse" /> SIM VIP
                  </div>

                  <div>
                    {/* Số SIM Header */}
                    <div className="text-center py-5 my-2 bg-gradient-to-br from-slate-50 to-red-50/20 rounded-2xl border border-slate-100 group-hover:bg-red-50/50 group-hover:border-red-200 transition-colors shadow-2xs">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">Số thuê bao Viettel</p>
                      <h2 className="text-3xl font-black text-slate-900 tracking-wider group-hover:text-[#EE0033] transition-colors drop-shadow-2xs">
                        {sim.soSim}
                      </h2>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-3 my-5 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Dòng SIM</span>
                        <span className="font-extrabold text-[#EE0033] bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-100">
                          {sim.loaiSim}
                        </span>
                      </div>

                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Giá bán niêm yết</span>
                        <span className="font-black text-emerald-600 text-base drop-shadow-2xs">{sim.giaBan}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Trạng thái kho</span>
                        <span className={`font-extrabold px-3 py-1 rounded-full text-[11px] ${
                          sim.rawStatus === "ConHang"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {sim.trangThai}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Link
                      to={`/buysim/${sim.maSim}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 text-xs font-extrabold hover:bg-slate-100 transition text-slate-700 shadow-[0_4px_0_#e5e7eb] hover:shadow-[0_6px_0_#d1d5db] hover:-translate-y-0.5 active:shadow-none active:translate-y-0.5 cursor-pointer"
                    >
                      <Eye size={15} />
                      Chi tiết
                    </Link>

                    <Link
                      to={`/buysim/${sim.maSim}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#EE0033] text-white rounded-xl py-2.5 text-xs font-black hover:bg-red-700 transition shadow-[0_4px_0_#A00022] hover:shadow-[0_6px_0_#A00022] hover:-translate-y-0.5 active:shadow-none active:translate-y-0.5 cursor-pointer"
                    >
                      <ShoppingCart size={15} />
                      Đặt mua
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredSim.length === 0 && (
              <div className="bg-white rounded-3xl shadow-xs p-16 text-center border border-slate-200 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  Không tìm thấy SIM phù hợp
                </h2>
                <p className="text-slate-400 text-xs mt-1">Vui lòng nhập từ khóa khác hoặc xóa bộ lọc dòng SIM.</p>
                <button
                  onClick={() => { setKeyword(''); setSelectedType('Tất cả'); }}
                  className="mt-4 text-xs font-bold text-[#EE0033] hover:underline cursor-pointer"
                >
                  Xóa tất cả tìm kiếm
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuySim;

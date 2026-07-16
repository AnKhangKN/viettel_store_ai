import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";

const BranchMapSection = ({ branchStores, selectedStore, setSelectedStore }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Lọc chi nhánh theo truy vấn tìm kiếm
  const filteredBranches = branchStores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-gray-50 py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-black text-[#EE0033] tracking-widest uppercase mb-3 block">
            Mạng lưới toàn quốc
          </span>
          <h3 className="text-3xl md:text-4xl font-black text-gray-900">
            Hệ thống chi nhánh Viettel
          </h3>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
            Tìm kiếm cửa hàng Viettel gần nhất để được hỗ trợ trực tiếp, nhanh chóng và chu đáo nhất.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          {/* List of branches */}
          <div className="w-full lg:w-1/3 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-100 bg-white">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm theo chi nhánh, địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#EE0033] outline-none text-sm transition-all"
              />
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {branchStores.length === 0 ? (
                <div className="text-center py-10 text-gray-400 font-semibold text-sm">
                  Hiện chưa cấu hình chi nhánh cửa hàng nào.
                </div>
              ) : filteredBranches.length === 0 ? (
                <div className="text-center py-10 text-gray-400 font-semibold text-sm">
                  Không tìm thấy chi nhánh phù hợp.
                </div>
              ) : (
                filteredBranches.map((store, i) => {
                  const isActive = selectedStore?.name === store.name;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedStore(store)}
                      className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                        isActive
                          ? "border-[#EE0033] bg-red-50 shadow-sm"
                          : "border-gray-100 hover:border-[#EE0033] hover:bg-red-50/50 bg-white"
                      }`}
                    >
                      <h4 className={`font-bold text-sm mb-1 ${isActive ? "text-[#EE0033]" : "text-gray-900"}`}>
                        {store.name}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#EE0033] flex-shrink-0 mt-0.5" />
                        {store.address}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Map iframe */}
          <div className="w-full lg:w-2/3 min-h-[400px] lg:min-h-full bg-gray-200 relative">
            {selectedStore ? (
              <iframe
                key={selectedStore.name}
                src={selectedStore.mapUrl}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold bg-gray-100 text-sm">
                Đang tải bản đồ chi nhánh...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BranchMapSection;

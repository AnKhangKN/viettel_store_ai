import React, { useState, useEffect } from 'react';
import { MapPin, Search, Phone, ChevronRight, Store, Navigation, Loader2, Clock } from 'lucide-react';
import { getAllBranches } from '../../../api/branch/branch.api';

const StoreLocatorPage = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getAllBranches();
        const branchList = res?.data || res || [];
        
        // Map database branches to standard structure
        const formattedStores = branchList.map((b) => {
          let embedUrl = b.map_url || '';
          
          // If map_url contains iframe tag string, extract src URL
          if (embedUrl.includes('<iframe')) {
            const match = embedUrl.match(/src=["']([^"']+)["']/);
            if (match && match[1]) {
              embedUrl = match[1];
            }
          }
          
          // If map_url is missing or invalid, generate fallback Google Maps embed URL
          if (!embedUrl || !embedUrl.startsWith('http')) {
            embedUrl = `https://www.google.com/maps?q=${encodeURIComponent((b.ten_chi_nhanh || '') + ' ' + (b.dia_chi || ''))}&output=embed`;
          }

          return {
            id: b.id_chi_nhanh,
            name: b.ten_chi_nhanh || 'Chi nhánh Viettel Store',
            address: b.dia_chi || 'Chưa cập nhật địa chỉ',
            phone: b.so_hotline || '1800 8123',
            workingHours: b.gio_lam_viec || '08:00 - 21:30 (Thứ 2 - CN)',
            mapUrl: embedUrl
          };
        });

        setStores(formattedStores);
        if (formattedStores.length > 0) {
          setSelectedStore(formattedStores[0]);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách chi nhánh từ DB:", err);
        setError("Không thể tải danh sách chi nhánh. Vui lòng kiểm tra lại kết nối!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-16 text-slate-800 font-sans antialiased">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center md:text-left relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-[#EE0033] border border-red-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Store className="w-3.5 h-3.5" /> Hệ Thống Siêu Thị Viettel Store
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">TÌM KIẾM CỬA HÀNG VIETTEL</h1>
          <p className="text-slate-400 text-sm mt-1 font-normal max-w-xl">
            Danh sách điểm giao dịch và cửa hàng trực thuộc hệ thống Viettel Store chính thức.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar List */}
        <div className="w-full lg:w-96 bg-white rounded-3xl shadow-xs border border-slate-200 p-5 flex flex-col h-[400px] lg:h-[650px]">
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Tìm theo tên chi nhánh, địa chỉ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#EE0033]" />
                <span className="text-xs font-bold">Đang tải danh sách chi nhánh...</span>
              </div>
            ) : error ? (
              <div className="text-center text-rose-500 text-xs font-bold py-10 px-4">
                {error}
              </div>
            ) : filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <div 
                  key={store.id} 
                  onClick={() => setSelectedStore(store)}
                  className={`p-3.5 border rounded-2xl cursor-pointer transition-all ${
                    selectedStore?.id === store.id 
                      ? 'border-[#EE0033] bg-red-50/40 shadow-xs' 
                      : 'border-slate-200 hover:border-red-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className={`font-extrabold text-xs mb-1.5 ${selectedStore?.id === store.id ? 'text-[#EE0033]' : 'text-slate-900'}`}>
                      {store.name}
                    </h3>
                    {selectedStore?.id === store.id && <ChevronRight className="w-4 h-4 text-[#EE0033] flex-shrink-0" />}
                  </div>
                  <p className="text-slate-600 text-[11px] mb-1.5 flex items-start leading-relaxed">
                    <MapPin className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5 ${selectedStore?.id === store.id ? 'text-[#EE0033]' : 'text-slate-400'}`} />
                    {store.address}
                  </p>
                  <div className="flex flex-wrap gap-y-1 justify-between text-[11px] text-slate-600">
                    <span className="flex items-center font-bold">
                      <Phone className={`w-3.5 h-3.5 mr-1.5 ${selectedStore?.id === store.id ? 'text-[#EE0033]' : 'text-slate-400'}`} />
                      {store.phone}
                    </span>
                    <span className="flex items-center text-slate-500 text-[10px]">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      {store.workingHours}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 text-xs py-10">
                Không tìm thấy chi nhánh phù hợp trong Cơ sở dữ liệu.
              </div>
            )}
          </div>
        </div>

        {/* Map Display */}
        <div className="flex-1 bg-white rounded-3xl overflow-hidden h-[450px] lg:h-[650px] border border-slate-200 shadow-xs flex flex-col">
          {selectedStore ? (
            <>
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800">
                <div>
                  <h2 className="text-base font-black flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-yellow-400" />
                    {selectedStore.name}
                  </h2>
                  <p className="text-slate-400 text-xs truncate max-w-lg mt-0.5">{selectedStore.address}</p>
                </div>
                <a 
                  href={`tel:${selectedStore.phone.replace(/\s+/g, '')}`} 
                  className="bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs flex-shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" /> Gọi ngay
                </a>
              </div>
              <div className="flex-1 w-full h-full relative bg-slate-100">
                <iframe
                  title="Google Map Store"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={selectedStore.mapUrl}
                  className="absolute inset-0"
                ></iframe>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs gap-2">
              <MapPin className="w-8 h-8 text-slate-300" />
              <span>Vui lòng chọn một chi nhánh từ danh sách để xem bản đồ</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StoreLocatorPage;

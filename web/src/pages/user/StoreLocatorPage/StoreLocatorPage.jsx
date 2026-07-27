import React, { useState } from 'react';
import { MapPin, Search, Phone, ChevronRight, Store, Sparkles, Navigation } from 'lucide-react';

const storeData = [
  { 
    id: 1, 
    name: 'Viettel Store - Hai Bà Trưng', 
    address: 'Số 102 Hai Bà Trưng, Phường Cửa Nam, Quận Hoàn Kiếm, Hà Nội', 
    phone: '1800 8123',
    mapUrl: 'https://www.google.com/maps?q=Viettel+Store+Hai+Bà+Trưng+Hà+Nội&output=embed'
  },
  { 
    id: 2, 
    name: 'Viettel Store - 3 Tháng 2', 
    address: 'Số 20 Đường 3 Tháng 2, Phường 12, Quận 10, TP. Hồ Chí Minh', 
    phone: '1800 8124',
    mapUrl: 'https://www.google.com/maps?q=Viettel+Store+Đường+3+Tháng+2+Quận+10&output=embed'
  },
  { 
    id: 3, 
    name: 'Viettel Store - Nguyễn Văn Linh', 
    address: 'Số 15 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng', 
    phone: '1800 8125',
    mapUrl: 'https://www.google.com/maps?q=Viettel+Store+Nguyễn+Văn+Linh+Đà+Nẵng&output=embed'
  },
  { 
    id: 4, 
    name: 'Viettel Store - Ninh Kiều', 
    address: 'Số 55 Đại lộ Hòa Bình, Quận Ninh Kiều, Cần Thơ', 
    phone: '1800 8126',
    mapUrl: 'https://www.google.com/maps?q=Viettel+Store+Hòa+Bình+Ninh+Kiều+Cần+Thơ&output=embed'
  },
  { 
    id: 5, 
    name: 'Viettel Store - Trần Hưng Đạo', 
    address: 'Số 22 Trần Hưng Đạo, Phường Phú Thủy, TP. Phan Thiết, Bình Thuận', 
    phone: '1800 8127',
    mapUrl: 'https://www.google.com/maps?q=Viettel+Store+Trần+Hưng+Đạo+Phan+Thiết&output=embed'
  },
  { 
    id: 6, 
    name: 'Viettel Store - Tô Hiệu', 
    address: 'Số 246 Tô Hiệu, Phường Trại Cau, Quận Lê Chân, Hải Phòng', 
    phone: '1800 8128',
    mapUrl: 'https://www.google.com/maps?q=Viettel+Store+Tô+Hiệu+Hải+Phòng&output=embed'
  }
];

const StoreLocatorPage = () => {
  const [selectedStore, setSelectedStore] = useState(storeData[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = storeData.filter(store => 
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
            Mạng lưới hơn 300 siêu thị viễn thông phủ rộng 63 tỉnh thành trên toàn quốc.
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
              placeholder="Tìm theo tỉnh/thành, quận/huyện..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <div 
                  key={store.id} 
                  onClick={() => setSelectedStore(store)}
                  className={`p-3.5 border rounded-2xl cursor-pointer transition-all ${
                    selectedStore.id === store.id 
                      ? 'border-[#EE0033] bg-red-50/40 shadow-xs' 
                      : 'border-slate-200 hover:border-red-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className={`font-extrabold text-xs mb-1.5 ${selectedStore.id === store.id ? 'text-[#EE0033]' : 'text-slate-900'}`}>
                      {store.name}
                    </h3>
                    {selectedStore.id === store.id && <ChevronRight className="w-4 h-4 text-[#EE0033] flex-shrink-0" />}
                  </div>
                  <p className="text-slate-600 text-[11px] mb-1.5 flex items-start leading-relaxed">
                    <MapPin className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5 ${selectedStore.id === store.id ? 'text-[#EE0033]' : 'text-slate-400'}`} />
                    {store.address}
                  </p>
                  <p className="text-slate-600 text-[11px] flex items-center font-bold">
                    <Phone className={`w-3.5 h-3.5 mr-1.5 ${selectedStore.id === store.id ? 'text-[#EE0033]' : 'text-slate-400'}`} />
                    Hotline: {store.phone}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 text-xs py-10">
                Không tìm thấy chi nhánh phù hợp.
              </div>
            )}
          </div>
        </div>

        {/* Map Display */}
        <div className="flex-1 bg-white rounded-3xl overflow-hidden h-[450px] lg:h-[650px] border border-slate-200 shadow-xs flex flex-col">
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
              className="bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
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
        </div>

      </div>
    </div>
  );
};

export default StoreLocatorPage;

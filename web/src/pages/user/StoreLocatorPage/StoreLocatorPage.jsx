import React, { useState } from 'react';
import { MapPin, Search, Phone, ChevronRight } from 'lucide-react';

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
  },
  { 
    id: 7, 
    name: 'Viettel Store - Thái Nguyên', 
    address: 'Số 69 Thái Nguyên, Phường Phước Tân, TP. Nha Trang, Khánh Hòa', 
    phone: '1800 8129',
    mapUrl: 'https://www.google.com/maps?q=Viettel+Store+Thái+Nguyên+Nha+Trang&output=embed'
  },
  { 
    id: 8, 
    name: 'Viettel Store - Ba Cu', 
    address: 'Số 120 Ba Cu, Phường 3, TP. Vũng Tàu, Bà Rịa - Vũng Tàu', 
    phone: '1800 8130',
    mapUrl: 'https://www.google.com/maps?q=Viettel+Store+Ba+Cu+Vũng+Tàu&output=embed'
  },
  { 
    id: 9, 
    name: 'Viettel Store - Phan Chu Trinh', 
    address: 'Số 45 Phan Chu Trinh, Phường Thắng Lợi, TP. Buôn Ma Thuột, Đắk Lắk', 
    phone: '1800 8131',
    mapUrl: 'https://www.google.com/maps?q=Viettel+Store+Phan+Chu+Trinh+Buôn+Ma+Thuột&output=embed'
  },
  { 
    id: 10, 
    name: 'Viettel Store - Minh Khai', 
    address: 'Số 15 Minh Khai, Phường Lê Mao, TP. Vinh, Nghệ An', 
    phone: '1800 8132',
    mapUrl: 'https://www.google.com/maps?q=Viettel+Store+Minh+Khai+Vinh+Nghệ+An&output=embed'
  },
];

const StoreLocatorPage = () => {
  const [selectedStore, setSelectedStore] = useState(storeData[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = storeData.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-600 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-extrabold mb-2">Tìm kiếm cửa hàng Viettel</h1>
        <p className="text-blue-100">Hệ thống hơn 300 siêu thị rộng khắp 63 tỉnh thành</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-[700px]">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Nhập tỉnh/thành phố, quận/huyện..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <div 
                  key={store.id} 
                  onClick={() => setSelectedStore(store)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedStore.id === store.id 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold mb-2 text-lg ${selectedStore.id === store.id ? 'text-blue-700' : 'text-gray-900'}`}>
                      {store.name}
                    </h3>
                    {selectedStore.id === store.id && <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 flex items-start">
                    <MapPin className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${selectedStore.id === store.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    {store.address}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center font-medium">
                    <Phone className={`w-4 h-4 mr-2 ${selectedStore.id === store.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    {store.phone}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                Không tìm thấy cửa hàng nào phù hợp với tìm kiếm của bạn.
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="w-full lg:w-2/3 bg-gray-200 rounded-2xl overflow-hidden h-[700px] border border-gray-200 shadow-sm flex flex-col">
          <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedStore.name}</h2>
              <p className="text-gray-600 text-sm">{selectedStore.address}</p>
            </div>
            <a href={`tel:${selectedStore.phone.replace(/\s+/g, '')}`} className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold py-2 px-4 rounded-lg flex items-center transition-colors">
              <Phone className="w-4 h-4 mr-2" /> Gọi ngay
            </a>
          </div>
          <div className="flex-1 w-full h-full relative">
            <iframe
              title="Google Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
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

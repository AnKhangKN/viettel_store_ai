import React, { useState } from 'react';
import { Globe, Plane, ShieldCheck, MapPin, Search, CheckCircle2, AlertCircle } from 'lucide-react';

// Mock data
const mockRoamingPackages = [
  { id: 1, name: 'HQ1', countries: ['Hàn Quốc'], data: '1GB/ngày', price: '50.000đ', valid: '1 ngày', description: 'Gói cước theo ngày siêu tiết kiệm' },
  { id: 2, name: 'TH7', countries: ['Thái Lan'], data: '5GB', price: '150.000đ', valid: '7 ngày', description: 'Lướt web vi vu 7 ngày tại Thái' },
  { id: 3, name: 'MY10', countries: ['Mỹ'], data: '10GB', price: '450.000đ', valid: '10 ngày', description: 'Trải nghiệm Internet tốc độ cao tại xứ cờ hoa' },
  { id: 4, name: 'EU30', countries: ['Anh', 'Pháp', 'Đức', 'Ý', 'Tây Ban Nha'], data: '20GB', price: '1.200.000đ', valid: '30 ngày', description: 'Đi khắp châu Âu không lo mất mạng' },
  { id: 5, name: 'ASEAN5', countries: ['Thái Lan', 'Singapore', 'Malaysia', 'Indonesia', 'Campuchia'], data: '5GB', price: '200.000đ', valid: '5 ngày', description: 'Gói cước dùng chung 5 nước Đông Nam Á' },
  { id: 6, name: 'WORLD', countries: ['Mỹ', 'Nhật Bản', 'Hàn Quốc', 'Úc', 'Canada', 'Toàn cầu'], data: '15GB', price: '900.000đ', valid: '15 ngày', description: 'Gói cước toàn cầu áp dụng 100+ quốc gia' },
];

const RoamingPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(true);
      return;
    }
    const searchTerm = query.toLowerCase().trim();
    const filtered = mockRoamingPackages.filter(pkg => 
      pkg.countries.some(country => country.toLowerCase().includes(searchTerm)) ||
      (searchTerm === 'toàn cầu' && pkg.countries.includes('Toàn cầu'))
    );
    setResults(filtered);
    setHasSearched(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-blue-900 text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000" alt="World Map" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Globe className="w-16 h-16 mx-auto mb-6 text-blue-300" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Đăng Ký Chuyển Vùng Quốc Tế
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Giữ kết nối liên tục tại hơn 200 quốc gia. Đăng ký dễ dàng, quản lý cước phí thông minh với các gói Data Roaming siêu tiết kiệm.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600">
                <Plane className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Phủ sóng 200+ quốc gia</h3>
              <p className="text-sm text-gray-500">Du lịch hay công tác, mạng luôn sẵn sàng</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Không cần đổi Sim</h3>
              <p className="text-sm text-gray-500">Giữ nguyên số Việt Nam ở nước ngoài</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Kiểm soát cước phí</h3>
              <p className="text-sm text-gray-500">Tự động cảnh báo khi sắp hết Data</p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tra cứu gói cước Roaming</h2>
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto relative">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tên quốc gia bạn sắp đến (VD: Mỹ, Hàn Quốc...)" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-lg" 
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-colors shadow-md md:w-auto w-full text-lg whitespace-nowrap"
              >
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
                {results.length > 0 
                  ? `Tìm thấy ${results.length} gói cước phù hợp cho "${query}"` 
                  : `Không tìm thấy gói cước nào cho "${query}"`}
              </h3>
              
              {results.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl flex items-start">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Rất tiếc!</h4>
                    <p className="text-yellow-700">Không có gói cước cụ thể nào khớp với từ khóa của bạn. Vui lòng thử tìm kiếm "Toàn cầu" hoặc liên hệ tổng đài 1800 8098 để được hỗ trợ.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((pkg) => (
                    <div key={pkg.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-blue-600 text-white font-bold px-4 py-1 rounded-bl-lg">
                        {pkg.name}
                      </div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-gray-500 text-sm font-medium mb-1">Áp dụng tại:</p>
                          <p className="font-bold text-gray-900 line-clamp-1" title={pkg.countries.join(', ')}>
                            {pkg.countries.join(', ')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-blue-600 font-medium mb-1">Data</p>
                          <p className="font-extrabold text-gray-900 text-lg">{pkg.data}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-blue-600 font-medium mb-1">Thời hạn</p>
                          <p className="font-extrabold text-gray-900 text-lg">{pkg.valid}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Giá cước</p>
                          <p className="text-2xl font-black text-blue-600">{pkg.price}</p>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                          Đăng ký
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-4 border-t pt-4 border-gray-100 flex items-start">
                         <CheckCircle2 className="w-4 h-4 text-green-500 mr-1.5 flex-shrink-0 mt-0.5" />
                         {pkg.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoamingPage;

import React, { useState } from 'react';
import { Calendar, ChevronRight, TrendingUp, Loader2, Sparkles, Newspaper, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsPage = () => {
  const featuredArticle = {
    title: 'Viettel chính thức phủ sóng 5G trên toàn quốc với tốc độ vượt trội',
    excerpt: 'Trải nghiệm tốc độ mạng không dây nhanh chưa từng có với công nghệ 5G tiên tiến nhất. Khám phá ngay các ưu đãi dành riêng cho thuê bao nâng cấp trong tháng này.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070',
    date: '24/10/2026',
    category: 'Tin Nổi Bật'
  };

  const allArticles = [
    {
      id: 1,
      title: 'Ra mắt gói cước Data 5G không giới hạn mới dành cho Gen Z',
      excerpt: 'Gói cước mới mang đến trải nghiệm lướt web, xem phim 4K thả ga mà không lo về giá, phù hợp học sinh sinh viên.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
      date: '23/10/2026',
      category: 'Khuyến Mãi'
    },
    {
      id: 2,
      title: 'Hướng dẫn bảo mật thông tin cá nhân trên ứng dụng di động',
      excerpt: 'Cập nhật ngay các mẹo nhỏ nhưng vô cùng hữu ích để bảo vệ tài khoản và dữ liệu cá nhân của bạn trên không gian mạng.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
      date: '21/10/2026',
      category: 'Mẹo Hay'
    },
    {
      id: 3,
      title: 'Top 5 Smartphone 5G đáng mua nhất tại Viettel Store 2026',
      excerpt: 'Bạn đang tìm kiếm điện thoại mới hỗ trợ 5G? Dưới đây là những lựa chọn tốt nhất kèm voucher giảm giá 2 triệu.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
      date: '19/10/2026',
      category: 'Sản Phẩm'
    },
    {
      id: 4,
      title: 'Chương trình tri ân khách hàng thân thiết Viettel Cộng Cộng',
      excerpt: 'Hàng ngàn phần quà hấp dẫn và voucher mua sắm đang chờ đón quý khách hàng đổi điểm tích lũy.',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800',
      date: '18/10/2026',
      category: 'Khuyến Mãi'
    },
    {
      id: 5,
      title: 'Viettel Store chính thức mở bán flagship thế hệ mới',
      excerpt: 'Khách hàng đặt trước sẽ nhận được nhiều phần quà giá trị cùng ưu đãi trả góp 0% lãi suất.',
      image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&q=80&w=800',
      date: '15/10/2026',
      category: 'Sản Phẩm'
    },
    {
      id: 6,
      title: 'Cách chuyển đổi eSIM miễn phí ngay trên ứng dụng MyViettel',
      excerpt: 'Không cần ra cửa hàng, bạn hoàn toàn có thể tự chuyển đổi sang eSIM chỉ với vài thao tác đơn giản.',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=800',
      date: '12/10/2026',
      category: 'Mẹo Hay'
    }
  ];

  const categories = ['Tất cả', 'Tin Nổi Bật', 'Khuyến Mãi', 'Sản Phẩm', 'Mẹo Hay'];
  
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoading(false);
    }, 600);
  };

  const filteredArticles = activeCategory === 'Tất cả' 
    ? allArticles 
    : allArticles.filter(article => article.category === activeCategory);

  return (
    <div className="bg-slate-50 min-h-screen py-10 pb-20 text-slate-800 font-sans antialiased">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4 shadow-md relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center md:text-left relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-[#EE0033] border border-red-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Newspaper className="w-3.5 h-3.5" /> Tin Tức & Khuyến Mãi Viettel
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">TIN TỨC & SỰ KIỆN NỔI BẬT</h1>
          <p className="text-slate-400 text-sm mt-1 font-normal max-w-xl">
            Cập nhật những thông tin công nghệ mới nhất, xu hướng 5G và ưu đãi viễn thông Viettel.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          {categories.map((cat, index) => (
            <button 
              key={index}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(4);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-[#EE0033] text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Articles Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Featured Article */}
            {(activeCategory === 'Tất cả' || activeCategory === featuredArticle.category) && (
              <div 
                onClick={() => navigate('/news/1')}
                className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200 group cursor-pointer"
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#EE0033] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {featuredArticle.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center text-xs text-slate-400 font-medium mb-2">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {featuredArticle.date}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-[#EE0033] transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center text-[#EE0033] font-bold text-xs">
                    Xem chi tiết bài viết 
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            )}

            {/* Smaller Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredArticles.slice(0, visibleCount).map((article) => (
                  <div 
                    key={article.id} 
                    onClick={() => navigate(`/news/${article.id}`)}
                    className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200 group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur-md text-[#EE0033] text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center text-[11px] text-slate-400 font-medium mb-2">
                          <Calendar className="w-3 h-3 mr-1" />
                          {article.date}
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 mb-2 group-hover:text-[#EE0033] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <span className="flex items-center text-[#EE0033] text-xs font-bold">
                        Chi tiết <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-500 text-xs font-medium">Đang cập nhật tin tức cho chuyên mục này...</p>
              </div>
            )}
            
            {visibleCount < filteredArticles.length && (
              <div className="flex justify-center mt-8">
                <button 
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:border-[#EE0033] hover:text-[#EE0033] hover:bg-red-50/40 transition flex items-center justify-center cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#EE0033]" />
                      Đang tải thêm...
                    </>
                  ) : (
                    'Xem thêm bài viết tin tức'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xs p-6 border border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#EE0033]" />
                Đọc Nhiều Nhất 2026
              </h3>
              <ul className="space-y-4">
                {[
                  'Hướng dẫn đăng ký eSIM Viettel online tại nhà',
                  'Gói cước 5G150 siêu tốc độ phủ sóng toàn quốc',
                  'Những lưu ý quan trọng khi chuyển mạng giữ số',
                  'Cách tra cứu dung lượng Data tốc độ cao miễn phí'
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 group cursor-pointer border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <span className="text-2xl font-black text-slate-300 group-hover:text-[#EE0033] transition-colors">
                      0{idx + 1}
                    </span>
                    <p className="text-xs font-bold text-slate-700 group-hover:text-[#EE0033] transition-colors leading-snug mt-1">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 rounded-3xl shadow-xs p-6 text-white">
              <h3 className="text-base font-black mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-400" /> Nhận tin khuyến mãi
              </h3>
              <p className="text-slate-400 text-xs mb-4 leading-relaxed">Nhận ngay thông báo ưu đãi gói cước & SIM số đẹp qua email.</p>
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white text-xs border border-slate-700 focus:outline-none focus:border-red-500 mb-3"
              />
              <button className="w-full bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer">
                Đăng ký ngay
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewsPage;

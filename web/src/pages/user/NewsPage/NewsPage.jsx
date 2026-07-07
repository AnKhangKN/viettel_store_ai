import React, { useState } from 'react';
import { Calendar, ChevronRight, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsPage = () => {
  const featuredArticle = {
    title: 'Viettel chính thức phủ sóng 5G trên toàn quốc với tốc độ vượt trội',
    excerpt: 'Trải nghiệm tốc độ mạng không dây nhanh chưa từng có với công nghệ 5G tiên tiến nhất. Khám phá ngay các ưu đãi dành riêng cho thuê bao nâng cấp trong tháng này.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
    date: '24/10/2026',
    category: 'Tin Nổi Bật'
  };

  const allArticles = [
    {
      id: 1,
      title: 'Ra mắt gói cước Data không giới hạn mới dành cho Gen Z',
      excerpt: 'Gói cước mới mang đến trải nghiệm lướt web, xem phim thả ga mà không lo về giá, đặc biệt phù hợp với giới trẻ.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3',
      date: '23/10/2026',
      category: 'Khuyến Mãi'
    },
    {
      id: 2,
      title: 'Hướng dẫn bảo mật thông tin cá nhân trên ứng dụng di động',
      excerpt: 'Cập nhật ngay các mẹo nhỏ nhưng vô cùng hữu ích để bảo vệ tài khoản và dữ liệu cá nhân của bạn trên không gian mạng.',
      image: 'https://picsum.photos/seed/article2/800/600',
      date: '21/10/2026',
      category: 'Mẹo Hay'
    },
    {
      id: 3,
      title: 'Top 5 Smartphone đáng mua nhất hỗ trợ mạng 5G',
      excerpt: 'Bạn đang tìm kiếm một chiếc điện thoại mới để trải nghiệm 5G? Dưới đây là những lựa chọn tốt nhất trong tầm giá.',
      image: 'https://picsum.photos/seed/article3/800/600',
      date: '19/10/2026',
      category: 'Sản Phẩm'
    },
    {
      id: 4,
      title: 'Chương trình tri ân khách hàng thân thiết cuối năm',
      excerpt: 'Hàng ngàn phần quà hấp dẫn đang chờ đón quý khách hàng đã đồng hành cùng chúng tôi trong suốt thời gian qua.',
      image: 'https://picsum.photos/seed/article4/800/600',
      date: '18/10/2026',
      category: 'Khuyến Mãi'
    },
    {
      id: 5,
      title: 'Viettel Store chính thức mở bán iPhone 15 Pro Max',
      excerpt: 'Khách hàng đặt trước sẽ nhận được nhiều phần quà giá trị cùng ưu đãi giảm giá lên đến 2 triệu đồng.',
      image: 'https://picsum.photos/seed/article5/800/600',
      date: '15/10/2026',
      category: 'Sản Phẩm'
    },
    {
      id: 6,
      title: 'Cách chuyển đổi eSim miễn phí ngay trên ứng dụng MyViettel',
      excerpt: 'Không cần ra cửa hàng, bạn hoàn toàn có thể tự chuyển đổi sang eSim chỉ với vài thao tác đơn giản trên điện thoại.',
      image: 'https://picsum.photos/seed/article6/800/600',
      date: '12/10/2026',
      category: 'Mẹo Hay'
    },
    {
      id: 7,
      title: 'Hợp tác chiến lược: Viettel nâng cấp hạ tầng viễn thông toàn cầu',
      excerpt: 'Sự kiện đánh dấu bước ngoặt quan trọng trong việc đưa công nghệ cáp quang và 5G Việt Nam vươn tầm quốc tế.',
      image: 'https://picsum.photos/seed/article7/800/600',
      date: '08/10/2026',
      category: 'Tin Nổi Bật'
    },
    {
      id: 8,
      title: 'Ưu đãi cực sốc: Tặng 50% giá trị thẻ nạp vào ngày Vàng',
      excerpt: 'Cơ hội tuyệt vời để nạp năng lượng cho dế yêu với chương trình khuyến mãi nạp thẻ hấp dẫn nhất tháng.',
      image: 'https://picsum.photos/seed/article8/800/600',
      date: '05/10/2026',
      category: 'Khuyến Mãi'
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
    }, 800); // Simulate network latency
  };

  const filteredArticles = activeCategory === 'Tất cả' 
    ? allArticles 
    : allArticles.filter(article => article.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Tin Tức & Sự Kiện</h1>
          <p className="text-xl text-gray-600">Cập nhật những thông tin mới nhất về công nghệ, dịch vụ và các chương trình khuyến mãi.</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat, index) => (
            <button 
              key={index}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(4); // Reset visible count on category change
              }}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                activeCategory === cat 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Featured Article - only show if on 'Tất cả' or matching category */}
            {(activeCategory === 'Tất cả' || activeCategory === featuredArticle.category) && (
              <div 
                onClick={() => navigate('/news/featured')}
                className="bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer animate-in fade-in duration-500"
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {featuredArticle.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {featuredArticle.date}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-200">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center text-red-600 font-semibold group/btn">
                    Đọc tiếp 
                    <ChevronRight className="w-5 h-5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            )}

            {/* Grid of smaller articles */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredArticles.slice(0, visibleCount).map((article) => (
                  <div 
                    key={article.id} 
                    onClick={() => navigate(`/news/${article.id}`)}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex flex-col animate-in fade-in zoom-in-95 duration-500"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur text-red-600 text-xs font-bold px-2 py-1 rounded shadow uppercase tracking-wider">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        {article.date}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-red-600 text-sm font-semibold mt-auto">
                        Chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-lg">Đang cập nhật thêm bài viết cho chuyên mục này...</p>
              </div>
            )}
            
            {/* Pagination / Load More */}
            {visibleCount < filteredArticles.length && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-8 py-3 border-2 border-red-600 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    'Xem thêm bài viết'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending Box */}
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 text-red-600 mr-2" />
                Đọc Nhiều Nhất
              </h3>
              <ul className="space-y-6">
                {[
                  'Hướng dẫn đăng ký eSim online tại nhà',
                  'Gói cước 4G/5G nào đang được ưa chuộng nhất?',
                  'Những điều cần biết khi chuyển vùng quốc tế',
                  'Cách tra cứu dung lượng data còn lại nhanh chóng'
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 group cursor-pointer">
                    <span className="text-3xl font-extrabold text-gray-200 group-hover:text-red-100 transition-colors">
                      0{idx + 1}
                    </span>
                    <p className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors duration-200 mt-1">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-900 rounded-xl shadow-md p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">Đăng ký nhận tin</h3>
              <p className="text-gray-400 mb-6 text-sm">Nhận ngay những thông tin khuyến mãi và cập nhật mới nhất qua email.</p>
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500 mb-4"
              />
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors duration-200">
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

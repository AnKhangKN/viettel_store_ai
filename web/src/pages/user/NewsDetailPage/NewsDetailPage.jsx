import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, Link as LinkIcon } from 'lucide-react';
import { FaFacebook, FaTwitter } from 'react-icons/fa';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Mock data for the detailed article
  const article = {
    id: id,
    title: 'Viettel chính thức phủ sóng 5G trên toàn quốc với tốc độ vượt trội',
    category: 'Tin Nổi Bật',
    date: '24/10/2026',
    author: 'Viettel Store',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
    content: `
      <p class="text-xl text-gray-700 leading-relaxed mb-6 font-medium">Trải nghiệm tốc độ mạng không dây nhanh chưa từng có với công nghệ 5G tiên tiến nhất. Khám phá ngay các ưu đãi dành riêng cho thuê bao nâng cấp trong tháng này.</p>
      
      <p class="text-gray-700 leading-relaxed mb-6">Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel) chính thức công bố phủ sóng 5G trên phạm vi toàn quốc. Đây là một bước tiến lịch sử, đưa Việt Nam trở thành một trong những quốc gia tiên phong trong việc triển khai và thương mại hóa công nghệ mạng di động thế hệ thứ 5.</p>
      
      <h3 class="text-2xl font-bold text-gray-900 mt-10 mb-4">Tốc độ vượt trội, độ trễ cực thấp</h3>
      <p class="text-gray-700 leading-relaxed mb-6">Với mạng 5G của Viettel, người dùng có thể trải nghiệm tốc độ tải xuống lên tới hàng Gigabit/giây, nhanh gấp 10-100 lần so với 4G hiện tại. Độ trễ của mạng gần như bằng không (dưới 10ms), mang lại trải nghiệm hoàn hảo cho các ứng dụng yêu cầu băng thông lớn như xem video 4K/8K, chơi game thực tế ảo (VR) hay điều khiển thiết bị IoT.</p>
      
      <img src="https://images.unsplash.com/photo-1614064641913-a520faff3f6a?auto=format&fit=crop&q=80&w=2000" alt="5G Technology" class="w-full rounded-2xl my-8 shadow-md" />
      
      <h3 class="text-2xl font-bold text-gray-900 mt-10 mb-4">Cách thức nâng cấp và ưu đãi</h3>
      <p class="text-gray-700 leading-relaxed mb-4">Để sử dụng mạng 5G, khách hàng chỉ cần đáp ứng 3 điều kiện đơn giản:</p>
      <ul class="list-disc pl-6 mb-6 text-gray-700 leading-relaxed space-y-2">
        <li>Sử dụng điện thoại thông minh có hỗ trợ 5G.</li>
        <li>Sử dụng sim 4G trở lên (không cần đổi sim 5G riêng biệt).</li>
        <li>Đăng ký các gói cước 5G hoặc đang ở trong khu vực có phủ sóng 5G.</li>
      </ul>
      
      <div class="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl my-8">
        <p class="text-red-800 font-medium">Đặc biệt: Trong tháng ra mắt, Viettel tặng ngay 50GB data 5G tốc độ cao cho toàn bộ khách hàng đăng ký trải nghiệm sớm thông qua ứng dụng MyViettel.</p>
      </div>
      
      <p class="text-gray-700 leading-relaxed">Việc phủ sóng 5G toàn quốc không chỉ nâng tầm trải nghiệm cá nhân mà còn tạo nền tảng vững chắc cho việc phát triển chính phủ điện tử, thành phố thông minh và chuyển đổi số toàn diện tại Việt Nam.</p>
    `
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Article Header (Parallax style) */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900">
        <img 
          src={article.image} 
          alt={article.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-300 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Quay lại danh sách
            </button>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                {article.category}
              </span>
              <span className="text-gray-300 text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {article.date}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              {article.title}
            </h1>
            
            <p className="text-gray-300 font-medium">Bởi <span className="text-white">{article.author}</span></p>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          
          {/* Social Share */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
            <div className="text-gray-500 font-medium">Chia sẻ bài viết này:</div>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <FaFacebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* HTML Content */}
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>
          
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;

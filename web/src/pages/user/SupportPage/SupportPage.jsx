import React from 'react';
import { MessageCircle, Phone, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Chăm Sóc Khách Hàng 24/7</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Chúng tôi luôn ở đây để lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi. Chọn kênh liên hệ phù hợp nhất với bạn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow border-t-4 border-red-600 flex">
            <div className="bg-red-50 p-4 rounded-full h-fit mr-6">
              <Phone className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gọi Tổng Đài</h2>
              <p className="text-gray-600 mb-4">Miễn phí cước gọi, hỗ trợ 24/7 giải đáp mọi thắc mắc.</p>
              <a href="tel:18001191" className="text-3xl font-black text-red-600 hover:text-red-700 transition-colors">1800 1191</a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow border-t-4 border-purple-600 flex">
            <div className="bg-purple-50 p-4 rounded-full h-fit mr-6">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chat Với Trợ Lý AI</h2>
              <p className="text-gray-600 mb-4">Nhận câu trả lời ngay lập tức từ hệ thống AI thông minh.</p>
              <Link to="/chatbot" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors inline-block">
                Bắt đầu Chat
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow border-t-4 border-blue-600 flex">
            <div className="bg-blue-50 p-4 rounded-full h-fit mr-6">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cửa Hàng Viettel</h2>
              <p className="text-gray-600 mb-4">Tìm kiếm điểm giao dịch gần bạn nhất trên toàn quốc.</p>
              <Link to="/store-locator" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
                Xem bản đồ <MapPin className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow border-t-4 border-green-600 flex">
            <div className="bg-green-50 p-4 rounded-full h-fit mr-6">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Góp Ý & Phản Hồi</h2>
              <p className="text-gray-600 mb-4">Gửi email cho chúng tôi về chất lượng dịch vụ.</p>
              <a href="mailto:cskh@viettel.com.vn" className="text-lg font-bold text-green-600 hover:text-green-700">cskh@viettel.com.vn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

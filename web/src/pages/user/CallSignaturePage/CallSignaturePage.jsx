import React from 'react';
import { Star, MessageSquareText, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallSignaturePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-yellow-500 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <Star className="w-16 h-16 mx-auto mb-4 text-yellow-100" />
        <h1 className="text-4xl font-extrabold mb-4">Chữ Ký Cuộc Gọi (vSign)</h1>
        <p className="text-xl text-yellow-50 max-w-2xl mx-auto">
          Tạo ấn tượng riêng bằng cách hiển thị thông điệp trên màn hình điện thoại người nhận khi bạn gọi đến.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <MessageSquareText className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thể hiện phong cách, truyền tải thông điệp</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Dịch vụ vSign cho phép bạn soạn thảo một đoạn văn bản ngắn gọn (như tên công ty, chức danh, lời chúc...). Khi bạn gọi cho một thuê bao Viettel khác, đoạn văn bản này sẽ hiển thị ngay trên màn hình điện thoại của họ trong lúc đổ chuông.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <input type="text" placeholder="Nhập chữ ký mẫu (VD: Xin chào, tôi là sale BĐS...)" className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 w-full max-w-sm" />
            <Link to="/payment" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 mr-2" /> Đăng ký & Tạo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallSignaturePage;

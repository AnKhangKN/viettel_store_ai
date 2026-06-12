import React from 'react';

const AboutPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Khung chứa nội dung trang About */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Về Chúng Tôi
        </h1>
        
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            Chào mừng bạn đến với hệ thống quản lý của <strong>Viettel Store AI</strong>. 
            Đây là nền tảng được xây dựng nhằm tối ưu hóa quy trình quản lý bán hàng và hỗ trợ chăm sóc khách hàng thông minh.
          </p>
          <p>
            Dự án được phát triển bởi đội ngũ tâm huyết, áp dụng các công nghệ mới nhất như React, Tailwind CSS 
            và AI để mang lại trải nghiệm tốt nhất cho người dùng.
          </p>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Thông tin phiên bản</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Phiên bản: 1.0.0</li>
              <li>Công nghệ: React, Vite, Tailwind CSS</li>
              <li>Phát triển bởi: Team CNTT2211</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
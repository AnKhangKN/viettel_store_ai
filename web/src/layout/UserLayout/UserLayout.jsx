import React from 'react';
// Import Header và Sidebar từ đúng đường dẫn trong dự án của bạn
import HeaderComponent from '../../components/user/HeaderComponent/HeaderComponent';
import SidebarComponent from '../../components/user/SidebarComponent/SidebarComponent';

const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - Trên cùng */}
      <HeaderComponent />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Bên trái */}
        <div className="w-64 bg-white border-r shadow-sm">
          <SidebarComponent />
        </div>

        {/* Phần nội dung chính (nơi chứa các trang như Home, About...) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
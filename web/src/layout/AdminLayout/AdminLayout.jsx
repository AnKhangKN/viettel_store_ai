import React from 'react';
import HeaderComponentAdmin from '../../components/admin/HeaderComponentAdmin/HeaderComponentAdmin';
import SidebarComponentAdmin from '../../components/admin/SidebarComponentAdmin/SidebarComponentAdmin';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Cố định bên trái */}
      <div className="w-64 bg-white shadow-md">
        <SidebarComponentAdmin />
      </div>

      {/* Phần nội dung bên phải */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Trên cùng */}
        <div className="bg-white shadow-sm border-b">
          <HeaderComponentAdmin />
        </div>
        
        {/* Nội dung chính */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
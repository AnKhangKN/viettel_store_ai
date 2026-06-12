import React from "react";
import HeaderComponentAdmin from "../../components/admin/HeaderComponentAdmin/HeaderComponentAdmin";
import SidebarComponentAdmin from "../../components/admin/SidebarComponentAdmin/SidebarComponentAdmin";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <HeaderComponentAdmin />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r shadow-md">
          <SidebarComponentAdmin />
        </div>

        {/* Nội dung chính */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
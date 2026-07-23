import React from "react";
import HeaderComponentStaff from "../../Components/staff/HeaderComponentStaff/HeaderComponentStaff";
import SidebarComponentStaff from "../../Components/staff/SidebarComponentStaff/SidebarComponentStaff";


const StaffLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <HeaderComponentStaff />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r shadow-md">
          <SidebarComponentStaff />
        </div>

        {/* Nội dung chính */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;

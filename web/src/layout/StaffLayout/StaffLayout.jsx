import React, { useState } from "react";
import HeaderComponentStaff from "../../components/staff/HeaderComponentStaff/HeaderComponentStaff";
import SidebarComponentStaff from "../../components/staff/SidebarComponentStaff/SidebarComponentStaff";

const StaffLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-xs border-b relative z-40">
        <HeaderComponentStaff onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden transition-opacity"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r shadow-xs transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <SidebarComponentStaff onCloseSidebar={() => setIsSidebarOpen(false)} />
        </aside>

        {/* Nội dung chính */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full">
          {children}
        </main>
      </div>
    </div>

  );
};

export default StaffLayout;


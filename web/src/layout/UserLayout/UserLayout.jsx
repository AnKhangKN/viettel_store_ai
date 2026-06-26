import React from 'react';
import HeaderComponent from "../../components/user/HeaderComponent/HeaderComponent";
import SidebarComponent from "../../components/user/SidebarComponent/SidebarComponent";

const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      {/* Header */}
      <HeaderComponent />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SidebarComponent />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
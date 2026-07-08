import React from "react";
import HeaderComponentStaff from "../../components/staff/HeaderComponentStaff/HeaderComponentStaff";

const StaffLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <HeaderComponentStaff />

      {/* Nội dung */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default StaffLayout;

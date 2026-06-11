import React from "react";
import HeaderComponentAdmin from "../../Components/admin/HeaderComponentAdmin/HeaderComponentAdmin";
import SidebarComponentAdmin from "../../Components/admin/SidebarComponentAdmin/SidebarComponentAdmin";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen">
            <HeaderComponentAdmin />
            <div className="flex flex-1">
                <SidebarComponentAdmin />
                
                <div className="flex-1 p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

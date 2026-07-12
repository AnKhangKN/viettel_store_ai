import React, { useState, useEffect } from "react";
import { getAllAccounts, updateAccountRole } from "../../../api/user/user.api";
import TableComponent from "../../../components/shared/TableComponent/TableComponent";
import {
  UserCheck,
  ShieldAlert,
  Users,
  Loader2,
  X,
  Mail,
  Smartphone,
  CreditCard,
  MapPin,
  Calendar,
  Lock,
  User
} from "lucide-react";

const UserPageAdmin = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for Detail Drawer

  // Fetch accounts list
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await getAllAccounts();
      if (res?.success && res?.data) {
        setAccounts(res.data);
      } else {
        setError("Không thể tải danh sách tài khoản.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi kết nối với máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Handle inline role update
  const handleRoleChange = async (idKhachHang, oldRole, newRole) => {
    if (oldRole === newRole) return;
    
    setUpdatingId(idKhachHang);
    setStatusMessage(null);

    // Optimistically update the role locally
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id_khach_hang === idKhachHang ? { ...acc, vai_tro: newRole } : acc
      )
    );

    // If the currently viewed user in drawer is modified, update that too
    if (selectedUser && selectedUser.id_khach_hang === idKhachHang) {
      setSelectedUser((prev) => ({ ...prev, vai_tro: newRole }));
    }

    try {
      const res = await updateAccountRole(idKhachHang, newRole);
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Cập nhật vai trò tài khoản thành công sang "${newRole}"!`
        });
      } else {
        throw new Error("API update failed");
      }
    } catch (err) {
      console.error(err);
      // Revert change on error
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id_khach_hang === idKhachHang ? { ...acc, vai_tro: oldRole } : acc
        )
      );
      if (selectedUser && selectedUser.id_khach_hang === idKhachHang) {
        setSelectedUser((prev) => ({ ...prev, vai_tro: oldRole }));
      }
      setStatusMessage({
        type: "error",
        text: "Không thể cập nhật vai trò. Vui lòng thử lại!"
      });
    } finally {
      setUpdatingId(null);
      // Auto clear alert message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Define table columns
  const columns = [
    {
      header: "Họ và tên",
      accessor: "ho_ten",
      sortable: true,
      render: (row) => (
        <div className="font-bold text-gray-800 hover:text-[#EE0033] transition-colors">{row.ho_ten}</div>
      )
    },
    {
      header: "Email tài khoản",
      accessor: "email",
      sortable: true,
      render: (row) => (
        <div className="text-gray-500 font-normal">{row.email || "Chưa thiết lập"}</div>
      )
    },
    {
      header: "Vai trò",
      accessor: "vai_tro",
      sortable: true,
      render: (row) => {
        const isCurrentUpdating = updatingId === row.id_khach_hang;
        
        return (
          <div className="flex items-center gap-2">
            {isCurrentUpdating ? (
              <Loader2 className="w-4 h-4 text-[#EE0033] animate-spin" />
            ) : null}
            <select
              value={row.vai_tro}
              disabled={isCurrentUpdating}
              onChange={(e) => handleRoleChange(row.id_khach_hang, row.vai_tro, e.target.value)}
              className={`border rounded-xl px-2 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer transition-all ${
                row.vai_tro === "admin"
                  ? "bg-red-50 text-[#EE0033] border-red-200"
                  : row.vai_tro === "staff"
                  ? "bg-purple-50 text-purple-700 border-purple-250"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              <option value="user">Khách hàng</option>
              <option value="staff">Nhân viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
        );
      }
    },
    {
      header: "Trạng thái",
      accessor: "trang_thai",
      sortable: true,
      render: (row) => {
        let badgeStyle = "bg-gray-100 text-gray-700";
        let label = row.trang_thai;
        
        if (row.trang_thai === "HoatDong") {
          badgeStyle = "bg-green-100 text-green-700";
          label = "Hoạt động";
        } else if (row.trang_thai === "Khoa") {
          badgeStyle = "bg-red-100 text-[#EE0033]";
          label = "Đã khóa";
        } else if (row.trang_thai === "ChoXacThuc") {
          badgeStyle = "bg-yellow-100 text-yellow-700";
          label = "Chờ xác thực";
        }

        return (
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${badgeStyle}`}>
            {label}
          </span>
        );
      }
    }
  ];

  // Filters configurations
  const filterConfigs = [
    {
      field: "vai_tro",
      label: "Vai trò",
      options: [
        { label: "Quản trị viên", value: "admin" },
        { label: "Nhân viên", value: "staff" },
        { label: "Khách hàng", value: "user" }
      ]
    },
    {
      field: "trang_thai",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "HoatDong" },
        { label: "Đã khóa", value: "Khoa" },
        { label: "Chờ xác thực", value: "ChoXacThuc" }
      ]
    }
  ];

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Quản lý Người dùng
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Xem toàn bộ tài khoản và phân quyền vai trò (Admin, Nhân viên, Khách hàng) trong hệ thống. Nhấp vào dòng để xem chi tiết.
          </p>
        </div>
      </div>

      {/* Action Alert Status Bar */}
      {statusMessage && (
        <div
          className={`px-5 py-3.5 rounded-2xl text-xs font-bold border animate-fade-in-up flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-[#EE0033] border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? <UserCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Table Content wrapper */}
      <div className="transition-all duration-300">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-150 p-20 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin" />
            <p className="font-bold text-gray-500">Đang tải danh sách tài khoản...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-gray-150 p-20 flex flex-col items-center justify-center gap-4 text-center">
            <ShieldAlert className="w-10 h-10 text-[#EE0033]" />
            <p className="font-bold text-[#EE0033]">{error}</p>
            <button
              onClick={fetchAccounts}
              className="bg-neutral-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <TableComponent
            data={accounts}
            columns={columns}
            searchPlaceholder="Tìm tài khoản theo họ tên, email..."
            searchFields={["ho_ten", "email"]}
            filterConfigs={filterConfigs}
            defaultItemsPerPage={10}
            onRowClick={(row) => setSelectedUser(row)}
          />
        )}
      </div>

      {/* User Details Slide-over Drawer */}
      {selectedUser && (
        <>
          {/* Background backdrop blur overlay */}
          <div
            onClick={() => setSelectedUser(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          ></div>

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 flex flex-col animate-slide-in-right border-l border-gray-150">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#EE0033]" />
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                  Chi tiết tài khoản
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                title="Đóng chi tiết"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (User Profile information) */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
              
              {/* Profile Avatar */}
              <div className="w-24 h-24 rounded-3xl bg-red-50 border-2 border-red-100/60 flex items-center justify-center text-[#EE0033] shadow-md my-4 transition-transform hover:scale-105 duration-300">
                <User className="w-12 h-12" />
              </div>

              {/* Display Name */}
              <h2 className="text-2xl font-black text-gray-800 mt-2 text-center">
                {selectedUser.ho_ten}
              </h2>
              
              {/* Badges for Role & Status */}
              <div className="flex items-center gap-2 mt-3">
                {/* Role Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                  selectedUser.vai_tro === "admin"
                    ? "bg-red-50 text-[#EE0033] border border-red-100"
                    : selectedUser.vai_tro === "staff"
                    ? "bg-purple-50 text-purple-700 border border-purple-100"
                    : "bg-gray-50 text-gray-600 border border-gray-200"
                }`}>
                  {selectedUser.vai_tro === "admin"
                    ? "Quản trị viên"
                    : selectedUser.vai_tro === "staff"
                    ? "Nhân viên"
                    : "Khách hàng"}
                </span>

                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedUser.trang_thai === "HoatDong"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : selectedUser.trang_thai === "Khoa"
                    ? "bg-red-50 text-[#EE0033] border border-red-100"
                    : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                }`}>
                  {selectedUser.trang_thai === "HoatDong"
                    ? "Hoạt động"
                    : selectedUser.trang_thai === "Khoa"
                    ? "Đã khóa"
                    : "Chờ xác thực"}
                </span>
              </div>

              {/* Details Info List */}
              <div className="w-full mt-8 space-y-5 border-t border-gray-100 pt-6">
                
                {/* ID Detail */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Mã tài khoản</p>
                    <p className="text-sm font-semibold text-gray-600 font-mono select-all">
                      {selectedUser.id_khach_hang}
                    </p>
                  </div>
                </div>

                {/* Email Detail */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Email tài khoản</p>
                    <p className="text-sm font-semibold text-gray-800 break-all">
                      {selectedUser.email || "Chưa thiết lập"}
                    </p>
                  </div>
                </div>

                {/* Phone Detail (Mocked metadata) */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Số điện thoại</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedUser.so_dien_thoai || "Chưa đăng ký số điện thoại"}
                    </p>
                  </div>
                </div>

                {/* CCCD Detail (Mocked metadata) */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Số CCCD / Hộ chiếu</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedUser.cccd || "Chưa xác thực CCCD"}
                    </p>
                  </div>
                </div>

                {/* Address Detail (Mocked metadata) */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Địa chỉ liên hệ</p>
                    <p className="text-sm font-semibold text-gray-800 leading-normal">
                      {selectedUser.dia_chi || "Chưa thiết lập địa chỉ"}
                    </p>
                  </div>
                </div>

                {/* Date Created Detail (Mocked metadata) */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Ngày tham gia</p>
                    <p className="text-sm font-semibold text-gray-800">
                      12/07/2026 (Mặc định)
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-neutral-900 hover:bg-black text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer text-center"
              >
                Đóng chi tiết
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default UserPageAdmin;
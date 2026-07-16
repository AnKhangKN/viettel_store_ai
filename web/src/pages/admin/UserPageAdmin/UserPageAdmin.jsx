import React, { useState, useEffect } from "react";
import { getAllAccounts, updateAccountRole, createEmployee } from "../../../api/user/user.api";
import { getAllBranches } from "../../../api/branch/branch.api";
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
  User,
  Building2,
  Plus,
  Key
} from "lucide-react";

const UserPageAdmin = () => {
  const [accounts, setAccounts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for Detail Drawer

  // State control cho form tạo mới nhân viên
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    ho_ten: "",
    email: "",
    mat_khau: "",
    so_dien_thoai: "",
    id_chi_nhanh: "",
    vai_tro: "staff",
    trang_thai: "HoatDong"
  });
  const [createLoading, setCreateLoading] = useState(false);

  // State tạm phục vụ chỉnh sửa trong Drawer chi tiết
  const [editRole, setEditRole] = useState("");
  const [editBranchId, setEditBranchId] = useState("");
  const [editLoading, setEditLoading] = useState(false);

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

  // Fetch branches list
  const fetchBranches = async () => {
    try {
      const res = await getAllBranches();
      if (res?.success && res?.data) {
        setBranches(res.data);
      }
    } catch (err) {
      console.error("Lỗi tải chi nhánh:", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchBranches();
  }, []);

  // Xử lý tạo mới nhân viên từ Modal Form
  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    
    if (!newEmployee.id_chi_nhanh) {
      alert("Vui lòng chọn chi nhánh làm việc cho nhân viên mới.");
      return;
    }

    setCreateLoading(true);
    setStatusMessage(null);

    try {
      const res = await createEmployee(newEmployee);
      if (res?.success) {
        await fetchAccounts(); // reload list
        setIsCreateOpen(false); // close form
        setStatusMessage({
          type: "success",
          text: `Đã tạo mới tài khoản nhân viên "${newEmployee.ho_ten}" thành công!`
        });
        
        // Reset form
        setNewEmployee({
          ho_ten: "",
          email: "",
          mat_khau: "",
          so_dien_thoai: "",
          id_chi_nhanh: branches[0]?.id_chi_nhanh || "",
          vai_tro: "staff",
          trang_thai: "HoatDong"
        });
      } else {
        throw new Error(res?.message || "Tạo thất bại");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.message || "Lỗi tạo tài khoản nhân viên mới. Vui lòng kiểm tra dữ liệu!"
      });
    } finally {
      setCreateLoading(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Xử lý cập nhật vai trò kèm chi nhánh từ Drawer
  const handleSaveRoleChange = async () => {
    if (!selectedUser) return;
    
    // Validate chi nhánh nếu chọn vai trò nhân viên
    if (editRole === "staff" && !editBranchId) {
      alert("Vui lòng chọn chi nhánh làm việc cho Nhân viên.");
      return;
    }

    setEditLoading(true);
    setStatusMessage(null);

    const idKhachHang = selectedUser.id_khach_hang;
    const targetBranchId = editRole === "staff" ? editBranchId : null;

    try {
      const res = await updateAccountRole(idKhachHang, editRole, targetBranchId);
      if (res?.success) {
        // Tải lại danh sách tài khoản từ server
        await fetchAccounts();

        // Tìm kiếm thông tin chi nhánh để cập nhật UI Drawer tạm thời
        const selectedBranch = branches.find((b) => b.id_chi_nhanh === targetBranchId);

        setSelectedUser((prev) => ({
          ...prev,
          vai_tro: editRole,
          id_chi_nhanh: targetBranchId,
          ten_chi_nhanh: selectedBranch ? selectedBranch.ten_chi_nhanh : null
        }));

        setStatusMessage({
          type: "success",
          text: `Đã cập nhật phân quyền tài khoản "${selectedUser.ho_ten}" thành công!`
        });
        
        // Đóng drawer sau khi lưu thành công
        setSelectedUser(null);
      } else {
        throw new Error(res?.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.message || "Không thể cập nhật vai trò. Vui lòng kiểm tra lại!"
      });
    } finally {
      setEditLoading(false);
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Định nghĩa các cột của bảng danh sách
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
        return (
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
            row.vai_tro === "admin"
              ? "bg-red-50 text-[#EE0033] border-red-200"
              : row.vai_tro === "staff"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
          }`}>
            {row.vai_tro === "admin"
              ? "Quản trị viên"
              : row.vai_tro === "staff"
              ? "Nhân viên"
              : "Khách hàng"}
          </span>
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

  // Các bộ lọc trên bảng
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
      {/* Tiêu đề trang & Nút thêm mới */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Quản lý Người dùng
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Xem toàn bộ tài khoản và cấu hình vai trò, chi nhánh làm việc. Nhấp vào dòng để xem chi tiết và cập nhật phân quyền.
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreateOpen(true);
            setNewEmployee({
              ho_ten: "",
              email: "",
              mat_khau: "",
              so_dien_thoai: "",
              id_chi_nhanh: branches[0]?.id_chi_nhanh || "",
              vai_tro: "staff",
              trang_thai: "HoatDong"
            });
          }}
          className="bg-[#EE0033] hover:bg-[#A00022] text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          Tạo nhân viên mới
        </button>
      </div>

      {/* Thông báo trạng thái cập nhật */}
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

      {/* Bảng danh sách tài khoản */}
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
            onRowClick={(row) => {
              setSelectedUser(row);
              setEditRole(row.vai_tro);
              setEditBranchId(row.id_chi_nhanh || "");
            }}
          />
        )}
      </div>

      {/* Slide-over Drawer xem chi tiết và Cập nhật phân quyền */}
      {selectedUser && (
        <>
          {/* Backdrop mờ nền */}
          <div
            onClick={() => setSelectedUser(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          ></div>

          {/* Khung Drawer chi tiết */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 flex flex-col animate-slide-in-right border-l border-gray-150">
            
            {/* Header Drawer */}
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

            {/* Body Drawer (Thông tin cá nhân & Form chỉnh sửa) */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
              
              {/* Profile Avatar */}
              <div className="w-24 h-24 rounded-3xl bg-red-50 border-2 border-red-100/60 flex items-center justify-center text-[#EE0033] shadow-md my-4 transition-transform hover:scale-105 duration-300">
                <User className="w-12 h-12" />
              </div>

              {/* Tên hiển thị */}
              <h2 className="text-2xl font-black text-gray-800 mt-2 text-center">
                {selectedUser.ho_ten}
              </h2>
              
              {/* Hiển thị vai trò và trạng thái hiện tại dạng Badge */}
              <div className="flex items-center gap-2 mt-3">
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
                    ? `Nhân viên quầy`
                    : "Khách hàng"}
                </span>

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

              {/* Thông tin chi tiết */}
              <div className="w-full mt-6 space-y-4 border-t border-gray-100 pt-6">
                
                {/* ID tài khoản */}
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

                {/* Email */}
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

                {/* Số điện thoại */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Số điện thoại</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedUser.so_dien_thoai || "Chưa đăng ký"}
                    </p>
                  </div>
                </div>

                {/* CCCD */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Số CCCD / Hộ chiếu</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedUser.cccd || "Chưa xác thực"}
                    </p>
                  </div>
                </div>

                {/* Địa chỉ */}
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
              </div>

              {/* Form phân quyền vai trò & thêm chi nhánh */}
              <div className="w-full mt-6 border-t border-gray-150 pt-6 space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                  Cập nhật phân quyền & chi nhánh
                </h4>
                
                {/* Lựa chọn vai trò */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Vai trò tài khoản</label>
                  <select
                    value={editRole}
                    onChange={(e) => {
                      setEditRole(e.target.value);
                      if (e.target.value !== "staff") {
                        setEditBranchId("");
                      } else if (!editBranchId && branches.length > 0) {
                        setEditBranchId(branches[0].id_chi_nhanh);
                      }
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#EE0033] bg-gray-50 cursor-pointer transition-all"
                  >
                    <option value="user">Khách hàng</option>
                    <option value="staff">Nhân viên cửa hàng (Staff)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>

                {/* Lựa chọn chi nhánh hoặc Alert cảnh báo (Chỉ hiển thị khi vai trò là staff) */}
                {editRole === "staff" && (
                  branches.length === 0 ? (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex flex-col items-center text-center gap-2 animate-fade-in">
                      <ShieldAlert className="w-8 h-8 text-yellow-500 animate-pulse" />
                      <p className="text-xs text-gray-600 font-medium">
                        Hệ thống chưa cấu hình chi nhánh nào. Vui lòng tạo chi nhánh trước khi phân quyền nhân viên.
                      </p>
                      <a
                        href="/admin/stores"
                        className="mt-1 bg-[#EE0033] hover:bg-[#A00022] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm"
                      >
                        Thêm chi nhánh ngay
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-purple-600" />
                        Chi nhánh làm việc bắt buộc <span className="text-[#EE0033]">*</span>
                      </label>
                      <select
                        value={editBranchId}
                        onChange={(e) => setEditBranchId(e.target.value)}
                        className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/30 cursor-pointer transition-all"
                      >
                        <option value="" disabled>-- Chọn chi nhánh gán cho nhân viên --</option>
                        {branches.map((b) => (
                          <option key={b.id_chi_nhanh} value={b.id_chi_nhanh}>
                            {b.ten_chi_nhanh}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                )}
              </div>

            </div>

            {/* Footer Drawer chứa các nút thao tác */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer text-center"
              >
                Hủy
              </button>
              <button
                disabled={editLoading || (editRole === "staff" && !editBranchId)}
                onClick={handleSaveRoleChange}
                className="flex-1 bg-[#EE0033] hover:bg-[#A00022] disabled:bg-red-200 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                {editLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>

          </div>
        </>
      )}

      {/* Slide-over Drawer Tạo mới nhân viên */}
      {isCreateOpen && (
        <>
          {/* Backdrop mờ nền */}
          <div
            onClick={() => setIsCreateOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          ></div>

          {/* Khung Drawer tạo mới */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 flex flex-col animate-slide-in-right border-l border-gray-150">
            
            {/* Header Drawer */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#EE0033]" />
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                  Tạo mới nhân viên
                </h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form trong Body Drawer */}
            <form onSubmit={handleCreateEmployee} className="flex-1 overflow-y-auto p-8 space-y-5">
              
              {/* Họ tên */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  Họ và tên nhân viên
                </label>
                <input
                  required
                  type="text"
                  placeholder="Nhập họ và tên..."
                  value={newEmployee.ho_ten}
                  onChange={(e) => setNewEmployee({ ...newEmployee, ho_ten: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  Email tài khoản (Tên đăng nhập)
                </label>
                <input
                  required
                  type="email"
                  placeholder="name@gmail.com..."
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                />
              </div>

              {/* Số điện thoại */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                  Số điện thoại
                </label>
                <input
                  required
                  type="tel"
                  placeholder="Nhập số điện thoại liên lạc..."
                  value={newEmployee.so_dien_thoai}
                  onChange={(e) => setNewEmployee({ ...newEmployee, so_dien_thoai: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                />
              </div>

              {/* Mật khẩu */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-gray-400" />
                  Mật khẩu khởi tạo
                </label>
                <input
                  required
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  value={newEmployee.mat_khau}
                  onChange={(e) => setNewEmployee({ ...newEmployee, mat_khau: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                />
              </div>

              {/* Chi nhánh làm việc hoặc Alert cảnh báo */}
              {newEmployee.vai_tro === "staff" && (
                branches.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex flex-col items-center text-center gap-2 animate-fade-in">
                    <ShieldAlert className="w-8 h-8 text-yellow-500 animate-pulse" />
                    <p className="text-xs text-gray-600 font-medium">
                      Hệ thống chưa cấu hình chi nhánh nào. Vui lòng tạo chi nhánh trước khi phân bổ nhân viên mới.
                    </p>
                    <a
                      href="/admin/stores"
                      className="mt-1 bg-[#EE0033] hover:bg-[#A00022] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm"
                    >
                      Thêm chi nhánh ngay
                    </a>
                  </div>
                ) : (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#EE0033]" />
                      Chi nhánh làm việc bắt buộc <span className="text-[#EE0033]">*</span>
                    </label>
                    <select
                      required
                      value={newEmployee.id_chi_nhanh}
                      onChange={(e) => setNewEmployee({ ...newEmployee, id_chi_nhanh: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#EE0033] bg-gray-50 cursor-pointer"
                    >
                      <option value="" disabled>-- Chọn chi nhánh làm việc --</option>
                      {branches.map((b) => (
                        <option key={b.id_chi_nhanh} value={b.id_chi_nhanh}>
                          {b.ten_chi_nhanh}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              )}

              {/* Vai trò */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Vai trò</label>
                <select
                  value={newEmployee.vai_tro}
                  onChange={(e) => setNewEmployee({ ...newEmployee, vai_tro: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#EE0033] bg-gray-50 cursor-pointer"
                >
                  <option value="staff">Nhân viên cửa hàng</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>

            </form>

            {/* Footer Drawer chứa nút Submit form */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="flex-1 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer text-center"
              >
                Hủy
              </button>
              <button
                type="submit"
                onClick={handleCreateEmployee}
                disabled={createLoading || !newEmployee.id_chi_nhanh}
                className="flex-1 bg-[#EE0033] hover:bg-[#A00022] disabled:bg-red-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                {createLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo nhân viên"
                )}
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default UserPageAdmin;
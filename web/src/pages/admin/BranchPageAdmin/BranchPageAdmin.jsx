import React, { useState, useEffect } from "react";
import {
  getAllBranches,
  createBranch,
  updateBranch
} from "../../../api/branch/branch.api";
import TableComponent from "../../../components/shared/TableComponent/TableComponent";
import {
  Plus,
  X,
  Loader2,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Edit,
  Phone,
  Clock,
  Mail,
  Lock,
  Building
} from "lucide-react";

const BranchPageAdmin = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modals & Drawers state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null); // Used for Edit Drawer

  // Form states
  const initialFormState = {
    ten_chi_nhanh: "",
    dia_chi: "",
    so_hotline: "",
    gio_lam_viec: "08:00 - 22:00",
    map_url: "",
    trang_thai: "HoatDong"
  };

  const [createFormData, setCreateFormData] = useState(initialFormState);
  const [editFormData, setEditFormData] = useState(initialFormState);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Fetch branches list
  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await getAllBranches();
      if (res?.success && res?.data) {
        setBranches(res.data);
      } else {
        setError("Không thể tải danh sách chi nhánh.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải dữ liệu cửa hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Handle opening Edit Drawer
  const handleRowClick = (branch) => {
    setSelectedBranch(branch);
    // Since get_all_branches might not return all fields directly, or some defaults,
    // we use what's returned in table row
    setEditFormData({
      ten_chi_nhanh: branch.ten_chi_nhanh || "",
      dia_chi: branch.dia_chi || "",
      so_hotline: branch.so_hotline || "",
      gio_lam_viec: branch.gio_lam_viec || "08:00 - 22:00",
      map_url: branch.map_url || "",
      trang_thai: branch.trang_thai || "HoatDong"
    });
  };

  // Hàm phụ trợ trích xuất thuộc tính src nếu người dùng paste nguyên thẻ iframe HTML
  const extractMapUrl = (input) => {
    if (!input) return "";
    const trimmed = input.trim();
    if (trimmed.startsWith("<iframe")) {
      const match = trimmed.match(/src="([^"]+)"/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return trimmed;
  };

  // Submit Create Branch Form
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitLoading(true);
    setStatusMessage(null);
    try {
      const cleanedData = {
        ...createFormData,
        map_url: extractMapUrl(createFormData.map_url)
      };
      const res = await createBranch(cleanedData);
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Đã thêm thành công cửa hàng mới "${createFormData.ten_chi_nhanh || "Viettel Store"}"!`
        });
        setIsCreateModalOpen(false);
        setCreateFormData(initialFormState);
        fetchBranches(); // Reload branches
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi thêm chi nhánh. Vui lòng kiểm tra lại.";
      setStatusMessage({
        type: "error",
        text: errMsg
      });
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Submit Edit Branch Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBranch) return;
    setFormSubmitLoading(true);
    setStatusMessage(null);
    try {
      const cleanedData = {
        ...editFormData,
        map_url: extractMapUrl(editFormData.map_url)
      };
      const res = await updateBranch(selectedBranch.id_chi_nhanh, cleanedData);
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Cập nhật thành công thông tin cửa hàng "${editFormData.ten_chi_nhanh}"!`
        });
        setSelectedBranch(null);
        fetchBranches(); // Reload branches
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi cập nhật thông tin chi nhánh. Vui lòng thử lại.";
      setStatusMessage({
        type: "error",
        text: errMsg
      });
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Columns definition for TableComponent
  const columns = [
    {
      header: "Tên chi nhánh",
      accessor: "ten_chi_nhanh",
      sortable: true,
      render: (row) => (
        <div className="font-bold text-gray-800 hover:text-[#EE0033] transition-colors">{row.ten_chi_nhanh}</div>
      )
    },
    {
      header: "Địa chỉ cửa hàng",
      accessor: "dia_chi",
      sortable: true,
      render: (row) => (
        <span className="text-gray-600 font-medium">{row.dia_chi}</span>
      )
    },
    {
      header: "Số Hotline",
      accessor: "so_hotline",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-gray-700 font-bold">{row.so_hotline}</span>
      )
    },
    {
      header: "Trạng thái hoạt động",
      accessor: "trang_thai",
      sortable: true,
      render: (row) => {
        let badgeStyle = "bg-gray-100 text-gray-600";
        let label = "Ngừng hoạt động";

        if (row.trang_thai === "HoatDong") {
          badgeStyle = "bg-green-100 text-green-700";
          label = "Đang hoạt động";
        } else if (row.trang_thai === "TamDongCua") {
          badgeStyle = "bg-yellow-100 text-yellow-700";
          label = "Tạm đóng cửa";
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
      field: "trang_thai",
      label: "Trạng thái",
      options: [
        { label: "Đang hoạt động", value: "HoatDong" },
        { label: "Tạm đóng cửa", value: "TamDongCua" },
        { label: "Ngừng hoạt động", value: "NgungHoatDong" }
      ]
    }
  ];

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Quản lý Chi nhánh
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Thiết lập mạng lưới cửa hàng Viettel Store toàn quốc để người dùng đặt số và lựa chọn giao dịch. Nhấp vào dòng để chỉnh sửa.
          </p>
        </div>
        <button
          onClick={() => {
            setCreateFormData(initialFormState);
            setIsCreateModalOpen(true);
          }}
          className="bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm cửa hàng mới
        </button>
      </div>

      {/* Action Notification Alert */}
      {statusMessage && (
        <div
          className={`px-5 py-3.5 rounded-2xl text-xs font-bold border animate-fade-in-up flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-[#EE0033] border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Table Content wrapper */}
      <div className="transition-all duration-300">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-150 p-20 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin" />
            <p className="font-bold text-gray-500">Đang tải danh sách cửa hàng...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-gray-150 p-20 flex flex-col items-center justify-center gap-4 text-center">
            <AlertCircle className="w-10 h-10 text-[#EE0033]" />
            <p className="font-bold text-[#EE0033]">{error}</p>
            <button
              onClick={fetchBranches}
              className="bg-neutral-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <TableComponent
            data={branches}
            columns={columns}
            searchPlaceholder="Tìm cửa hàng theo tên, địa chỉ..."
            searchFields={["ten_chi_nhanh", "dia_chi"]}
            filterConfigs={filterConfigs}
            defaultItemsPerPage={10}
            onRowClick={handleRowClick}
          />
        )}
      </div>

      {/* 1. Modal: Thêm Cửa hàng Mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCreateModalOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          ></div>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl z-50 flex flex-col max-h-[90vh] border border-gray-150 animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#EE0033]" />
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                  Tạo cửa hàng mới
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-4">
                {/* Tên cửa hàng */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Tên cửa hàng / Chi nhánh (Không bắt buộc)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Viettel Store Quận 1"
                    value={createFormData.ten_chi_nhanh}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, ten_chi_nhanh: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033]"
                  />
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Địa chỉ cửa hàng *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Số 20 đường 3/2, Quận 10, TP.HCM"
                    value={createFormData.dia_chi}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, dia_chi: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Hotline */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Số Hotline (Không bắt buộc)
                    </label>
                    <input
                      type="text"
                      placeholder="Tự động sinh hoặc nhập số"
                      value={createFormData.so_hotline}
                      onChange={(e) =>
                        setCreateFormData({ ...createFormData, so_hotline: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                    />
                  </div>

                  {/* Giờ làm việc */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Giờ làm việc
                    </label>
                    <input
                      type="text"
                      value={createFormData.gio_lam_viec}
                      onChange={(e) =>
                        setCreateFormData({ ...createFormData, gio_lam_viec: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                    />
                  </div>
                </div>

                {/* Đường dẫn nhúng bản đồ (Map URL) */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Đường dẫn nhúng bản đồ (Google Map Embed URL)
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập iframe src của bản đồ Google Maps..."
                    value={createFormData.map_url}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, map_url: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Trạng thái hoạt động
                  </label>
                  <select
                    value={createFormData.trang_thai}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, trang_thai: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
                  >
                    <option value="HoatDong">Đang hoạt động</option>
                    <option value="TamDongCua">Tạm đóng cửa</option>
                    <option value="NgungHoatDong">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-all cursor-pointer text-center"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="flex-1 bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {formSubmitLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Đăng ký tạo cửa hàng"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Slide-over Drawer: Chỉnh sửa thông tin Cửa hàng */}
      {selectedBranch && (
        <>
          <div
            onClick={() => setSelectedBranch(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          ></div>

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 flex flex-col animate-slide-in-right border-l border-gray-150">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#EE0033]" />
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                  Chỉnh sửa cửa hàng
                </h3>
              </div>
              <button
                onClick={() => setSelectedBranch(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Form) */}
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center gap-3 bg-red-50/50 border border-red-100 p-4 rounded-xl mb-2">
                <Building className="w-8 h-8 text-[#EE0033] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 truncate">{selectedBranch.ten_chi_nhanh}</h4>
                  <p className="text-[10px] text-gray-400 font-mono select-all truncate">ID: {selectedBranch.id_chi_nhanh}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Tên cửa hàng */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Tên cửa hàng / Chi nhánh *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.ten_chi_nhanh}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, ten_chi_nhanh: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Địa chỉ cửa hàng *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.dia_chi}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, dia_chi: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Hotline */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Số Hotline *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.so_hotline}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, so_hotline: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                    />
                  </div>

                  {/* Giờ làm việc */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Giờ làm việc
                    </label>
                    <input
                      type="text"
                      value={editFormData.gio_lam_viec}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, gio_lam_viec: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                    />
                  </div>
                </div>

                {/* Đường dẫn nhúng bản đồ (Map URL) */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Đường dẫn nhúng bản đồ (Google Map Embed URL)
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập iframe src của bản đồ Google Maps..."
                    value={editFormData.map_url}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, map_url: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Trạng thái hoạt động
                  </label>
                  <select
                    value={editFormData.trang_thai}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, trang_thai: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
                  >
                    <option value="HoatDong">Đang hoạt động</option>
                    <option value="TamDongCua">Tạm đóng cửa</option>
                    <option value="NgungHoatDong">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-6 border-t border-gray-100 flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedBranch(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-all cursor-pointer text-center"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="flex-1 bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {formSubmitLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Lưu thay đổi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default BranchPageAdmin;
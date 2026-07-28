import React, { useState, useEffect } from "react";
import {
  getSimTypes,
  createSimType,
  updateSimType
} from "../../../api/sim/sim.api";
import TableComponent from "../../../components/shared/TableComponent/TableComponent";
import {
  Plus,
  X,
  Loader2,
  Tag,
  AlertCircle,
  CheckCircle2,
  Edit,
  Info
} from "lucide-react";

const SimTypePageAdmin = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modals & Drawers state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null); // Used for Edit Drawer

  // Form states
  const initialFormState = {
    ten_loai_sim: "",
    mo_ta: "",
    trang_thai: "DangBan"
  };

  const [createFormData, setCreateFormData] = useState(initialFormState);
  const [editFormData, setEditFormData] = useState(initialFormState);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Fetch all SIM types
  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await getSimTypes();
      if (res?.success && res?.data) {
        setTypes(res.data);
      } else {
        setError("Không thể tải danh sách loại SIM.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi kết nối với máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Handle row click to edit
  const handleRowClick = (type) => {
    setSelectedType(type);
    setEditFormData({
      ten_loai_sim: type.ten_loai_sim || "",
      mo_ta: type.mo_ta || "",
      trang_thai: type.trang_thai || "DangBan"
    });
  };

  // Submit Create SIM Type
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitLoading(true);
    setStatusMessage(null);
    try {
      const res = await createSimType(createFormData);
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Đã thêm thành công loại SIM mới "${createFormData.ten_loai_sim}"!`
        });
        setIsCreateModalOpen(false);
        setCreateFormData(initialFormState);
        fetchTypes(); // Reload types list
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi thêm loại SIM. Vui lòng thử lại.";
      setStatusMessage({
        type: "error",
        text: errMsg
      });
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Submit Edit SIM Type
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType) return;
    setFormSubmitLoading(true);
    setStatusMessage(null);
    try {
      const res = await updateSimType(selectedType.id_loai_sim, editFormData);
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Cập nhật thành công loại SIM "${editFormData.ten_loai_sim}"!`
        });
        setSelectedType(null);
        fetchTypes(); // Reload types list
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi cập nhật loại SIM. Vui lòng thử lại.";
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
      header: "Tên loại SIM",
      accessor: "ten_loai_sim",
      sortable: true,
      render: (row) => (
        <div className="font-bold text-gray-800 hover:text-[#EE0033] transition-colors">{row.ten_loai_sim}</div>
      )
    },
    {
      header: "Mô tả hình thức",
      accessor: "mo_ta",
      sortable: true,
      render: (row) => (
        <span className="text-gray-500 font-normal">{row.mo_ta || "Không có mô tả"}</span>
      )
    },
    {
      header: "Trạng thái kinh doanh",
      accessor: "trang_thai",
      sortable: true,
      render: (row) => {
        let badgeStyle = "bg-gray-100 text-gray-600";
        let label = "Ngừng kinh doanh";

        if (row.trang_thai === "DangBan") {
          badgeStyle = "bg-green-100 text-green-700";
          label = "Đang bán";
        } else if (row.trang_thai === "TamNgung") {
          badgeStyle = "bg-yellow-100 text-yellow-700";
          label = "Tạm ngưng";
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
        { label: "Đang bán", value: "DangBan" },
        { label: "Tạm ngưng", value: "TamNgung" },
        { label: "Ngừng kinh doanh", value: "NgungKinhDoanh" }
      ]
    }
  ];

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Quản lý Loại SIM
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Thiết lập các loại SIM (Trả trước, Trả sau) hệ thống hỗ trợ để phân loại kho hàng. Nhấp vào dòng để chỉnh sửa.
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
          Thêm loại SIM mới
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
            <p className="font-bold text-gray-500">Đang tải danh sách loại SIM...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-gray-150 p-20 flex flex-col items-center justify-center gap-4 text-center">
            <AlertCircle className="w-10 h-10 text-[#EE0033]" />
            <p className="font-bold text-[#EE0033]">{error}</p>
            <button
              onClick={fetchTypes}
              className="bg-neutral-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <TableComponent
            data={types}
            columns={columns}
            searchPlaceholder="Tìm kiếm theo tên loại SIM..."
            searchFields={["ten_loai_sim"]}
            filterConfigs={filterConfigs}
            defaultItemsPerPage={10}
            onRowClick={handleRowClick}
          />
        )}
      </div>

      {/* 1. Modal: Thêm Loại SIM Mới */}
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
                <Tag className="w-5 h-5 text-[#EE0033]" />
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                  Tạo loại SIM mới
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
                {/* Tên loại SIM */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Tên loại SIM *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Sim trả trước, Sim trả sau..."
                    value={createFormData.ten_loai_sim}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, ten_loai_sim: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033]"
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
                    className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
                  >
                    <option value="DangBan">Đang bán</option>
                    <option value="TamNgung">Tạm ngưng</option>
                    <option value="NgungKinhDoanh">Ngừng kinh doanh</option>
                  </select>
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Mô tả loại hình dịch vụ
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Mô tả quyền lợi, đặc thù thuê bao..."
                    value={createFormData.mo_ta}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, mo_ta: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  ></textarea>
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
                    "Đăng ký tạo loại SIM"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Slide-over Drawer: Chỉnh sửa thông tin Loại SIM */}
      {selectedType && (
        <>
          <div
            onClick={() => setSelectedType(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          ></div>

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 flex flex-col animate-slide-in-right border-l border-gray-150">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#EE0033]" />
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                  Chỉnh sửa loại SIM
                </h3>
              </div>
              <button
                onClick={() => setSelectedType(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Form) */}
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center gap-3 bg-red-50/50 border border-red-100 p-4 rounded-xl mb-2">
                <Tag className="w-8 h-8 text-[#EE0033] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 truncate">{selectedType.ten_loai_sim}</h4>
                  <p className="text-[10px] text-gray-400 font-mono select-all truncate">ID: {selectedType.id_loai_sim}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Tên loại SIM */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Tên loại SIM *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.ten_loai_sim}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, ten_loai_sim: e.target.value })
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
                    className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
                  >
                    <option value="DangBan">Đang bán</option>
                    <option value="TamNgung">Tạm ngưng</option>
                    <option value="NgungKinhDoanh">Ngừng kinh doanh</option>
                  </select>
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Mô tả loại hình dịch vụ
                  </label>
                  <textarea
                    rows="4"
                    value={editFormData.mo_ta}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, mo_ta: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  ></textarea>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-6 border-t border-gray-100 flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedType(null)}
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

export default SimTypePageAdmin;

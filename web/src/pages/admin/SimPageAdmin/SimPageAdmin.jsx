import React, { useState, useEffect } from "react";
import {
  getAllSims,
  createSim,
  updateSim,
  getSimTypes
} from "../../../api/sim/sim.api";
import { getAllBranches } from "../../../api/branch/branch.api";
import TableComponent from "../../../components/shared/TableComponent/TableComponent";
import {
  Plus,
  X,
  Loader2,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Edit,
  Building,
  Tag,
  DollarSign,
  Briefcase
} from "lucide-react";

// Validate Viettel SIM number
const validateViettelSim = (soSim) => {
  const cleaned = (soSim || "").trim();
  if (!cleaned) {
    return {
      isValid: false,
      message: "Số SIM không được để trống."
    };
  }
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(cleaned)) {
    return {
      isValid: false,
      message: "Số SIM phải có đúng 10 chữ số và chỉ chứa các ký tự số (0-9)."
    };
  }
  const viettelPrefixes = ["086", "096", "097", "098", "032", "033", "034", "035", "036", "037", "038", "039"];
  const prefix = cleaned.substring(0, 3);
  if (!viettelPrefixes.includes(prefix)) {
    return {
      isValid: false,
      message: "Số SIM phải thuộc nhà mạng Viettel (Đầu số hợp lệ: 086, 096, 097, 098, 032, 033, 034, 035, 036, 037, 038, 039)."
    };
  }
  return { isValid: true, cleaned };
};

const SimPageAdmin = () => {
  const [sims, setSims] = useState([]);
  const [branches, setBranches] = useState([]);
  const [simTypes, setSimTypes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  // Modals & Drawers state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSim, setSelectedSim] = useState(null); // Used for Edit Drawer

  // Form states
  const initialFormState = {
    so_sim: "",
    id_loai_sim: "",
    gia_ban: 0,
    trang_thai: "ConHang"
  };

  const [createFormData, setCreateFormData] = useState(initialFormState);
  const [editFormData, setEditFormData] = useState(initialFormState);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Fetch all initial data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [simsRes, typesRes] = await Promise.all([
        getAllSims(),
        getSimTypes()
      ]);

      if (simsRes?.success && simsRes?.data) {
        setSims(simsRes.data);
      }
      if (typesRes?.success && typesRes?.data) {
        setSimTypes(typesRes.data);
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi kết nối với máy chủ để tải dữ liệu SIM.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle opening Edit Drawer
  const handleRowClick = (sim) => {
    setSelectedSim(sim);
    setEditError(null);
    setEditFormData({
      so_sim: sim.so_sim || "",
      id_loai_sim: sim.loai_sim?.id_loai_sim || sim.id_loai_sim || "",
      gia_ban: sim.gia_ban || 0,
      trang_thai: sim.trang_thai || "ConHang"
    });
  };

  // Submit Create SIM Form
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError(null);
    
    // Kiểm tra dữ liệu đầu vào số SIM
    const validation = validateViettelSim(createFormData.so_sim);
    if (!validation.isValid) {
      setCreateError(validation.message);
      return;
    }

    setFormSubmitLoading(true);
    setStatusMessage(null);
    try {
      const res = await createSim({
        ...createFormData,
        so_sim: validation.cleaned,
        gia_ban: Number(createFormData.gia_ban)
      });
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Đã thêm thành công số SIM mới "${createFormData.so_sim}"!`
        });
        setIsCreateModalOpen(false);
        setCreateFormData(initialFormState);
        setCreateError(null);
        fetchData(); // Reload list
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi thêm số SIM. Vui lòng kiểm tra lại.";
      setCreateError(errMsg);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Submit Edit SIM Form (Transfer Branch / Update details)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSim) return;
    setEditError(null);

    // Kiểm tra dữ liệu đầu vào số SIM
    const validation = validateViettelSim(editFormData.so_sim);
    if (!validation.isValid) {
      setEditError(validation.message);
      return;
    }

    setFormSubmitLoading(true);
    setStatusMessage(null);
    try {
      const res = await updateSim(selectedSim.id_sim, {
        ...editFormData,
        so_sim: validation.cleaned,
        gia_ban: Number(editFormData.gia_ban)
      });
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Đã cập nhật thành công số SIM "${editFormData.so_sim}"!`
        });
        setSelectedSim(null);
        setEditFormData(initialFormState);
        setEditError(null);
        fetchData(); // Reload list
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi cập nhật số SIM. Vui lòng kiểm tra lại.";
      setEditError(errMsg);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Columns definition for TableComponent
  const columns = [
    {
      header: "Số thuê bao SIM",
      accessor: "so_sim",
      sortable: true,
      render: (row) => (
        <div className="font-bold text-gray-800 hover:text-[#EE0033] transition-colors">{row.so_sim}</div>
      )
    },
    {
      header: "Loại SIM",
      accessor: "ten_loai_sim",
      sortable: true,
      render: (row) => (
        <span className="text-gray-700 font-semibold">
          {row.loai_sim?.ten_loai_sim || "Chưa phân loại"}
        </span>
      )
    },
    {
      header: "Giá bán",
      accessor: "gia_ban",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-gray-900">
          {(row.gia_ban || 0).toLocaleString("vi-VN")}đ
        </span>
      )
    },
    {
      header: "Trạng thái",
      accessor: "trang_thai",
      sortable: true,
      render: (row) => {
        let badgeStyle = "bg-gray-100 text-gray-600";
        let label = "Ngừng kinh doanh";

        if (row.trang_thai === "ConHang") {
          badgeStyle = "bg-green-100 text-green-700";
          label = "Còn hàng";
        } else if (row.trang_thai === "DaDat") {
          badgeStyle = "bg-yellow-100 text-yellow-700";
          label = "Đã đặt";
        } else if (row.trang_thai === "DaBan") {
          badgeStyle = "bg-red-100 text-[#EE0033]";
          label = "Đã bán";
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
        { label: "Còn hàng", value: "ConHang" },
        { label: "Đã đặt", value: "DaDat" },
        { label: "Đã bán", value: "DaBan" },
        { label: "Ngừng bán", value: "NgungKinhDoanh" }
      ]
    }
  ];

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Quản lý Kho SIM
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý kho SIM số đẹp dùng chung toàn hệ thống. Nhấp vào dòng để chỉnh sửa.
          </p>
        </div>
        <button
          onClick={() => {
            setCreateFormData({
              ...initialFormState,
              id_loai_sim: simTypes[0]?.id_loai_sim || ""
            });
            setCreateError(null);
            setIsCreateModalOpen(true);
          }}
          className="bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm SIM số mới
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
            <p className="font-bold text-gray-500">Đang tải danh sách kho SIM...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-gray-150 p-20 flex flex-col items-center justify-center gap-4 text-center">
            <AlertCircle className="w-10 h-10 text-[#EE0033]" />
            <p className="font-bold text-[#EE0033]">{error}</p>
            <button
              onClick={fetchData}
              className="bg-neutral-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <TableComponent
            data={sims}
            columns={columns}
            searchPlaceholder="Tìm kiếm theo số thuê bao SIM..."
            searchFields={["so_sim"]}
            filterConfigs={filterConfigs}
            defaultItemsPerPage={10}
            onRowClick={handleRowClick}
          />
        )}
      </div>

      {/* 1. Modal: Thêm SIM mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => {
              setIsCreateModalOpen(false);
              setCreateError(null);
            }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          ></div>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl z-50 flex flex-col max-h-[90vh] border border-gray-150 animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#EE0033]" />
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                  Tạo SIM số mới
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCreateError(null);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            {simTypes.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-yellow-500 animate-bounce" />
                <h4 className="text-base font-bold text-gray-800">
                  Chưa đủ điều kiện tạo SIM mới
                </h4>
                <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                  Hệ thống hiện chưa có loại SIM nào. Bạn cần khởi tạo ít nhất một loại SIM trước khi đăng ký SIM số.
                </p>
                <div className="flex gap-3 pt-4 w-full">
                  <a
                    href="/admin/sim-types"
                    className="flex-1 bg-[#EE0033] hover:bg-[#A00022] text-white font-bold py-3 rounded-xl text-xs transition-all text-center block shadow-md uppercase tracking-wider"
                  >
                    Thêm loại SIM
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setCreateError(null);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs transition-all uppercase tracking-wider mt-2 cursor-pointer text-center"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                {createError && (
                  <div className="px-4 py-3 bg-red-50 text-[#EE0033] border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{createError}</span>
                  </div>
                )}
                <div className="space-y-4">
                  {/* Số SIM */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Số SIM thuê bao *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: 0988668668"
                      value={createFormData.so_sim}
                      onChange={(e) =>
                        setCreateFormData({ ...createFormData, so_sim: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Loại SIM */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Loại SIM cát tường *
                      </label>
                      <select
                        value={createFormData.id_loai_sim}
                        onChange={(e) =>
                          setCreateFormData({ ...createFormData, id_loai_sim: e.target.value })
                        }
                        className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
                      >
                        {simTypes.map((type) => (
                          <option key={type.id_loai_sim} value={type.id_loai_sim}>
                            {type.ten_loai_sim} ({(type.gia_ban || 0).toLocaleString()}đ)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Giá bán */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Giá bán SIM (VNĐ) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={createFormData.gia_ban}
                        onChange={(e) =>
                          setCreateFormData({ ...createFormData, gia_ban: e.target.value })
                        }
                        className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                      />
                    </div>
                  </div>

                  <div>
                    {/* Trạng thái */}
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Trạng thái ban đầu
                    </label>
                    <select
                      value={createFormData.trang_thai}
                      onChange={(e) =>
                        setCreateFormData({ ...createFormData, trang_thai: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
                    >
                      <option value="ConHang">Còn hàng</option>
                      <option value="DaDat">Đã đặt</option>
                      <option value="DaBan">Đã bán</option>
                      <option value="NgungKinhDoanh">Ngừng kinh doanh</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setCreateError(null);
                    }}
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
                      "Đăng ký tạo SIM"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. Slide-over Drawer: Chỉnh sửa SIM */}
      {selectedSim && (
        <>
          <div
            onClick={() => {
              setSelectedSim(null);
              setEditError(null);
            }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          ></div>
 
          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 flex flex-col animate-slide-in-right border-l border-gray-150">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#EE0033]" />
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                  Chỉnh sửa thông tin SIM
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedSim(null);
                  setEditError(null);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Form) */}
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {editError && (
                <div className="px-4 py-3 bg-red-50 text-[#EE0033] border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}
              <div className="flex items-center gap-3 bg-red-50/50 border border-red-100 p-4 rounded-xl mb-2">
                <Smartphone className="w-8 h-8 text-[#EE0033] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 truncate">Số SIM: {selectedSim.so_sim}</h4>
                  <p className="text-[10px] text-gray-400 font-mono select-all truncate">ID: {selectedSim.id_sim}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Số SIM */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Số thuê bao SIM *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.so_sim}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, so_sim: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                {/* Loại SIM */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Loại SIM cát tường *
                  </label>
                  <select
                    value={editFormData.id_loai_sim}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, id_loai_sim: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
                  >
                    {simTypes.map((type) => (
                      <option key={type.id_loai_sim} value={type.id_loai_sim}>
                        {type.ten_loai_sim} ({(type.gia_ban || 0).toLocaleString()}đ)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Giá bán */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Giá bán SIM (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editFormData.gia_ban}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, gia_ban: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Trạng thái SIM
                  </label>
                  <select
                    value={editFormData.trang_thai}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, trang_thai: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
                  >
                    <option value="ConHang">Còn hàng</option>
                    <option value="DaDat">Đã đặt</option>
                    <option value="DaBan">Đã bán</option>
                    <option value="NgungKinhDoanh">Ngừng kinh doanh</option>
                  </select>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-6 border-t border-gray-100 flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSim(null);
                    setEditError(null);
                  }}
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

export default SimPageAdmin;
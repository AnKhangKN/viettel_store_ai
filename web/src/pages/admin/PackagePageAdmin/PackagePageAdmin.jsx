import React, { useState, useEffect } from "react";
import {
  getAllPackages,
  createPackage,
  updatePackage
} from "../../../api/package/package.api";
import TableComponent from "../../../components/shared/TableComponent/TableComponent";
import {
  Plus,
  X,
  Loader2,
  Package,
  AlertCircle,
  CheckCircle2,
  Edit,
  Info,
  DollarSign,
  Database,
  Clock,
  PhoneCall,
  MessageSquare
} from "lucide-react";

const PackagePageAdmin = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modals & Drawers state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null); // Used for Edit Drawer

  // Form states
  const initialFormState = {
    ten_goi: "",
    mo_ta: "",
    gia_cuoc: 0,
    dung_luong_gb: 0,
    thoi_han_ngay: 30,
    so_phut_goi: 0,
    so_sms: 0,
    trang_thai: "DangApDung"
  };

  const [createFormData, setCreateFormData] = useState(initialFormState);
  const [editFormData, setEditFormData] = useState(initialFormState);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Fetch packages list
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await getAllPackages();
      if (res?.success && res?.data) {
        setPackages(res.data);
      } else {
        setError("Không thể tải danh sách gói cước.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải dữ liệu gói cước.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle opening Edit Drawer
  const handleRowClick = (pkg) => {
    // We need details of a single package (including descriptions, mins, sms)
    // If not present in table fields, we can initialize from the clicked object
    // Or normally we can set it directly
    setSelectedPackage(pkg);
    setEditFormData({
      ten_goi: pkg.ten_goi || "",
      mo_ta: pkg.mo_ta || "",
      gia_cuoc: pkg.gia_cuoc || 0,
      dung_luong_gb: pkg.dung_luong_gb || 0,
      thoi_han_ngay: pkg.thoi_han_ngay || 30,
      so_phut_goi: pkg.so_phut_goi || 0,
      so_sms: pkg.so_sms || 0,
      trang_thai: pkg.trang_thai || "DangApDung"
    });
  };

  // Submit Create Package Form
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitLoading(true);
    setStatusMessage(null);

    // Kiểm tra trùng tên gói cước ở client-side
    const nameExists = packages.some(
      (pkg) => pkg.ten_goi?.trim().toLowerCase() === createFormData.ten_goi?.trim().toLowerCase()
    );
    if (nameExists) {
      setStatusMessage({
        type: "error",
        text: `Tên gói cước "${createFormData.ten_goi}" đã tồn tại. Vui lòng nhập tên khác.`
      });
      setFormSubmitLoading(false);
      return;
    }

    try {
      const res = await createPackage({
        ...createFormData,
        gia_cuoc: Number(createFormData.gia_cuoc),
        dung_luong_gb: Number(createFormData.dung_luong_gb),
        thoi_han_ngay: Number(createFormData.thoi_han_ngay),
        so_phut_goi: Number(createFormData.so_phut_goi),
        so_sms: Number(createFormData.so_sms)
      });
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Đã thêm thành công gói cước mới "${createFormData.ten_goi}"!`
        });
        setIsCreateModalOpen(false);
        setCreateFormData(initialFormState);
        fetchPackages(); // Reload packages
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi thêm gói cước. Vui lòng kiểm tra lại.";
      setStatusMessage({
        type: "error",
        text: errMsg
      });
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Submit Edit Package Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setFormSubmitLoading(true);
    setStatusMessage(null);

    // Kiểm tra trùng tên gói cước ở client-side (trừ chính nó)
    const nameExists = packages.some(
      (pkg) =>
        pkg.id_goi !== selectedPackage.id_goi &&
        pkg.ten_goi?.trim().toLowerCase() === editFormData.ten_goi?.trim().toLowerCase()
    );
    if (nameExists) {
      setStatusMessage({
        type: "error",
        text: `Tên gói cước "${editFormData.ten_goi}" đã tồn tại ở một gói cước khác. Vui lòng nhập tên khác.`
      });
      setFormSubmitLoading(false);
      return;
    }

    try {
      const res = await updatePackage(selectedPackage.id_goi, {
        ...editFormData,
        gia_cuoc: Number(editFormData.gia_cuoc),
        dung_luong_gb: Number(editFormData.dung_luong_gb),
        thoi_han_ngay: Number(editFormData.thoi_han_ngay),
        so_phut_goi: Number(editFormData.so_phut_goi),
        so_sms: Number(editFormData.so_sms)
      });
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Cập nhật thành công thông tin gói cước "${editFormData.ten_goi}"!`
        });
        setSelectedPackage(null);
        fetchPackages(); // Reload packages
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi cập nhật gói cước. Vui lòng kiểm tra lại.";
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
      header: "Tên gói cước",
      accessor: "ten_goi",
      sortable: true,
      render: (row) => (
        <div className="font-bold text-gray-800 hover:text-[#EE0033] transition-colors">{row.ten_goi}</div>
      )
    },
    {
      header: "Giá cước tham khảo",
      accessor: "gia_cuoc",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-gray-900">
          {(row.gia_cuoc || 0).toLocaleString("vi-VN")}đ
        </span>
      )
    },
    {
      header: "Dung lượng Data",
      accessor: "dung_luong_gb",
      sortable: true,
      render: (row) => (
        <span className="text-gray-700 font-medium">
          {row.dung_luong_gb} GB
        </span>
      )
    },
    {
      header: "Thời hạn sử dụng",
      accessor: "thoi_han_ngay",
      sortable: true,
      render: (row) => (
        <span className="text-gray-600">
          {row.thoi_han_ngay} ngày
        </span>
      )
    },
    {
      header: "Trạng thái áp dụng",
      accessor: "trang_thai",
      sortable: true,
      render: (row) => {
        const isApDung = row.trang_thai === "DangApDung";
        return (
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              isApDung ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            {isApDung ? "Đang áp dụng" : "Ngừng áp dụng"}
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
        { label: "Đang áp dụng", value: "DangApDung" },
        { label: "Ngừng áp dụng", value: "NgungApDung" }
      ]
    }
  ];

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Quản lý Gói cước
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Thiết lập danh sách gói cước di động Viettel để người dùng xem và tham khảo. Nhấp vào dòng để chỉnh sửa.
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
          Thêm gói cước mới
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
            <p className="font-bold text-gray-500">Đang tải danh sách gói cước...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-gray-150 p-20 flex flex-col items-center justify-center gap-4 text-center">
            <AlertCircle className="w-10 h-10 text-[#EE0033]" />
            <p className="font-bold text-[#EE0033]">{error}</p>
            <button
              onClick={fetchPackages}
              className="bg-neutral-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <TableComponent
            data={packages}
            columns={columns}
            searchPlaceholder="Tìm kiếm theo tên gói cước..."
            searchFields={["ten_goi"]}
            filterConfigs={filterConfigs}
            defaultItemsPerPage={10}
            onRowClick={handleRowClick}
          />
        )}
      </div>

      {/* 1. Modal: Thêm Gói cước Mới */}
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
                <Package className="w-5 h-5 text-[#EE0033]" />
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                  Tạo gói cước mới
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
              <div className="grid grid-cols-2 gap-4">
                {/* Tên gói */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Tên gói cước *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: V200C, ST90N..."
                    value={createFormData.ten_goi}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, ten_goi: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033]"
                  />
                </div>

                {/* Giá cước */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Giá cước (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={createFormData.gia_cuoc}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, gia_cuoc: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                {/* Dung lượng */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Dung lượng (GB) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={createFormData.dung_luong_gb}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, dung_luong_gb: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                {/* Thời hạn */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Thời hạn (Ngày) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={createFormData.thoi_han_ngay}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, thoi_han_ngay: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Trạng thái áp dụng
                  </label>
                  <select
                    value={createFormData.trang_thai}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, trang_thai: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
                  >
                    <option value="DangApDung">Đang áp dụng</option>
                    <option value="NgungApDung">Ngừng áp dụng</option>
                  </select>
                </div>

                {/* Số phút gọi */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Phút gọi miễn phí
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={createFormData.so_phut_goi}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, so_phut_goi: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                {/* Số SMS */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    SMS miễn phí
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={createFormData.so_sms}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, so_sms: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                {/* Mô tả */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Mô tả chi tiết ưu đãi
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Mô tả các khuyến mãi đi kèm của gói cước..."
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
                    "Đăng ký tạo gói"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Slide-over Drawer: Chỉnh sửa thông tin Gói cước */}
      {selectedPackage && (
        <>
          <div
            onClick={() => setSelectedPackage(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          ></div>

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 flex flex-col animate-slide-in-right border-l border-gray-150">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#EE0033]" />
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                  Chỉnh sửa gói cước
                </h3>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Form) */}
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center gap-3 bg-red-50/50 border border-red-100 p-4 rounded-xl mb-2">
                <Package className="w-8 h-8 text-[#EE0033] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800">{selectedPackage.ten_goi}</h4>
                  <p className="text-[10px] text-gray-400 font-mono select-all">ID: {selectedPackage.id_goi}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Tên gói */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Tên gói cước *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.ten_goi}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, ten_goi: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Giá cước */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Giá cước (VNĐ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.gia_cuoc}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, gia_cuoc: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                    />
                  </div>

                  {/* Dung lượng */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Dung lượng (GB) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.1"
                      value={editFormData.dung_luong_gb}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, dung_luong_gb: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                    />
                  </div>

                  {/* Thời hạn */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Thời hạn (Ngày) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editFormData.thoi_han_ngay}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, thoi_han_ngay: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                    />
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Trạng thái áp dụng
                    </label>
                    <select
                      value={editFormData.trang_thai}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, trang_thai: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
                    >
                      <option value="DangApDung">Đang áp dụng</option>
                      <option value="NgungApDung">Ngừng áp dụng</option>
                    </select>
                  </div>

                  {/* Số phút gọi */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Phút gọi miễn phí
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.so_phut_goi}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, so_phut_goi: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                    />
                  </div>

                  {/* Số SMS */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      SMS miễn phí
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.so_sms}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, so_sms: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                    />
                  </div>
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Mô tả chi tiết ưu đãi
                  </label>
                  <textarea
                    rows="3"
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
                  onClick={() => setSelectedPackage(null)}
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

export default PackagePageAdmin;
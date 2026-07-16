import React, { useState, useEffect } from "react";
import {
  getQueueServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService
} from "../../../api/queue/queue.api";
import TableComponent from "../../../components/shared/TableComponent/TableComponent";
import {
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
  Clock,
  FileText,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

const CounterServicesPageAdmin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modals & Drawers state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null); // Used for Edit Modal/Drawer
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Form states
  const initialFormState = {
    ten_giao_dich: "",
    mo_ta: "",
    thoi_gian_xu_ly_trung_binh: 15,
    trang_thai: "HoatDong"
  };

  const [createFormData, setCreateFormData] = useState(initialFormState);
  const [editFormData, setEditFormData] = useState(initialFormState);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Fetch services list
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getQueueServices();
      if (res?.success && res?.data) {
        setServices(res.data);
      } else {
        setError("Không thể tải danh sách dịch vụ tại quầy.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải dữ liệu dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle opening Edit Modal
  const handleEditClick = (service) => {
    setSelectedService(service);
    setEditFormData({
      ten_giao_dich: service.ten_giao_dich || "",
      mo_ta: service.mo_ta || "",
      thoi_gian_xu_ly_trung_binh: service.thoi_gian_xu_ly_trung_binh || 15,
      trang_thai: service.trang_thai || "HoatDong"
    });
  };

  // Handle opening Delete Modal
  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  // Submit Create Service
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createFormData.ten_giao_dich.trim()) {
      alert("Tên dịch vụ không được để trống!");
      return;
    }
    setFormSubmitLoading(true);
    setStatusMessage(null);
    try {
      const res = await adminCreateService({
        ...createFormData,
        thoi_gian_xu_ly_trung_binh: parseInt(createFormData.thoi_gian_xu_ly_trung_binh, 10)
      });
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Đã thêm thành công dịch vụ mới "${createFormData.ten_giao_dich}"!`
        });
        setIsCreateModalOpen(false);
        setCreateFormData(initialFormState);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi thêm dịch vụ. Vui lòng kiểm tra lại.";
      setStatusMessage({
        type: "error",
        text: errMsg
      });
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Submit Edit Service
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return;
    if (!editFormData.ten_giao_dich.trim()) {
      alert("Tên dịch vụ không được để trống!");
      return;
    }
    setFormSubmitLoading(true);
    setStatusMessage(null);
    try {
      const res = await adminUpdateService(selectedService.id_loai_giao_dich, {
        ...editFormData,
        thoi_gian_xu_ly_trung_binh: parseInt(editFormData.thoi_gian_xu_ly_trung_binh, 10)
      });
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Cập nhật thành công thông tin dịch vụ "${editFormData.ten_giao_dich}"!`
        });
        setSelectedService(null);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi cập nhật thông tin dịch vụ.";
      setStatusMessage({
        type: "error",
        text: errMsg
      });
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Submit Delete Service
  const handleDeleteSubmit = async () => {
    if (!serviceToDelete) return;
    setFormSubmitLoading(true);
    setStatusMessage(null);
    try {
      const res = await adminDeleteService(serviceToDelete.id_loai_giao_dich);
      if (res?.success) {
        setStatusMessage({
          type: "success",
          text: `Đã xóa dịch vụ "${serviceToDelete.ten_giao_dich}" thành công!`
        });
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Lỗi khi xóa dịch vụ.";
      setStatusMessage({
        type: "error",
        text: errMsg
      });
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Auto clear status message
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Columns definition for TableComponent
  const columns = [
    {
      header: "Tên dịch vụ",
      accessor: "ten_giao_dich",
      sortable: true,
      render: (row) => (
        <div className="font-bold text-gray-800 hover:text-[#EE0033] transition-colors">{row.ten_giao_dich}</div>
      )
    },
    {
      header: "Mô tả dịch vụ",
      accessor: "mo_ta",
      render: (row) => (
        <div className="text-gray-500 max-w-xs truncate" title={row.mo_ta}>
          {row.mo_ta || <span className="text-gray-300 italic">Chưa có mô tả</span>}
        </div>
      )
    },
    {
      header: "Thời gian xử lý trung bình",
      accessor: "thoi_gian_xu_ly_trung_binh",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 font-medium text-gray-700">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>{row.thoi_gian_xu_ly_trung_binh} phút</span>
        </div>
      )
    },
    {
      header: "Trạng thái",
      accessor: "trang_thai",
      sortable: true,
      render: (row) => {
        const isAct = row.trang_thai === "HoatDong";
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            isAct 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {isAct ? "Hoạt động" : "Ngừng áp dụng"}
          </span>
        );
      }
    },
    {
      header: "Hành động",
      accessor: "actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span className="text-xs font-medium">Sửa</span>
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-xs font-medium">Xóa</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý dịch vụ tại quầy</h1>
          <p className="text-sm text-gray-500 mt-1">Cấu hình danh mục dịch vụ xếp hàng tại cửa hàng Viettel Store</p>
        </div>
        <button
          onClick={() => {
            setCreateFormData(initialFormState);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#EE0033] to-[#A00022] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm dịch vụ mới</span>
        </button>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 animate-fade-in ${
          statusMessage.type === "success" 
            ? "bg-green-50 text-green-800 border-green-200" 
            : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          )}
          <span className="text-sm font-semibold">{statusMessage.text}</span>
        </div>
      )}

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col justify-center items-center gap-3">
            <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin" />
            <span className="text-gray-500 font-medium">Đang tải danh sách dịch vụ...</span>
          </div>
        ) : error ? (
          <div className="p-16 flex flex-col justify-center items-center gap-3 text-red-500 text-center">
            <AlertCircle className="w-12 h-12" />
            <span className="font-semibold text-lg">{error}</span>
            <button
              onClick={fetchServices}
              className="mt-2 text-white bg-[#EE0033] px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-95"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <TableComponent
            data={services}
            columns={columns}
            searchPlaceholder="Tìm kiếm dịch vụ..."
            searchKey="ten_giao_dich"
            pagination={true}
            pageSize={10}
          />
        )}
      </div>

      {/* Modal: Create Service */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-scale-up relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#EE0033]" />
              <span>Thêm loại dịch vụ quầy mới</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên dịch vụ *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đăng ký SIM chính chủ"
                  value={createFormData.ten_giao_dich}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, ten_giao_dich: e.target.value }))}
                  className="w-full h-11 px-3 border border-gray-300 rounded-xl focus:border-[#EE0033] focus:ring-1 focus:ring-[#EE0033] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả dịch vụ</label>
                <textarea
                  placeholder="Mô tả tóm tắt dịch vụ tại quầy"
                  value={createFormData.mo_ta}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, mo_ta: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#EE0033] focus:ring-1 focus:ring-[#EE0033] outline-none text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Thời gian xử lý trung bình (phút) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={createFormData.thoi_gian_xu_ly_trung_binh}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, thoi_gian_xu_ly_trung_binh: e.target.value }))}
                  className="w-full h-11 px-3 border border-gray-300 rounded-xl focus:border-[#EE0033] focus:ring-1 focus:ring-[#EE0033] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Trạng thái áp dụng</label>
                <select
                  value={createFormData.trang_thai}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, trang_thai: e.target.value }))}
                  className="w-full h-11 px-3 border border-gray-300 rounded-xl focus:border-[#EE0033] focus:ring-1 focus:ring-[#EE0033] outline-none text-sm"
                >
                  <option value="HoatDong">Hoạt động (Đang áp dụng)</option>
                  <option value="NgungApDung">Ngừng áp dụng</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="flex items-center gap-2 bg-[#EE0033] hover:bg-opacity-95 text-white px-5 py-2 rounded-xl font-semibold text-sm disabled:opacity-70 shadow-sm"
                >
                  {formSubmitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Thêm mới</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Service (Drawer / Backdrop modal style) */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-scale-up relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Edit className="w-5 h-5 text-blue-600" />
              <span>Chỉnh sửa dịch vụ quầy</span>
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên dịch vụ *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đăng ký SIM chính chủ"
                  value={editFormData.ten_giao_dich}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, ten_giao_dich: e.target.value }))}
                  className="w-full h-11 px-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả dịch vụ</label>
                <textarea
                  placeholder="Mô tả dịch vụ"
                  value={editFormData.mo_ta}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, mo_ta: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Thời gian xử lý trung bình (phút) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editFormData.thoi_gian_xu_ly_trung_binh}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, thoi_gian_xu_ly_trung_binh: e.target.value }))}
                  className="w-full h-11 px-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Trạng thái áp dụng</label>
                <select
                  value={editFormData.trang_thai}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, trang_thai: e.target.value }))}
                  className="w-full h-11 px-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="HoatDong">Hoạt động (Đang áp dụng)</option>
                  <option value="NgungApDung">Ngừng áp dụng</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold text-sm disabled:opacity-70 shadow-sm"
                >
                  {formSubmitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete */}
      {isDeleteModalOpen && serviceToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-scale-up relative">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa dịch vụ</h3>
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa dịch vụ <span className="font-bold text-gray-800">"{serviceToDelete.ten_giao_dich}"</span>? Hành động này sẽ ẩn dịch vụ này khỏi danh sách chọn của khách hàng.
            </p>

            <div className="flex gap-3 justify-end pt-5">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setServiceToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={formSubmitLoading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold text-sm disabled:opacity-70 cursor-pointer"
              >
                {formSubmitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterServicesPageAdmin;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Monitor, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RefreshCw, 
  Filter,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  getAllBoothsAdmin, 
  createBoothAdmin, 
  updateBoothAdmin, 
  deleteBoothAdmin 
} from '../../../api/queue/booth.api';
import { getAllBranches } from '../../../api/branch/branch.api';

const BoothPageAdmin = () => {
  const navigate = useNavigate();
  const [booths, setBooths] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('ALL');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('CREATE'); // 'CREATE' | 'EDIT'
  const [editingBoothId, setEditingBoothId] = useState(null);

  // No Branch Prompt Modal State
  const [showNoBranchModal, setShowNoBranchModal] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    id_chi_nhanh: '',
    so_quay: 1,
    ten_quay: '',
    mo_ta: '',
    trang_thai: 'HoatDong'
  });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBooth, setDeletingBooth] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [boothsRes, branchesRes] = await Promise.all([
        getAllBoothsAdmin(),
        getAllBranches()
      ]);

      if (boothsRes?.success && Array.isArray(boothsRes?.data)) {
        setBooths(boothsRes.data);
      }

      if (branchesRes?.success && Array.isArray(branchesRes?.data)) {
        setBranches(branchesRes.data);
        if (branchesRes.data.length > 0 && !formData.id_chi_nhanh) {
          setFormData((prev) => ({ ...prev, id_chi_nhanh: branchesRes.data[0].id_chi_nhanh }));
        }
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu Quầy giao dịch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter booths list
  const filteredBooths = booths.filter((b) => {
    const matchesBranch = selectedBranchFilter === 'ALL' || b.id_chi_nhanh === selectedBranchFilter;
    const matchesSearch = 
      b.ten_quay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ten_chi_nhanh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `Quầy ${b.so_quay}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  // Stats calculation
  const totalBooths = booths.length;
  const activeBooths = booths.filter((b) => b.trang_thai === 'HoatDong').length;
  const pausedBooths = booths.filter((b) => b.trang_thai !== 'HoatDong').length;

  // Open Create Modal
  const handleOpenCreateModal = () => {
    // RÀNG BUỘC: Nếu chưa có chi nhánh nào, thông báo để Admin tạo chi nhánh trước!
    if (branches.length === 0) {
      setShowNoBranchModal(true);
      return;
    }

    setModalMode('CREATE');
    setEditingBoothId(null);
    setFormError('');
    setFormData({
      id_chi_nhanh: branches[0].id_chi_nhanh,
      so_quay: booths.length + 1,
      ten_quay: `Quầy ${booths.length + 1}`,
      mo_ta: '',
      trang_thai: 'HoatDong'
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (booth) => {
    setModalMode('EDIT');
    setEditingBoothId(booth.id_quay);
    setFormError('');
    setFormData({
      id_chi_nhanh: booth.id_chi_nhanh,
      so_quay: booth.so_quay,
      ten_quay: booth.ten_quay,
      mo_ta: booth.mo_ta || '',
      trang_thai: booth.trang_thai
    });
    setShowModal(true);
  };

  // Form Submit Handler (Create & Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');

    if (branches.length === 0 || !formData.id_chi_nhanh) {
      setFormError('Vui lòng chọn hoặc tạo chi nhánh trước khi khởi tạo quầy!');
      return;
    }

    if (!formData.so_quay || formData.so_quay <= 0) {
      setFormError('Số quầy phải lớn hơn 0!');
      return;
    }

    if (!formData.ten_quay.trim()) {
      setFormError('Tên quầy không được để trống!');
      return;
    }

    setSubmitting(true);

    try {
      if (modalMode === 'CREATE') {
        const res = await createBoothAdmin(formData);
        if (res?.success) {
          setShowModal(false);
          await fetchData();
        } else {
          setFormError(res?.message || 'Không thể tạo quầy giao dịch!');
        }
      } else {
        const res = await updateBoothAdmin(editingBoothId, formData);
        if (res?.success) {
          setShowModal(false);
          await fetchData();
        } else {
          setFormError(res?.message || 'Không thể cập nhật quầy giao dịch!');
        }
      }
    } catch (err) {
      console.error(err);
      setFormError(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin quầy!');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deletingBooth) return;

    setLoading(true);
    try {
      const res = await deleteBoothAdmin(deletingBooth.id_quay);
      if (res?.success) {
        setShowDeleteModal(false);
        setDeletingBooth(null);
        await fetchData();
      } else {
        alert(res?.message || 'Không thể xóa quầy!');
      }
    } catch (err) {
      console.error('Lỗi xóa quầy:', err);
      alert(err?.response?.data?.message || 'Không thể xóa quầy giao dịch này!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* Top Banner & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200/80">
        <div>
          <div className="flex items-center gap-2 text-[#EE0033] font-bold text-xs uppercase tracking-wider mb-1">
            <Monitor className="w-4 h-4" />
            <span>Quản Lý Hệ Thống Quầy</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Danh Mục Quầy Giao Dịch
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tạo mới, phân bổ số quầy và quản lý danh mục quầy trực thuộc từng chi nhánh Viettel Store.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#EE0033] text-white font-black px-6 py-3.5 rounded-2xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:shadow-[0_0px_0_#A00022] active:translate-y-1 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm Quầy Giao Dịch Mới</span>
        </button>
      </div>

      {/* NO BRANCH WARNING BANNER */}
      {!loading && branches.length === 0 && (
        <div className="bg-amber-50 border-2 border-amber-200/90 text-amber-900 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 border border-amber-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base md:text-lg font-black text-amber-900">
                Chưa có Chi Nhánh Cửa Hàng Nào Trong Hệ Thống!
              </h4>
              <p className="text-xs md:text-sm text-amber-800 mt-1 leading-relaxed">
                Mỗi quầy giao dịch phải thuộc về một Chi nhánh cụ thể. Vui lòng tạo Chi nhánh cửa hàng trước để bắt đầu khởi tạo quầy.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/stores')}
            className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-black px-6 py-3.5 rounded-2xl shadow-[0_4px_0_#92400e] hover:-translate-y-0.5 active:translate-y-0.5 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Chi Nhánh Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng số quầy</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{totalBooths} Quầy</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đang hoạt động</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-0.5">{activeBooths} Quầy</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tạm ngưng / Bảo trì</p>
            <h3 className="text-2xl font-black text-amber-600 mt-0.5">{pausedBooths} Quầy</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên quầy, số quầy hoặc chi nhánh..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all text-gray-800 placeholder-gray-400"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Branch Filter Dropdown & Refresh Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-8 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer"
            >
              <option value="ALL">🏢 Tất cả chi nhánh ({branches.length})</option>
              {branches.map((br) => (
                <option key={br.id_chi_nhanh} value={br.id_chi_nhanh}>
                  📍 {br.ten_chi_nhanh}
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-3 text-gray-500 hover:text-[#EE0033] hover:bg-red-50 rounded-xl transition-all border border-gray-200 shrink-0 cursor-pointer"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Booths Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <RefreshCw className="w-8 h-8 text-[#EE0033] animate-spin mx-auto" />
            <p className="font-bold text-sm">Đang tải danh sách quầy giao dịch...</p>
          </div>
        ) : filteredBooths.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Monitor className="w-12 h-12 text-gray-300 mx-auto" />
            <h4 className="text-base font-bold text-gray-700">Chưa tìm thấy quầy giao dịch nào</h4>
            <p className="text-xs text-gray-400">Thử thay đổi bộ lọc hoặc bấm "Thêm Quầy Giao Dịch Mới" để khởi tạo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Số Quầy</th>
                  <th className="py-4 px-6">Tên Quầy</th>
                  <th className="py-4 px-6">Chi Nhánh</th>
                  <th className="py-4 px-6">Mô Tả / Vị Trí</th>
                  <th className="py-4 px-6">Trạng Thái</th>
                  <th className="py-4 px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {filteredBooths.map((booth) => (
                  <tr key={booth.id_quay} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Số quầy Badge */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-red-50 text-[#EE0033] font-black text-xs border border-red-100">
                        Quầy số {booth.so_quay}
                      </span>
                    </td>

                    {/* Tên quầy */}
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {booth.ten_quay}
                    </td>

                    {/* Chi nhánh */}
                    <td className="py-4 px-6 text-gray-700">
                      <div className="flex items-center gap-1.5 font-semibold text-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#EE0033]" />
                        <span>{booth.ten_chi_nhanh}</span>
                      </div>
                    </td>

                    {/* Mô tả */}
                    <td className="py-4 px-6 text-gray-500 text-xs max-w-xs truncate">
                      {booth.mo_ta || <span className="text-gray-300 italic">Không có mô tả</span>}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                        booth.trang_thai === 'HoatDong'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : booth.trang_thai === 'TamNgung'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          booth.trang_thai === 'HoatDong' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></span>
                        {booth.trang_thai === 'HoatDong'
                          ? 'Hoạt động'
                          : booth.trang_thai === 'TamNgung'
                          ? 'Tạm ngưng'
                          : 'Ngừng hoạt động'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(booth)}
                          className="p-2 rounded-xl text-gray-500 hover:text-[#EE0033] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Sửa thông tin quầy"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingBooth(booth);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa quầy"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* NO BRANCH PROMPT MODAL */}
      {showNoBranchModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mx-auto border border-amber-100">
              <Building2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900">Cần Tạo Chi Nhánh Trước</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Hệ thống hiện chưa có Chi nhánh cửa hàng nào. Mỗi quầy giao dịch phải được gán vào một Chi nhánh cụ thể.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setShowNoBranchModal(false)}
                className="w-full sm:w-1/2 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowNoBranchModal(false);
                  navigate('/admin/stores');
                }}
                className="w-full sm:w-1/2 bg-[#EE0033] text-white font-black py-3 rounded-xl shadow-[0_4px_0_#A00022] hover:-translate-y-0.5 active:translate-y-0.5 text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Tạo Chi Nhánh Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREATION / EDIT FORM */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {modalMode === 'CREATE' ? 'Thêm Quầy Giao Dịch Mới' : 'Cập Nhật Thông Tin Quầy'}
                  </h3>
                  <p className="text-xs text-gray-500">Cấu hình thông tin quầy thuộc chi nhánh</p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 text-[#EE0033] border border-red-200 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in-up">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              
              {/* Select Branch */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Chi Nhánh Cửa Hàng <span className="text-red-500">*</span>
                </label>
                {branches.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 flex items-center justify-between">
                    <span>Chưa có chi nhánh nào</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        navigate('/admin/stores');
                      }}
                      className="text-[#EE0033] underline font-extrabold"
                    >
                      Thêm chi nhánh ngay →
                    </button>
                  </div>
                ) : (
                  <select
                    value={formData.id_chi_nhanh}
                    onChange={(e) => setFormData({ ...formData, id_chi_nhanh: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all cursor-pointer"
                    required
                  >
                    {branches.map((b) => (
                      <option key={b.id_chi_nhanh} value={b.id_chi_nhanh}>
                        {b.ten_chi_nhanh} ({b.dia_chi})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Grid 2 cols for Số quầy & Trạng thái */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Số Thứ Tự Quầy <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.so_quay}
                    onChange={(e) => setFormData({ ...formData, so_quay: parseInt(e.target.value) || 1 })}
                    placeholder="VD: 1"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Trạng Thái
                  </label>
                  <select
                    value={formData.trang_thai}
                    onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="HoatDong">Hoạt động</option>
                    <option value="TamNgung">Tạm ngưng</option>
                    <option value="NgungHoatDong">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>

              {/* Tên hiển thị Quầy */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Tên Hiển Thị Quầy <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ten_quay}
                  onChange={(e) => setFormData({ ...formData, ten_quay: e.target.value })}
                  placeholder="VD: Quầy 1 hoặc Quầy 1 - Đổi SIM"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Mô tả vị trí */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mô Tả / Vị Trí Trong Cửa Hàng
                </label>
                <textarea
                  rows="3"
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  placeholder="VD: Quầy nằm ở dãy đầu sảnh chính bên trái..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={submitting || branches.length === 0}
                  className="bg-[#EE0033] text-white font-black px-6 py-3 rounded-xl shadow-[0_4px_0_#A00022] hover:shadow-[0_6px_0_#A00022] hover:-translate-y-0.5 active:translate-y-0.5 text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>{modalMode === 'CREATE' ? 'Tạo Quầy Mới' : 'Cập Nhật Quầy'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deletingBooth && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-5 text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold mx-auto border border-red-100">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900">Xác Nhận Xóa Quầy Giao Dịch?</h3>
              <p className="text-xs text-gray-500 mt-2">
                Bạn có chắc chắn muốn xóa <span className="font-bold text-gray-900">{deletingBooth.ten_quay}</span> thuộc chi nhánh <span className="font-bold text-[#EE0033]">{deletingBooth.ten_chi_nhanh}</span>?
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingBooth(null);
                }}
                className="w-1/2 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="w-1/2 bg-red-600 text-white font-black py-3 rounded-xl shadow-[0_4px_0_#991b1b] hover:-translate-y-0.5 active:translate-y-0.5 text-xs transition-all cursor-pointer"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BoothPageAdmin;

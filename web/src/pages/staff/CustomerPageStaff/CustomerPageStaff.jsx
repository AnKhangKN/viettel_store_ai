import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Clock,
  RefreshCw,
  Eye,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Calendar,
  UserCheck,
  X,
  User,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { getAllCustomers, getCustomerDetails } from "../../../api/user/user.api";

const CustomerPageStaff = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal Detail State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getAllCustomers();
      if (res.success && Array.isArray(res.data)) {
        setCustomers(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Compute Statistics
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.trang_thai === "HoatDong").length;
    const pending = customers.filter((c) => c.trang_thai === "ChoXacThuc").length;
    const locked = customers.filter((c) => c.trang_thai === "Khoa").length;
    return { total, active, pending, locked };
  }, [customers]);

  // Filter & Search Logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Filter Status
      if (statusFilter !== "ALL" && customer.trang_thai !== statusFilter) {
        return false;
      }

      // Search Query
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      const name = (customer.ho_ten || "").toLowerCase();
      const phone = (customer.so_dien_thoai || "").toLowerCase();
      const email = (customer.email || "").toLowerCase();
      const cccd = (customer.cccd || "").toLowerCase();

      return name.includes(term) || phone.includes(term) || email.includes(term) || cccd.includes(term);
    });
  }, [customers, statusFilter, searchTerm]);

  // View Details Modal Trigger
  const handleViewDetail = async (customerId) => {
    try {
      setLoadingDetail(true);
      setDetailModalOpen(true);
      const res = await getCustomerDetails(customerId);
      if (res.success && res.data) {
        setSelectedCustomer(res.data);
      }
    } catch (error) {
      console.error("Lỗi xem chi tiết khách hàng:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "HoatDong":
        return (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Hoạt động
          </span>
        );
      case "ChoXacThuc":
        return (
          <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5 w-fit">
            <Clock className="w-3 h-3 text-amber-600" />
            Chờ xác thực
          </span>
        );
      case "Khoa":
        return (
          <span className="bg-red-50 text-[#EE0033] text-xs font-bold px-3 py-1 rounded-full border border-red-200 flex items-center gap-1.5 w-fit">
            <Lock className="w-3 h-3 text-[#EE0033]" />
            Đã khóa
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Search className="w-7 h-7 text-[#EE0033]" />
            Tra Cứu Thông Tin Khách Hàng
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Hệ thống tra cứu thông tin khách hàng tập trung toàn quốc (áp dụng chung cho tất cả chi nhánh Viettel)
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="bg-white border border-gray-200 text-gray-700 hover:text-[#EE0033] hover:border-red-200 font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 text-xs cursor-pointer w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#EE0033]" : ""}`} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* Top Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Khách hàng toàn hệ thống</span>
            <p className="text-3xl font-black text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>


        {/* Active Accounts */}
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Đang hoạt động</span>
            <p className="text-3xl font-black text-emerald-600 mt-1">{stats.active}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Validation */}
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Chờ xác thực</span>
            <p className="text-3xl font-black text-amber-600 mt-1">{stats.pending}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Locked Accounts */}
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Đã bị khóa</span>
            <p className="text-3xl font-black text-[#EE0033] mt-1">{stats.locked}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Filter & Table Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 space-y-6">
        {/* Search & Status Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tra cứu theo Họ tên, SĐT, Email, CCCD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {[
              { id: "ALL", label: "Tất cả" },
              { id: "HoatDong", label: "Hoạt động" },
              { id: "ChoXacThuc", label: "Chờ xác thực" },
              { id: "Khoa", label: "Đã khóa" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-[#EE0033] text-white shadow-md shadow-red-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-5">Khách hàng</th>
                <th className="py-4 px-5">Số điện thoại</th>
                <th className="py-4 px-5">Số CCCD</th>
                <th className="py-4 px-5">Trạng thái</th>
                <th className="py-4 px-5">Ngày đăng ký</th>
                <th className="py-4 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 font-medium">
                    <RefreshCw className="w-8 h-8 text-[#EE0033] animate-spin mx-auto mb-2" />
                    Đang tải dữ liệu khách hàng...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 font-medium">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    Không tìm thấy khách hàng phù hợp
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id_khach_hang} className="hover:bg-gray-50/60 transition-colors">
                    {/* Customer Name & Email */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-[#EE0033] border border-red-100 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                          {c.ho_ten ? c.ho_ten.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-snug">{c.ho_ten}</p>
                          <p className="text-xs text-gray-500">{c.email || "Chưa có email"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-5 font-semibold text-gray-800">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {c.so_dien_thoai || "—"}
                      </div>
                    </td>

                    {/* CCCD */}
                    <td className="py-4 px-5 font-medium text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                        {c.cccd || "Chưa cập nhật"}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">{renderStatusBadge(c.trang_thai)}</td>

                    {/* Created Date */}
                    <td className="py-4 px-5 text-xs text-gray-500 font-medium">
                      {c.ngay_tao ? new Date(c.ngay_tao).toLocaleDateString("vi-VN") : "—"}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleViewDetail(c.id_khach_hang)}
                        className="bg-white border border-gray-200 text-gray-700 hover:text-[#EE0033] hover:border-red-200 font-bold px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow transition-all text-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#EE0033]" />
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal Popup */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 relative overflow-hidden space-y-6 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Hồ sơ chi tiết Khách hàng</h3>
                  <p className="text-xs text-gray-500">Mã KH: {selectedCustomer?.id_khach_hang?.substring(0, 8).toUpperCase()}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedCustomer(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Content */}
            {loadingDetail ? (
              <div className="py-12 text-center text-gray-400">
                <RefreshCw className="w-8 h-8 text-[#EE0033] animate-spin mx-auto mb-2" />
                Đang tải thông tin chi tiết...
              </div>
            ) : selectedCustomer ? (
              <div className="space-y-5">
                {/* Profile Card Banner */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#EE0033] text-white flex items-center justify-center text-xl font-black shadow-md">
                      {selectedCustomer.ho_ten ? selectedCustomer.ho_ten.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-gray-900">{selectedCustomer.ho_ten}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  {renderStatusBadge(selectedCustomer.trang_thai)}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Số điện thoại</span>
                    <p className="text-sm font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#EE0033]" />
                      {selectedCustomer.so_dien_thoai || "Chưa có"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Số CCCD / CMND</span>
                    <p className="text-sm font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#EE0033]" />
                      {selectedCustomer.cccd || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Giới tính</span>
                    <p className="text-sm font-bold text-gray-800 mt-1">
                      {selectedCustomer.gioi_tinh || "Nam"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Ngày sinh</span>
                    <p className="text-sm font-bold text-gray-800 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {selectedCustomer.ngay_sinh || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Địa chỉ giao hàng / Thường trú</span>
                  <p className="text-xs font-semibold text-gray-800 mt-1 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-4 h-4 text-[#EE0033] flex-shrink-0 mt-0.5" />
                    {selectedCustomer.dia_chi || "Chưa cập nhật địa chỉ"}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedCustomer(null);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPageStaff;

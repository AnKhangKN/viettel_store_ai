import React, { useState, useEffect } from "react";
import { getAllBranches } from "../../../api/branch/branch.api";
import { getQueueServices, createQueueTicket } from "../../../api/queue/queue.api";
import { MapPin, Calendar, Clock, Phone, User, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const Appointment = () => {
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    hoTen: "",
    soDienThoai: "",
    idChiNhanh: "",
    idLoaiGiaoDich: "",
  });

  const [result, setResult] = useState(null);

  // Load chi nhánh và dịch vụ khi mở trang
  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      setError(null);
      try {
        const [branchRes, serviceRes] = await Promise.all([
          getAllBranches(),
          getQueueServices()
        ]);

        if (branchRes?.success && branchRes?.data) {
          // Chỉ lấy các chi nhánh đang hoạt động
          const activeBranches = branchRes.data.filter(b => b.trang_thai === "HoatDong");
          setBranches(activeBranches);
        }
        if (serviceRes?.success && serviceRes?.data) {
          // Chỉ lấy dịch vụ đang hoạt động
          const activeServices = serviceRes.data.filter(s => s.trang_thai === "HoatDong");
          setServices(activeServices);
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách chi nhánh hoặc dịch vụ. Vui lòng tải lại trang.");
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  // Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "soDienThoai") {
      // Chỉ cho nhập số và tối đa 10 ký tự
      const phone = value.replace(/[^0-9]/g, "").slice(0, 10);
      setForm((prev) => ({
        ...prev,
        soDienThoai: phone,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu trống
    if (
      form.hoTen.trim() === "" ||
      form.soDienThoai.trim() === "" ||
      form.idChiNhanh === "" ||
      form.idLoaiGiaoDich === ""
    ) {
      alert("Vui lòng nhập và chọn đầy đủ thông tin!");
      return;
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.soDienThoai)) {
      alert("Số điện thoại không hợp lệ!\nPhải bắt đầu bằng số 0 và gồm đúng 10 chữ số.");
      setForm((prev) => ({
        ...prev,
        soDienThoai: "",
      }));
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await createQueueTicket({
        ho_ten: form.hoTen,
        so_dien_thoai: form.soDienThoai,
        id_chi_nhanh: form.idChiNhanh,
        id_loai_giao_dich: form.idLoaiGiaoDich
      });

      if (res?.success && res?.data) {
        setResult(res.data);
        // Reset form
        setForm({
          hoTen: "",
          soDienThoai: "",
          idChiNhanh: "",
          idLoaiGiaoDich: "",
        });
      } else {
        alert(res?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Đã có lỗi xảy ra trong quá trình đăng ký.";
      alert(errMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center gap-3 py-10">
        <Loader2 className="w-12 h-12 text-[#EE0033] animate-spin" />
        <p className="text-gray-500 font-semibold">Đang chuẩn bị thông tin dịch vụ quầy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 relative overflow-hidden">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full blur-3xl -z-10 translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-50/50 rounded-full blur-3xl -z-10 -translate-x-12 translate-y-12"></div>

        <h2 className="text-center text-3xl font-extrabold text-[#EE0033] tracking-tight mb-2">
          Đăng ký giao dịch tại quầy
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Tiết kiệm thời gian chờ đợi. Lấy số thứ tự trực tuyến trước khi đến cửa hàng Viettel Store.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Họ và tên */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span>Họ và tên *</span>
            </label>
            <input
              type="text"
              name="hoTen"
              required
              value={form.hoTen}
              onChange={handleChange}
              placeholder="Nhập họ và tên đầy đủ"
              className="w-full h-12 px-4 border border-gray-300 rounded-2xl focus:border-[#EE0033] focus:ring-1 focus:ring-[#EE0033] outline-none text-sm transition-all shadow-sm"
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>Số điện thoại liên hệ *</span>
            </label>
            <input
              type="text"
              name="soDienThoai"
              required
              value={form.soDienThoai}
              onChange={handleChange}
              maxLength={10}
              placeholder="Nhập số điện thoại (ví dụ: 098...)"
              className="w-full h-12 px-4 border border-gray-300 rounded-2xl focus:border-[#EE0033] focus:ring-1 focus:ring-[#EE0033] outline-none text-sm transition-all shadow-sm"
            />
          </div>

          {/* Chọn cửa hàng */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Chọn cửa hàng Viettel Store *</span>
            </label>
            <select
              name="idChiNhanh"
              required
              value={form.idChiNhanh}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-gray-300 rounded-2xl focus:border-[#EE0033] focus:ring-1 focus:ring-[#EE0033] outline-none text-sm bg-white transition-all shadow-sm cursor-pointer"
            >
              <option value="">-- Chọn chi nhánh gần bạn nhất --</option>
              {branches.map((b) => (
                <option key={b.id_chi_nhanh} value={b.id_chi_nhanh}>
                  {b.ten_chi_nhanh} ({b.dia_chi})
                </option>
              ))}
            </select>
          </div>

          {/* Chọn loại dịch vụ */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Chọn loại dịch vụ cần giao dịch *</span>
            </label>
            <select
              name="idLoaiGiaoDich"
              required
              value={form.idLoaiGiaoDich}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-gray-300 rounded-2xl focus:border-[#EE0033] focus:ring-1 focus:ring-[#EE0033] outline-none text-sm bg-white transition-all shadow-sm cursor-pointer"
            >
              <option value="">-- Chọn dịch vụ cần thực hiện --</option>
              {services.map((s) => (
                <option key={s.id_loai_giao_dich} value={s.id_loai_giao_dich}>
                  {s.ten_giao_dich} (Xử lý ~{s.thoi_gian_xu_ly_trung_binh} phút)
                </option>
              ))}
            </select>
          </div>

          {/* Nút Đăng ký */}
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full h-12 bg-gradient-to-r from-[#EE0033] to-[#A00022] hover:opacity-95 text-white font-bold rounded-2xl transition-all duration-250 cursor-pointer shadow-md disabled:opacity-75 flex justify-center items-center gap-2 text-base mt-2"
          >
            {submitLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>Đăng ký lấy số thứ tự</span>
          </button>
        </form>

        {/* Kết quả đăng ký lấy số thành công */}
        {result && (
          <div className="mt-10 bg-gradient-to-br from-green-50 to-white border-2 border-dashed border-green-500 rounded-3xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden animate-scale-up">
            
            {/* Success Icon */}
            <div className="flex justify-center mb-3">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>

            <h3 className="text-green-700 text-2xl font-black mb-1">
              Đăng ký thành công!
            </h3>
            <p className="text-gray-500 text-xs mb-6">
              Vui lòng chụp ảnh màn hình này hoặc lưu thông tin số thứ tự khi đến quầy.
            </p>

            <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm max-w-md mx-auto space-y-4">
              
              <div>
                <div className="text-gray-400 text-sm font-medium">SỐ THỨ TỰ CỦA BẠN</div>
                <div className="text-[#EE0033] text-5xl sm:text-6xl font-black tracking-widest my-2 select-all">
                  {result.so_thu_tu}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-col items-center gap-1.5 text-sm text-gray-700">
                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Thời gian chờ ước tính: <span className="text-[#EE0033]">{result.so_phut_cho} phút</span></span>
                </div>
                <p className="text-xs text-gray-400">
                  Dự kiến phục vụ lúc: {new Date(result.thoi_gian_du_kien).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 text-xs text-left space-y-2 text-gray-600">
                <div>
                  <span className="font-bold text-gray-700">Khách hàng:</span> {result.khach_hang.ho_ten} ({result.khach_hang.so_dien_thoai})
                </div>
                <div>
                  <span className="font-bold text-gray-700">Dịch vụ:</span> {result.dich_vu.ten_giao_dich}
                </div>
                <div>
                  <span className="font-bold text-gray-700">Cửa hàng:</span> {result.chi_nhanh.ten_chi_nhanh}
                </div>
                <div className="text-gray-400 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{result.chi_nhanh.dia_chi}</span>
                </div>
              </div>

            </div>

            <button
              onClick={() => setResult(null)}
              className="mt-6 bg-[#EE0033] hover:bg-opacity-95 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
            >
              Đăng ký lượt mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;

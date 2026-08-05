import React, { useState, useEffect } from "react";
import { getAllBranches } from "../../../api/branch/branch.api";
import { getQueueServices, createQueueTicket, getQueueTicketDetails } from "../../../api/queue/queue.api";
import { MapPin, Calendar, Clock, Phone, User, Loader2, CheckCircle2, AlertCircle, Monitor, Sparkles, QrCode, ArrowRight, ShieldCheck, Users } from "lucide-react";

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

  // Lắng nghe cập nhật thời gian thực qua WebSocket cho phiếu thứ tự của khách hàng
  useEffect(() => {
    if (!result || !result.id_phieu) return;

    const branchId = result.id_chi_nhanh || result.chi_nhanh?.id_chi_nhanh;
    if (!branchId) return;

    const ticketId = result.id_phieu;


    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const hostUrl = backendUrl.replace(/^https?:\/\//, "");
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${hostUrl}/api/queue/ws/${branchId}`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event === "queue_updated") {
          const ticketRes = await getQueueTicketDetails(ticketId);
          if (ticketRes?.success && ticketRes?.data) {
            const ticketData = ticketRes.data;
            if (ticketData.is_completed) {
              alert(`Phiếu thứ tự #${result.so_thu_tu} của bạn đã phục vụ thành công! Cảm ơn quý khách đã sử dụng dịch vụ Viettel Store.`);
              setResult(null);
            } else {
              setResult((prev) => ({
                ...prev,
                ...ticketData,
                so_phut_cho: ticketData.so_phut_cho,
                thoi_gian_du_kien: ticketData.thoi_gian_du_kien,
                so_nguoi_cho_truoc: ticketData.so_nguoi_cho_truoc,
                trang_thai: ticketData.trang_thai
              }));
            }
          }
        }
      } catch (err) {
        console.error("Lỗi cập nhật phiếu thứ tự thời gian thực:", err);
      }
    };

    return () => {
      socket.close();
    };
  }, [result?.id_phieu]);


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
          const activeBranches = branchRes.data.filter(b => b.trang_thai === "HoatDong");
          setBranches(activeBranches);
        }
        if (serviceRes?.success && serviceRes?.data) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "soDienThoai") {
      const phone = value.replace(/[^0-9]/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, soDienThoai: phone }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.hoTen.trim() || !form.soDienThoai.trim() || !form.idChiNhanh || !form.idLoaiGiaoDich) {
      alert("Vui lòng điền và chọn đầy đủ thông tin yêu cầu!");
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.soDienThoai)) {
      alert("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số bắt đầu bằng số 0.");
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
        setForm({ hoTen: "", soDienThoai: "", idChiNhanh: "", idLoaiGiaoDich: "" });
      } else {
        alert(res?.message || "Đăng ký không thành công. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Đã xảy ra lỗi khi khởi tạo phiếu hàng đợi.";
      alert(errMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-3 py-10">
        <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin mb-2" />
        <p className="text-slate-500 font-bold text-xs">Đang tải danh sách dịch vụ quầy Viettel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 pb-20">

      {/* HERO SECTION */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="inline-flex items-center gap-1.5 bg-red-50 text-[#EE0033] border border-red-100 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-3 shadow-2xs">
          <Clock className="w-3.5 h-3.5" /> Hàng Đợi Thông Minh AI 2026
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">LẤY SỐ THỨ TỰ TẠI QUẦY</h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Chủ động lấy số thứ tự trực tuyến trước khi đến cửa hàng Viettel Store. Tiết kiệm thời gian, không lo xếp hàng chờ đợi!
        </p>
      </div>

      <div className="max-w-3xl mx-auto">

        {/* CARD CONTAINER */}
        <div className="bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] border-2 border-slate-100 p-6 sm:p-10 relative overflow-hidden">

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Form step header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Họ và tên */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#EE0033]" />
                    <span>Họ và tên người lấy số *</span>
                  </label>
                  <input
                    type="text"
                    name="hoTen"
                    required
                    value={form.hoTen}
                    onChange={handleChange}
                    placeholder="Nhập họ tên đầy đủ..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition"
                  />
                </div>

                {/* Số điện thoại */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#EE0033]" />
                    <span>Số điện thoại nhận tin nhắn *</span>
                  </label>
                  <input
                    type="text"
                    name="soDienThoai"
                    required
                    value={form.soDienThoai}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="098x xxx xxx"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition"
                  />
                </div>

              </div>

              {/* Chọn cửa hàng */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#EE0033]" />
                  <span>Chọn cửa hàng Viettel Store giao dịch *</span>
                </label>
                <select
                  name="idChiNhanh"
                  required
                  value={form.idChiNhanh}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EE0033] transition cursor-pointer"
                >
                  <option value="">-- Chọn cửa hàng Viettel gần bạn --</option>
                  {branches.map((b) => (
                    <option key={b.id_chi_nhanh} value={b.id_chi_nhanh}>
                      {b.ten_chi_nhanh} — {b.dia_chi}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn loại dịch vụ */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#EE0033]" />
                  <span>Nhu cầu dịch vụ tại quầy *</span>
                </label>
                <select
                  name="idLoaiGiaoDich"
                  required
                  value={form.idLoaiGiaoDich}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EE0033] transition cursor-pointer"
                >
                  <option value="">-- Chọn loại thủ tục cần thực hiện --</option>
                  {services.map((s) => (
                    <option key={s.id_loai_giao_dich} value={s.id_loai_giao_dich}>
                      {s.ten_giao_dich} (Thời gian xử lý ~{s.thoi_gian_xu_ly_trung_binh} phút)
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button 3D */}
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-[#EE0033] text-white font-black py-3.5 rounded-xl text-sm transition shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:shadow-none active:translate-y-1 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý cấp số thứ tự...
                  </>
                ) : (
                  <>
                    <span>Đăng ký & Lấy phiếu thứ tự</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Hệ thống tự động điều phối số thứ tự thông minh tới quầy trống</span>
              </div>

            </form>
          ) : (
            /* TICKET DIGITAL DISPLAY CARD */
            <div className="bg-gradient-to-br from-red-50/50 via-white to-orange-50/50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden animate-in fade-in zoom-in duration-200">

              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-1">CẤP SỐ THỨ TỰ THÀNH CÔNG!</h3>
              <p className="text-xs text-slate-500 mb-6">Phiếu điện tử của bạn đã được khởi tạo trên hệ thống Viettel Store.</p>

              {/* Digital Ticket Box */}
              <div className="bg-white rounded-3xl border-2 border-red-100 shadow-md p-6 max-w-md mx-auto space-y-4">

                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">MÃ SỐ THỨ TỰ CỦA BẠN</span>
                  <div className="text-5xl sm:text-6xl font-black text-[#EE0033] tracking-widest my-2 select-all drop-shadow-xs">
                    {result.so_thu_tu}
                  </div>
                </div>

                {/* Quầy dự kiến */}
                {result.quay_du_kien && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#EE0033] text-white flex items-center justify-center font-bold shrink-0">
                        <Monitor className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">QUẦY ĐÃ ĐIỀU PHỐI</span>
                        <span className="text-sm font-black text-slate-900">{result.quay_du_kien}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#EE0033] bg-white px-2.5 py-1 rounded-full border border-red-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Tự động
                    </span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 text-xs space-y-2">


                  <div className="flex justify-between items-center text-slate-600">
                    <span>Thời gian chờ dự kiến:</span>
                    <span className="font-extrabold text-[#EE0033]">{result.so_phut_cho} phút</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Dự kiến phục vụ lúc:</span>
                    <span className="font-bold text-slate-800">
                      {result.thoi_gian_du_kien ? new Date(result.thoi_gian_du_kien).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 text-xs text-left space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <p><strong className="text-slate-800">Khách hàng:</strong> {result.khach_hang.ho_ten} ({result.khach_hang.so_dien_thoai})</p>
                  <p><strong className="text-slate-800">Loại dịch vụ:</strong> {result.dich_vu.ten_giao_dich}</p>
                  <p><strong className="text-slate-800">Chi nhánh:</strong> {result.chi_nhanh.ten_chi_nhanh}</p>
                  <p className="text-[11px] text-slate-400">{result.chi_nhanh.dia_chi}</p>
                </div>


              </div>

              <button
                onClick={() => setResult(null)}
                className="mt-6 bg-[#EE0033] hover:bg-red-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-xs cursor-pointer"
              >
                Lấy số lượt tiếp theo
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Appointment;

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Sparkles,
  Clock,
  CreditCard,
  ShieldCheck,
  LifeBuoy,
  FileText,
  X,
  Zap,
  Check,
  AlertCircle
} from "lucide-react";

const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    topic: "KyThuat",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const faqList = [
    {
      id: 1,
      category: "Queue",
      question: "Làm thế nào để lấy số thứ tự giao dịch tại cửa hàng Viettel Store?",
      answer: "Bạn có thể lấy số thứ tự bằng cách đặt lịch trước trên mục 'Đăng ký quầy' hoặc quét mã QR tại quầy đón tiếp chi nhánh Viettel."
    },
    {
      id: 2,
      category: "Sim",
      question: "Tôi cần chuẩn bị giấy tờ gì khi làm thủ tục đăng ký SIM chính chủ?",
      answer: "Quý khách mang theo bản gốc Căn cước công dân (CCCD) gắn chip còn thời hạn. Nhân viên sẽ hỗ trợ đối soát sinh trắc học và hoàn tất trong 5-10 phút."
    },
    {
      id: 3,
      category: "Package",
      question: "Làm sao để đăng ký hoặc kiểm tra dung lượng Data 4G/5G còn lại?",
      answer: "Bạn tra cứu trực tiếp tại trang 'Gói cước' trên website hoặc soạn tin nhắn KTTK gửi 191 (miễn phí) để xem lưu lượng Data."
    },
    {
      id: 4,
      category: "Sim",
      question: "Tôi có thể mua SIM số đẹp trực tuyến và nhận tại nhà không?",
      answer: "Có. Viettel Store hỗ trợ chọn SIM số đẹp online, thanh toán VNPay/COD và giao tận nhà toàn quốc."
    },
    {
      id: 5,
      category: "Payment",
      question: "Thanh toán đơn hàng SIM qua cổng VNPay có an toàn không?",
      answer: "Giao dịch VNPay đáp ứng chuẩn PCI DSS quốc tế, bảo mật 100% và nhận hóa đơn điện tử ngay sau khi hoàn tất."
    }
  ];

  const categories = [
    { id: "ALL", label: "Tất cả" },
    { id: "Queue", label: "Hàng chờ & Đặt số" },
    { id: "Sim", label: "SIM số & Chính chủ" },
    { id: "Package", label: "Gói cước 4G/5G" },
    { id: "Payment", label: "Thanh toán VNPay" },
  ];

  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      if (activeCategory !== "ALL" && item.category !== activeCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory]);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 4000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.phone || !formState.message) {
      showToast("error", "Vui lòng điền đầy đủ Họ tên, Số điện thoại và Nội dung.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast("success", "Gửi yêu cầu hỗ trợ thành công! Chuyên viên Viettel sẽ gọi lại trong 15 phút.");
      setFormState({
        name: "",
        phone: "",
        email: "",
        topic: "KyThuat",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 text-slate-800 font-sans antialiased">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast({ show: false, type: "", message: "" })} className="ml-2 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-[#EE0033] border border-red-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Trung Tâm Hỗ Trợ 24/7
          </span>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight">CHÚNG TÔI CÓ THỂ HỖ TRỢ GÌ CHO BẠN?</h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Giải đáp thắc mắc dịch vụ di động, hỗ trợ lấy số quầy và tra cứu gói cước Viettel.
          </p>

          {/* Search Box */}
          <div className="pt-3 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập câu hỏi tìm kiếm (VD: Đăng ký SIM, Gói cước 5G, Lấy số quầy...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EE0033] shadow-md transition"
              />
              <Search className="w-4 h-4 text-[#EE0033] absolute left-4 top-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* 4 Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold border border-red-100 group-hover:scale-105 transition">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Tổng Đài CSKH</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Miễn phí 1800 8098 phục vụ 24/7 giải đáp mọi sự cố di động.
                </p>
              </div>
            </div>
            <a
              href="tel:18008098"
              className="mt-4 w-full bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-xs text-center flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> 1800 8098
            </a>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold border border-purple-100 group-hover:scale-105 transition">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Trợ Lý AI Chatbot</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tự động gợi ý gói cước, tìm SIM và hướng dẫn thủ tục trực tuyến.
                </p>
              </div>
            </div>
            <Link
              to="/chatbot"
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-xs text-center flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> Chat Với AI
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 group-hover:scale-105 transition">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Siêu Thị Viettel Store</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tìm điểm giao dịch trực tiếp và xem giờ mở cửa gần bạn.
                </p>
              </div>
            </div>
            <Link
              to="/store-locator"
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-xs text-center flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" /> Tìm Chi Nhánh
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100 group-hover:scale-105 transition">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Email Phản Hồi</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Gửi thắc mắc hoặc góp ý dịch vụ tới hòm thư cskh@viettel.com.vn.
                </p>
              </div>
            </div>
            <a
              href="mailto:cskh@viettel.com.vn"
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-xs text-center flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> Gửi Mail
            </a>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#EE0033]" />
              Câu Hỏi Thường Gặp (FAQ)
            </h2>
            <p className="text-xs text-slate-500">
              Giải đáp các câu hỏi hay gặp về SIM số, gói cước và dịch vụ quầy
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#EE0033] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3 max-w-3xl mx-auto">
            {filteredFaqs.map((item) => {
              const isOpen = expandedFaq === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? "bg-red-50/40 border-red-200" : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-xs cursor-pointer"
                  >
                    <span>{item.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#EE0033] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs font-medium text-slate-600 leading-relaxed border-t border-red-100/60 pt-2">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Gửi Yêu Cầu Hỗ Trợ Trực Tuyến</h2>
              <p className="text-xs text-slate-500">
                Chuyên viên CSKH Viettel sẽ tiếp nhận và phản hồi nhanh chóng
              </p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ tên..."
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="text"
                  required
                  placeholder="098x xxx xxx"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EE0033]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung yêu cầu *</label>
              <textarea
                rows="3"
                required
                placeholder="Mô tả sự cố hoặc thắc mắc của bạn..."
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EE0033] resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#EE0033] hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              Gửi yêu cầu hỗ trợ
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SupportPage;

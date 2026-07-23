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
  // Search & FAQ Category State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Support Form State
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

  // FAQ Items Data
  const faqList = [
    {
      id: 1,
      category: "Queue",
      question: "Làm thế nào để lấy số thứ tự giao dịch tại cửa hàng Viettel Store?",
      answer:
        "Bạn có thể lấy số thứ tự trực tiếp bằng 2 cách: (1) Đặt lịch hẹn trước thông qua tính năng 'Đặt lịch hẹn' trên website Viettel Store AI để được ưu tiên phục vụ, hoặc (2) Quét mã QR tại quầy đón tiếp khi đến chi nhánh."
    },
    {
      id: 2,
      category: "Sim",
      question: "Tôi cần chuẩn bị giấy tờ gì khi đăng ký SIM chính chủ tại quầy?",
      answer:
        "Quý khách vui lòng mang theo bản gốc Căn cước công dân (CCCD) có gắn chip còn thời hạn sử dụng. Nhân viên Viettel sẽ hỗ trợ đối soát thông tin sinh trắc học và hoàn tất đăng ký chính chủ trong vòng 5-10 phút."
    },
    {
      id: 3,
      category: "Package",
      question: "Làm sao để đăng ký hoặc kiểm tra dung lượng gói cước 4G/5G còn lại?",
      answer:
        "Bạn có thể tra cứu và đăng ký gói cước trực tiếp tại mục 'Gói cước' trên website, hoặc soạn tin nhắn KTKQ gửi 191 (miễn phí) để kiểm tra lưu lượng data và số phút gọi còn lại."
    },
    {
      id: 4,
      category: "Sim",
      question: "Tôi có thể mua SIM số đẹp trực tuyến và nhận tại nhà không?",
      answer:
        "Có. Viettel Store hỗ trợ chọn SIM số đẹp online tại mục 'Mua SIM', hoàn tất thanh toán an toàn và giao SIM tận nhà trên toàn quốc kèm hướng dẫn kích hoạt chính chủ."
    },
    {
      id: 5,
      category: "Payment",
      question: "Thanh toán giao dịch qua VNPAY tại Viettel Store có an toàn không?",
      answer:
        "Giao dịch qua VNPAY tuân thủ chuẩn bảo mật quốc tế PCI DSS. Khi thanh toán trên hệ thống Viettel Store AI, dữ liệu được mã hóa tức thì và bạn có thể nhận hóa đơn điện tử ngay sau khi hoàn tất."
    },
    {
      id: 6,
      category: "Queue",
      question: "Thời gian làm việc của các cửa hàng Viettel Store như thế nào?",
      answer:
        "Hầu hết các chi nhánh Viettel Store mở cửa từ 08:00 đến 20:30 tất cả các ngày trong tuần (kể cả Thứ 7, Chủ Nhật và ngày lễ). Bạn có thể tìm địa chỉ chi tiết tại trang 'Hệ thống cửa hàng'."
    },
    {
      id: 7,
      category: "Package",
      question: "Nếu đăng ký nhầm gói cước data, tôi có được hủy hoặc đổi gói không?",
      answer:
        "Bạn có thể hủy gói cước cũ bằng cú pháp HUY [TênGói] gửi 191 và tiến hành chọn đăng ký gói mới phù hợp hơn. Đội ngũ nhân viên và Chatbot AI luôn sẵn sàng tư vấn gói cước tối ưu nhất."
    },
    {
      id: 8,
      category: "Payment",
      question: "Nếu gặp sự cố bị trừ tiền nhưng chưa nhận được mã SIM/Gói cước thì sao?",
      answer:
        "Đừng lo lắng. Hãy liên hệ ngay Tổng đài CSKH miễn phí 1800 8198 hoặc điền Form hỗ trợ bên dưới với thông tin mã giao dịch VNPAY. Hệ thống sẽ kiểm tra và bù hoàn dịch vụ trong tối đa 15 phút."
    }
  ];

  // FAQ Categories
  const categories = [
    { id: "ALL", label: "Tất cả câu hỏi" },
    { id: "Queue", label: "Hàng chờ & Số thứ tự" },
    { id: "Sim", label: "SIM số & Chính chủ" },
    { id: "Package", label: "Gói cước 4G/5G" },
    { id: "Payment", label: "Thanh toán & Hóa đơn" },
  ];

  // Filtered FAQ List
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
      showToast("error", "Vui lòng điền đầy đủ thông tin Họ tên, Số điện thoại và Nội dung.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast("success", "Gửi yêu cầu hỗ trợ thành công! Chuyên viên Viettel sẽ liên hệ lại trong vòng 15 phút.");
      setFormState({
        name: "",
        phone: "",
        email: "",
        topic: "KyThuat",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] pb-16 animate-fade-in">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-bold transition-all transform animate-bounce-short ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast({ show: false, type: "", message: "" })} className="ml-2 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#EE0033] via-[#CC002D] to-[#A00022] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <span className="bg-yellow-400 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Trung Tâm Hỗ Trợ 24/7
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Chúng Tôi Có Thể Hỗ Trợ Gì Cho Bạn?
          </h1>

          <p className="text-red-100 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Giải đáp thắc mắc, hướng dẫn dịch vụ di động, số thứ tự giao dịch và chăm sóc khách hàng Viettel.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm (Ví dụ: Đăng ký SIM, Gói cước 4G, Lấy số thứ tự...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-900 border-2 border-white/30 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold placeholder:text-gray-400 shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50 transition-all"
              />
              <Search className="w-5 h-5 text-[#EE0033] absolute left-4 top-4.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        {/* 4 Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Hotline */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.08)] border-2 border-gray-100 hover:border-red-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#EE0033] border border-red-100 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-[#EE0033] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100 uppercase">
                  Miễn Phí Cước
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-2">Tổng Đài CSKH</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Phục vụ 24/7 giải đáp nhanh mọi sự cố kỹ thuật và đăng ký dịch vụ.
                </p>
              </div>
            </div>
            <a
              href="tel:18008198"
              className="mt-6 w-full bg-[#EE0033] text-white font-black py-3 rounded-xl shadow-[0_4px_0_#A00022] hover:shadow-[0_6px_0_#A00022] hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-center text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> 1800 8198
            </a>
          </div>

          {/* Card 2: AI Chatbot */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.08)] border-2 border-gray-100 hover:border-purple-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100 uppercase">
                  Trợ Lý AI 24/7
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-2">Chat Với Viettel AI</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Tự động tư vấn gói cước, tra cứu SIM số đẹp và hướng dẫn thủ tục.
                </p>
              </div>
            </div>
            <Link
              to="/chatbot"
              className="mt-6 w-full bg-purple-600 text-white font-black py-3 rounded-xl shadow-[0_4px_0_#581c87] hover:shadow-[0_6px_0_#581c87] hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-center text-sm flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Chat Ngay
            </Link>
          </div>

          {/* Card 3: Store Locator */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.08)] border-2 border-gray-100 hover:border-blue-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 uppercase">
                  Mạng Lưới Toàn Quốc
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-2">Cửa Hàng Viettel</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Tìm điểm giao dịch trực tiếp gần nhất và xem giờ hoạt động chi nhánh.
                </p>
              </div>
            </div>
            <Link
              to="/store-locator"
              className="mt-6 w-full bg-blue-600 text-white font-black py-3 rounded-xl shadow-[0_4px_0_#1e40af] hover:shadow-[0_6px_0_#1e40af] hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-center text-sm flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Xem Bản Đồ
            </Link>
          </div>

          {/* Card 4: Email */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.08)] border-2 border-gray-100 hover:border-emerald-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase">
                  Gửi Phản Hồi
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-2">Email Chăm Sóc</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Gửi góp ý về chất lượng dịch vụ hoặc thắc mắc cần hỗ trợ qua Email.
                </p>
              </div>
            </div>
            <a
              href="mailto:cskh@viettel.com.vn"
              className="mt-6 w-full bg-emerald-600 text-white font-black py-3 rounded-xl shadow-[0_4px_0_#065f46] hover:shadow-[0_6px_0_#065f46] hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-center text-sm flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" /> Gửi Email
            </a>
          </div>
        </div>

        {/* Section 2: FAQ Accordion */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200/80 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#EE0033]" />
              Câu Hỏi Thường Gặp (FAQ)
            </h2>
            <p className="text-xs text-gray-500">
              Tổng hợp câu trả lời cho những thắc mắc phổ biến nhất của khách hàng và nhân viên
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#EE0033] text-white shadow-md shadow-red-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                Không tìm thấy câu hỏi phù hợp với từ khóa "{searchQuery}"
              </div>
            ) : (
              filteredFaqs.map((item) => {
                const isOpen = expandedFaq === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen
                        ? "bg-red-50/40 border-red-200 shadow-sm"
                        : "bg-white border-gray-200/80 hover:border-gray-300"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(item.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-red-100 text-[#EE0033] flex items-center justify-center text-xs font-black flex-shrink-0">
                          Q{item.id}
                        </span>
                        {item.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#EE0033] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs font-medium text-gray-600 leading-relaxed border-t border-red-100/60 flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item.answer}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section 3: Interactive Support Ticket Form & Quick How-To Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Ticket Form (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-200/80 space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#EE0033] flex items-center justify-center font-bold">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Gửi Yêu Cầu Hỗ Trợ Trực Tuyến</h2>
                <p className="text-xs text-gray-500">
                  Điền thông tin sự cố hoặc yêu cầu, tư vấn viên Viettel sẽ liên hệ phản hồi sớm nhất
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Họ tên */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Họ và tên <span className="text-[#EE0033]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Số điện thoại liên hệ <span className="text-[#EE0033]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="098x xxx xxx"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                  />
                </div>

                {/* Loại chủ đề */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Chủ đề cần hỗ trợ
                  </label>
                  <select
                    value={formState.topic}
                    onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                  >
                    <option value="KyThuat">Sự cố Kỹ thuật & Sóng 4G/5G</option>
                    <option value="DangKySim">Đăng ký SIM số & Chính chủ</option>
                    <option value="GoiCuoc">Tư vấn Gói cước Data/Thoại</option>
                    <option value="HangCho">Hỗ trợ Hàng chờ & Đặt hẹn quầy</option>
                    <option value="ThanhToan">Thanh toán & Hóa đơn VNPAY</option>
                    <option value="GopY">Ý kiến đóng góp & Khác</option>
                  </select>
                </div>
              </div>

              {/* Tiêu đề */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Tiêu đề yêu cầu
                </label>
                <input
                  type="text"
                  placeholder="Tóm tắt ngắn gọn nội dung thắc mắc..."
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
                />
              </div>

              {/* Nội dung chi tiết */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                  Nội dung chi tiết <span className="text-[#EE0033]">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Mô tả cụ thể thắc mắc hoặc vấn đề bạn gặp phải..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto bg-[#EE0033] text-white font-black px-8 py-3.5 rounded-xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:shadow-[0_0px_0_#A00022] active:translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    Đang xử lý gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Gửi Yêu Cầu Hỗ Trợ
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick User Guides (1 Col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Hướng Dẫn Thao Tác</h3>
                  <p className="text-xs text-gray-500">Các bước thực hiện nhanh</p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-semibold text-gray-700">
                {/* Step 1 */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between text-[#EE0033] font-black">
                    <span>1. Đặt số thứ tự quầy</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-gray-500 text-[11px] font-normal leading-normal">
                    Truy cập trang Đặt hẹn → Chọn chi nhánh & thời gian → Nhận mã xếp hàng ưu tiên.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between text-purple-600 font-black">
                    <span>2. Hỏi đáp cùng Chatbot AI</span>
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <p className="text-gray-500 text-[11px] font-normal leading-normal">
                    Bấm mục 'Chatbot AI' → Nhập từ khóa gói cước hoặc loại SIM mong muốn → Nhận gợi ý chuẩn xác.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-600 font-black">
                    <span>3. Thanh toán qua VNPAY</span>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <p className="text-gray-500 text-[11px] font-normal leading-normal">
                    Chọn SIM/Gói cước → Quét mã QR VNPAY-QR → Nhận hóa đơn điện tử thành công.
                  </p>
                </div>
              </div>
            </div>

            {/* Commitment Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black tracking-tight text-white">Cam Kết Chất Lượng Viettel</h4>
              <p className="text-xs text-gray-300 font-medium leading-relaxed">
                Đội ngũ chăm sóc khách hàng cam kết bảo mật tuyệt đối thông tin và phản hồi mọi yêu cầu hỗ trợ trong vòng 15-30 phút.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

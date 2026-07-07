import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Phone,
  Sparkles,
  Clock,
  Store,
  Compass,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function ChatbotPage() {
  // Dữ liệu mock Bảng GoiCuoc phục vụ AI tra cứu
  const dataGoiCuoc = [
    { maGoi: 'ST90', tenGoi: 'ST90', giaTien: '90.000đ', dungLuong: '30GB', thoiHan: '30 ngày', moTa: 'Gói cước quốc dân cực kỳ phù hợp cho học sinh, sinh viên.', loai: 'Data' },
    { maGoi: 'V200C', tenGoi: 'COMBO V200C', giaTien: '200.000đ', dungLuong: '120GB', thoiHan: '30 ngày', moTa: 'Miễn phí gọi nội mạng dưới 20 phút + 100 phút ngoại mạng.', loai: 'Combo' },
    { maGoi: '5GFAST', tenGoi: '5GFAST', giaTien: '300.000đ', dungLuong: '200GB', thoiHan: '30 ngày', moTa: 'Data 5G siêu tốc độ cao, trải nghiệm không giới hạn.', loai: '5G' }
  ];

  // Dữ liệu giả định về hệ thống hàng đợi tại quầy giao dịch gần nhất
  const queueData = {
    soKhachDangCho: 8,
    thoiGianUocTinhMoiNguoi: 4, // 4 phút/khách
  };

  // Các câu hỏi gợi ý có sẵn theo yêu cầu thiết kế
  const sampleQuestions = [
    { label: 'Gói cước nào phù hợp sinh viên?', type: 'sinh_vien' },
    { label: 'Đăng ký ST90 như thế nào?', type: 'dang_ky_st90' },
    { label: 'Tổng đài Viettel là bao nhiêu?', type: 'tong_dai' },
    { label: 'Còn bao lâu tới lượt tôi?', type: 'thoi_gian_cho' },
    { label: 'Khi nào nên đến cửa hàng?', type: 'khuyen_nghi_cua_hang' }
  ];

  // State quản lý lịch sử tin nhắn chat
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý ảo Viettel AI. Bạn đang quan tâm đến gói cước viễn thông hay cần ước tính thời gian chờ giao dịch tại quầy?',
      time: 'Vừa xong'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hàm xử lý khi sinh câu trả lời tự động từ AI theo kịch bản yêu cầu
  const getAIResponse = (type, text) => {
    switch (type) {
      case 'sinh_vien':
        const studentPkg = dataGoiCuoc.find(p => p.maGoi === 'ST90');
        return {
          text: `Dựa trên bảng dữ liệu gói cước, Viettel đề xuất gói cước tối ưu nhất dành cho sinh viên hiện tại là **${studentPkg.tenGoi}**:`,
          customCard: studentPkg
        };
      case 'dang_ky_st90':
        return {
          text: 'Để đăng ký gói cước **ST90**, quý khách có thể soạn tin nhắn theo cú pháp: \n\n`ST90` gửi `191` \n\nHoặc bấm trực tiếp vào nút **[Đăng ký gói cước]** hiển thị ngay tại trang sản phẩm.',
          hasAction: true
        };
      case 'tong_dai':
        return {
          text: 'Tổng đài Chăm sóc khách hàng chính thức và miễn phí của Viettel Telecom là:\n\n* **1800 8098**: Hỗ trợ các dịch vụ di động, khóa chiều, tra cứu gói cước.\n* **1800 8168**: Hỗ trợ dịch vụ Internet Cáp quang cố định và Truyền hình.'
        };
      case 'thoi_gian_cho':
        const waitTime = queueData.soKhachDangCho * queueData.thoiGianUocTinhMoiNguoi;
        return {
          text: `Hệ thống ghi nhận hiện tại đang có **${queueData.soKhachDangCho} khách hàng** đang xếp hàng chờ tại quầy. Dự kiến còn khoảng **${waitTime} phút** nữa sẽ tới lượt giao dịch của bạn.`
        };
      case 'khuyen_nghi_cua_hang':
        const busyTime = queueData.soKhachDangCho > 5 ? "khá đông" : "thông thoáng";
        return {
          text: `Tình trạng phòng giao dịch hiện tại đang **${busyTime}** (${queueData.soKhachDangCho} người đang chờ). Khuyên nghị bạn nên đặt lịch hẹn trực tuyến trước qua ứng dụng hoặc chọn khung giờ thấp điểm như **14:00 - 15:30** chiều để không phải mất thời gian chờ đợi.`
        };
      default:
        return {
          text: `Cảm ơn bạn đã nhắn tin. Yêu cầu "${text}" đang được hệ thống phân tích và phản hồi trong giây lát.`
        };
    }
  };

  // Thao tác gửi tin nhắn
  const handleSend = (text, type = 'custom') => {
    if (!text.trim()) return;

    // 1. Thêm tin nhắn của User
    const userMsg = { id: Date.now(), sender: 'user', text, time: 'Vừa xong' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // 2. Phản hồi giả lập từ AI sau 600ms
    setTimeout(() => {
      const aiReplyData = getAIResponse(type, text);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReplyData.text,
        customCard: aiReplyData.customCard,
        hasAction: aiReplyData.hasAction,
        time: 'Vừa xong'
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-184px)] bg-gray-50 text-gray-800 font-sans flex flex-col antialiased">


      {/* 2. CHAT WORKSPACE SECTION */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6 min-h-0">

        {/* THANH PANEL GỢI Ý BÊN TRÁI (QUICK SUGGESTIONS) */}
        <aside className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0 overflow-y-auto min-h-0 pr-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-black text-gray-900 flex items-center tracking-wide uppercase mb-3 text-[#EE0033]">
              <HelpCircle className="w-4 h-4 mr-2" /> Câu hỏi thường gặp
            </h2>
            <p className="text-xs text-gray-400 mb-4 font-normal leading-relaxed">Chọn nhanh các câu hỏi chuẩn bị sẵn để kiểm tra năng lực phản hồi và tra cứu dữ liệu của hệ thống thông minh.</p>
            <div className="space-y-2.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.label, q.type)}
                  className="w-full text-left text-xs bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 p-3 rounded-xl transition-all font-medium text-gray-700 hover:text-purple-700 flex items-start gap-2 group"
                >
                  <span className="bg-gray-200 group-hover:bg-purple-200 text-gray-500 group-hover:text-purple-700 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[10px]">{idx + 1}</span>
                  <span className="flex-1 leading-normal">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* TRẠNG THÁI HÀNG ĐỢI THỜI GIAN THỰC */}
          <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl p-5 text-white shadow-md">
            <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center mb-3">
              <Store className="w-4 h-4 mr-2 text-red-400" /> Giám sát quầy dịch vụ
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-xs text-gray-300">Khách đang đợi:</span>
                <span className="font-black text-red-400 text-sm">{queueData.soKhachDangCho} người</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-xs text-gray-300">Thời gian xử lý TB:</span>
                <span className="font-semibold text-gray-200 text-xs">{queueData.thoiGianUocTinhMoiNguoi} phút / lượt</span>
              </div>
            </div>
          </div>
        </aside>

        {/* KHÔNG GIAN KHUNG CHAT CHÍNH (MAIN INTERACTION CHATBOX) */}
        <main className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative min-h-[500px] lg:min-h-0">

          {/* Header thanh Chat */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-700 px-6 py-4 flex items-center justify-between text-white shadow-sm flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-xl border border-white/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-wide">Trợ lý Viettel AI thế hệ mới</h3>
                <p className="text-[11px] text-purple-200 flex items-center mt-0.5 font-normal">
                  <span className="h-2 w-2 bg-green-400 rounded-full inline-block mr-1.5 animate-pulse"></span>
                  Trực tuyến tự động • Kết nối cơ sở dữ liệu
                </p>
              </div>
            </div>
          </div>

          {/* Vùng nội dung tin nhắn (Scrollable list) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`p-2 rounded-xl flex-shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-[#EE0033] text-white' : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                  }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bong bóng hội thoại */}
                <div className="max-w-[85%] sm:max-w-[70%]">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm border ${msg.sender === 'user'
                    ? 'bg-white text-gray-800 border-red-100 rounded-tr-none'
                    : 'bg-white text-gray-800 border-purple-100 rounded-tl-none'
                    }`}>
                    {msg.text}

                    {/* RENDERING CARD GÓI CƯỚC NẾU AI TRA CỨU RA DỮ LIỆU */}
                    {msg.customCard && (
                      <div className="mt-4 bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-xl border border-purple-100 p-4 shadow-inner text-gray-800">
                        <div className="flex justify-between items-start mb-2.5">
                          <span className="bg-purple-600 text-white font-black px-2.5 py-0.5 rounded-md text-xs tracking-wide">
                            {msg.customCard.tenGoi}
                          </span>
                          <span className="font-black text-purple-700 text-base">{msg.customCard.giaTien}</span>
                        </div>
                        <div className="text-xs space-y-1 text-gray-600 font-normal">
                          <p>• **Dung lượng:** {msg.customCard.dungLuong}</p>
                          <p>• **Thời hạn:** {msg.customCard.thoiHan}</p>
                          <p className="text-gray-500 text-[11px] italic mt-1.5 border-t border-purple-100 pt-1.5 leading-normal">{msg.customCard.moTa}</p>
                        </div>
                        <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 rounded-lg text-xs transition shadow-sm">
                          Đăng ký gói này ngay
                        </button>
                      </div>
                    )}

                    {/* ACTION BUTTON DÀNH CHO HƯỚNG DẪN ĐĂNG KÝ */}
                    {msg.hasAction && (
                      <div className="mt-3">
                        <button className="bg-[#EE0033] hover:bg-[#CC002D] text-white text-xs font-bold py-2 px-4 rounded-xl transition shadow-md flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1.5" /> Đăng ký gói cước trực tuyến
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block px-1">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập tin nhắn cố định chân trang (Footer input bar) */}
          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
              className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-600 focus-within:bg-white transition-all"
            >
              <input
                type="text"
                placeholder="Nhập câu hỏi tra cứu dữ liệu (Ví dụ: Gói cước sinh viên)..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm focus:outline-none py-1.5 text-gray-800 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`p-2.5 rounded-xl transition-all shadow-sm ${inputValue.trim()
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </main>

      </div>

      {/* FOOTER ĐỒNG BỘ THƯƠNG HIỆU */}
      <footer className="bg-gray-900 text-gray-500 text-xs text-center py-4 flex-shrink-0 border-t border-gray-800">
        © 2026 Viettel AI System - Tích hợp hệ thống quản lý cơ sở dữ liệu viễn thông toàn diện.
      </footer>

    </div>
  );
}
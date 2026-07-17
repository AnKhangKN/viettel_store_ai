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
import { sendChatbotMessage } from '../../../api/chatbot/chatbot.api';
import { getAllBranches } from '../../../api/branch/branch.api';

export default function ChatbotPage() {
  // State quản lý chi nhánh thật
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Lấy danh sách chi nhánh thật khi component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await getAllBranches();
        if (res?.success && Array.isArray(res.data)) {
          setBranches(res.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi nhánh:", err);
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchBranches();
  }, []);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Thao tác gửi tin nhắn thật lên API
  const handleSend = async (text) => {
    if (!text.trim() || isTyping) return;

    // 1. Thêm tin nhắn của User vào giao diện
    const userMsg = { id: Date.now(), sender: 'user', text, time: 'Vừa xong' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 2. Định dạng lịch sử trò chuyện gửi lên API (bỏ tin nhắn chào mặc định ở đầu để Gemini ko lỗi)
      const formattedHistory = [];
      const historyMessages = messages.filter(m => m.id !== 1);
      
      for (const m of historyMessages) {
        formattedHistory.push({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: m.text
        });
      }

      // 3. Gọi API lấy phản hồi từ chatbot
      const res = await sendChatbotMessage(text, formattedHistory);

      if (res?.success && res?.data?.response) {
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.data.response,
          time: 'Vừa xong'
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error("Không nhận được phản hồi hợp lệ.");
      }
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Rất tiếc, hệ thống chatbot đang bận hoặc gặp sự cố kết nối. Quý khách vui lòng thử lại sau ít phút hoặc liên hệ tổng đài miễn phí 1800 8098 nhé. ⚡',
        time: 'Vừa xong'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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
                  onClick={() => handleSend(q.label)}
                  className="w-full text-left text-xs bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 p-3 rounded-xl transition-all font-medium text-gray-700 hover:text-purple-700 flex items-start gap-2 group"
                >
                  <span className="bg-gray-200 group-hover:bg-purple-200 text-gray-500 group-hover:text-purple-700 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[10px]">{idx + 1}</span>
                  <span className="flex-1 leading-normal">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CHI NHÁNH CỬA HÀNG THỰC TẾ */}
          <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl p-5 text-white shadow-md flex-1 min-h-[220px] flex flex-col">
            <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center mb-3">
              <Store className="w-4 h-4 mr-2 text-red-400" /> Hệ thống cửa hàng
            </h3>
            {loadingBranches ? (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
                Đang tải danh sách chi nhánh...
              </div>
            ) : branches.length > 0 ? (
              <div className="space-y-2.5 overflow-y-auto max-h-[280px] pr-1">
                {branches.map((b) => (
                  <div key={b.id_chi_nhanh} className="bg-white/5 p-3 rounded-xl border border-white/10 text-[11px] leading-relaxed">
                    <p className="font-bold text-gray-200 text-xs">{b.ten_chi_nhanh}</p>
                    <p className="text-gray-400 mt-1">📍 {b.dia_chi}</p>
                    <p className="text-red-300 font-semibold mt-1">📞 Hotline: {b.so_hotline}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
                Không có dữ liệu chi nhánh.
              </div>
            )}
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
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl flex-shrink-0 shadow-sm bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] sm:max-w-[70%] bg-white text-gray-800 border border-purple-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <span className="text-xs text-gray-400">Trợ lý ảo đang trả lời...</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
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
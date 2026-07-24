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
  HelpCircle,
  MessageSquare,
  Zap
} from 'lucide-react';
import { sendChatbotMessage } from '../../../api/chatbot/chatbot.api';
import { getAllBranches } from '../../../api/branch/branch.api';

export default function ChatbotPage() {
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  const sampleQuestions = [
    { label: 'Gói cước Data 5G Viettel nào hot nhất?', type: 'goi_cuoc' },
    { label: 'Hướng dẫn mua SIM số đẹp & nhận tại quầy?', type: 'mua_sim' },
    { label: 'Cách đặt lịch lấy số thứ tự giao dịch online?', type: 'so_thu_tu' },
    { label: 'Thanh toán đơn hàng qua VNPay Sandbox như thế nào?', type: 'vnpay' },
    { label: 'Tra cứu địa chỉ & hotline cửa hàng Viettel gần nhất?', type: 'cua_hang' }
  ];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý AI Viettel. Bạn đang quan tâm đến gói cước Data 4G/5G, tìm SIM số đẹp hay cần lấy số thứ tự quầy giao dịch hôm nay?',
      time: 'Vừa xong'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { id: Date.now(), sender: 'user', text, time: 'Vừa xong' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const formattedHistory = [];
      const historyMessages = messages.filter(m => m.id !== 1);
      
      for (const m of historyMessages) {
        formattedHistory.push({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: m.text
        });
      }

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
      const serverMessage = err?.response?.data?.message;
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: serverMessage || 'Hệ thống AI hiện đang xử lý nhiều yêu cầu. Vui lòng thử lại sau ít phút hoặc liên hệ tổng đài 1800 8098 nhé. ⚡',
        time: 'Vừa xong'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-[calc(100vh-140px)] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-[720px]">

        {/* SIDEBAR BÊN TRÁI: GỢI Ý CÂU HỎI & CỬA HÀNG */}
        <aside className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0 h-full">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 flex flex-col">
            <h2 className="text-xs font-black text-[#EE0033] flex items-center gap-1.5 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" /> Gợi ý câu hỏi nhanh
            </h2>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Nhấp vào các chủ đề mẫu để thử nghiệm khả năng trả lời thông minh của Trợ lý AI:
            </p>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.label)}
                  className="w-full text-left text-xs bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 p-3 rounded-2xl transition-all font-semibold text-slate-700 hover:text-purple-700 flex items-start gap-2 group cursor-pointer"
                >
                  <span className="bg-slate-200 group-hover:bg-purple-200 text-slate-600 group-hover:text-purple-700 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xs flex-1 flex flex-col overflow-hidden border border-slate-800">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Store className="w-4 h-4 text-red-400" /> Điểm giao dịch Viettel
            </h3>
            {loadingBranches ? (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                Đang tải hệ thống cửa hàng...
              </div>
            ) : branches.length > 0 ? (
              <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                {branches.map((b) => (
                  <div key={b.id_chi_nhanh} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-xs">
                    <p className="font-extrabold text-slate-200">{b.ten_chi_nhanh}</p>
                    <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">📍 {b.dia_chi}</p>
                    <p className="text-red-400 font-bold mt-1 text-[11px]">Hotline: {b.so_hotline}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                Chưa có dữ liệu cửa hàng.
              </div>
            )}
          </div>
        </aside>

        {/* CHAT MAIN BOX */}
        <main className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden h-full">

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 px-6 py-4 flex items-center justify-between text-white flex-shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2 rounded-2xl border border-white/20 backdrop-blur-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">Trợ Lý Ảo Viettel AI (Gemini 2026)</h3>
                <p className="text-[11px] text-purple-200 flex items-center gap-1.5 mt-0.5">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full inline-block animate-pulse"></span>
                  Trực tuyến 24/7 • Kết nối dữ liệu gói cước & SIM
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`p-2.5 rounded-2xl flex-shrink-0 shadow-2xs ${
                  msg.sender === 'user' ? 'bg-[#EE0033] text-white' : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="max-w-[85%] sm:max-w-[75%]">
                  <div className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs border ${
                    msg.sender === 'user'
                      ? 'bg-white text-slate-800 border-red-100 rounded-tr-none'
                      : 'bg-white text-slate-800 border-purple-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block px-2">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl flex-shrink-0 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white text-slate-800 border border-purple-100 p-3.5 rounded-3xl rounded-tl-none shadow-2xs flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Trợ lý AI đang suy nghĩ...</span>
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-600 focus-within:bg-white transition-all"
            >
              <input
                type="text"
                placeholder="Nhập nội dung bạn cần hỏi Trợ lý AI Viettel..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-transparent border-none text-xs sm:text-sm focus:outline-none py-1.5 text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`p-2.5 rounded-xl transition-all shadow-2xs cursor-pointer ${
                  inputValue.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </main>

      </div>
    </div>
  );
}
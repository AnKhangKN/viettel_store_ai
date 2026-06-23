import React, { useState } from 'react';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Chào bạn! Mình là trợ lý AI Viettel. Bạn cần mình hỗ trợ gì về gói cước hay dịch vụ không?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    // Thêm tin nhắn của người dùng
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    
    // Giả lập AI trả lời (Sau này nối với API Python của bạn)
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Đây là phản hồi mẫu từ AI về: ' + input }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-gray-50 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header chat */}
      <div className="bg-white p-4 border-b flex items-center space-x-3">
        <div className="bg-red-600 p-2 rounded-full text-white"><FaRobot /></div>
        <h2 className="font-bold text-lg">Trợ lý AI Viettel</h2>
      </div>

      {/* Nội dung chat */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-red-600 text-white' : 'bg-white text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Ô nhập liệu */}
      <div className="bg-white p-4 border-t flex space-x-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập câu hỏi của bạn..."
          className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-red-500"
        />
        <button onClick={handleSend} className="bg-red-600 text-white px-6 rounded-xl hover:bg-red-700 transition">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
import React from 'react';

const HomePage = () => {
  return (
    <div className="space-y-12 pb-12">
      {/* 1. Giới thiệu hệ thống */}
      <section className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-l-red-600">
        <h1 className="text-4xl font-bold text-red-700 mb-4">🎉 Chào mừng đến với Viettel Store AI</h1>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">Hệ thống hỗ trợ thông minh giúp bạn chọn lựa gói cước, mua SIM và kết nối dịch vụ Viettel nhanh chóng, tiện lợi nhất.</p>
      </section>

      {/* 2. Banner gói cước nổi bật */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl p-10 text-white shadow-xl hover:shadow-2xl transition-shadow">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><span>⭐</span> Gói cước nổi bật nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['V120B', 'MXH120', 'SD135'].map((pkg) => (
            <div key={pkg} className="bg-white/20 backdrop-blur-md p-6 rounded-xl border-2 border-white/40 hover:bg-white/30 transition-colors">
              <h3 className="text-2xl font-bold">{pkg}</h3>
              <p className="text-sm mt-3 opacity-95">Ưu đãi data khủng, miễn phí gọi nội mạng thả ga.</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Nút chức năng */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Xem gói cước", icon: "📱" },
          { label: "Mua SIM online", icon: "🛒" },
          { label: "Đăng ký tại quầy", icon: "🏪" },
          { label: "Chat với AI", icon: "🤖" },
        ].map((btn) => (
          <button key={btn.label} className="bg-gradient-to-br from-red-600 to-red-700 text-white font-bold py-5 px-4 rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all duration-200">
            <div className="text-2xl mb-2">{btn.icon}</div>
            <div className="text-sm">{btn.label}</div>
          </button>
        ))}
      </section>

      {/* 4. Số tổng đài Viettel */}
      <section className="bg-gradient-to-r from-red-700 to-red-900 text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">📞 Tổng đài hỗ trợ Viettel</h2>
          <p className="opacity-90 mt-2">Liên hệ với chúng tôi 24/7 để được giải đáp mọi thắc mắc.</p>
        </div>
        <div className="text-5xl font-black mt-4 md:mt-0 tracking-wider text-yellow-300 bg-red-800/50 px-6 py-4 rounded-lg">1800 8098</div>
      </section>
    </div>
  );
};

export default HomePage;
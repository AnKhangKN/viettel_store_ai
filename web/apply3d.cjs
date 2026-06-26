const fs = require('fs');

function apply3D() {
  const file = 'src/Components/user/HomePage/HomePage.jsx';
  let c = fs.readFileSync(file, 'utf8');

  // 1. Hero banner 3D card
  const heroOld = `<div className="hidden md:flex justify-center relative">
            <div className="w-72 h-72 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full absolute -top-4 opacity-20 blur-2xl"></div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl text-center w-80 relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-base font-bold tracking-widest text-yellow-300 uppercase">Gói Cước Hot Nhất</span>
              <h3 className="text-6xl font-black my-4">5G150</h3>
              <p className="text-xl font-semibold text-white/90">180 GB / Tháng</p>
              <div className="border-t border-white/20 my-4"></div>
              <p className="text-base text-white/80">Chỉ 150.000đ cho 30 ngày sử dụng</p>
            </div>
          </div>`;
  const heroNew = `<div className="hidden md:flex justify-center relative" style={{ perspective: '1000px' }}>
            <div className="w-72 h-72 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full absolute -top-4 opacity-30 blur-2xl animate-pulse"></div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border-t border-l border-white/40 border-r border-b border-white/10 shadow-[20px_20px_40px_-10px_rgba(0,0,0,0.5)] text-center w-80 relative z-10 transition-all duration-500 hover:shadow-[30px_30px_50px_-15px_rgba(0,0,0,0.6)] hover:rotate-0" style={{ transform: 'rotateX(15deg) rotateY(-20deg) translateZ(50px)', transformStyle: 'preserve-3d' }}>
              <div style={{ transform: 'translateZ(40px)' }}>
                <span className="text-base font-bold tracking-widest text-yellow-300 uppercase drop-shadow-md">Gói Cước Hot Nhất</span>
                <h3 className="text-6xl font-black my-4 drop-shadow-xl text-white">5G150</h3>
                <p className="text-xl font-semibold text-white/90 drop-shadow-md">180 GB / Tháng</p>
                <div className="border-t border-white/20 my-4 shadow-[0_2px_0_rgba(255,255,255,0.1)]"></div>
                <p className="text-base text-white/80 drop-shadow-sm">Chỉ 150.000đ cho 30 ngày sử dụng</p>
              </div>
            </div>
          </div>`;
  c = c.replace(heroOld, heroNew);

  // 2. Quick Actions
  c = c.replace(/className="flex items-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50\/50 border border-red-100 hover:shadow-md hover:border-\[#EE0033\]\/30 transition text-left group"/g, 
  'className="flex items-center p-4 rounded-xl bg-white border-2 border-red-100 shadow-[0_6px_0_#fecaca] hover:shadow-[0_8px_0_#fca5a5] hover:-translate-y-1 active:shadow-[0_0px_0_#fca5a5] active:translate-y-1 transition-all duration-200 text-left group"');

  c = c.replace(/className="flex items-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 hover:shadow-md hover:border-purple-300 transition text-left group"/g, 
  'className="flex items-center p-4 rounded-xl bg-white border-2 border-purple-200 shadow-[0_6px_0_#e9d5ff] hover:shadow-[0_8px_0_#d8b4fe] hover:-translate-y-1 active:shadow-[0_0px_0_#d8b4fe] active:translate-y-1 transition-all duration-200 text-left group"');

  // 3. Package Cards
  c = c.replace(/className="bg-white rounded-2xl border border-gray-200\/80 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 flex flex-col justify-between overflow-hidden group"/g, 
  'className="bg-white rounded-2xl border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(238,0,51,0.25)] hover:-translate-y-3 transition-all duration-300 flex flex-col justify-between overflow-hidden group"');

  // 4. Primary buttons
  c = c.replace(/className="bg-white text-\[#EE0033\] font-bold px-8 py-3.5 rounded-lg shadow-lg hover:bg-gray-100 transition flex items-center group"/g, 
  'className="bg-white text-[#EE0033] font-black px-8 py-3.5 rounded-xl shadow-[0_6px_0_#e5e7eb] hover:shadow-[0_8px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all flex items-center group"');

  // 5. Card buttons
  c = c.replace(/className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-\[#EE0033\] hover:text-white hover:border-\[#EE0033\] transition-all shadow-sm"/g, 
  'className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl shadow-[0_4px_0_#e5e7eb] hover:shadow-[0_6px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 hover:border-gray-300 transition-all"');

  // 6. Floating Chatbot button
  c = c.replace(/className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center group relative"/g, 
  'className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-[0_8px_0_#4c1d95] hover:shadow-[0_12px_0_#4c1d95] hover:-translate-y-2 active:shadow-[0_0px_0_#4c1d95] active:translate-y-1 transition-all duration-200 flex items-center justify-center group relative"');

  fs.writeFileSync(file, c);
}

apply3D();

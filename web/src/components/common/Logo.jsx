import React from 'react';

const Logo = ({ className = "w-10 h-10", showText = true, textLight = true }) => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <img src="/viettel-v-logo.svg" alt="Viettel Logo" className={`object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform ${className}`} />
      {showText && (
        <div className="text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`text-2xl font-black tracking-tighter ${textLight ? 'text-white' : 'text-slate-900'}`}>viettel</span>
            <span className="text-[#FBBF24] font-black text-lg">STORE</span>
          </div>
          <p className={`text-[10px] font-bold tracking-widest uppercase mt-0.5 ${textLight ? 'text-red-100/90' : 'text-slate-500'}`}>
            AI Customer Portal
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;

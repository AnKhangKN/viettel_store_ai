import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck, Truck } from 'lucide-react';

export default function SimCheckoutPage() {
  const { id } = useParams(); // maSim or soSim
  const navigate = useNavigate();

  // Mock data for the selected SIM (in reality, fetch by ID)
  const simData = {
    soSim: id || "0988xxxx88",
    loaiSim: "Số đẹp",
    giaBan: "500.000đ",
    phiHoaMang: "50.000đ",
  };

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/buysim');
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Đặt Mua Thành Công!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Cảm ơn quý khách đã mua SIM <span className="font-bold text-[#EE0033]">{simData.soSim}</span>. Hệ thống sẽ liên hệ xác nhận trong ít phút tới.
          </p>
          <div className="w-10 h-1 bg-green-500 mx-auto rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Thanh Toán Đơn Hàng</h1>
          <p className="text-gray-500">Hoàn tất thông tin để sở hữu số thuê bao bạn mong muốn</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái: Form thông tin */}
          <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center">
              <span className="w-8 h-8 bg-red-100 text-[#EE0033] rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span>
              Thông tin cá nhân
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên *</label>
                  <input required type="text" className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] outline-none transition" placeholder="Nhập họ tên đầy đủ..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại liên hệ *</label>
                  <input required type="tel" className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] outline-none transition" placeholder="SĐT để nhân viên gọi xác nhận..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số CCCD / CMND *</label>
                <input required type="text" className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] outline-none transition" placeholder="Nhập số căn cước công dân của bạn..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ giao hàng (Tùy chọn)</label>
                <input type="text" className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] outline-none transition" placeholder="Nhập địa chỉ nhận SIM..." />
              </div>
              
              <div className="pt-6">
                <button type="submit" className="w-full bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-red-500/30 transition-all active:scale-[0.98]">
                  Xác nhận & Thanh toán
                </button>
              </div>
            </form>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100 text-center">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-2">Số thuê bao</p>
                <h3 className="text-3xl font-black text-[#EE0033] tracking-wider">{simData.soSim}</h3>
                <span className="inline-block bg-white text-gray-600 px-3 py-1 rounded-lg text-xs font-semibold mt-3 shadow-sm">{simData.loaiSim}</span>
              </div>

              <div className="space-y-4 mb-6 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Giá SIM</span>
                  <span className="font-semibold text-gray-900">{simData.giaBan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí hòa mạng</span>
                  <span className="font-semibold text-gray-900">{simData.phiHoaMang}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold">Tổng cộng</span>
                  <span className="text-2xl font-black text-[#EE0033]">550.000đ</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <ShieldCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Giao dịch an toàn và bảo mật tuyệt đối 100%
                </div>
                <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Truck className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                  Giao SIM tận nhà miễn phí toàn quốc
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

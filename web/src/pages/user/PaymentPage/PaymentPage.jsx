import React, { useState } from 'react';
import { CreditCard, Wallet, Smartphone, ShieldCheck, QrCode, CheckCircle2, ArrowLeft } from 'lucide-react';

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState('viettelpay');
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = [
    { id: 'viettelpay', name: 'Viettel Money', desc: 'Thanh toán cước, nạp thẻ chiết khấu tới 10%', icon: <Smartphone className="w-8 h-8 text-red-500 mr-4 flex-shrink-0" />, tag: 'Phổ biến' },
    { id: 'qr', name: 'Chuyển khoản (Mã QR)', desc: 'Quét mã VietQR bằng mọi ứng dụng ngân hàng', icon: <QrCode className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />, tag: 'Nhanh chóng' },
    { id: 'ewallet', name: 'Ví điện tử', desc: 'Hỗ trợ Momo, ZaloPay, VNPay...', icon: <Wallet className="w-8 h-8 text-pink-500 mr-4 flex-shrink-0" /> },
    { id: 'atm', name: 'Thẻ ngân hàng / ATM', desc: 'Thẻ nội địa và quốc tế (Visa/Mastercard)', icon: <CreditCard className="w-8 h-8 text-blue-400 mr-4 flex-shrink-0" /> },
    { id: 'autopay', name: 'Thanh toán tự động', desc: 'Không lo trễ hạn với AutoPay', icon: <ShieldCheck className="w-8 h-8 text-green-500 mr-4 flex-shrink-0" /> },
  ];

  const handleContinue = () => {
    if (selectedMethod === 'qr') {
      setStep(2); // Show QR
    } else {
      // For other methods, mock success for now
      setIsSuccess(true);
      setStep(3);
    }
  };

  const handleSimulatePayment = () => {
    setIsSuccess(true);
    setStep(3);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {step === 1 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Thanh Toán Trực Tuyến</h1>
              <p className="text-lg text-gray-600">Nhanh chóng, tiện lợi và an toàn tuyệt đối với hệ thống thanh toán của Viettel.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 md:p-12 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Chọn hình thức thanh toán</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {methods.map((m) => (
                    <div 
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`border-2 rounded-2xl p-6 flex items-start cursor-pointer relative overflow-hidden transition-all duration-200 ${
                        selectedMethod === m.id 
                          ? 'border-red-500 bg-red-50 shadow-md' 
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      {m.tag && (
                        <div className={`absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg ${selectedMethod === m.id ? 'bg-red-500' : 'bg-gray-400'}`}>
                          {m.tag}
                        </div>
                      )}
                      
                      {/* Check icon for selected state */}
                      {selectedMethod === m.id && (
                        <CheckCircle2 className="absolute bottom-4 right-4 text-red-500 w-6 h-6" />
                      )}

                      {m.icon}
                      <div>
                        <h3 className={`font-bold text-lg mb-1 ${selectedMethod === m.id ? 'text-red-700' : 'text-gray-900'}`}>{m.name}</h3>
                        <p className="text-sm text-gray-600">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-8 text-center">
                <button 
                  onClick={handleContinue}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-xl text-lg transition-colors shadow-lg"
                >
                  Tiếp tục thanh toán
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-2xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-red-600 flex items-center font-medium transition-colors">
                  <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại
                </button>
                <h2 className="text-xl font-bold text-gray-900">Quét mã QR để thanh toán</h2>
                <div className="w-20"></div> {/* Spacer for centering */}
             </div>
             
             <div className="p-10 flex flex-col items-center text-center">
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-semibold mb-6 flex items-center border border-blue-200">
                  <QrCode className="w-5 h-5 mr-2" /> Hỗ trợ mọi ứng dụng ngân hàng (VietQR)
                </div>
                
                <div className="border-4 border-gray-100 p-4 rounded-3xl shadow-sm mb-6 bg-white">
                  {/* Generated QR Code */}
                  <img src="https://quickchart.io/qr?text=VIETTEL_PAYMENT_10000&size=250&margin=2" alt="QR Code" className="w-64 h-64 object-contain" />
                </div>

                <div className="w-full max-w-sm text-left bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Người nhận:</span>
                    <span className="font-bold text-gray-900">VIETTEL TELECOM</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Số tiền:</span>
                    <span className="font-bold text-red-600 text-lg">10.000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nội dung:</span>
                    <span className="font-medium text-gray-900 text-right">Thanh toan dich vu</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-6">Trang này sẽ tự động chuyển hướng khi thanh toán thành công.</p>
                
                {/* Nút giả lập để test */}
                <button 
                  onClick={handleSimulatePayment}
                  className="text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  (Giả lập: Đã quét mã xong)
                </button>
             </div>
          </div>
        )}

        {step === 3 && isSuccess && (
           <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-xl mx-auto animate-in zoom-in-95 duration-500 p-12 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Thanh toán thành công!</h2>
              <p className="text-gray-600 mb-8">Cảm ơn bạn đã sử dụng dịch vụ của Viettel. Hệ thống đã ghi nhận giao dịch của bạn.</p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
                <div className="flex justify-between mb-3 border-b border-gray-200 pb-3">
                  <span className="text-gray-500">Mã giao dịch</span>
                  <span className="font-medium text-gray-900">VT{Math.floor(Math.random() * 100000000)}</span>
                </div>
                <div className="flex justify-between mb-3 border-b border-gray-200 pb-3">
                  <span className="text-gray-500">Thời gian</span>
                  <span className="font-medium text-gray-900">{new Date().toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 whitespace-nowrap">Trạng thái</span>
                  <span className="font-bold text-green-600 whitespace-nowrap">Hoàn tất</span>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = '/'}
                className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-10 rounded-xl transition-colors"
              >
                Về trang chủ
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

const RegisterPackagePage = () => {
  const { id } = useParams(); // maGoi
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  // Mock data for the package (ideally fetched from API)
  const pkg = {
    maGoi: id || 'ST90',
    tenGoi: id || 'ST90',
    giaTien: '90.000đ',
    dungLuong: '30GB',
    thoiHan: '30 ngày',
    moTa: 'Ưu đãi sinh viên, miễn phí Data truy cập Tiktok',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Viettel phone number prefixes
    const viettelRegex = /^(086|096|097|098|032|033|034|035|036|037|038|039)\d{7}$/;
    
    if (!viettelRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      setError('Vui lòng nhập đúng số điện thoại mạng Viettel.');
      return;
    }

    if (phoneNumber) {
      // Proceed to payment, passing necessary state if needed
      navigate('/payment');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Đăng ký gói cước {pkg.tenGoi}</h1>
          <p className="text-gray-600">Vui lòng kiểm tra thông tin gói cước và nhập số điện thoại để tiếp tục thanh toán.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Package Details */}
              <div className="flex-1 bg-red-50 rounded-2xl p-6 border border-red-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="bg-[#EE0033] text-white text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">Gói cước</span>
                    <h2 className="text-2xl font-black text-gray-900">{pkg.tenGoi}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#EE0033] block">{pkg.giaTien}</span>
                    <span className="text-sm text-gray-500">/ {pkg.thoiHan}</span>
                  </div>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900 block">Dung lượng Data</span>
                      <span className="text-gray-600 text-sm">{pkg.dungLuong} tốc độ cao</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900 block">Mô tả</span>
                      <span className="text-gray-600 text-sm">{pkg.moTa}</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Registration Form */}
              <div className="flex-1 flex flex-col justify-center">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                      Số điện thoại đăng ký
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        className={`pl-11 w-full border-2 rounded-xl p-3 focus:outline-none transition-colors ${
                          error ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600' : 'border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        }`}
                        placeholder="Nhập số điện thoại Viettel"
                        value={phoneNumber}
                        onChange={(e) => { setPhoneNumber(e.target.value); setError(''); }}
                        required
                      />
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start">
                    <ShieldCheck className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Thông tin của bạn được bảo mật an toàn. Sau khi đăng ký, hệ thống sẽ chuyển tới trang thanh toán an toàn của Viettel.
                    </p>
                  </div>

                  <button
                    type="submit"
                    translate="no"
                    className="w-full bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold py-3 md:py-4 px-2 md:px-6 rounded-xl text-sm sm:text-base md:text-lg transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center group"
                  >
                    Thanh toán
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPackagePage;

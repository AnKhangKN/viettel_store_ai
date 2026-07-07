import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for the package (ideally fetched from API based on id)
  const pkg = {
    maGoi: id || 'ST90',
    tenGoi: id || 'ST90',
    giaTien: '90.000đ',
    dungLuong: '30GB',
    thoiHan: '30 ngày',
    moTa: 'Ưu đãi sinh viên, miễn phí Data truy cập Tiktok',
    loai: 'Data',
    chiTiet: [
      'Truy cập Internet tốc độ cao 5G/4G.',
      'Miễn phí 100% lưu lượng data truy cập ứng dụng TikTok.',
      'Không giới hạn dung lượng truy cập ở tốc độ thường.',
      'Gói cước tự động gia hạn sau 30 ngày.',
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#EE0033]">Trang chủ</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/package')} className="hover:text-[#EE0033]">Gói cước</button>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">{pkg.tenGoi}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row">
            
            {/* Left: Summary */}
            <div className="md:w-1/2 p-8 md:p-12 bg-red-50 border-b md:border-b-0 md:border-r border-red-100">
              <div className="inline-block bg-[#EE0033] text-white font-bold px-3 py-1 rounded-full text-xs mb-4 uppercase tracking-wider">
                Gói {pkg.loai}
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">{pkg.tenGoi}</h1>
              <p className="text-gray-600 mb-8">{pkg.moTa}</p>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 border border-red-50">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Giá cước</span>
                  <span className="text-3xl font-black text-[#EE0033]">{pkg.giaTien}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Lưu lượng</span>
                  <span className="text-xl font-bold text-gray-900">{pkg.dungLuong}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Chu kỳ</span>
                  <span className="text-lg font-semibold text-gray-900">{pkg.thoiHan}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/register-package/${pkg.maGoi}`)}
                className="w-full bg-[#EE0033] hover:bg-[#CC002D] text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center group"
              >
                Đăng ký ngay
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right: Detailed Info */}
            <div className="md:w-1/2 p-8 md:p-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap className="w-6 h-6 text-yellow-500 mr-2" /> Đặc quyền gói cước
              </h3>
              
              <ul className="space-y-4 mb-10">
                {pkg.chiTiet.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="w-6 h-6 text-blue-500 mr-2" /> Lưu ý khi sử dụng
              </h3>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm text-gray-600 space-y-2">
                <p>- Để tra cứu lưu lượng còn lại, soạn <strong>KTTK gửi 191</strong>.</p>
                <p>- Hủy gia hạn: Soạn <strong>HUY gửi 191</strong>.</p>
                <p>- Hủy gói (mất Data còn lại): Soạn <strong>HUYDATA gửi 191</strong>.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;

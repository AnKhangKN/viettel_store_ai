import React from 'react';
import { Music, PlayCircle, Search, Star } from 'lucide-react';

const ImuzikPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-pink-600 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <Music className="w-16 h-16 mx-auto mb-4 text-pink-200" />
        <h1 className="text-4xl font-extrabold mb-4">Nhạc Chờ Imuzik</h1>
        <p className="text-xl text-pink-100 max-w-2xl mx-auto">
          Thể hiện cá tính qua từng tiếng tút tút. Kho nhạc chờ hàng triệu bài hát bản quyền hot nhất hiện nay.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex gap-4 mb-8">
            <input type="text" placeholder="Tìm kiếm bài hát, ca sĩ..." className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500" />
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-bold flex items-center">
              <Search className="w-5 h-5 mr-2" /> Tìm
            </button>
          </div>
          
          <h2 className="text-2xl font-bold mb-6 flex items-center"><Star className="w-6 h-6 text-yellow-500 mr-2" /> Bài hát thịnh hành</h2>
          <div className="space-y-4">
            {[
              { title: 'Cắt Đôi Nỗi Sầu', artist: 'Tăng Duy Tân', code: '123456' },
              { title: 'À Lôi', artist: 'Double2T', code: '654321' },
              { title: 'Nấu Ăn Cho Em', artist: 'Đen Vâu', code: '112233' },
            ].map((song, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 hover:bg-pink-50 rounded-xl transition-colors">
                <div className="flex items-center">
                  <PlayCircle className="w-10 h-10 text-pink-500 mr-4 cursor-pointer" />
                  <div>
                    <h3 className="font-bold text-gray-900">{song.title}</h3>
                    <p className="text-sm text-gray-500">{song.artist}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Mã số: <span className="font-bold text-gray-900">{song.code}</span></p>
                  <button className="text-pink-600 font-semibold hover:underline text-sm">Cài nhạc chờ</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImuzikPage;

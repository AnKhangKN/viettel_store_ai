import React from "react";
import {
  FaUsers,
  FaStore,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const DashboardPage = () => {
  const counters = [
    {
      title: "Khách đang chờ",
      value: 12,
      icon: <FaUsers />,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Quầy hoạt động",
      value: 3,
      icon: <FaStore />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Đã xử lý hôm nay",
      value: 35,
      icon: <FaCheckCircle />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
  ];

  const countersStatus = [
    {
      booth: "Quầy 1",
      staff: "Nguyễn Văn A",
      customer: "A001",
      status: "Đang phục vụ",
    },
    {
      booth: "Quầy 2",
      staff: "Trần Văn B",
      customer: "A002",
      status: "Đang phục vụ",
    },
    {
      booth: "Quầy 3",
      staff: "Lê Văn C",
      customer: "---",
      status: "Trống",
    },
  ];

  const waiting = [
    {
      id: "A003",
      name: "Phạm Văn D",
      service: "Đăng ký SIM",
      time: "5 phút",
    },
    {
      id: "A004",
      name: "Lê Thị E",
      service: "Đăng ký gói cước",
      time: "10 phút",
    },
    {
      id: "A005",
      name: "Võ Văn F",
      service: "Thanh toán",
      time: "15 phút",
    },
  ];

  const history = [
    "A001 - Đăng ký SIM",
    "A002 - Thanh toán",
    "A010 - Gia hạn gói cước",
    "A012 - Đăng ký eSIM",
  ];

  return (
    <div className="space-y-8">
      {/* Tiêu đề */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Nhân viên
        </h1>

        <p className="text-gray-500 mt-2">
          Theo dõi tình trạng giao dịch tại chi nhánh
        </p>
      </div>

      {/* Cards thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {counters.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center hover:shadow-xl transition"
          >
            <div>
              <p className="text-gray-500">{item.title}</p>

              <h2 className="text-4xl font-bold mt-3 text-gray-800">
                {item.value}
              </h2>
            </div>

            <div
              className={`${item.bg} ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Tình trạng quầy */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b flex items-center gap-3">
          <FaStore className="text-blue-600" />

          <h2 className="text-xl font-bold">
            Tình trạng các quầy
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Quầy</th>
              <th className="p-4 text-left">Nhân viên</th>
              <th className="p-4 text-left">Khách hiện tại</th>
              <th className="p-4 text-left">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {countersStatus.map((item) => (
              <tr
                key={item.booth}
                className="border-t hover:bg-blue-50 transition"
              >
                <td className="p-4 font-semibold">{item.booth}</td>

                <td className="p-4">{item.staff}</td>

                <td className="p-4">{item.customer}</td>

                <td className="p-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      item.status === "Đang phục vụ"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Khách chờ + lịch sử */}
      <div className="grid xl:grid-cols-2 gap-6">
        {/* Khách chờ */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b flex items-center gap-3">
            <FaClock className="text-orange-500" />

            <h2 className="text-xl font-bold">
              Danh sách khách đang chờ
            </h2>
          </div>

          {waiting.map((item) => (
            <div
              key={item.id}
              className="p-5 border-b flex justify-between hover:bg-gray-50"
            >
              <div>
                <p className="font-bold text-blue-600">
                  {item.id}
                </p>

                <p>{item.name}</p>
              </div>

              <div className="text-right">
                <p>{item.service}</p>

                <p className="text-sm text-gray-500">
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lịch sử giao dịch */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-5">
            Giao dịch gần đây
          </h2>

          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-3"
              >
                <span>{item}</span>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Hoàn thành
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
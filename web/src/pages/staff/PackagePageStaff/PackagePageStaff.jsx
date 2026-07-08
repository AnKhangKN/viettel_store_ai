import React, { useState } from "react";
import {
  FaFilter,
  FaStar,
  FaSearch,
  FaUser,
  FaPhone,
} from "react-icons/fa";

const PackagePageStaff = () => {
  // =============================
  // Bộ lọc
  // =============================

  const [price, setPrice] = useState("Tất cả");
  const [capacity, setCapacity] = useState("Tất cả");
  const [duration, setDuration] = useState("Tất cả");

  // =============================
  // Khách hàng
  // =============================

  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);

  // popup đăng ký

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // =============================
  // Dữ liệu khách hàng
  // Sau này lấy từ database
  // =============================

  const customers = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      phone: "0988123456",
      currentPackage: "ST70K",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      phone: "0977555666",
      currentPackage: "Không có",
    },
    {
      id: 3,
      name: "Lê Minh Khang",
      phone: "0966111222",
      currentPackage: "V120",
    },
  ];

  // =============================
  // Danh sách gói
  // =============================

  const packages = [
    {
      id: 1,
      name: "D5",
      price: 5000,
      data: 5,
      duration: "Gói ngày",
      description: "Gói data ngắn hạn sử dụng trong ngày",
    },
    {
      id: 2,
      name: "ST60N",
      price: 60000,
      data: 60,
      duration: "Gói tháng",
      description:
        "Gói data phục vụ học tập, mạng xã hội và giải trí",
    },
    {
      id: 3,
      name: "ST90",
      price: 90000,
      data: 90,
      duration: "Gói tháng",
      description:
        "Dung lượng cao cho Youtube, TikTok, học online",
    },
    {
      id: 4,
      name: "V200C",
      price: 200000,
      data: 120,
      duration: "Gói tháng",
      description:
        "Dung lượng lớn kèm ưu đãi gọi nội mạng",
    },
    {
      id: 5,
      name: "Family120",
      price: 120000,
      data: 120,
      duration: "Gói tháng",
      description:
        "Gói data dung lượng cao sử dụng ổn định",
    },
    {
      id: 6,
      name: "DN300",
      price: 300000,
      data: 300,
      duration: "Gói tháng",
      description:
        "Gói dung lượng lớn cho nhu cầu sử dụng cao",
    },
    {
      id: 7,
      name: "YEAR500",
      price: 500000,
      data: 500,
      duration: "Gói năm",
      description:
        "Gói dài hạn tiết kiệm chi phí sử dụng",
    },
  ];

  // =============================
  // Tìm khách hàng
  // =============================

  const searchCustomer = () => {
    const result = customers.find(
      (item) => item.phone === phone
    );

    if (result) {
      setCustomer(result);
    } else {
      setCustomer(null);
      alert("Không tìm thấy khách hàng.");
    }
  };

  // =============================
  // Chọn gói
  // =============================

  const registerPackage = (pkg) => {
    if (!customer) {
      alert("Vui lòng tìm khách hàng trước.");
      return;
    }

    setSelectedPackage(pkg);
    setShowConfirm(true);
  };

  // =============================
  // Xác nhận đăng ký
  // Sau này gọi API
  // =============================

  const confirmRegister = () => {
    alert(
      `Đăng ký thành công gói ${selectedPackage.name} cho ${customer.name}`
    );

    setShowConfirm(false);
    setSelectedPackage(null);
  };

  // =============================
  // Lọc gói cước
  // =============================

  const filteredPackages = packages.filter((pkg) => {
    const checkPrice =
      price === "Tất cả" ||
      (price === "Dưới 100.000đ" &&
        pkg.price < 100000) ||
      (price === "100.000đ - 200.000đ" &&
        pkg.price >= 100000 &&
        pkg.price <= 200000) ||
      (price === "Trên 200.000đ" &&
        pkg.price > 200000);

    const checkCapacity =
      capacity === "Tất cả" ||
      (capacity === "Dưới 50GB" &&
        pkg.data < 50) ||
      (capacity === "50GB - 100GB" &&
        pkg.data >= 50 &&
        pkg.data <= 100) ||
      (capacity === "Trên 100GB" &&
        pkg.data > 100);

    const checkDuration =
      duration === "Tất cả" ||
      pkg.duration === duration;

    return (
      checkPrice &&
      checkCapacity &&
      checkDuration
    );
  });
  return (
  <div className="min-h-screen bg-gray-100 p-6">

    {/* Header */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Đăng ký gói cước
      </h1>

      <p className="text-gray-500 mt-2">
        Nhân viên hỗ trợ khách hàng đăng ký gói cước tại quầy
      </p>
    </div>

    {/* Tìm khách hàng */}
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

      <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
        <FaSearch className="text-red-600" />
        Tìm khách hàng
      </h2>

      <div className="flex gap-4">

        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Nhập số điện thoại..."
          className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
        />

        <button
          onClick={searchCustomer}
          className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-xl transition"
        >
          Tìm kiếm
        </button>

      </div>

      {customer ? (

        <div className="mt-6 border rounded-2xl p-5 bg-red-50">

          <h3 className="font-bold text-red-600 mb-5">
            Thông tin khách hàng
          </h3>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FaUser className="text-red-600" />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Họ tên
                </p>

                <p className="font-semibold">
                  {customer.name}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FaPhone className="text-blue-600" />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Số điện thoại
                </p>

                <p className="font-semibold">
                  {customer.phone}
                </p>

              </div>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Gói hiện tại
              </p>

              <span className="inline-block mt-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
                {customer.currentPackage}
              </span>

            </div>

          </div>

        </div>

      ) : (

        <div className="mt-6 border-2 border-dashed rounded-2xl p-8 text-center text-gray-400">

          Chưa chọn khách hàng

        </div>

      )}

    </div>

    {/* Bộ lọc */}
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

      <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
        <FaFilter />
        Lọc gói cước
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <div>

          <label className="text-sm font-medium">
            💰 Mức giá
          </label>

          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-2 border rounded-xl p-3"
          >
            <option>Tất cả</option>
            <option>Dưới 100.000đ</option>
            <option>100.000đ - 200.000đ</option>
            <option>Trên 200.000đ</option>
          </select>

        </div>

        <div>

          <label className="text-sm font-medium">
            📶 Dung lượng
          </label>

          <select
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full mt-2 border rounded-xl p-3"
          >
            <option>Tất cả</option>
            <option>Dưới 50GB</option>
            <option>50GB - 100GB</option>
            <option>Trên 100GB</option>
          </select>

        </div>

        <div>

          <label className="text-sm font-medium">
            📅 Thời hạn
          </label>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full mt-2 border rounded-xl p-3"
          >
            <option>Tất cả</option>
            <option>Gói ngày</option>
            <option>Gói tháng</option>
            <option>Gói năm</option>
          </select>

        </div>

      </div>

    </div>
        {/* Danh sách gói cước */}
    {filteredPackages.length > 0 ? (

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredPackages.map((pkg) => (

          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
          >

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold text-gray-800">
                {pkg.name}
              </h2>

              <FaStar className="text-yellow-500 text-xl" />

            </div>

            <p className="text-red-600 text-3xl font-bold mt-4">
              {pkg.price.toLocaleString()}đ
            </p>

            <div className="mt-5 space-y-3 text-gray-600">

              <p>
                📶 Dung lượng:
                <span className="font-semibold ml-2">
                  {pkg.data}GB
                </span>
              </p>

              <p>
                📅 Thời hạn:
                <span className="font-semibold ml-2">
                  {pkg.duration}
                </span>
              </p>

            </div>

            <p className="mt-5 text-gray-500 text-sm leading-6">
              {pkg.description}
            </p>

            <button
              onClick={() => registerPackage(pkg)}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Đăng ký gói cước
            </button>

          </div>

        ))}

      </div>

    ) : (

      <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-400">

        Không tìm thấy gói cước phù hợp.

      </div>

    )}

    {/* Popup xác nhận */}
    {showConfirm && selectedPackage && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl w-[500px] p-8">

          <h2 className="text-2xl font-bold text-red-600 mb-6">
            Xác nhận đăng ký
          </h2>

          <div className="space-y-3">

            <p>
              <span className="font-semibold">
                Khách hàng:
              </span>{" "}
              {customer.name}
            </p>

            <p>
              <span className="font-semibold">
                Số điện thoại:
              </span>{" "}
              {customer.phone}
            </p>

            <p>
              <span className="font-semibold">
                Gói cước:
              </span>{" "}
              {selectedPackage.name}
            </p>

            <p>
              <span className="font-semibold">
                Giá:
              </span>{" "}
              {selectedPackage.price.toLocaleString()}đ
            </p>

            <p>
              <span className="font-semibold">
                Dung lượng:
              </span>{" "}
              {selectedPackage.data}GB
            </p>

            <p>
              <span className="font-semibold">
                Thời hạn:
              </span>{" "}
              {selectedPackage.duration}
            </p>

          </div>

          <div className="flex justify-end gap-4 mt-8">

            <button
              onClick={() => setShowConfirm(false)}
              className="px-6 py-2 rounded-xl border hover:bg-gray-100"
            >
              Hủy
            </button>

            <button
              onClick={confirmRegister}
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              Xác nhận
            </button>

          </div>

        </div>

      </div>

    )}

  </div>
);

};

export default PackagePageStaff;
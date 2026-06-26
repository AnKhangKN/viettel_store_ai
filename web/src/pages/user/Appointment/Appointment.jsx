import React, { useState } from "react";

const Appointment = () => {
  const [form, setForm] = useState({
    hoTen: "",
    soDienThoai: "",
    dichVu: "",
  });

  const [result, setResult] = useState(null);

  // Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "soDienThoai") {
      // Chỉ cho nhập số và tối đa 10 ký tự
      const phone = value.replace(/[^0-9]/g, "").slice(0, 10);

      setForm((prev) => ({
        ...prev,
        soDienThoai: phone,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu trống
    if (
      form.hoTen.trim() === "" ||
      form.soDienThoai.trim() === "" ||
      form.dichVu === ""
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Kiểm tra số điện thoại:
    // - Bắt đầu bằng 0
    // - Đúng 10 số
    const phoneRegex = /^0\d{9}$/;

    if (!phoneRegex.test(form.soDienThoai)) {
      alert(
        "Số điện thoại không hợp lệ!\nPhải bắt đầu bằng số 0 và gồm đúng 10 chữ số.",
      );

      // Xóa ô số điện thoại
      setForm((prev) => ({
        ...prev,
        soDienThoai: "",
      }));

      return;
    }
    // Sinh số thứ tự
    const soThuTu =
      "A" + String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");

    // Thời gian dự kiến (5 - 25 phút)
    const thoiGian = Math.floor(Math.random() * 21) + 5;

    setResult({
      soThuTu,
      thoiGian,
    });

    // Reset form
    setForm({
      hoTen: "",
      soDienThoai: "",
      dichVu: "",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "35px",
      }}
    >
      <div
        style={{
          maxWidth: "750px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "12px",
          padding: "35px",
          boxShadow: "0 5px 15px rgba(0,0,0,.08)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#d70018",
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          Đăng ký giao dịch tại quầy
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Vui lòng nhập đầy đủ thông tin để lấy số thứ tự.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: "600",
              }}
            >
              Họ và tên
            </label>

            <input
              type="text"
              name="hoTen"
              value={form.hoTen}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              style={{
                width: "100%",
                height: "48px",
                padding: "0 15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: "600",
              }}
            >
              Số điện thoại
            </label>

            <input
              type="text"
              name="soDienThoai"
              value={form.soDienThoai}
              onChange={handleChange}
              maxLength={10}
              placeholder="Nhập số điện thoại"
              style={{
                width: "100%",
                height: "48px",
                padding: "0 15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          <div style={{ marginBottom: 30 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: "600",
              }}
            >
              Dịch vụ
            </label>

            <select
              name="dichVu"
              value={form.dichVu}
              onChange={handleChange}
              style={{
                width: "100%",
                height: "48px",
                padding: "0 15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            >
              <option value="">-- Chọn dịch vụ --</option>
              <option>Làm lại SIM</option>
              <option>Chuyển đổi chính chủ</option>
              <option>Đăng ký gói cước</option>
              <option>Mua SIM</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              height: "50px",
              background: "#d70018",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Đăng ký
          </button>
        </form>
        {result && (
          <div
            style={{
              marginTop: "35px",
              background: "#fff5f5",
              border: "2px dashed #d70018",
              borderRadius: "12px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                color: "#16a34a",
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              Đăng ký thành công
            </h3>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "25px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  color: "#666",
                  fontSize: "18px",
                  marginBottom: "10px",
                }}
              >
                Số thứ tự
              </div>

              <div
                style={{
                  color: "#d70018",
                  fontSize: "60px",
                  fontWeight: "bold",
                  letterSpacing: "4px",
                }}
              >
                {result.soThuTu}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  fontSize: "18px",
                }}
              >
                Ước tính còn{" "}
                <span
                  style={{
                    color: "#d70018",
                    fontWeight: "700",
                  }}
                >
                  {result.thoiGian} phút
                </span>
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              style={{
                background: "#d70018",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 25px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              Đăng ký mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;

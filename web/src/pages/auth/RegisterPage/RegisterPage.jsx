import React from 'react';

const RegisterPage = () => (
  <div className="auth-wrapper">
    <div className="auth-card">
      <h2 className="auth-title">Đăng Ký Tài Khoản</h2>
      <form>
        <div className="form-group">
          <label>Họ và tên</label>
          <input className="form-input" type="text" placeholder="Nguyễn Văn A" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-input" type="email" placeholder="example@viettel.com.vn" />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input className="form-input" type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="auth-button">Đăng ký ngay</button>
        <div className="auth-footer">
          <span>Đã có tài khoản?</span>
          <a href="/login">Đăng nhập</a>
        </div>
      </form>
    </div>
  </div>
);
export default RegisterPage;
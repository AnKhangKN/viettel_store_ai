import React from 'react';

const LoginPage = () => (
  <div className="auth-wrapper">
    <div className="auth-card">
      <h2 className="auth-title">Đăng Nhập</h2>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input className="form-input" type="email" placeholder="example@viettel.com.vn" />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input className="form-input" type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="auth-button">Đăng nhập</button>
        <div className="auth-footer">
          <a href="/register">Đăng ký</a>
          <a href="/forgot-password">Quên mật khẩu?</a>
        </div>
      </form>
    </div>
  </div>
);

export default LoginPage;
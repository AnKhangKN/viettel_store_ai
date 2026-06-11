import React from 'react';

const ForgetPasswordPage = () => (
  <div className="auth-wrapper">
    <div className="auth-card">
      <h2 className="auth-title">Quên Mật Khẩu</h2>
      <p style={{fontSize: '0.875rem', color: '#666', textAlign: 'center', marginBottom: '1rem'}}>
        Nhập email để nhận hướng dẫn khôi phục.
      </p>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input className="form-input" type="email" placeholder="example@viettel.com.vn" />
        </div>
        <button type="submit" className="auth-button" style={{backgroundColor: '#f59e0b'}}>Gửi yêu cầu</button>
        <div className="auth-footer" style={{justifyContent: 'center'}}>
          <a href="/login">Quay lại đăng nhập</a>
        </div>
      </form>
    </div>
  </div>
);
export default ForgetPasswordPage;
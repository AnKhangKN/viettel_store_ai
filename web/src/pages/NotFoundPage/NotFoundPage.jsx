import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="auth-wrapper" style={{flexDirection: 'column'}}>
    <h1 style={{fontSize: '5rem', fontWeight: 'bold', color: '#1d4ed8'}}>404</h1>
    <p style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Trang không tồn tại!</p>
    <Link to="/" className="auth-button" style={{width: 'auto', padding: '0.5rem 1.5rem'}}>Về trang chủ</Link>
  </div>
);
export default NotFoundPage;
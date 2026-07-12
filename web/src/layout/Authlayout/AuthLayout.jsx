// web/src/pages/auth/authlayout/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
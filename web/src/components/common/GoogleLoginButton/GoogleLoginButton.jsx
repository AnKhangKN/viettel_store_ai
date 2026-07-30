import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError, loading, text = "Đăng nhập bằng Google" }) => {
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (onSuccess) {
        onSuccess(tokenResponse);
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      if (onError) {
        onError(error);
      }
    }
  });

  return (
    <button
      type="button"
      onClick={() => triggerGoogleLogin()}
      disabled={loading}
      className="flex items-center justify-center w-full bg-white border-2 border-gray-200 text-gray-800 font-bold py-3.5 px-4 rounded-2xl shadow-[0_4px_0_#e5e7eb] hover:shadow-[0_6px_0_#d1d5db] hover:-translate-y-0.5 active:shadow-[0_0px_0_#d1d5db] active:translate-y-0.5 hover:border-gray-300 transition-all disabled:opacity-50 cursor-pointer text-base"
    >
      <FcGoogle className="text-2xl mr-3 flex-shrink-0" />
      <span>{loading ? 'Đang xác thực Google...' : text}</span>
    </button>
  );
};

export default GoogleLoginButton;

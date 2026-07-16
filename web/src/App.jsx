import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { routes } from "./routes";
import React, { useEffect, useState } from "react";

import UserLayout from "./layout/UserLayout/UserLayout";
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import StaffLayout from "./layout/StaffLayout/StaffLayout";

import { store } from "./app/store";
import { setCredentials } from "./features/auth/authSlice";
import { refreshToken, getUserInfo } from "./api/shared/aixos.api";

const SplashScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#EE0033] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
    <div className="flex flex-col items-center z-10">
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#EE0033] mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 L 15 85 L 15 50 A 35 35 0 0 1 50 15 Z" />
      </svg>
      <h1 className="text-2xl font-black tracking-tighter text-[#EE0033] uppercase">Viettel Store AI</h1>
      <div className="mt-4 flex gap-2">
        <div className="w-2.5 h-2.5 bg-[#EE0033] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2.5 h-2.5 bg-[#EE0033] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
        <div className="w-2.5 h-2.5 bg-[#EE0033] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  </div>
);

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const publicPaths = ["/", "/login", "/register", "/forgot-password", "/forget-password"];
  const isPublicPath = publicPaths.includes(location.pathname);

  useEffect(() => {
    const initApp = async () => {
      // Nếu đã có accessToken trong Redux (đã đăng nhập), không cần refresh lại
      if (store.getState().auth.accessToken) {
        setIsAuthReady(true);
        return;
      }

      try {
        const res = await refreshToken();

        if (res?.success && res?.data?.accessToken) {
          const accessToken = res.data.accessToken;

          // Dispatch accessToken trước để axiosJWT interceptor có token gửi đi
          store.dispatch(
            setCredentials({
              accessToken,
            })
          );

          // Lấy thông tin user (lúc này Authorization header đã có token)
          const userRes = await getUserInfo();


          if (userRes?.success && userRes?.data) {
            store.dispatch(
              setCredentials({
                accessToken,
                user: userRes.data,
              })
            );
          } else {
            throw new Error("Không lấy được thông tin người dùng");
          }
        } else {
          throw new Error("Refresh token không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi tự động đăng nhập:", error);
        // Chỉ bắt buộc chuyển hướng về trang login nếu đang ở trang bảo mật (private path)
        if (!isPublicPath) {
          navigate("/login");
        }
      } finally {
        setIsAuthReady(true);
      }
    };

    initApp();
  }, [isPublicPath, navigate]);

  if (!isAuthReady) {
    return <SplashScreen />;
  }


  return (
    <Routes>
      {routes.map((route, index) => {
        const Page = route.page;
        let Layout = React.Fragment;

        if (route.isShowUserLayout) Layout = UserLayout;
        if (route.isShowStaffLayout) Layout = StaffLayout;
        if (route.isShowAdminLayout) Layout = AdminLayout;

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Page />
                </React.Suspense>
              </Layout>
            }
          />
        );
      })}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
import React from "react";

export const routes = [
  //   Authentication
  {
    path: "/login",
    name: "Login",
    page: React.lazy(() => import("../pages/auth/LoginPage/LoginPage")),
  },
  {
    path: "/register",
    name: "Register",
    page: React.lazy(() => import("../pages/auth/RegisterPage/RegisterPage")),
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    page: React.lazy(() =>
      import("../pages/auth/ForgotPasswordPage/ForgotPasswordPage")
    ),
  },

  //   User
  {
    path: "/",
    name: "Home",
    page: React.lazy(() => import("../pages/user/HomePage/HomePage")),
    isShowUserLayout: true,
  },
  {
    path: "/about",
    name: "About",
    page: React.lazy(() => import("../pages/user/AboutPage/AboutPage")),
    isShowUserLayout: true,
  },

  //   Admin
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    page: React.lazy(() => import("../pages/admin/DashboardPage/DashboardPage")),
    isShowAdminLayout: true,
  }
];

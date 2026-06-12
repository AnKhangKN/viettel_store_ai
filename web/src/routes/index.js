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
    path: "/forget-password",
    name: "Forget Password",
    page: React.lazy(() =>
      import("../pages/auth/ForgetPasswordPage/ForgetPasswordPage")
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
];
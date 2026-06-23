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
    page: React.lazy(() => import("../pages/auth/ForgotPasswordPage/ForgotPasswordPage")),
  },

  //   User
  {
    path: "/",
    name: "Home",
    page: React.lazy(() => import("../Components/user/HomePage/HomePage")),
    isShowUserLayout: true,
  },

  {
    path: "/package",
    name: "Package",
    page: React.lazy(() => import("../../src/Components/user/PackagePage/PackagePage")),
    isShowUserLayout: true,
  },
  {
    path: "/chatbot",
    name: "Chatbot",
    page: React.lazy(() => import("../../src/Components/user/ChatbotPage/ChatbotPage")),
    isShowUserLayout: true,
  },
  

  //   Admin
];
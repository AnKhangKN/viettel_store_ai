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
    //path: "/register-service",
    //name: "Register Service",
    //page: React.lazy(() => import("../pages/user/RegisterServicePage/RegisterServicePage")),
    //isShowUserLayout: true,
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
    page: React.lazy(() => import("../pages/user/HomePage/HomePage")),
    isShowUserLayout: true,
  },
  {
    path: "/package",
    name: "Package",
    page: React.lazy(() => import("../pages/user/PackagePage/PackagePage")),
    isShowUserLayout: true,
  },
  {
    path: "/chatbot",
    name: "Chatbot",
    page: React.lazy(() => import("../pages/user/ChatbotPage/ChatbotPage")),
    isShowUserLayout: true,
  },
    {
    path: "/appointment",
    name: "Appointment",
    page: React.lazy(() => import("../pages/user/Appointment/Appointment")),
    isShowUserLayout: true,
  },
    {
    path: "/buysim",
    name: "Buy Sim",
    page: React.lazy(() => import("../pages/user/BuySim/BuySim")),
    isShowUserLayout: true,
  },
    {
    path: "/lookup",
    name: "Lookup",
    page: React.lazy(() => import("../pages/user/Lookup/Lookup")),
    isShowUserLayout: true,
  },
    
    
    
  //   Admin
];
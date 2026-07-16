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
  {
    path: "/logout",
    name: "Logout",
    page: React.lazy(() => import("../pages/auth/LogoutPage/LogoutPage")),
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
    path: "/package/:id",
    name: "Package Detail",
    page: React.lazy(() => import("../pages/user/PackageDetailPage/PackageDetailPage")),
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
    path: "/buysim/:id",
    name: "Buy Sim Checkout",
    page: React.lazy(() => import("../pages/user/SimCheckoutPage/SimCheckoutPage")),
    isShowUserLayout: true,
  },
  {
    path: "/lookup",
    name: "Lookup",
    page: React.lazy(() => import("../pages/user/Lookup/Lookup")),
    isShowUserLayout: true,
  },
  {
    path: "/mobile-services",
    name: "Mobile Services",
    page: React.lazy(() => import("../pages/user/MobileServicesPage/MobileServicesPage")),
    isShowUserLayout: true,
  },
  {
    path: "/mobile-services/:id",
    name: "Mobile Services Detail",
    page: React.lazy(() => import("../pages/user/MobileServiceDetailPage/MobileServiceDetailPage")),
    isShowUserLayout: true,
  },
  {
    path: "/payment",
    name: "Payment",
    page: React.lazy(() => import("../pages/user/PaymentPage/PaymentPage")),
    isShowUserLayout: true,
  },
  {
    path: "/support",
    name: "Support",
    page: React.lazy(() => import("../pages/user/SupportPage/SupportPage")),
    isShowUserLayout: true,
  },
  {
    path: "/news",
    name: "News",
    page: React.lazy(() => import("../pages/user/NewsPage/NewsPage")),
    isShowUserLayout: true,
  },
  {
    path: "/news/:id",
    name: "News Detail",
    page: React.lazy(() => import("../pages/user/NewsDetailPage/NewsDetailPage")),
    isShowUserLayout: true,
  },
  {
    path: "/store-locator",
    name: "Store Locator",
    page: React.lazy(() => import("../pages/user/StoreLocatorPage/StoreLocatorPage")),
    isShowUserLayout: true,
  },

  //   Admin
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    page: React.lazy(() => import("../pages/admin/DashboardPageAdmin/DashboardPageAdmin")),
    isShowAdminLayout: true,
  },
  {
    path: "/admin/packages",
    name: "Package",
    page: React.lazy(() => import("../pages/admin/PackagePageAdmin/PackagePageAdmin")),
    isShowAdminLayout: true,
  },
  {
    path: "/admin/sims",
    name: "Sim",
    page: React.lazy(() => import("../pages/admin/SimPageAdmin/SimPageAdmin")),
    isShowAdminLayout: true,
  },
  {
    path: "/admin/sim-types",
    name: "SimType",
    page: React.lazy(() => import("../pages/admin/SimTypePageAdmin/SimTypePageAdmin")),
    isShowAdminLayout: true,
  },

  {
    path: "/admin/users",
    name: "User",
    page: React.lazy(() => import("../pages/admin/UserPageAdmin/UserPageAdmin")),
    isShowAdminLayout: true,
  },
  {
    path: "/admin/stores",
    name: "Branch",
    page: React.lazy(() => import("../pages/admin/BranchPageAdmin/BranchPageAdmin")),
    isShowAdminLayout: true,
  },
  {
    path: "/admin/counter-services",
    name: "CounterServices",
    page: React.lazy(() => import("../pages/admin/CounterServicesPageAdmin/CounterServicesPageAdmin")),
    isShowAdminLayout: true,
  },

  {
    path: "/admin/settings",
    name: "Setting",
    page: React.lazy(() => import("../pages/admin/SettingPageAdmin/SettingPageAdmin")),
    isShowAdminLayout: true,
  },

  //  Staff
  {
    path: "/staff/dashboard",
    name: "Dashboard",
    page: React.lazy(() => import("../pages/staff/DashboardPageStaff/DashboardPageStaff")),
    isShowStaffLayout: true,
  },
  {
    path: "/staff/waiting-list",
    name: "Waiting List",
    page: React.lazy(() => import("../pages/staff/WaitingListStaff/WaitingListStaff")),
    isShowStaffLayout: true,
  }

];
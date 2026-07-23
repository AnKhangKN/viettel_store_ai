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
    path: "/profile",
    name: "User Profile",
    page: React.lazy(() => import("../pages/user/UserProfilePage/UserProfilePage")),
    isShowUserLayout: true,
  },
  {
    path: "/package",
    name: "Package",
    page: React.lazy(() => import("../pages/user/PackagePage/PackagePage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/package/:id",
    name: "Package Detail",
    page: React.lazy(() => import("../pages/user/PackageDetailPage/PackageDetailPage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/chatbot",
    name: "Chatbot",
    page: React.lazy(() => import("../pages/user/ChatbotPage/ChatbotPage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/appointment",
    name: "Appointment",
    page: React.lazy(() => import("../pages/user/Appointment/Appointment")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/buysim",
    name: "Buy Sim",
    page: React.lazy(() => import("../pages/user/BuySim/BuySim")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/buysim/:id",
    name: "Buy Sim Checkout",
    page: React.lazy(() => import("../pages/user/SimCheckoutPage/SimCheckoutPage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/lookup",
    name: "Lookup",
    page: React.lazy(() => import("../pages/user/Lookup/Lookup")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/mobile-services",
    name: "Mobile Services",
    page: React.lazy(() => import("../pages/user/MobileServicesPage/MobileServicesPage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/mobile-services/:id",
    name: "Mobile Services Detail",
    page: React.lazy(() => import("../pages/user/MobileServiceDetailPage/MobileServiceDetailPage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/payment",
    name: "Payment",
    page: React.lazy(() => import("../pages/user/PaymentPage/PaymentPage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/payment/vnpay-return",
    name: "VNPay Return",
    page: React.lazy(() => import("../pages/user/VNPayReturnPage/VNPayReturnPage")),
    isShowUserLayout: true,
  },
  {
    path: "/support",
    name: "Support",
    page: React.lazy(() => import("../pages/user/SupportPage/SupportPage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/news",
    name: "News",
    page: React.lazy(() => import("../pages/user/NewsPage/NewsPage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/news/:id",
    name: "News Detail",
    page: React.lazy(() => import("../pages/user/NewsDetailPage/NewsDetailPage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },
  {
    path: "/store-locator",
    name: "Store Locator",
    page: React.lazy(() => import("../pages/user/StoreLocatorPage/StoreLocatorPage")),
    isShowUserLayout: true,
    requiredRole: "user",
  },

  //   Admin
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    page: React.lazy(() => import("../pages/admin/DashboardPageAdmin/DashboardPageAdmin")),
    isShowAdminLayout: true,
    requiredRole: "admin",
  },
  {
    path: "/admin/packages",
    name: "Package",
    page: React.lazy(() => import("../pages/admin/PackagePageAdmin/PackagePageAdmin")),
    isShowAdminLayout: true,
    requiredRole: "admin",
  },
  {
    path: "/admin/sims",
    name: "Sim",
    page: React.lazy(() => import("../pages/admin/SimPageAdmin/SimPageAdmin")),
    isShowAdminLayout: true,
    requiredRole: "admin",
  },
  {
    path: "/admin/sim-types",
    name: "SimType",
    page: React.lazy(() => import("../pages/admin/SimTypePageAdmin/SimTypePageAdmin")),
    isShowAdminLayout: true,
    requiredRole: "admin",
  },

  {
    path: "/admin/users",
    name: "User",
    page: React.lazy(() => import("../pages/admin/UserPageAdmin/UserPageAdmin")),
    isShowAdminLayout: true,
    requiredRole: "admin",
  },
  {
    path: "/admin/stores",
    name: "Branch",
    page: React.lazy(() => import("../pages/admin/BranchPageAdmin/BranchPageAdmin")),
    isShowAdminLayout: true,
    requiredRole: "admin",
  },
  {
    path: "/admin/counter-services",
    name: "CounterServices",
    page: React.lazy(() => import("../pages/admin/CounterServicesPageAdmin/CounterServicesPageAdmin")),
    isShowAdminLayout: true,
    requiredRole: "admin",
  },
  {
    path: "/admin/booths",
    name: "BoothsAdmin",
    page: React.lazy(() => import("../pages/admin/BoothPageAdmin/BoothPageAdmin")),
    isShowAdminLayout: true,
    requiredRole: "admin",
  },

  {
    path: "/admin/settings",
    name: "Setting",
    page: React.lazy(() => import("../pages/admin/SettingPageAdmin/SettingPageAdmin")),
    isShowAdminLayout: true,
    requiredRole: "admin",
  },

  //  Staff
  {
    path: "/staff/dashboard",
    name: "Dashboard",
    page: React.lazy(() => import("../pages/staff/DashboardPageStaff/DashboardPageStaff")),
    isShowStaffLayout: true,
    requiredRole: "staff",
  },
  {
    path: "/staff/waiting-list",
    name: "Waiting List",
    page: React.lazy(() => import("../pages/staff/WaitingListStaff/WaitingListStaff")),
    isShowStaffLayout: true,
    requiredRole: "staff",
  },
  {
    path: "/staff/sim-orders",
    name: "Sim Orders Staff",
    page: React.lazy(() => import("../pages/staff/SimOrdersStaff/SimOrdersStaff")),
    isShowStaffLayout: true,
    requiredRole: "staff",
  },
  {
    path: "/staff/sim",
    name: "Sim Staff",
    page: React.lazy(() => import("../pages/staff/SimOrdersStaff/SimOrdersStaff")),
    isShowStaffLayout: true,
    requiredRole: "staff",
  },
  {
    path: "/staff/profile",
    name: "Staff Profile",
    page: React.lazy(() => import("../pages/staff/StaffProfilePage/StaffProfilePage")),
    isShowStaffLayout: true,
    requiredRole: "staff",
  },
  {
    path: "/staff/customer",
    name: "Customer Staff",
    page: React.lazy(() => import("../pages/staff/CustomerPageStaff/CustomerPageStaff")),
    isShowStaffLayout: true,
    requiredRole: "staff",
  }
];

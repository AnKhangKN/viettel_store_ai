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
    path: "/register-package/:id",
    name: "Register Package",
    page: React.lazy(() => import("../pages/user/RegisterPackagePage/RegisterPackagePage")),
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
    path: "/roaming",
    name: "Roaming",
    page: React.lazy(() => import("../pages/user/RoamingPage/RoamingPage")),
    isShowUserLayout: true,
  },
  {
    path: "/vas",
    name: "VAS",
    page: React.lazy(() => import("../pages/user/VasPage/VasPage")),
    isShowUserLayout: true,
  },
  {
    path: "/vas/imuzik",
    name: "Imuzik",
    page: React.lazy(() => import("../pages/user/ImuzikPage/ImuzikPage")),
    isShowUserLayout: true,
  },
  {
    path: "/vas/mca",
    name: "MCA",
    page: React.lazy(() => import("../pages/user/McaPage/McaPage")),
    isShowUserLayout: true,
  },
  {
    path: "/vas/signature",
    name: "Call Signature",
    page: React.lazy(() => import("../pages/user/CallSignaturePage/CallSignaturePage")),
    isShowUserLayout: true,
  },
  {
    path: "/vas/security",
    name: "Device Security",
    page: React.lazy(() => import("../pages/user/DeviceSecurityPage/DeviceSecurityPage")),
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
    path: "/admin",
    name: "Admin",
    page: React.lazy(() => import("../pages/admin/DashboardPage/DashboardPage")),
    isShowAdminLayout: true,
  },
  {
    path: "/admin/new",
    name: "New Page",
    page: React.lazy(() => import("../pages/admin/NewPage/NewPage")),
    isShowAdminLayout: true,
  },
  
  //  Staff
   {
    path: "/staff",
    name: "Staff",
    page: React.lazy(() => import("../pages/staff/DashboardPage/DashboardPage")),
    isShowStaffLayout: true,
  },
  {
    path: "/staff/waiting-list",
    name: "Waiting List",
    page: React.lazy(() => import("../pages/staff/WaitingList/WaitingList")),
    isShowStaffLayout: true,
  },
  {
    path: "/staff/package",
    name: "Package",
    page: React.lazy(() => import("../pages/staff/PackagePageStaff/PackagePageStaff")),
    isShowStaffLayout: true,
  }

];
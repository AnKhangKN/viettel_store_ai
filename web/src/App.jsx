import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { routes } from "./routes";
import React from "react";

import UserLayout from "./layout/UserLayout/UserLayout";
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import StaffLayout from "./layout/StaffLayout/StaffLayout";

function App() {
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
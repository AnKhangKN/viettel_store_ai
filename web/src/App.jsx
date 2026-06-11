import React from "react";
import { Routes, Route } from "react-router-dom";

import { routes } from "./routes";
import UserLayout from "./layout/UserLayout/UserLayout";
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

function App() {
  return (
      <Routes>
        {routes.map((route, index) => {
          const Page = route.page;

          let Layout = React.Fragment;

          if (route.isShowUserLayout) {
            Layout = UserLayout;
          }

          if (route.isShowAdminLayout) {
            Layout = AdminLayout;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
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
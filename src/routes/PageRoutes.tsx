import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import MainLayout from "../pages/MainLayout";
import Dashboard from "../pages/Dashboard";
import Places from "../pages/Places";

const PageRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute component={MainLayout} />}>
          <Route index element={<Dashboard />} />
          <Route path="/places" element={<Places />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default PageRoutes;

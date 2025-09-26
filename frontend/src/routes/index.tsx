import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import BoardPage from "../pages/BoardPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import Dashboard from "../pages/Dashboard";

function Router() {
  return (
    <Routes>
      {/* Protected Routes - Cần đăng nhập */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      >
        {/* Dashboard - Trang chủ */}
        <Route index element={<Dashboard />} />

        {/* Boards - Quản lý dự án */}
        <Route path="board/:boardId" element={<BoardPage />} />

        {/* Profile - Hồ sơ cá nhân */}
        <Route path="profile" element={<ProfilePage />} />

        {/* Homepage - Trang chủ */}
        <Route path="home" element={<HomePage />} />
      </Route>

      {/* Public Routes - Không cần đăng nhập */}
      <Route path="/auth">
        <Route
          path="login"
          element={
            <PublicRoute redirectTo="/">
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute redirectTo="/">
              <RegisterPage />
            </PublicRoute>
          }
        />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default Router;

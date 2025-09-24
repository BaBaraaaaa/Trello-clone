import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import BoardPage from "../pages/BoardPage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

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
        <Route index element={<HomePage />} />
        <Route path="board/:boardId" element={<BoardPage />} />
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

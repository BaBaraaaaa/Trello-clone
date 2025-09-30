import { Routes, Route } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

// Pages
import Dashboard from "../pages/Dashboard";
import BoardPage from "../pages/BoardPage";
import ProfilePage from "../pages/ProfilePage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

function Router() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      >
        {/* Default and alias routes for Dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="board/:boardId" element={<BoardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="home" element={<HomePage />} />
      </Route>

      {/* Public Routes */}
      <Route
        path="/auth/login"
        element={
          <PublicRoute redirectTo="/">
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute redirectTo="/">
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default Router;

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";
import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const PublicRoute = ({ children, redirectTo = "/" }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Redirect về dashboard nếu đã đăng nhập
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render children nếu chưa đăng nhập (cho phép truy cập public routes)
  return <>{children}</>;
};

export default PublicRoute;
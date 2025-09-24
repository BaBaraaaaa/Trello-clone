import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PublicRouteProps {
    restricted?: boolean; // Nếu restricted=true, chuyển hướng nếu đã đăng nhập
    redirectTo?: string;  // Đường dẫn chuyển hướng nếu đã đăng nhập
    isAuthenticated?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
    restricted = false,
    redirectTo = '/',
    isAuthenticated = false,
}) => {
    if (restricted && isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }
    return <Outlet />;
};

export default PublicRoute;
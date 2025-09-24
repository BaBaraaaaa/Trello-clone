import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center'
    }}>
        <h1>404</h1>
        <p>Trang bạn tìm kiếm không tồn tại.</p>
        <Link to="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>
            Quay về trang chủ
        </Link>
    </div>
);

export default NotFoundPage;
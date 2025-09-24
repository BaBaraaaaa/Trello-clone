import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0079bf 0%, #5067c5 100%)',
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                    padding: '40px 32px',
                    minWidth: 350,
                    maxWidth: 400,
                    width: '100%',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <img
                        src="/trello-logo.svg"
                        alt="Trello"
                        style={{ height: 48, marginBottom: 8 }}
                    />
                    <h2 style={{ margin: 0, color: '#0079bf' }}>Đăng nhập Trello</h2>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
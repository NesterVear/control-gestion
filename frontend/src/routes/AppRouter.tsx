import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { LoginModal } from '../features/auth/LoginModal';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
    } else {
      setLoginModalOpen(false);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    navigate('/dashboard');
  };

  return (
    <>
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <></>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRoles={["Administrador", "SuperRoot"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Otras rutas */}
      </Routes>
    </>
  );
};

export default AppRouter;
import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { LoginModal } from '../features/auth/LoginModal';
import Dashboard from '../pages/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';

const AppRouter: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(true);
  const navigate = useNavigate();

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
          path="/dashboard"
          element={
            <ProtectedRoute requiredRoles={['Administrador', 'SuperRoot']}>
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
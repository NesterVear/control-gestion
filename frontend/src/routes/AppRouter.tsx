
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/Layout';
import  Login  from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { CapturasList } from '../features/capturas/CapturasList';
import { CapturaForm } from '../features/capturas/CapturaForm';
import { DirectorioExternoList } from '../features/directorioExterno/DirectorioExternoList';
import { UsuariosList } from '../features/usuarios/UsuariosList';
import { TestAlertas } from '../pages/TestAlertas';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/capturas"
          element={
            <ProtectedRoute requiredRoles={['Lector', 'Capturista', 'Administrador', 'SuperRoot']}>
              <MainLayout>
                <CapturasList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/capturas/nueva"
          element={
            <ProtectedRoute requiredRoles={['Capturista', 'Administrador', 'SuperRoot']}>
              <MainLayout>
                <CapturaForm />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/capturas/:folio"
          element={
            <ProtectedRoute requiredRoles={['Capturista', 'Administrador', 'SuperRoot']}>
              <MainLayout>
                <CapturaForm />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/directorio-externo"
          element={
            <ProtectedRoute requiredRoles={['Lector', 'Capturista', 'Administrador', 'SuperRoot']}>
              <MainLayout>
                <DirectorioExternoList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute requiredRoles={['SuperRoot']}>
              <MainLayout>
                <UsuariosList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/test-alertas"
          element={
            <ProtectedRoute requiredRoles={['Administrador', 'SuperRoot']}>
              <MainLayout>
                <TestAlertas />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

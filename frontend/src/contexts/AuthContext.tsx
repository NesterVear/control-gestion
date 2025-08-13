
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import type { Usuario, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing session on app load
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    if (userId && userRole && userName) {
      setUser({
        id: parseInt(userId),
        usuario: userName,
        rol: userRole as Usuario['rol'],
      });
    }
    setLoading(false);
  }, []);

  const login = async (usuario: string, contrasena: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.login(usuario, contrasena);
      
      const userData: Usuario = {
        id: response.id,
        usuario,
        rol: response.rol as Usuario['rol'],
      };

      setUser(userData);
      localStorage.setItem('userId', response.id.toString());
      localStorage.setItem('userRole', response.rol);
      localStorage.setItem('userName', usuario);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

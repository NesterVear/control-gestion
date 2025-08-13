import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { TextField, Button, Paper, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { authService } from '../services/api'; // Ajusta la ruta si es necesario
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface BearLoginProps {
  onSuccess?: () => void;
}

const BearLogin: React.FC<BearLoginProps> = ({ onSuccess }) => {
  const [usuario, setUsuario] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [pwdFocus, setPwdFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // Eye tracking solo en usuario
  const eyeOffset = Math.min(usuario.length * 1.2, 12);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await authService.login(usuario, contrasena);
      localStorage.setItem('userId', String(res.id));
      localStorage.setItem('userRole', res.rol);
      setUser?.({ id: res.id, usuario, rol: res.rol });
      setMessage('¡Ingreso exitoso!');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      const apiMsg = err?.response?.data?.error || 'Usuario o contraseña incorrectos.';
      setMessage(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: 16,
      }}
    >
      {/* Mantén tus estilos CSS aquí o en un archivo separado */}
      <style>{`/* (tu CSS del oso tal cual) */`}</style>

      <Paper className={`bear-login-card ${pwdFocus ? 'eyes-covered' : ''}`} elevation={0}>
        <div className="bear-container">
          <div className="polar-bear">
            <div className="bear-ear left"><div className="inner" /></div>
            <div className="bear-ear right"><div className="inner" /></div>

            <div className="bear-head">
              <div className="bear-eye left" style={{ transform: `translateX(${-eyeOffset}px)` }} />
              <div className="bear-eye right" style={{ transform: `translateX(${eyeOffset}px)` }} />
              <div className="bear-muzzle">
                <div className="bear-nose" />
                <div className="bear-smile" />
              </div>
              <div className="bear-paw left">
                <div className="paw-pad p1" />
                <div className="paw-pad p2" />
                <div className="paw-pad p3" />
              </div>
              <div className="bear-paw right">
                <div className="paw-pad p1" />
                <div className="paw-pad p2" />
                <div className="paw-pad p3" />
              </div>
            </div>
          </div>

          <Typography variant="h5" className="login-header">Iniciar sesión</Typography>
          <Typography variant="body2" className="login-subtitle">Una experiencia divertida y elegante</Typography>
        </div>

        <Box component="form" onSubmit={onSubmit} className="login-form">
          <Box className="bear-textfield">
            <TextField
              fullWidth
              label="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onFocus={() => setPwdFocus(false)}
              variant="outlined"
              autoComplete="username"
              aria-label="Nombre de usuario"
            />
          </Box>

          <Box className="bear-textfield">
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              variant="outlined"
              autoComplete="current-password"
              aria-label="Contraseña"
            />
          </Box>

          <Button type="submit" fullWidth variant="contained" disabled={loading} className="login-button" aria-label="Iniciar sesión">
            {loading ? <CircularProgress size={22} style={{ color: 'inherit' }} /> : 'Entrar'}
          </Button>

          {message && (
            <Alert severity={message.includes('exitoso') ? 'success' : 'error'} className={`bear-alert ${message.includes('exitoso') ? 'success' : 'error'}`}>
              {message}
            </Alert>
          )}

          <Typography variant="caption" className="bear-tip">
            💡 Consejo: enfoca el campo de contraseña para ver cómo el osito se cubre los ojos
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default BearLogin;
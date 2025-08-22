// src/pages/Login.tsx
import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import './LoginStyles.css'; // ¡Aquí importas tu archivo CSS!

interface BearLoginProps {
  onSuccess?: () => void;
}

const BearLogin: React.FC<BearLoginProps> = ({ onSuccess }) => {
  const [usuario, setUsuario] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [pwdFocus, setPwdFocus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { login, loading } = useAuth();

  const eyeOffset = Math.min(usuario.length * 2.0, 12);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const success = await login(usuario, contrasena);

    if (success) {
      setMessage('¡Ingreso exitoso!');
      if (onSuccess) onSuccess();
    } else {
      setMessage('Usuario o contraseña incorrectos.');
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
      {/* Ya no necesitas la etiqueta <style> aquí */}

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
        </Box>
      </Paper>
    </div>
  );
};

export default BearLogin;
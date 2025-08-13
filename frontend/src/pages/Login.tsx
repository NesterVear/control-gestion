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
<style>{`
  .bear-login-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
    width: 320px;
    box-sizing: border-box;
    color: white;
    user-select: none;
    position: relative;
  }

  .bear-container {
    text-align: center;
    margin-bottom: 16px;
  }

  .polar-bear {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 16px;
  }

  .bear-ear {
    position: absolute;
    top: 0;
    width: 30px;
    height: 30px;
    background: white;
    border-radius: 50%;
    box-shadow: inset -4px -4px 6px rgba(0,0,0,0.1);
  }

  .bear-ear.left {
    left: 0;
  }

  .bear-ear.right {
    right: 0;
  }

  .bear-ear .inner {
    width: 16px;
    height: 16px;
    background: #ccc;
    border-radius: 50%;
    margin: 7px auto 0;
  }

  .bear-head {
    position: relative;
    width: 100px;
    height: 100px;
    background: white;
    border-radius: 50%;
    margin: 0 auto;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    overflow: visible;
  }

  .bear-eye {
    position: absolute;
    top: 35px;
    width: 18px;
    height: 18px;
    background: black;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  .bear-eye.left {
    left: 20px;
  }

  .bear-eye.right {
    right: 20px;
  }

  .bear-muzzle {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 40px;
    background: #eee;
    border-radius: 40px / 30px;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }

  .bear-nose {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 14px;
    height: 10px;
    background: black;
    border-radius: 50% / 40%;
  }

  .bear-smile {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 10px;
    border-bottom: 2px solid black;
    border-radius: 0 0 20px 20px;
  }

  .bear-paw {
    position: absolute;
    bottom: 0;
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    transition: transform 0.3s ease;
  }

  .bear-paw.left {
    left: 10px;
  }

  .bear-paw.right {
    right: 10px;
  }

  .paw-pad {
    position: absolute;
    background: #ccc;
    border-radius: 50%;
  }

  .paw-pad.p1 {
    width: 12px;
    height: 12px;
    top: 10px;
    left: 8px;
  }

  .paw-pad.p2 {
    width: 10px;
    height: 10px;
    top: 18px;
    left: 20px;
  }

  .paw-pad.p3 {
    width: 8px;
    height: 8px;
    top: 28px;
    left: 12px;
  }

  /* Animación para cubrir ojos */
  .bear-login-card.eyes-covered .bear-paw.left {
    transform: translate(30px, -40px) rotate(20deg);
  }

  .bear-login-card.eyes-covered .bear-paw.right {
    transform: translate(-30px, -40px) rotate(-20deg);
  }
`}</style> */

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
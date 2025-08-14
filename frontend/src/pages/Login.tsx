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
  const eyeOffset = Math.min(usuario.length * 2.0, 12);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await authService.login(usuario, contrasena);
      localStorage.setItem('userId', String(res.id));
      localStorage.setItem('userRole', res.rol);

      setUser?.({ id: res.id, usuario, rol: res.rol as "Lector" | "Capturista" | "Administrador" | "SuperRoot" });

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
        :root {
          --md-surface: #111111;
          --md-surface-variant: #1a1a1a;
          --md-primary: #1976d2;
          --md-on-surface: #ffffff;
          --md-on-surface-variant: #9e9e9e;
          --md-outline: #333333;
          --md-outline-variant: #2a2a2a;
        }

        /* Bear animations - GPU optimized */
        @keyframes bear-blink { 
          0%, 96%, 100% { transform: scaleY(1); } 
          98% { transform: scaleY(0.1); } 
        }
        @keyframes bear-bob { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-4px); } 
        }
        @keyframes bear-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-2px) scale(1.01); }
        }

        /* Compact card styles */
        .bear-login-card { 
          background: var(--md-surface);
          border: 1px solid var(--md-outline-variant);
          border-radius: 20px;
          max-width: 300px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          position: relative;
        }

        /* Bear container - more prominent, integrated design */
        .bear-container { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          padding: 16px 16px 8px;
          position: relative;
        }

        .polar-bear { 
          width: 260px; 
          height: 260px; 
          position: relative; 
          animation: bear-float 8s ease-in-out infinite;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }

        /* IMPROVED EARS - Larger, more integrated, cuter */
        .bear-ear { 
          width: 75px; 
          height: 75px; 
          background: #ffffff; 
          border: 5px solid #000000; 
          border-radius: 50%; 
          position: absolute; 
          top: 5px; 
          z-index: 2;
          box-shadow: inset 0 -6px 0 rgba(0,0,0,0.08);
        }
        .bear-ear.left { left: 35px; transform: rotate(-20deg); }
        .bear-ear.right { right: 35px; transform: rotate(20deg); }
        
        .bear-ear .inner { 
          width: 36px; 
          height: 36px; 
          background: #ff69b4; 
          border-radius: 50%; 
          position: absolute; 
          top: 18px; 
          left: 50%; 
          transform: translateX(-50%);
          border: 2px solid #000;
        }

        /* Bear head - better proportioned */
        .bear-head { 
          position: absolute; 
          left: 50%; 
          top: 42px; 
          transform: translateX(-50%); 
          width: 170px; 
          height: 155px; 
          background: #ffffff; 
          border: 5px solid #000000; 
          border-radius: 60% 60% 50% 50%; 
          box-shadow: inset 0 -8px 0 rgba(0,0,0,0.06);
          z-index: 1;
        }

        /* Eyes with smooth tracking */
        .bear-eye { 
          width: 30px; 
          height: 30px; 
          background: #111111; 
          border-radius: 50%; 
          position: absolute; 
          top: 33px; 
          z-index: 3; 
          animation: bear-blink 7s infinite;
          display: flex; 
          align-items: center; 
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        .bear-eye::after { 
          content: ""; 
          width: 12px; 
          height: 12px; 
          background: #ffffff; 
          border-radius: 50%; 
          position: relative;
          top: -1px;
        }
        .bear-eye.left { left: 48px; }
        .bear-eye.right { right: 48px; }

        /* Snout area */
        .bear-muzzle { 
          position: absolute; 
          left: 50%; 
          bottom: 14px; 
          transform: translateX(-50%); 
          width: 100px; 
          height: 72px; 
          background: #ffffff; 
          border: 4px solid #000000; 
          border-radius: 40px;
          box-shadow: inset 0 -4px 0 rgba(0,0,0,0.06);
        }
        .bear-nose { 
          position: absolute; 
          left: 50%; 
          top: 4px; 
          transform: translateX(-50%); 
          width: 22px; 
          height: 18px; 
          background: #111111; 
          border-radius: 12px 12px 8px 8px; 
        }
        .bear-smile { 
          position: absolute; 
          left: 50%; 
          top: 26px; 
          transform: translateX(-50%); 
          width: 42px; 
          height: 20px; 
          border-bottom: 4px solid #111111; 
          border-radius: 0 0 42px 42px; 
        }

        /* Paws with smooth animations */
        .bear-paw { 
          position: absolute; 
          width: 80px; 
          height: 80px; 
          background: #ffffff; 
          border: 5px solid #000000; 
          border-radius: 50%; 
          z-index: 20; 
          top: 120px; 
          transition: all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: inset 0 -4px rgba(0,0,0,0.08);
        }
        .bear-paw.left { left: 0px; }
        .bear-paw.right { right: 0px; }
        
        .paw-pad { 
          position: absolute; 
          width: 14px; 
          height: 14px; 
          background: #e0e0e0; 
          border: 2px solid #000000; 
          border-radius: 50%; 
        }
        .paw-pad.p1 { left: 12px; top: 18px; }
        .paw-pad.p2 { right: 12px; top: 18px; }
        .paw-pad.p3 { left: 50%; transform: translateX(-50%); top: 8px; }

        /* Eyes covered animation - only for password field */
        .bear-login-card.eyes-covered .bear-paw.left { 
          left: 0px; 
          top: 40px; 
          transform: translate(68px, -8px) rotate(-12deg); 
        }
        .bear-login-card.eyes-covered .bear-paw.right { 
          right: 0px; 
          top: 40px; 
          transform: translate(-68px, -8px) rotate(12deg); 
        }
        .bear-login-card.eyes-covered .bear-eye { 
          transform: scaleY(0.1); 
        }

        /* Compact header */
        .login-header { 
          color: var(--md-on-surface); 
          font-weight: 300; 
          margin: 8px 0 4px; 
          font-size: 1.5rem;
        }
        .login-subtitle { 
          color: var(--md-on-surface-variant); 
          font-size: 13px; 
          margin-bottom: 16px;
        }

        /* Form styles - no separation */
        .login-form {
          padding: 0 20px 20px;
        }

        /* Material Design TextField improvements */
        .bear-textfield {
          margin-bottom: 16px;
        }
        
        .bear-textfield .MuiOutlinedInput-root {
          background: var(--md-surface-variant);
          border-radius: 12px;
          color: var(--md-on-surface);
        }
        
        .bear-textfield .MuiOutlinedInput-root fieldset {
          border-color: var(--md-outline);
        }
        
        .bear-textfield .MuiOutlinedInput-root:hover fieldset {
          border-color: var(--md-outline-variant);
        }
        
        .bear-textfield .MuiOutlinedInput-root.Mui-focused fieldset {
          border-color: var(--md-primary);
          border-width: 2px;
        }
        
        .bear-textfield .MuiInputLabel-root {
          color: var(--md-on-surface-variant);
        }
        
        .bear-textfield .MuiInputLabel-root.Mui-focused {
          color: var(--md-primary);
        }

        /* Enhanced login button */
        .login-button {
          background: var(--md-primary) !important;
          color: var(--md-on-surface) !important;
          padding: 14px !important;
          border-radius: 12px !important;
          text-transform: none !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
          transition: all 0.2s ease !important;
        }
        
        .login-button:hover {
          background: #1565c0 !important;
          box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4) !important;
          transform: translateY(-1px);
        }
        
        .login-button:disabled {
          background: var(--md-outline) !important;
          box-shadow: none !important;
          transform: none !important;
        }

        /* Alert improvements */
        .bear-alert {
          margin-top: 16px;
          border-radius: 8px;
        }
        
        .bear-alert.success {
          background-color: #1b5e20 !important;
          color: var(--md-on-surface) !important;
        }
        
        .bear-alert.error {
          background-color: #d32f2f !important;
          color: var(--md-on-surface) !important;
        }

        /* Helpful tip */
        .bear-tip {
          color: #808080;
          font-size: 12px;
          text-align: center;
          margin-top: 12px;
          padding: 8px;
          opacity: 0.8;
        }
      `}</style>

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
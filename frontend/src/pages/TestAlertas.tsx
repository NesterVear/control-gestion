
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { NotificationImportant, Send } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { capturaService } from '../services/api';

export const TestAlertas: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleTestAlertas = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const response = await capturaService.testAlertas();
      setMessage(response.mensaje);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al probar alertas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Test de Alertas
          <NotificationImportant sx={{ ml: 1, verticalAlign: 'middle' }} />
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Prueba el sistema de notificaciones de alertas para capturas pendientes.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ maxWidth: 600 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '4rem', mb: 2 }}>
                🔔
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Verificar Alertas de Capturas
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Este botón ejecutará el sistema de alertas manualmente para verificar
                capturas pendientes y enviar notificaciones por correo.
              </Typography>

              {message && (
                <Alert severity="success" sx={{ mb: 2, textAlign: 'left' }}>
                  {message}
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                onClick={handleTestAlertas}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Enviando...' : 'Ejecutar Test de Alertas'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

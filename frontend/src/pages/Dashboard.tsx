
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Description,
  Contacts,
  CheckCircle,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { capturaService, directorioExternoService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Captura, DirectorioExterno } from '../types';

interface DashboardStats {
  totalCapturas: number;
  capturasCompletadas: number;
  capturasPendientes: number;
  totalDirectorios: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCapturas: 0,
    capturasCompletadas: 0,
    capturasPendientes: 0,
    totalDirectorios: 0,
  });
  const [recentCapturas, setRecentCapturas] = useState<Captura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [capturas, directorios] = await Promise.all([
        capturaService.getCapturas(),
        directorioExternoService.getDirectorios(),
      ]);

      const completadas = capturas.filter(c => c.completado).length;
      const pendientes = capturas.filter(c => !c.completado).length;

      setStats({
        totalCapturas: capturas.length,
        capturasCompletadas: completadas,
        capturasPendientes: pendientes,
        totalDirectorios: directorios.length,
      });

      // Get recent capturas (last 5)
      const recent = capturas
        .sort((a, b) => b.folio_acaac - a.folio_acaac)
        .slice(0, 5);
      setRecentCapturas(recent);
    } catch (err) {
      setError('Error loading dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    delay: number;
  }> = ({ title, value, icon, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                backgroundColor: `${color}.main`,
                color: 'white',
                borderRadius: '50%',
                p: 1,
                mr: 2,
              }}
            >
              {icon}
            </Box>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Dashboard
          <Box component="span" sx={{ ml: 1, fontSize: '2rem' }}>
            🐻‍❄️
          </Box>
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Bienvenido, {user?.usuario} ({user?.rol})
        </Typography>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Capturas"
            value={stats.totalCapturas}
            icon={<Description />}
            color="primary"
            delay={0.1}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completadas"
            value={stats.capturasCompletadas}
            icon={<CheckCircle />}
            color="success"
            delay={0.2}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pendientes"
            value={stats.capturasPendientes}
            icon={<Schedule />}
            color="warning"
            delay={0.3}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Directorios Externos"
            value={stats.totalDirectorios}
            icon={<Contacts />}
            color="info"
            delay={0.4}
          />
        </Grid>

        {/* Recent Capturas */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Capturas Recientes
              </Typography>

              {recentCapturas.length === 0 ? (
                <Typography color="text.secondary">
                  No hay capturas recientes
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentCapturas.map((captura, index) => (
                    <motion.div
                      key={captura.folio_acaac}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    >
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, '&:hover': { bgcolor: 'action.hover' } }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1">
                              Folio: {captura.folio_acaac} - {captura.numero_oficio}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {captura.asunto || 'Sin asunto'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Recepción: {captura.fecha_recepcion}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={captura.tipo}
                              color={captura.tipo === 'Entrada' ? 'primary' : 'secondary'}
                              size="small"
                            />
                            <Chip
                              label={captura.completado ? 'Completado' : 'Pendiente'}
                              color={captura.completado ? 'success' : 'warning'}
                              size="small"
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              )}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

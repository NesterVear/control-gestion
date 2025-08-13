
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Add,
  PersonAdd,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface NewUserForm {
  usuario: string;
  contrasena: string;
  rol: 'Administrador' | 'Lector' | 'SuperRoot';
}

const initialFormData: NewUserForm = {
  usuario: '',
  contrasena: '',
  rol: 'Lector',
};

// Mock users data - since we don't have a get users endpoint
interface UserInfo {
  id: number;
  usuario: string;
  rol: string;
}

export const UsuariosList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form dialog state
  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState<NewUserForm>(initialFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user } = useAuth();

  // Mock data for current users (in real app this would come from an API)
  const mockUsers: UserInfo[] = [
    { id: 1, usuario: user?.usuario || 'current_user', rol: user?.rol || 'SuperRoot' },
  ];

  const canCreateUsers = () => {
    return user && user.rol === 'SuperRoot';
  };

  const handleOpenForm = () => {
    setFormDialog(true);
    setFormData(initialFormData);
    setError('');
    setSuccess('');
  };

  const handleCloseForm = () => {
    setFormDialog(false);
    setFormData(initialFormData);
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.usuario.trim()) {
      setError('El usuario es obligatorio');
      return;
    }
    
    if (!formData.contrasena.trim()) {
      setError('La contraseña es obligatoria');
      return;
    }

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setFormLoading(true);
      setError('');
      setSuccess('');

      const response = await authService.createUser({
        usuario: formData.usuario.trim(),
        contrasena: formData.contrasena,
        rol: formData.rol,
      });

      setSuccess(`Usuario "${formData.usuario}" creado exitosamente (ID: ${response.id})`);
      
      setTimeout(() => {
        handleCloseForm();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error creating user');
    } finally {
      setFormLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SuperRoot':
        return 'error';
      case 'Administrador':
        return 'warning';
      case 'Capturista':
        return 'info';
      case 'Lector':
        return 'success';
      default:
        return 'default';
    }
  };

  if (!canCreateUsers()) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Acceso Denegado
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Solo los usuarios SuperRoot pueden gestionar usuarios.
        </Typography>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Gestión de Usuarios
            <Box component="span" sx={{ ml: 1, fontSize: '2rem' }}>
              👥
            </Box>
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenForm}
          >
            Nuevo Usuario
          </Button>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper sx={{ mb: 4 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información sobre Roles
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Chip label="SuperRoot" color="error" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Acceso completo al sistema
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Chip label="Administrador" color="warning" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Gestión completa de capturas y directorio
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Chip label="Capturista" color="info" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Crear y editar capturas
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Chip label="Lector" color="success" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Solo lectura
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockUsers.map((usuario, index) => (
                  <motion.tr
                    key={usuario.id}
                    component={TableRow}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" color="primary">
                        {usuario.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {usuario.usuario}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={usuario.rol}
                        color={getRoleColor(usuario.rol) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Activo"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>

      {/* Create User Dialog */}
      <Dialog
        open={formDialog}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAdd />
              Crear Nuevo Usuario
            </Box>
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Usuario *"
                  value={formData.usuario}
                  onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                  required
                  disabled={formLoading}
                  placeholder="Ingresa el nombre de usuario"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contraseña *"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  required
                  disabled={formLoading}
                  placeholder="Mínimo 6 caracteres"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={formLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required disabled={formLoading}>
                  <InputLabel>Rol *</InputLabel>
                  <Select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value as NewUserForm['rol'] })}
                    label="Rol *"
                  >
                    <MenuItem value="Lector">Lector</MenuItem>
                    <MenuItem value="Administrador">Administrador</MenuItem>
                    <MenuItem value="SuperRoot">SuperRoot</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} disabled={formLoading} startIcon={<Cancel />}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formLoading}
              startIcon={formLoading ? <CircularProgress size={16} /> : <Save />}
            >
              {formLoading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

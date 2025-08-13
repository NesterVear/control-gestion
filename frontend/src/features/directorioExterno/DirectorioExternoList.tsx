
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
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Save,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { directorioExternoService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { DirectorioExterno } from '../../types';

interface FormData {
  nombre: string;
  cargo: string;
  institucion: string;
}

const initialFormData: FormData = {
  nombre: '',
  cargo: '',
  institucion: '',
};

export const DirectorioExternoList: React.FC = () => {
  const [directorios, setDirectorios] = useState<DirectorioExterno[]>([]);
  const [filteredDirectorios, setFilteredDirectorios] = useState<DirectorioExterno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form dialog state
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    isEdit: boolean;
    directorio: DirectorioExterno | null;
  }>({
    open: false,
    isEdit: false,
    directorio: null,
  });
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    directorio: DirectorioExterno | null;
  }>({
    open: false,
    directorio: null,
  });
  const [deleting, setDeleting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    loadDirectorios();
  }, []);

  useEffect(() => {
    filterDirectorios();
  }, [directorios, searchTerm]);

  const loadDirectorios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await directorioExternoService.getDirectorios();
      setDirectorios(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading directorios');
    } finally {
      setLoading(false);
    }
  };

  const filterDirectorios = () => {
    if (!searchTerm.trim()) {
      setFilteredDirectorios(directorios);
    } else {
      const filtered = directorios.filter(directorio =>
        directorio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        directorio.cargo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        directorio.institucion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDirectorios(filtered);
    }
  };

  const canModify = () => {
    return user && ['Administrador', 'SuperRoot'].includes(user.rol);
  };

  const handleOpenForm = (directorio?: DirectorioExterno) => {
    if (directorio) {
      setFormDialog({ open: true, isEdit: true, directorio });
      setFormData({
        nombre: directorio.nombre,
        cargo: directorio.cargo || '',
        institucion: directorio.institucion || '',
      });
    } else {
      setFormDialog({ open: true, isEdit: false, directorio: null });
      setFormData(initialFormData);
    }
  };

  const handleCloseForm = () => {
    setFormDialog({ open: false, isEdit: false, directorio: null });
    setFormData(initialFormData);
    setError('');
    setSuccess('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      setFormLoading(true);
      setError('');
      setSuccess('');

      if (formDialog.isEdit && formDialog.directorio) {
        await directorioExternoService.updateDirectorio(formDialog.directorio.id, formData);
        setSuccess('Directorio actualizado exitosamente');
      } else {
        await directorioExternoService.createDirectorio(formData);
        setSuccess('Directorio creado exitosamente');
      }

      await loadDirectorios();
      setTimeout(() => {
        handleCloseForm();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error saving directorio');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.directorio) return;

    try {
      setDeleting(true);
      await directorioExternoService.deleteDirectorio(deleteDialog.directorio.id);
      await loadDirectorios();
      setDeleteDialog({ open: false, directorio: null });
      setSuccess('Directorio eliminado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error deleting directorio');
    } finally {
      setDeleting(false);
    }
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Directorio Externo
            <Box component="span" sx={{ ml: 1, fontSize: '2rem' }}>
              📇
            </Box>
          </Typography>

          {canModify() && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenForm()}
            >
              Nuevo Contacto
            </Button>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre, cargo o institución..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
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
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Institución</TableCell>
                  {canModify() && <TableCell align="center">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDirectorios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canModify() ? 5 : 4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {searchTerm ? 'No se encontraron contactos' : 'No hay contactos registrados'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDirectorios.map((directorio, index) => (
                    <motion.tr
                      key={directorio.id}
                      component={TableRow}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" color="primary">
                          {directorio.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {directorio.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>{directorio.cargo || '-'}</TableCell>
                      <TableCell>{directorio.institucion || '-'}</TableCell>
                      {canModify() && (
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title="Editar">
                              <IconButton size="small" onClick={() => handleOpenForm(directorio)}>
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setDeleteDialog({ open: true, directorio })}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      )}
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>

      {/* Form Dialog */}
      <Dialog
        open={formDialog.open}
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
            {formDialog.isEdit ? 'Editar Contacto' : 'Nuevo Contacto'}
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
                  label="Nombre *"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  disabled={formLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cargo"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  disabled={formLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Institución"
                  value={formData.institucion}
                  onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
                  disabled={formLoading}
                />
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
              {formLoading ? 'Guardando...' : (formDialog.isEdit ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, directorio: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el contacto "{deleteDialog.directorio?.nombre}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, directorio: null })}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

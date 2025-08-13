
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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  PictureAsPdf,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { capturaService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Captura } from '../../types';

export const CapturasList: React.FC = () => {
  const [capturas, setCapturas] = useState<Captura[]>([]);
  const [filteredCapturas, setFilteredCapturas] = useState<Captura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; captura: Captura | null }>({
    open: false,
    captura: null,
  });
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadCapturas();
  }, []);

  useEffect(() => {
    filterCapturas();
  }, [capturas, searchTerm]);

  const loadCapturas = async () => {
    try {
      setLoading(true);
      const data = await capturaService.getCapturas();
      setCapturas(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading capturas');
    } finally {
      setLoading(false);
    }
  };

  const filterCapturas = () => {
    if (!searchTerm.trim()) {
      setFilteredCapturas(capturas);
    } else {
      const filtered = capturas.filter(captura =>
        captura.numero_oficio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        captura.asunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        captura.remitente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        captura.destinatario?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCapturas(filtered);
    }
  };

  const handleEdit = (folio: number) => {
    navigate(`/capturas/${folio}`);
  };

  const handleDelete = async () => {
    if (!deleteDialog.captura) return;

    try {
      setDeleting(true);
      await capturaService.deleteCaptura(deleteDialog.captura.folio_acaac);
      await loadCapturas(); // Reload data
      setDeleteDialog({ open: false, captura: null });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error deleting captura');
    } finally {
      setDeleting(false);
    }
  };

  const canEdit = () => {
    return user && ['Capturista', 'Administrador', 'SuperRoot'].includes(user.rol);
  };

  const canDelete = () => {
    return user && ['Administrador', 'SuperRoot'].includes(user.rol);
  };

  const getTipoChipColor = (tipo: string) => {
    return tipo === 'Entrada' ? 'primary' : 'secondary';
  };

  const getStatusChipColor = (completado: boolean) => {
    return completado ? 'success' : 'warning';
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
            Capturas
            <Box component="span" sx={{ ml: 1, fontSize: '2rem' }}>
              📄
            </Box>
          </Typography>

          {canEdit() && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/capturas/nueva')}
            >
              Nueva Captura
            </Button>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar por número de oficio, asunto, remitente o destinatario..."
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
                  <TableCell>Folio</TableCell>
                  <TableCell>Fecha Recepción</TableCell>
                  <TableCell>Número Oficio</TableCell>
                  <TableCell>Asunto</TableCell>
                  <TableCell>Remitente</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Prioridad</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCapturas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {searchTerm ? 'No se encontraron capturas' : 'No hay capturas registradas'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCapturas.map((captura, index) => (
                    <motion.tr
                      key={captura.folio_acaac}
                      component={TableRow}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" color="primary">
                          {captura.folio_acaac}
                        </Typography>
                      </TableCell>
                      <TableCell>{captura.fecha_recepcion}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {captura.numero_oficio}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {captura.asunto || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>{captura.remitente || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={captura.tipo}
                          color={getTipoChipColor(captura.tipo) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={captura.completado ? 'Completado' : 'Pendiente'}
                          color={getStatusChipColor(captura.completado) as any}
                          size="small"
                          icon={captura.completado ? <CheckCircle /> : <Schedule />}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={captura.prioridad}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {captura.pdf_url && (
                            <Tooltip title="Ver PDF">
                              <IconButton size="small" color="info">
                                <PictureAsPdf />
                              </IconButton>
                            </Tooltip>
                          )}
                          {canEdit() && (
                            <Tooltip title="Editar">
                              <IconButton size="small" onClick={() => handleEdit(captura.folio_acaac)}>
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          )}
                          {canDelete() && (
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setDeleteDialog({ open: true, captura })}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, captura: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la captura con folio {deleteDialog.captura?.folio_acaac}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, captura: null })}>
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

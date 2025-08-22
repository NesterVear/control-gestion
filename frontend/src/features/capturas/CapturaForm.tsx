import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { capturaService } from '../../services/api';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Typography, Box, Paper, Grid, Alert, Chip, CircularProgress } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import type { Prioridad, Atendio } from '../../types';

type Tipo = 'Entrada' | 'Salida';
type Status = 'Conocimiento' | 'Respuesta';

const prioridades: Prioridad[] = ['Urgente', 'ExtraUrgente', 'Ordinario'];
const atendios: Atendio[] = ['Mitzi', 'Edgar', 'Chiqui', 'Rosy'];

const initialFormData = {
  usuario_id: 0,
  fecha_elaboracion: '',
  fecha_recepcion: '',
  numero_oficio: '',
  asunto: '',
  remitente: '',
  destinatario: '',
  prioridad: 'Ordinario' as Prioridad,
  observacion: '',
  atendio: undefined as Atendio | undefined,
  pdf_url: '',
  tipo: 'Entrada' as Tipo,
  status: '' as Status | '',
  respuesta_pdf_url: '',
  completado: false,
};

export const CapturaForm: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [fechaElaboracion, setFechaElaboracion] = useState<Date | null>(null);
  const [fechaRecepcion, setFechaRecepcion] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { folio } = useParams<{ folio: string }>();
  const { user } = useAuth();

  useEffect(() => {
    if (folio && folio !== 'nueva') {
      setIsEdit(true);
      loadCaptura(parseInt(folio));
    }

    if (user) {
      setFormData(prev => ({ ...prev, usuario_id: user.id }));
    }
  }, [folio, user]);

  const loadCaptura = async (folioAcaac: number) => {
    try {
      setLoading(true);
      const capturas = await capturaService.getCapturas();
      const captura = capturas.find(c => c.folio_acaac === folioAcaac);

      if (captura) {
        setFormData({
          usuario_id: captura.usuario_id,
          fecha_elaboracion: captura.fecha_elaboracion,
          fecha_recepcion: captura.fecha_recepcion,
          numero_oficio: captura.numero_oficio,
          asunto: captura.asunto || '',
          remitente: captura.remitente || '',
          destinatario: captura.destinatario || '',
          prioridad: captura.prioridad,
          observacion: captura.observacion || '',
          atendio: captura.atendio || undefined,
          pdf_url: captura.pdf_url || '',
          tipo: captura.tipo,
          status: captura.status || '',
          respuesta_pdf_url: captura.respuesta_pdf_url || '',
          completado: captura.completado,
        });

        // Parse dates
        if (captura.fecha_elaboracion) {
          const [day, month, year] = captura.fecha_elaboracion.split('-');
          setFechaElaboracion(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
        }
        if (captura.fecha_recepcion) {
          const [day, month, year] = captura.fecha_recepcion.split('-');
          setFechaRecepcion(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
        }
      }
    } catch (err: any) {
      setError('Error loading captura');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleDateChange = (field: 'fecha_elaboracion' | 'fecha_recepcion', date: Date | null) => {
    if (field === 'fecha_elaboracion') {
      setFechaElaboracion(date);
      setFormData(prev => ({
        ...prev,
        fecha_elaboracion: date ? format(date, 'dd-MM-yyyy') : ''
      }));
    } else {
      setFechaRecepcion(date);
      setFormData(prev => ({
        ...prev,
        fecha_recepcion: date ? format(date, 'dd-MM-yyyy') : ''
      }));
    }
  };

  const validateForm = () => {
    const requiredFields: (keyof typeof formData)[] = ['fecha_elaboracion', 'fecha_recepcion', 'numero_oficio', 'prioridad', 'tipo'];
    const missing = requiredFields.filter(field => !formData[field]);

    if (missing.length > 0) {
      setError(`Campos obligatorios faltantes: ${missing.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const submitData = { ...formData };

      if (isEdit) {
        await capturaService.updateCaptura(parseInt(folio!), submitData);
        setSuccess('Captura actualizada exitosamente');
      } else {
        const response = await capturaService.createCaptura(submitData);
        setSuccess(`Captura creada exitosamente - Folio: ${response.folio_acaac}`);
      }

      setTimeout(() => {
        navigate('/capturas');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error saving captura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/capturas')}
              sx={{ mr: 2 }}
            >
              Volver
            </Button>
            <Typography variant="h4">
              {isEdit ? 'Editar Captura' : 'Nueva Captura'}
              <Box component="span" sx={{ ml: 1, fontSize: '2rem' }}>
                📝
              </Box>
            </Typography>
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
          <Paper sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Información Básica
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Fecha de Elaboración *"
                    value={fechaElaboracion}
                    onChange={(date) => handleDateChange('fecha_elaboracion', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Fecha de Recepción *"
                    value={fechaRecepcion}
                    onChange={(date) => handleDateChange('fecha_recepcion', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número de Oficio *"
                    value={formData.numero_oficio}
                    onChange={(e) => handleInputChange('numero_oficio', e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Tipo *</InputLabel>
                    <Select
                      value={formData.tipo}
                      onChange={(e) => handleInputChange('tipo', e.target.value)}
                      label="Tipo *"
                    >
                      <MenuItem value="Entrada">Entrada</MenuItem>
                      <MenuItem value="Salida">Salida</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Asunto"
                    value={formData.asunto}
                    onChange={(e) => handleInputChange('asunto', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Información de Contacto
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Remitente"
                    value={formData.remitente}
                    onChange={(e) => handleInputChange('remitente', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Destinatario"
                    value={formData.destinatario}
                    onChange={(e) => handleInputChange('destinatario', e.target.value)}
                  />
                </Grid>

                {/* Priority and Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Prioridad y Detalles
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Prioridad *</InputLabel>
                    <Select
                      value={formData.prioridad}
                      onChange={(e) => handleInputChange('prioridad', e.target.value as Prioridad)}
                      label="Prioridad *"
                    >
                      {prioridades.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Atendio</InputLabel>
                    <Select
                      value={formData.atendio || ''}
                      onChange={(e) => handleInputChange('atendio', e.target.value as Atendio)}
                      label="Atendio"
                    >
                      {atendios.map((a) => (
                        <MenuItem key={a} value={a}>
                          {a}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {formData.tipo === 'Entrada' && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value as Status)}
                        label="Status"
                      >
                        <MenuItem value="Conocimiento">Conocimiento</MenuItem>
                        <MenuItem value="Respuesta">Respuesta</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Observación"
                    value={formData.observacion}
                    onChange={(e) => handleInputChange('observacion', e.target.value)}
                    multiline
                    rows={3}
                  />
                </Grid>

                {/* PDF URLs */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Documentos PDF
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="URL del PDF"
                    value={formData.pdf_url}
                    onChange={(e) => handleInputChange('pdf_url', e.target.value)}
                  />
                </Grid>

                {formData.tipo === 'Entrada' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="URL del PDF de Respuesta"
                      value={formData.respuesta_pdf_url}
                      onChange={(e) => handleInputChange('respuesta_pdf_url', e.target.value)}
                    />
                  </Grid>
                )}

                {/* Status Chip */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Estado:
                    </Typography>
                    <Chip
                      label={formData.completado ? 'Completado' : 'Pendiente'}
                      color={formData.completado ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/capturas')}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Guardar')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </LocalizationProvider>
  );
};

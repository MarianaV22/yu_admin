import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import StarIcon from '@mui/icons-material/Star';

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grow,
  Snackbar,
  Alert,
} from '@mui/material';

const accessoryTypes = [
  "Backgrounds",
  "Shirts",
  "SkinColor",
  "Bigode",
  "Cachecol",
  "Chapeu",
  "Ouvidos"
];

export default function Accessories() {
  const [accessories, setAccessories] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentAccessory, setCurrentAccessory] = useState(null);
  const [form, setForm] = useState({ name: '', type: '', value: 0, src: '' });
  const [filterType, setFilterType] = useState('All');
  const [checked, setChecked] = useState(false);

  // estados de alertas
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  // estados de confirmação de delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: '' });

  useEffect(() => {
    api.get('/accessories')
      .then(res => {
        if (res.data && Array.isArray(res.data.accessories)) {
          setAccessories(res.data.accessories);
        }
      })
      .catch(err => console.error('Erro ao buscar acessórios:', err))
      .finally(() => setChecked(true));
  }, []);

  const filteredAccessories = accessories.filter(a =>
    filterType === 'All' ? true : a.type === filterType
  );

  const handleOpenDialog = accessory => {
    if (accessory) {
      setCurrentAccessory(accessory);
      setForm({
        name: accessory.name,
        type: accessory.type,
        value: accessory.value,
        src: accessory.src,
      });
    } else {
      setCurrentAccessory(null);
      setForm({ name: '', type: '', value: 0, src: '' });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => setOpen(false);
  const handleAlertClose = () => setAlert({ ...alert, open: false });

  // abre diálogo de confirmação
  const openConfirm = (accessory) => {
    setToDelete({ id: accessory._id, name: accessory.name });
    setConfirmOpen(true);
  };
  const closeConfirm = () => setConfirmOpen(false);

  const confirmDelete = async () => {
    try {
      await api.delete(`/accessories/${toDelete.id}`);
      setAccessories(accessories.filter(a => a._id !== toDelete.id));
      setAlert({ open: true, message: `Acessório "${toDelete.name}" eliminado com sucesso!`, severity: 'success' });
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erro ao apagar acessório.';
      setAlert({ open: true, message: msg, severity: 'error' });
      console.error('Erro ao apagar acessório:', err);
    }
    setConfirmOpen(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.type || form.value == null || !form.src) {
      setAlert({ open: true, message: 'Por favor, preencha todos os campos obrigatórios.', severity: 'error' });
      return;
    }
    try {
      if (currentAccessory) {
        const { data } = await api.put(`/accessories/${currentAccessory._id}`, form);
        setAccessories(accessories.map(a => a._id === currentAccessory._id ? data.accessory : a));
        setAlert({ open: true, message: 'Acessório atualizado com sucesso!', severity: 'success' });
      } else {
        const { data } = await api.post('/accessories', form);
        setAccessories([ ...accessories, data.accessory ]);
        setAlert({ open: true, message: 'Acessório criado com sucesso!', severity: 'success' });
      }
      setOpen(false);
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erro ao salvar acessório.';
      setAlert({ open: true, message: msg, severity: 'error' });
      console.error('Erro ao salvar acessório:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Accessories Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage and explore your accessories collection.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="filter-type-label">Filter by Type</InputLabel>
          <Select labelId="filter-type-label" value={filterType} onChange={e => setFilterType(e.target.value)} label="Filter by Type">
            <MenuItem value="All">All</MenuItem>
            {accessoryTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
        <Button onClick={() => handleOpenDialog()} sx={{ backgroundColor: '#8E5DB1', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', px:3, py:1.5, borderRadius:2, boxShadow:'none', '&:hover':{backgroundColor:'#634B7A',boxShadow:'0 3px 6px rgba(0,0,0,0.2)'} }}>
          Add Accessory
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredAccessories.map((a, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={a._id}>
            <Grow in={checked} style={{ transformOrigin: '0 0 0' }} {...(checked ? { timeout: 500 + i*100 } : {})}>
              <Card sx={{ transition: 'transform 0.3s, box-shadow 0.3s', '&:hover':{transform:'translateY(-5px)',boxShadow:6}}}>
                <CardMedia component="img" height="140" image={a.src} alt={a.name} />
                <CardContent>
                  <Typography variant="h6">{a.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{a.type}</Typography>
                  <Typography variant="body2" sx={{ mt:1, display:'flex', alignItems:'center', gap:.5 }}>
                    {a.value}<StarIcon fontSize="small" sx={{color:"#FFD700"}} />
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenDialog(a)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => openConfirm(a)}>Delete</Button>
                </CardActions>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo de criar/editar */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{currentAccessory ? 'Edit Accessory' : 'Add Accessory'}</DialogTitle>
        <DialogContent>
          {/* Preview da imagem */}
          {form.src && (
            <Box sx={{ mt:2, textAlign:'center' }}>
              <img src={form.src} alt={form.name||'Preview'} style={{maxWidth:'100%',maxHeight:200,borderRadius:4,boxShadow:'0 0 4px rgba(0,0,0,0.2)'}} onError={e=>e.currentTarget.style.display='none'} />
            </Box>
          )}
          <TextField autoFocus margin="dense" label="Name*" fullWidth value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <FormControl fullWidth margin="dense">
            <InputLabel id="type-select-label">Type*</InputLabel>
            <Select labelId="type-select-label" value={form.type} label="Type*" onChange={e=>setForm({...form,type:e.target.value})}>
              {accessoryTypes.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField margin="dense" label="Value*" type="number" fullWidth value={form.value} onChange={e=>setForm({...form,value:Number(e.target.value)})} />
          <TextField margin="dense" label="Image URL*" fullWidth value={form.src} onChange={e=>setForm({...form,src:e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação */}
      <Dialog open={confirmOpen} onClose={closeConfirm}>
        <DialogTitle>Confirmar eliminação</DialogTitle>
        <DialogContent>
          <Typography>Tem a certeza que quer eliminar "{toDelete.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Não</Button>
          <Button color="error" onClick={confirmDelete}>Sim</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de alertas */}
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose} anchorOrigin={{ vertical:'top', horizontal:'center' }}>
        <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width:'100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

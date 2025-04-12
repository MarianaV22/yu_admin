import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';

export default function Accessories() {
  const [accessories, setAccessories] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentAccessory, setCurrentAccessory] = useState(null);
  const [form, setForm] = useState({
    name: '',
    type: '',
    value: 0,
    src: '',
  });
  const [filterType, setFilterType] = useState('All');
  const [checked, setChecked] = useState(false);

  // Ao montar o componente, tenta buscar os acessórios da API
  useEffect(() => {
    axios
      .get('http://localhost:3000/accessories') // Ajuste a URL conforme seu endpoint
      .then((res) => {
        if (res.data && Array.isArray(res.data.accessories)) {
          setAccessories(res.data.accessories);
        } else {
          console.error('Resposta inesperada da API:', res.data);
          setAccessories([]);
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar acessórios:', err);
        setAccessories([]);
      });
    // Ativa animação de entrada
    setChecked(true);
  }, []);

  // Filtro: exibe acessórios conforme o tipo selecionado
  const filteredAccessories = accessories.filter((a) =>
    filterType === 'All' ? true : a.type === filterType
  );

  const handleOpenDialog = (accessory) => {
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

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (currentAccessory) {
      setAccessories(
        accessories.map((a) =>
          a._id === currentAccessory._id ? { ...a, ...form } : a
        )
      );
      // Caso queira atualizar no backend, execute um axios.put(...)
    } else {
      const newAccessory = {
        ...form,
        _id: Math.random().toString(36).substring(7),
      };
      setAccessories([...accessories, newAccessory]);
      // Caso queira criar no backend, execute um axios.post(...)
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    setAccessories(accessories.filter((a) => a._id !== id));
    // Para deletar no backend, execute um axios.delete(...)
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Accessories Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage and explore your accessories collection.
        </Typography>
      </Box>

      {/* Filtro e Botão para adicionar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
        }}
      >
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="filter-type-label">Filter by Type</InputLabel>
          <Select
            labelId="filter-type-label"
            id="filter-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Filter by Type"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Decor">Decor</MenuItem>
            <MenuItem value="SkinColor">SkinColor</MenuItem>
            <MenuItem value="Shirts">Shirts</MenuItem>
            <MenuItem value="Backgrounds">Backgrounds</MenuItem>
          </Select>
        </FormControl>
        <Button
            onClick={() => handleOpenDialog()}
            sx={{
                backgroundColor: '#8E5DB1', 
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: 'none',
                transition: 'background-color 0.3s, box-shadow 0.3s',
                '&:hover': {
                backgroundColor: '#634B7A', 
                boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                },
            }}
            >
            Add Accessory
        </Button>

      </Box>

      {/* Grid de Cards com animação Grow */}
      <Grid container spacing={3}>
        {filteredAccessories.map((a, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={a._id}>
            <Grow
              in={checked}
              style={{ transformOrigin: '0 0 0' }}
              {...(checked ? { timeout: 500 + index * 100 } : {})}
            >
              <Card
                sx={{
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={a.src}
                  alt={a.name}
                />
                <CardContent>
                  <Typography variant="h6">{a.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {a.type}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ${a.value}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenDialog(a)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(a._id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo para adicionar/editar acessório */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentAccessory ? 'Edit Accessory' : 'Add Accessory'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            helperText="Use values: Decor, SkinColor, Shirts, Backgrounds"
          />
          <TextField
            margin="dense"
            label="Value"
            type="number"
            fullWidth
            value={form.value}
            onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={form.src}
            onChange={(e) => setForm({ ...form, src: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

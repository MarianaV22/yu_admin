import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  useTheme,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

export default function AdminTasks() {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalTasks: 0, totalCompletedTasks: 0 });
  const [users, setUsers] = useState([]);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [form, setForm] = useState({
    userId: '',
    title: '',
    description: '',
    completed: false,
    verified: false,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Alert state
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchStats();
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/tasks/stats');
      if (data.success) {
        setStats({ totalTasks: data.totalTasks, totalCompletedTasks: data.totalCompletedTasks });
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas de tarefas:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      // espera resposta { users } ou array
      const list = Array.isArray(data) ? data : data.users || [];
      setUsers(list);
    } catch (err) {
      console.error('Erro ao buscar utilizadores:', err);
    }
  };

  const openForm = task => {
    if (task) {
      setCurrentTask(task);
      setForm({
        userId: task.userId || '',
        title: task.title,
        description: task.description,
        completed: task.completed,
        verified: task.verified,
      });
    } else {
      setCurrentTask(null);
      setForm({ userId: '', title: '', description: '', completed: false, verified: false });
    }
    setFormOpen(true);
  };
  const closeForm = () => setFormOpen(false);

  const handleSave = async () => {
    if (!form.userId || !form.title.trim()) {
      setAlert({ open: true, message: 'Usuário e título são obrigatórios.', severity: 'error' });
      return;
    }
    try {
      let data;
      if (currentTask) {
        ({ data } = await api.put(`/tasks/${currentTask._id}`, form));
        setTasks(tasks.map(t => (t._id === currentTask._id ? data.task : t)));
        setAlert({ open: true, message: 'Tarefa atualizada com sucesso!', severity: 'success' });
      } else {
        ({ data } = await api.post('/tasks', form));
        setTasks([...tasks, data.task]);
        setAlert({ open: true, message: 'Tarefa criada com sucesso!', severity: 'success' });
      }
      closeForm();
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erro ao salvar tarefa.';
      setAlert({ open: true, message: msg, severity: 'error' });
    }
  };

  const openDelete = task => {
    setToDelete(task);
    setConfirmOpen(true);
  };
  const closeDelete = () => setConfirmOpen(false);

  const confirmDelete = async () => {
    try {
      await api.delete(`/tasks/${toDelete._id}`);
      setTasks(tasks.filter(t => t._id !== toDelete._id));
      setAlert({ open: true, message: 'Tarefa eliminada com sucesso!', severity: 'success' });
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erro ao eliminar tarefa.';
      setAlert({ open: true, message: msg, severity: 'error' });
    }
    closeDelete();
  };

  const statsCards = [
    {
      title: 'Total de Tarefas',
      value: stats.totalTasks.toString(),
      icon: <ListAltIcon fontSize='large' />,
      gradient: 'linear-gradient(135deg, rgb(216, 231, 192) 0%, #99C556 100%)',
    },
    {
      title: 'Tarefas Completas',
      value: stats.totalCompletedTasks.toString(),
      icon: <CheckCircleIcon fontSize='large' />,
      gradient: 'linear-gradient(135deg, rgb(213, 247, 245) 0%, #8DD4D1 100%)',
    },
  ];

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4'>Tarefas Dashboard</Typography>
        <Button variant='contained' startIcon={<AddIcon />} onClick={() => openForm()} sx={{ backgroundColor: '#8E5DB1' }}>
          Nova Tarefa
        </Button>
      </Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                p: 3,
                height: 140,
                background: item.gradient,
                color: theme.palette.grey[800],
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform .3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
              }}
            >
              {item.icon}
              <Typography variant='body1' sx={{ mt: 1 }}>
                {item.title}
              </Typography>
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                {item.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Utilizador</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Concluída</TableCell>
              <TableCell>Verificada</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(task => {
              const user = users.find(u => u._id === task.userId);
              return (
                <TableRow key={task._id}>
                  <TableCell>{task._id}</TableCell>
                  <TableCell>{user?.username || user?.email || task.userId}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.completed ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{task.verified ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>
                    <IconButton size='small' onClick={() => openForm(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => openDelete(task)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* Form Dialog */}
      <Dialog open={formOpen} onClose={closeForm}>
        <DialogTitle>{currentTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin='dense'>
            <InputLabel id='user-select-label'>Utilizador*</InputLabel>
            <Select
              labelId='user-select-label'
              value={form.userId}
              label='Utilizador*'
              onChange={e => setForm({ ...form, userId: e.target.value })}
            >
              {users.map(u => (
                <MenuItem key={u._id} value={u._id}>
                  {u.username || u.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin='dense'
            label='Título*'
            fullWidth
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            margin='dense'
            label='Descrição'
            fullWidth
            multiline
            minRows={2}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id='completed-select-label'>Concluída</InputLabel>
              <Select
                labelId='completed-select-label'
                value={form.completed ? 'true' : 'false'}
                label='Concluída'
                onChange={e => setForm({ ...form, completed: e.target.value === 'true' })}
              >
                <MenuItem value='false'>Não</MenuItem>
                <MenuItem value='true'>Sim</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id='verified-select-label'>Verificada</InputLabel>
              <Select
                labelId='verified-select-label'
                value={form.verified ? 'true' : 'false'}
                label='Verificada'
                onChange={e => setForm({ ...form, verified: e.target.value === 'true' })}
              >
                <MenuItem value='false'>Não</MenuItem>
                <MenuItem value='true'>Sim</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={confirmOpen} onClose={closeDelete}>
        <DialogTitle>Confirmar Eliminação</DialogTitle>
        <DialogContent>
          <Typography>
            Tem a certeza que quer eliminar a tarefa "{toDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete}>Não</Button>
          <Button color='error' onClick={confirmDelete}>Sim</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

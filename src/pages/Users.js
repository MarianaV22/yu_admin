import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Avatar from '../components/Avatar';
import './Users.css';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  Box,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Helper para ler cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [accessoriesList, setAccessoriesList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({ username: '', code: '', email: '', points: 0 });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  // Fetch users e accessories
  useEffect(() => {
    const token = getCookie('token');
    api.get('/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data.users || res.data))
      .catch(err => console.error('Erro ao buscar usuários:', err));

    api.get('/accessories', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAccessoriesList(res.data.accessories))
      .catch(err => console.error('Erro ao buscar acessórios:', err));
  }, []);

  const handleOpenDialog = (user) => {
    if (user) {
      setCurrentUser(user);
      setForm({ username: user.username, code: user.code, email: user.email, points: user.points });
    } else {
      setCurrentUser(null);
      setForm({ username: '', code: '', email: '', points: 0 });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => setOpen(false);

  const handleSave = async () => {
    const token = getCookie('token');
    try {
      let res;
      if (currentUser) {
        res = await api.put(`/users/${currentUser._id}`, form, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(users.map(u => u._id === currentUser._id ? res.data : u));
        setAlert({ open: true, message: 'Utilizador atualizado com sucesso!', severity: 'success' });
      } else {
        res = await api.post('/users', form, { headers: { Authorization: `Bearer ${token}` } });
        setUsers([...users, res.data]);
        setAlert({ open: true, message: 'Utilizador criado com sucesso!', severity: 'success' });
      }
      setOpen(false);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setAlert({ open: true, message: 'Erro ao salvar usuário.', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const token = getCookie('token');
    try {
      await api.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.filter(u => u._id !== id));
      setAlert({ open: true, message: 'Utilizador eliminado com sucesso!', severity: 'success' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      setAlert({ open: true, message: 'Erro ao eliminar utilizador.', severity: 'error' });
    }
  };

  const handleAlertClose = () => setAlert({ ...alert, open: false });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ mb: 2, backgroundColor: '#8E5DB1' }}>
        Add User
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Mascot</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow key={u._id}>
              <TableCell>{u._id}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.code}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.points}</TableCell>
              <TableCell>
                <div className="avatarWrapper">
                  <Avatar
                    mascot={u.mascot}
                    equipped={u.accessoriesEquipped || {}}
                    accessoriesList={accessoriesList}
                    size={50}
                  />
                </div>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenDialog(u)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(u._id)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{currentUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Username" fullWidth value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <TextField margin="dense" label="Code" fullWidth value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          <TextField margin="dense" label="Email" fullWidth value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField margin="dense" label="Points" type="number" fullWidth value={form.points} onChange={e => setForm({ ...form, points: Number(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

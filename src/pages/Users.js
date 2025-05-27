import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  TextField 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Função auxiliar para ler um cookie pelo nome
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // Agora os dados do formulário usam "username" em vez de "name"
  const [form, setForm] = useState({ username: '', code: '', email: '', points: 0 });

  // Função para buscar os usuários da API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getCookie('token'); 
        const response = await axios.get("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Se a API retornar um array ou um objeto com a chave "users"
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.error("Formato inesperado da resposta:", response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenDialog = (user) => {
    if (user) {
      setCurrentUser(user);
      setForm({ 
        username: user.username, 
        code: user.code, 
        email: user.email, 
        points: user.points 
      });
    } else {
      setCurrentUser(null);
      setForm({ username: '', code: '', email: '', points: 0 });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => setOpen(false);

  // Se estiver editando, usa PUT; se for criação, usa POST (exemplo)
  const handleSave = async () => {
    const token = getCookie('token');
    try {
      if (currentUser) {
        // Atualização (PUT)
        const response = await axios.put(
          `http://localhost:3000/users/${currentUser._id}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Atualiza o estado com os dados atualizados (pode usar response.data se a API retornar o objeto atualizado)
        setUsers(users.map(u => u._id === currentUser._id ? response.data : u));
      } else {
        // Criação (POST) – se necessário. Exemplo:
        const response = await axios.post(
          `http://localhost:3000/users`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Adiciona o novo usuário ao estado
        setUsers([...users, response.data]);
      }
      setOpen(false);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = getCookie('token');
    try {
      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Atualiza o estado removendo o usuário deletado
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Button 
        variant="contained" 
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
        Add User
      </Button>

      <Table sx={{ mt: 2 }}>
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
                <img 
                  src={u.mascot} 
                  alt={u.username} 
                  style={{ width: 50, height: 50, borderRadius: '50%' }}
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleOpenDialog(u)}
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    backgroundColor: '#8E5DB1',
                    borderRadius: '20px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#634B7A',
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(u._id)}
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  sx={{
                    backgroundColor: '#8E5DB1',
                    borderRadius: '20px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    ml: 1,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#634B7A',
                    },
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{currentUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Points"
            type="number"
            fullWidth
            value={form.points}
            onChange={e => setForm({ ...form, points: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

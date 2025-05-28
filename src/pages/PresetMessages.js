import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import {
  Container,
  Typography,
  Card,
  Box,
  Grid,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

export default function AdminPresetMessages() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [editForm, setEditForm] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  // Busca todas as mensagens já criadas
  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/preset-messages');
      if (data.success) {
        setMessages(data.messages);
        // scroll to bottom
        setTimeout(() => chatRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
    }
  };

  const handleAlertClose = () => setAlert({ ...alert, open: false });

  const handleSend = async () => {
    if (!newMsg.trim()) {
      setAlert({ open: true, message: 'Escreva uma mensagem antes de enviar.', severity: 'error' });
      return;
    }
    try {
      const { data } = await api.post('/preset-messages', { message: newMsg.trim() });
      setMessages(prev => [...prev, data.message]);
      setNewMsg('');
      setAlert({ open: true, message: 'Mensagem criada com sucesso!', severity: 'success' });
      setTimeout(() => chatRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erro ao criar mensagem.';
      setAlert({ open: true, message: msg, severity: 'error' });
    }
  };

  const openEdit = msg => {
    setCurrent(msg);
    setEditForm(msg.message);
    setEditOpen(true);
  };
  const closeEdit = () => setEditOpen(false);

  const handleEditSave = async () => {
    if (!editForm.trim()) {
      setAlert({ open: true, message: 'Mensagem não pode ficar vazia.', severity: 'error' });
      return;
    }
    try {
      const { data } = await api.put(`/preset-messages/${current._id}`, { message: editForm.trim() });
      setMessages(prev => prev.map(m => m._id === current._id ? data.message : m));
      setAlert({ open: true, message: 'Mensagem editada com sucesso!', severity: 'success' });
      setEditOpen(false);
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erro ao editar mensagem.';
      setAlert({ open: true, message: msg, severity: 'error' });
    }
  };

  const openDelete = msg => {
    setToDelete(msg);
    setConfirmOpen(true);
  };
  const closeDelete = () => setConfirmOpen(false);

  const confirmDelete = async () => {
    try {
      await api.delete(`/preset-messages/${toDelete._id}`);
      setMessages(prev => prev.filter(m => m._id !== toDelete._id));
      setAlert({ open: true, message: 'Mensagem eliminada com sucesso!', severity: 'success' });
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erro ao eliminar mensagem.';
      setAlert({ open: true, message: msg, severity: 'error' });
    }
    setConfirmOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Preset Messages Admin
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        Use este chat para criar, editar e eliminar mensagens predefinidas.
      </Typography>

      <Card variant="outlined" sx={{ p: 2, height: 500, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {messages.map(msg => (
            <Box key={msg._id} sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 2, mb: 1, position: 'relative' }}>
              <Typography variant="body1">{msg.message}</Typography>
              <Box sx={{ position: 'absolute', top: 4, right: 4, display: 'flex' }}>
                <IconButton size="small" onClick={() => openEdit(msg)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => openDelete(msg)}>
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            </Box>
          ))}
          <div ref={chatRef} />
        </Box>

        <Box sx={{ display: 'flex', mt: 1 }}>
          <TextField
            variant="outlined"
            placeholder="Nova mensagem…"
            fullWidth
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Card>

      <Dialog open={editOpen} onClose={closeEdit}>
        <DialogTitle>Editar Mensagem</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline minRows={2} value={editForm} onChange={e => setEditForm(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit}>Cancelar</Button>
          <Button onClick={handleEditSave}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={closeDelete}>
        <DialogTitle>Confirmar Eliminação</DialogTitle>
        <DialogContent>
          <Typography>Tem a certeza que quer eliminar esta mensagem?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete}>Não</Button>
          <Button color="error" onClick={confirmDelete}>Sim</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

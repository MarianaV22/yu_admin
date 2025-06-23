import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import axios from 'axios';

import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmailIcon from '@mui/icons-material/Email';
import api from '../utils/api';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if(parts.length === 2) return parts.pop().split(';').shift();
  return "";
}

export default function Dashboard() {
  const theme = useTheme();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAccessories, setTotalAccessories] = useState(0);


  useEffect(() => {
    const token = getCookie('token');
    api.get('/users/stats/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTotalUsers(res.data.totalUsers))
      .catch(err => console.error('Erro ao buscar users:', err));

    api.get('/accessories/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTotalAccessories(res.data.totalAccessories))
      .catch(err => console.error('Erro ao buscar accessories:', err));

  }, []);



  const stats = [
    {
      title: 'Acessórios',
      value: totalAccessories.toString(),
      icon: <ShoppingBagIcon fontSize="large" />,
      gradient: 'linear-gradient(135deg, rgb(243, 215, 188) 0%, #FFAB5C 100%)',
    },
    {
      title: 'Utilizadores YU',
      value: totalUsers.toString(),
      icon: <PersonIcon fontSize="large" />,
      gradient: 'linear-gradient(135deg, rgb(231, 201, 236) 0%, #B653CA 100%)',
    },
    
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Painel administrativo YU!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                height: 180, // Altura fixa para todos os cards
                p: 3,
                borderRadius: 2,
                background: item.gradient,
                color: theme.palette.grey[800],
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ mb: 1 }}>{item.icon}</Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {item.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {item.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

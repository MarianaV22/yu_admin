import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Divider,
  Button,
} from '@mui/material';


import DashboardIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';



const drawerWidth = 240;

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remova aqui tokens ou informações de autenticação conforme necessário
    console.log('Logout efetuado!');
    // Redireciona para a página de login
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Cabeçalho */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#8E5DB1',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>

          {/* Botão de Logout  */}
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              borderRadius: '20px',
              backgroundColor: '#8E5DB1',
              color: '#fff',
              textTransform: 'none',
              px: 2,
              py: 1,
              boxShadow: 'none',
              fontSize: '15px',      // Define o tamanho da fonte
              fontWeight: 'bold',    // Deixa o texto em negrito
              border: '1px solid #fff', // Adiciona uma borda; você pode ajustar a cor conforme desejado
              '&:hover': {
                backgroundColor: '#634B7A',
              },
            }}
          >
            Logout
          </Button>

        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Divider />

        <List sx={{ mt: 1 }}>
          {/* DASHBOARD */}
          <ListItemButton
            component={Link}
            to="/"
            selected={pathname === '/'}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                color: '#8E5DB1',
                '& .MuiListItemIcon-root': {
                  color: '#8E5DB1',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#8E5DB1' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{ fontWeight: 'medium' }}
            />
          </ListItemButton>

          {/* USER */}
          <ListItemButton
            component={Link}
            to="/users"
            selected={pathname === '/users'}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                color: '#8E5DB1',
                '& .MuiListItemIcon-root': {
                  color: '#8E5DB1',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#8E5DB1' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary="Users"
              primaryTypographyProps={{ fontWeight: 'medium' }}
            />
          </ListItemButton>

          {/* ACCESSORIES */}
          <ListItemButton
            component={Link}
            to="/accessories"
            selected={pathname === '/accessories'}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                color: '#8E5DB1',
                '& .MuiListItemIcon-root': {
                  color: '#8E5DB1',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#8E5DB1' }}>
              <ShoppingBagIcon />
            </ListItemIcon>
            <ListItemText
              primary="Accessories"
              primaryTypographyProps={{ fontWeight: 'medium' }}
            />
          </ListItemButton>

            {/* TASK */}
            <ListItemButton
            component={Link}
            to="/tasks"
            selected={pathname === '/task'}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                color: '#8E5DB1',
                '& .MuiListItemIcon-root': {
                  color: '#8E5DB1',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#8E5DB1' }}>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tasks"
              primaryTypographyProps={{ fontWeight: 'medium' }}
            />
          </ListItemButton>

            {/* PresetMessages */}
            <ListItemButton
            component={Link}
            to="/preset_messages"
            selected={pathname === '/preset_messages'}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                color: '#8E5DB1',
                '& .MuiListItemIcon-root': {
                  color: '#8E5DB1',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#8E5DB1' }}>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText
              primary="preset_messages"
              primaryTypographyProps={{ fontWeight: 'medium' }}
            />
          </ListItemButton>

        </List>
      </Drawer>

      {/* Conteúdo */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

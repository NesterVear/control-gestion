
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Description,
  Contacts,
  People,
  Settings,
  NotificationImportant,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
}

const navigationItems: NavItem[] = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
    roles: ['Lector', 'Capturista', 'Administrador', 'SuperRoot'],
  },
  {
    text: 'Capturas',
    icon: <Description />,
    path: '/capturas',
    roles: ['Lector', 'Capturista', 'Administrador', 'SuperRoot'],
  },
  {
    text: 'Directorio Externo',
    icon: <Contacts />,
    path: '/directorio-externo',
    roles: ['Lector', 'Capturista', 'Administrador', 'SuperRoot'],
  },
];

const adminItems: NavItem[] = [
  {
    text: 'Usuarios',
    icon: <People />,
    path: '/usuarios',
    roles: ['SuperRoot'],
  },
  {
    text: 'Test Alertas',
    icon: <NotificationImportant />,
    path: '/test-alertas',
    roles: ['Administrador', 'SuperRoot'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const canAccessItem = (item: NavItem): boolean => {
    if (!user) return false;
    return item.roles.includes(user.rol);
  };

  const isSelected = (path: string): boolean => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ pt: 8 }}> {/* Account for AppBar height */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Navegación Principal
        </Typography>
      </Box>
      
      <List>
        {navigationItems
          .filter(canAccessItem)
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isSelected(item.path)}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.dark',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected(item.path) ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>

      {adminItems.some(canAccessItem) && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Administración
            </Typography>
          </Box>
          
          <List>
            {adminItems
              .filter(canAccessItem)
              .map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={isSelected(item.path)}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      mx: 1,
                      mb: 0.5,
                      borderRadius: 1,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.dark',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isSelected(item.path) ? 'inherit' : 'text.secondary',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Shield as ShieldIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  ManageAccounts as ModeratorIcon,
} from '@mui/icons-material';

const roleColors = {
  admin: '#ff1744',
  moderator: '#ffab00',
  user: '#00e676',
};

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:768px)');

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const navItems = isAuthenticated
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
        ...(user?.role === 'admin'
          ? [{ label: 'Admin Panel', path: '/admin', icon: <AdminIcon /> }]
          : []),
        ...(user?.role === 'moderator'
          ? [{ label: 'Mod Panel', path: '/moderator', icon: <ModeratorIcon /> }]
          : []),
      ]
    : [
        { label: 'Login', path: '/login', icon: <LoginIcon /> },
        { label: 'Register', path: '/register', icon: <RegisterIcon /> },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(10, 25, 41, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 229, 255, 0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
          >
            <ShieldIcon
              sx={{
                color: '#00e5ff',
                fontSize: 32,
                filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.5))',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                background: 'linear-gradient(135deg, #00e5ff, #7c4dff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
              }}
            >
              AuthGuard
            </Typography>
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: isActive(item.path) ? '#00e5ff' : 'text.secondary',
                    position: 'relative',
                    '&::after': isActive(item.path)
                      ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '20%',
                          right: '20%',
                          height: 2,
                          background: 'linear-gradient(90deg, #00e5ff, #7c4dff)',
                          borderRadius: 1,
                        }
                      : {},
                    '&:hover': {
                      color: '#00e5ff',
                      background: 'rgba(0, 229, 255, 0.05)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* User Menu */}
              {isAuthenticated && (
                <>
                  <Chip
                    label={user?.role?.toUpperCase()}
                    size="small"
                    sx={{
                      ml: 1,
                      backgroundColor: `${roleColors[user?.role]}22`,
                      color: roleColors[user?.role],
                      border: `1px solid ${roleColors[user?.role]}44`,
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />
                  <IconButton onClick={handleMenuOpen} sx={{ ml: 0.5 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        background: 'linear-gradient(135deg, #00e5ff, #7c4dff)',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        background: 'rgba(17, 34, 64, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 229, 255, 0.1)',
                        minWidth: 200,
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {user?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: 'rgba(0, 229, 255, 0.08)' }} />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon sx={{ color: '#ff1744' }} />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ color: '#00e5ff' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            background: 'rgba(10, 25, 41, 0.98)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {isAuthenticated && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 1,
                  background: 'linear-gradient(135deg, #00e5ff, #7c4dff)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" fontWeight={700}>
                {user?.name}
              </Typography>
              <Chip
                label={user?.role?.toUpperCase()}
                size="small"
                sx={{
                  mt: 0.5,
                  backgroundColor: `${roleColors[user?.role]}22`,
                  color: roleColors[user?.role],
                  fontWeight: 700,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
          )}
          <Divider sx={{ borderColor: 'rgba(0, 229, 255, 0.08)', mb: 1 }} />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      background: 'rgba(0, 229, 255, 0.1)',
                      color: '#00e5ff',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            {isAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  sx={{ borderRadius: 2, color: '#ff1744' }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

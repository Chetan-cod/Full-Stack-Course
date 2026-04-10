import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Collapse,
  Fade,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Shield as ShieldIcon,
  Group as GroupIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const roleConfig = {
  admin: { color: '#ff1744', icon: <AdminIcon sx={{ fontSize: 16 }} /> },
  moderator: { color: '#ffab00', icon: <ShieldIcon sx={{ fontSize: 16 }} /> },
  user: { color: '#00e676', icon: <PersonIcon sx={{ fontSize: 16 }} /> },
};

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to load users.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data } = await api.patch(`/users/${userId}/role`, { role: newRole });
      setAlert({ show: true, type: 'success', message: data.message });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to update role.',
      });
    }
  };

  const handleDelete = async () => {
    const userId = deleteDialog.user?._id;
    setDeleteDialog({ open: false, user: null });
    try {
      const { data } = await api.delete(`/users/${userId}`);
      setAlert({ show: true, type: 'success', message: data.message });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete user.',
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            background: 'linear-gradient(135deg, rgba(255,23,68,0.08), rgba(124,77,255,0.08))',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 23, 68, 0.1)',
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: 'rgba(255, 23, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GroupIcon sx={{ fontSize: 30, color: '#ff1744' }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    background: 'linear-gradient(135deg, #e3f2fd, #ff1744)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Admin Panel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage users, roles & permissions
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip
                label={`${users.length} Users`}
                sx={{
                  backgroundColor: 'rgba(0, 229, 255, 0.1)',
                  color: '#00e5ff',
                  fontWeight: 700,
                }}
              />
              <Tooltip title="Refresh">
                <IconButton
                  onClick={fetchUsers}
                  sx={{
                    color: '#00e5ff',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    '&:hover': { background: 'rgba(0, 229, 255, 0.1)' },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Alert */}
      <Collapse in={alert.show}>
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
          sx={{ mb: 3 }}
        >
          {alert.message}
        </Alert>
      </Collapse>

      {/* Users Table */}
      <Fade in timeout={800}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            background: 'rgba(17, 34, 64, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 229, 255, 0.08)',
            borderRadius: 3,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress sx={{ color: '#00e5ff' }} />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#00e5ff', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
                    User
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#00e5ff', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#00e5ff', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#00e5ff', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
                    Joined
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#00e5ff', borderBottom: '1px solid rgba(0,229,255,0.1)' }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => {
                  const isCurrentUser = u._id === currentUser?.id;
                  const rc = roleConfig[u.role] || roleConfig.user;
                  return (
                    <TableRow
                      key={u._id}
                      sx={{
                        '&:hover': { background: 'rgba(0, 229, 255, 0.03)' },
                        '& td': { borderBottom: '1px solid rgba(0,229,255,0.05)' },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              background: `linear-gradient(135deg, ${rc.color}44, ${rc.color})`,
                              fontSize: '0.85rem',
                              fontWeight: 700,
                            }}
                          >
                            {u.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {u.name} {isCurrentUser && '(You)'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {u.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {isCurrentUser ? (
                          <Chip
                            icon={rc.icon}
                            label={u.role.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: `${rc.color}22`,
                              color: rc.color,
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              '& .MuiChip-icon': { color: rc.color },
                            }}
                          />
                        ) : (
                          <Select
                            value={u.role}
                            size="small"
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            sx={{
                              minWidth: 130,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: `${rc.color}44`,
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: rc.color,
                              },
                              '& .MuiSelect-select': {
                                color: rc.color,
                                fontWeight: 600,
                                fontSize: '0.85rem',
                              },
                            }}
                          >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="moderator">Moderator</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {!isCurrentUser ? (
                          <Tooltip title="Delete User">
                            <IconButton
                              onClick={() => setDeleteDialog({ open: true, user: u })}
                              sx={{
                                color: '#ff1744',
                                '&:hover': {
                                  background: 'rgba(255, 23, 68, 0.1)',
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">No users found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Fade>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        PaperProps={{
          sx: {
            background: 'rgba(17, 34, 64, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 23, 68, 0.2)',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: '#ff1744' }}>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong style={{ color: '#e3f2fd' }}>{deleteDialog.user?.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, user: null })}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              background: '#ff1744',
              '&:hover': { background: '#d50000' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

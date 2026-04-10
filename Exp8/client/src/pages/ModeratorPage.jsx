import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip, Alert, Collapse, Fade,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Avatar, Tooltip, TextField,
} from '@mui/material';
import {
  Edit as EditIcon, Close as CloseIcon, Save as SaveIcon,
  Group as GroupIcon, Refresh as RefreshIcon, Shield as ShieldIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const roleConfig = {
  admin:     { color: '#ff1744' },
  moderator: { color: '#ffab00' },
  user:      { color: '#00e676' },
};

export default function ModeratorPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const [editDialog, setEditDialog] = useState({ open: false, user: null, name: '', email: '' });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch (error) {
      setAlert({ show: true, type: 'error', message: error.response?.data?.message || 'Failed to load users.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openEdit = (u) => setEditDialog({ open: true, user: u, name: u.name, email: u.email });
  const closeEdit = () => setEditDialog({ open: false, user: null, name: '', email: '' });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch(`/users/${editDialog.user._id}`, {
        name: editDialog.name,
        email: editDialog.email,
      });
      setAlert({ show: true, type: 'success', message: data.message });
      setUsers(prev => prev.map(u => u._id === editDialog.user._id ? { ...u, name: editDialog.name, email: editDialog.email } : u));
      closeEdit();
    } catch (error) {
      setAlert({ show: true, type: 'error', message: error.response?.data?.message || 'Failed to update user.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Fade in timeout={600}>
        <Paper elevation={0} sx={{
          p: { xs: 3, md: 4 }, mb: 4,
          background: 'linear-gradient(135deg, rgba(255,171,0,0.08), rgba(124,77,255,0.08))',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 171, 0, 0.15)', borderRadius: 4,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 56, height: 56, borderRadius: 3, background: 'rgba(255,171,0,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldIcon sx={{ fontSize: 30, color: '#ffab00' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ background: 'linear-gradient(135deg, #e3f2fd, #ffab00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Moderator Panel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and edit regular users
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                icon={<PersonIcon />}
                label={`${users.length} Users`}
                sx={{ backgroundColor: 'rgba(255,171,0,0.1)', color: '#ffab00', fontWeight: 700, '& .MuiChip-icon': { color: '#ffab00' } }}
              />
              <Tooltip title="Refresh">
                <IconButton onClick={fetchUsers} sx={{ color: '#ffab00', border: '1px solid rgba(255,171,0,0.2)', '&:hover': { background: 'rgba(255,171,0,0.1)' } }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Permissions info */}
          <Box sx={{ mt: 3, p: 2, borderRadius: 2, background: 'rgba(255,171,0,0.05)', border: '1px solid rgba(255,171,0,0.1)' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Your Permissions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
              {[
                { label: '✅ View regular users', ok: true },
                { label: '✅ Edit name & email', ok: true },
                { label: '❌ Change roles', ok: false },
                { label: '❌ Delete users', ok: false },
                { label: '❌ Manage admins', ok: false },
              ].map(item => (
                <Chip key={item.label} label={item.label} size="small"
                  sx={{ backgroundColor: item.ok ? 'rgba(0,230,118,0.08)' : 'rgba(255,23,68,0.08)',
                    color: item.ok ? '#00e676' : '#ff1744', fontSize: '0.75rem' }} />
              ))}
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Alert */}
      <Collapse in={alert.show}>
        <Alert severity={alert.type} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      </Collapse>

      {/* Users Table */}
      <Fade in timeout={800}>
        <TableContainer component={Paper} elevation={0} sx={{
          background: 'rgba(17, 34, 64, 0.6)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,171,0,0.08)', borderRadius: 3,
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress sx={{ color: '#ffab00' }} />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <TableCell key={h} align={h === 'Actions' ? 'center' : 'left'}
                      sx={{ fontWeight: 700, color: '#ffab00', borderBottom: '1px solid rgba(255,171,0,0.1)' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(u => {
                  const rc = roleConfig[u.role] || roleConfig.user;
                  const isCurrentUser = u._id === currentUser?.id;
                  return (
                    <TableRow key={u._id} sx={{ '&:hover': { background: 'rgba(255,171,0,0.03)' }, '& td': { borderBottom: '1px solid rgba(255,171,0,0.05)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${rc.color}44, ${rc.color})`, fontSize: '0.85rem', fontWeight: 700 }}>
                            {u.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{u.email}</Typography></TableCell>
                      <TableCell>
                        <Chip label={u.role.toUpperCase()} size="small"
                          sx={{ backgroundColor: `${rc.color}22`, color: rc.color, fontWeight: 700, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{new Date(u.createdAt).toLocaleDateString()}</Typography></TableCell>
                      <TableCell align="center">
                        {!isCurrentUser ? (
                          <Tooltip title="Edit User">
                            <IconButton onClick={() => openEdit(u)}
                              sx={{ color: '#ffab00', '&:hover': { background: 'rgba(255,171,0,0.1)' } }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="text.secondary">—</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {users.length === 0 && (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No users found.</Typography>
                  </TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Fade>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={closeEdit} maxWidth="xs" fullWidth
        PaperProps={{ sx: { background: 'rgba(17, 34, 64, 0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,171,0,0.2)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#ffab00', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Edit User
          <IconButton onClick={closeEdit} size="small" sx={{ color: 'text.secondary' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Update name and email for <strong style={{ color: '#e3f2fd' }}>{editDialog.user?.name}</strong>.
          </DialogContentText>
          <TextField fullWidth label="Name" value={editDialog.name}
            onChange={e => setEditDialog(d => ({ ...d, name: e.target.value }))}
            sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Email" type="email" value={editDialog.email}
            onChange={e => setEditDialog(d => ({ ...d, email: e.target.value }))}
            size="small" />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeEdit} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}
            sx={{ background: '#ffab00', color: '#0a1929', '&:hover': { background: '#ffc107' } }}>
            {saving ? <CircularProgress size={20} sx={{ color: '#0a1929' }} /> : <><SaveIcon sx={{ mr: 0.5, fontSize: 18 }} />Save</>}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

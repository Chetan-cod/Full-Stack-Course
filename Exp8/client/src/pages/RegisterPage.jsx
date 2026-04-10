import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, Paper, Typography, TextField, Button, Alert,
  CircularProgress, InputAdornment, IconButton, Fade,
  Collapse, Link,
} from '@mui/material';
import {
  Email as EmailIcon, Lock as LockIcon, Person as PersonIcon,
  Visibility, VisibilityOff, PersonAdd as PersonAddIcon,
} from '@mui/icons-material';


export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', role: 'user' },
  });

  const password = watch('password');

  const onSubmit = async (formData) => {
    setAlert({ show: false, type: 'info', message: '' });
    const result = await registerUser(formData.name, formData.email, formData.password, formData.role);
    if (result.success) {
      setAlert({ show: true, type: 'success', message: 'Account created! Redirecting...' });
      setTimeout(() => navigate('/dashboard'), 800);
    } else {
      setAlert({ show: true, type: 'error', message: result.message });
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Fade in timeout={600}>
        <Paper elevation={0} sx={{
          p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 480,
          background: 'rgba(17, 34, 64, 0.6)', backdropFilter: 'blur(30px)',
          border: '1px solid rgba(124, 77, 255, 0.15)', borderRadius: 4,
          position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #7c4dff, #00e5ff, #7c4dff)',
            backgroundSize: '200% 100%', animation: 'shimmer 3s infinite linear',
          },
          '@keyframes shimmer': { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(124,77,255,0.15), rgba(0,229,255,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PersonAddIcon sx={{ fontSize: 36, color: '#7c4dff', filter: 'drop-shadow(0 0 10px rgba(124, 77, 255, 0.5))' }} />
            </Box>
            <Typography variant="h4" sx={{ background: 'linear-gradient(135deg, #e3f2fd, #7c4dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 0.5 }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">Join us and start your secure journey</Typography>
          </Box>

          {/* Alert */}
          <Collapse in={alert.show}>
            <Alert severity={alert.type} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 3 }}>
              {alert.message}
            </Alert>
          </Collapse>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name */}
            <TextField fullWidth id="register-name" label="Full Name" autoComplete="name"
              error={!!errors.name} helperText={errors.name?.message} disabled={loading} sx={{ mb: 2.5 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
            />

            {/* Email */}
            <TextField fullWidth id="register-email" label="Email Address" type="email" autoComplete="email"
              error={!!errors.email} helperText={errors.email?.message} disabled={loading} sx={{ mb: 2.5 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
              {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Please enter a valid email address' } })}
            />

            {/* Password */}
            <TextField fullWidth id="register-password" label="Password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
              error={!!errors.password} helperText={errors.password?.message} disabled={loading} sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: 'text.secondary' }}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
              }}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            />

            {/* Confirm Password */}
            <TextField fullWidth id="register-confirm-password" label="Confirm Password" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
              error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} disabled={loading} sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small" sx={{ color: 'text.secondary' }}>{showConfirm ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
              }}
              {...register('confirmPassword', { required: 'Please confirm your password', validate: v => v === password || 'Passwords do not match' })}
            />

            <Button type="submit" fullWidth variant="contained" disabled={loading} id="register-submit-btn"
              sx={{ py: 1.5, fontSize: '1rem', background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)', '&:hover': { background: 'linear-gradient(135deg, #b47cff 0%, #6effff 100%)' } }}>
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Account'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: '#7c4dff', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}

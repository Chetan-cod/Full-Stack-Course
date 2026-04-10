import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Collapse,
  Link,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Shield as ShieldIcon,
} from '@mui/icons-material';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const emailValue    = watch('email');
  const passwordValue = watch('password');

  const demoCredentials = [
    { label: 'Admin',     email: 'admin@example.com', password: 'admin123', color: '#ff1744', bg: 'rgba(255,23,68,0.08)',   border: 'rgba(255,23,68,0.2)' },
    { label: 'Moderator', email: 'mod@example.com',   password: 'mod123',   color: '#ffab00', bg: 'rgba(255,171,0,0.08)', border: 'rgba(255,171,0,0.2)' },
    { label: 'User',      email: 'user@example.com',  password: 'user123',  color: '#00e676', bg: 'rgba(0,230,118,0.08)', border: 'rgba(0,230,118,0.2)' },
  ];

  const fillDemo = (cred) => {
    setValue('email',    cred.email,    { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue('password', cred.password, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const onSubmit = async (formData) => {
    setAlert({ show: false, type: 'info', message: '' });
    const result = await login(formData.email, formData.password);

    if (result.success) {
      setAlert({ show: true, type: 'success', message: result.message });
      setTimeout(() => navigate('/dashboard'), 800);
    } else {
      setAlert({ show: true, type: 'error', message: result.message });
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            width: '100%',
            maxWidth: 460,
            background: 'rgba(17, 34, 64, 0.6)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(0, 229, 255, 0.1)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: 'linear-gradient(90deg, #00e5ff, #7c4dff, #00e5ff)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s infinite linear',
            },
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '200% 0' },
              '100%': { backgroundPosition: '-200% 0' },
            },
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,77,255,0.15))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldIcon
                sx={{
                  fontSize: 36,
                  color: '#00e5ff',
                  filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.5))',
                }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                background: 'linear-gradient(135deg, #e3f2fd, #00e5ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your secure dashboard
            </Typography>
          </Box>

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

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              id="login-email"
              label="Email Address"
              type="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
              sx={{ mb: 2.5 }}
              InputLabelProps={{ shrink: !!emailValue }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
            />

            <TextField
              fullWidth
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
              sx={{ mb: 3 }}
              InputLabelProps={{ shrink: !!passwordValue }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              id="login-submit-btn"
              sx={{
                py: 1.5,
                fontSize: '1rem',
                position: 'relative',
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#0a1929' }} />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  color: '#00e5ff',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>

          {/* Demo credentials */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" color="text.secondary"
              sx={{ display: 'block', mb: 1, fontWeight: 600, textAlign: 'center', letterSpacing: 0.5 }}
            >
              🔑 Demo Credentials — click to auto-fill
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {demoCredentials.map((cred) => (
                <Tooltip key={cred.label} title={`Click to fill ${cred.label} credentials`} arrow>
                  <Box
                    onClick={() => fillDemo(cred)}
                    sx={{
                      flex: 1, p: 1.2, borderRadius: 2, cursor: 'pointer',
                      background: cred.bg, border: `1px solid ${cred.border}`,
                      transition: 'all 0.2s',
                      '&:hover': { background: cred.border, transform: 'translateY(-2px)' },
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: cred.color, mb: 0.3 }}>
                      {cred.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                      {cred.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                      {cred.password}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}

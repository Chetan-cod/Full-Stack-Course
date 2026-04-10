import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Fade,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Security as SecurityIcon,
  VerifiedUser as VerifiedIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const roleConfig = {
  admin: { color: '#ff1744', icon: <AdminIcon />, label: 'Administrator' },
  moderator: { color: '#ffab00', icon: <ShieldIcon />, label: 'Moderator' },
  user: { color: '#00e676', icon: <PersonIcon />, label: 'User' },
};

const stats = [
  {
    title: 'Security Level',
    value: 'High',
    icon: <SecurityIcon sx={{ fontSize: 28 }} />,
    color: '#00e5ff',
    progress: 92,
  },
  {
    title: 'Authentication',
    value: 'JWT Active',
    icon: <VerifiedIcon sx={{ fontSize: 28 }} />,
    color: '#00e676',
    progress: 100,
  },
  {
    title: 'Session',
    value: '24h Token',
    icon: <ShieldIcon sx={{ fontSize: 28 }} />,
    color: '#7c4dff',
    progress: 75,
  },
  {
    title: 'API Access',
    value: 'Protected',
    icon: <SpeedIcon sx={{ fontSize: 28 }} />,
    color: '#ffab00',
    progress: 88,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const roleInfo = roleConfig[user?.role] || roleConfig.user;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Welcome Section */}
      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(124,77,255,0.08))',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(0, 229, 255, 0.1)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: `linear-gradient(135deg, ${roleInfo.color}44, ${roleInfo.color})`,
                fontSize: '2rem',
                fontWeight: 800,
                boxShadow: `0 4px 30px ${roleInfo.color}33`,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography
                variant="h4"
                sx={{
                  background: 'linear-gradient(135deg, #e3f2fd, #00e5ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                Welcome, {user?.name}!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
                {user?.email}
              </Typography>
              <Chip
                icon={roleInfo.icon}
                label={roleInfo.label}
                sx={{
                  backgroundColor: `${roleInfo.color}22`,
                  color: roleInfo.color,
                  border: `1px solid ${roleInfo.color}44`,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  px: 1,
                  '& .MuiChip-icon': { color: roleInfo.color },
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Fade in timeout={600 + index * 150}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  background: 'rgba(17, 34, 64, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 229, 255, 0.08)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    border: `1px solid ${stat.color}33`,
                    boxShadow: `0 8px 30px ${stat.color}15`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
                >
                  {stat.title}
                </Typography>
                <Typography variant="h6" sx={{ color: stat.color, mt: 0.5, mb: 1.5 }}>
                  {stat.value}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stat.progress}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                      background: `linear-gradient(90deg, ${stat.color}, ${stat.color}88)`,
                    },
                  }}
                />
              </Paper>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Auth Info */}
      <Fade in timeout={1200}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 4,
            background: 'rgba(17, 34, 64, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 229, 255, 0.08)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: '#00e5ff', mb: 2 }}>
            🔐 Authentication Details
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Token Type', value: 'JWT (JSON Web Token)' },
              { label: 'Expiry', value: '24 hours' },
              { label: 'Storage', value: 'localStorage' },
              { label: 'Auth Method', value: 'Bearer Token' },
              { label: 'Role', value: user?.role?.toUpperCase() },
              { label: 'User ID', value: user?.id?.slice(-8) || 'N/A' },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.label}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(0, 229, 255, 0.03)',
                    border: '1px solid rgba(0, 229, 255, 0.06)',
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Fade>
    </Box>
  );
}

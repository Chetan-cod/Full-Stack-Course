import { Box, Paper, Typography, Button, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Block as BlockIcon } from '@mui/icons-material';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

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
            p: { xs: 4, sm: 6 },
            textAlign: 'center',
            maxWidth: 480,
            background: 'rgba(17, 34, 64, 0.6)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 23, 68, 0.15)',
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              borderRadius: '50%',
              background: 'rgba(255, 23, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BlockIcon
              sx={{
                fontSize: 44,
                color: '#ff1744',
                filter: 'drop-shadow(0 0 10px rgba(255, 23, 68, 0.5))',
              }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{
              background: 'linear-gradient(135deg, #e3f2fd, #ff1744)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            You don't have permission to access this page.
            Please contact an administrator if you believe this is an error.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              borderColor: 'rgba(0, 229, 255, 0.3)',
              color: '#00e5ff',
              '&:hover': {
                borderColor: '#00e5ff',
                background: 'rgba(0, 229, 255, 0.05)',
              },
            }}
          >
            Go Back
          </Button>
        </Paper>
      </Fade>
    </Box>
  );
}

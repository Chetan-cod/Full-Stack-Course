import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
      light: '#6effff',
      dark: '#00b2cc',
      contrastText: '#0a1929',
    },
    secondary: {
      main: '#7c4dff',
      light: '#b47cff',
      dark: '#3f1dcb',
    },
    background: {
      default: '#0a1929',
      paper: 'rgba(17, 34, 64, 0.8)',
    },
    error: {
      main: '#ff1744',
    },
    success: {
      main: '#00e676',
    },
    warning: {
      main: '#ffab00',
    },
    text: {
      primary: '#e3f2fd',
      secondary: 'rgba(176, 190, 210, 0.8)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a1929 0%, #0d2137 40%, #0a1929 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 229, 255, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          textTransform: 'none',
          fontSize: '0.95rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #00e5ff 0%, #7c4dff 100%)',
          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6effff 0%, #b47cff 100%)',
            boxShadow: '0 6px 30px rgba(0, 229, 255, 0.5)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(0, 229, 255, 0.15)',
              transition: 'all 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 229, 255, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00e5ff',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;

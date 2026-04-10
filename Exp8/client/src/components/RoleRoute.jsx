import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

/**
 * RoleRoute — restricts access to specific roles.
 * Must be used inside ProtectedRoute or after auth check.
 */
export default function RoleRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress
          sx={{
            color: '#7c4dff',
            filter: 'drop-shadow(0 0 10px rgba(124, 77, 255, 0.5))',
          }}
        />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

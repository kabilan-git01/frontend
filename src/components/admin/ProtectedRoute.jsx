import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppProvider';

export default function ProtectedRoute({ children }) {
  const { auth } = useApp();
  const location = useLocation();

  if (!auth.isAuthenticated || auth.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

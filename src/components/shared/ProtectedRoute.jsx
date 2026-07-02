import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppProvider';
import { LoadingSpinner } from '../ui/SectionHeader';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { auth } = useApp();
  const location = useLocation();

  if (auth.loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

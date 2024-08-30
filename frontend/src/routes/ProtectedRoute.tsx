import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: ('ADMIN' | 'USER')[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuth, user, isInitialized, isLoading } = useContext(AuthContext);

  if (!isInitialized || isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.perfil)) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
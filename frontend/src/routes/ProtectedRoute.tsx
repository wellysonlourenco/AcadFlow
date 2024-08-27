import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';


interface ProtectedRouteProps {
  allowedRoles?: ('ADMIN' | 'USER')[];
}


export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuth, user, isInitialized } = useContext(AuthContext);

  if (!isInitialized) {
    return <div>Carregando...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.perfil)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { isAuth } = useContext(AuthContext);

  if (!isAuth) {
    <Navigate to="/sign-in" replace />;
  } 

  return <Outlet />;
};
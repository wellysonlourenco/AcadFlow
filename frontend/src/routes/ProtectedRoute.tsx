import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';


interface ProtectedRouteProps {
  allowedRoles?: ('ADMIN' | 'USER')[];
}


export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuth, user } = useContext(AuthContext);

  if (!isAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.perfil)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};


// export const ProtectedRoute = () => {
//   const { isAuth } = useContext(AuthContext);

//   if (!isAuth) {
//     <Navigate to="/sign-in" replace />;
//   }

//   return <Outlet />;
// };
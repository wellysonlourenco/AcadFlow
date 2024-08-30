import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { AdminDashboard } from './admin-dashboard';
import { UserDashboard } from './user-dashboard';

export function Dashboard() {
    const { user } = useContext(AuthContext);

    return (
        <>
            {user?.perfil === 'ADMIN' ? <AdminDashboard /> : <UserDashboard />}
        </>
    );
};
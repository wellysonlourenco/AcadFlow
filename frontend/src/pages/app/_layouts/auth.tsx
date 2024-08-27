import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function AuthLayout() {
    const { isAuth } = useContext(AuthContext);

    if (isAuth) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
            <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
                <div className='relative z-20 flex items-center text-lg font-medium'>

                    <img src="/logo.png" alt="Logo" className="h-12 w-12" />
                    <span className='font-semibold'>AcadFlow - Sistema de Gerenciamento</span>

                </div>
                <div className='relative z-20 mt-auto'>

                    <footer className='text-sm'>
                        Wellyson Lourenço &copy; AcadFlow - {new Date().getFullYear()}

                    </footer>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center relative'>
                <Outlet />
            </div>
        </div>
    )
}
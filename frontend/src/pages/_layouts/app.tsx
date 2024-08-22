import { Header } from "@/components/header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
    // const { isAuth } = useContext(AuthContext);

    // if (!isAuth) {
    //   return <Navigate to="/sign-in" replace />;
    // } 

    return (
        <div className='relative h-full overflow-hidden bg-background'>
            <Header />

            <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
                <Outlet />
            </div>
        </div>
    )
}
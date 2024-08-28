import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { AuthContext } from "@/context/AuthContext";
import { Calendar, GraduationCap, Home, Menu, QrCode, Tags } from "lucide-react";
import { useContext } from "react";
import { NavLink } from "./nav-link";
import { Button } from "./ui/button";

export function SheetMobile() {
    const { user } = useContext(AuthContext);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="flex flex-col space-y-4 mt-6">
                    <NavLink to="/">
                        <Home className="h-4 w-4 mr-2" /> Inicio
                    </NavLink>
                    <NavLink to="/events">
                        <Calendar className="h-4 w-4 mr-2" /> Eventos
                    </NavLink>
                    <NavLink to="/inscricoes">
                        <QrCode className="h-4 w-4 mr-2" /> Inscrições
                    </NavLink>
                    <NavLink to="/certificates">
                        <GraduationCap className="h-4 w-4 mr-2" /> Certificado
                    </NavLink>
                    {user && user.perfil === 'ADMIN' && (
                        <NavLink to="/categories">
                            <Tags className="h-4 w-4" /> Categoria
                        </NavLink>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
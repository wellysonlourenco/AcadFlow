import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar, GraduationCap, Home, Menu, QrCode } from "lucide-react";
import { NavLink } from "./nav-link";
import { Button } from "./ui/button";

export function SheetMobile() {
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
                </nav>
            </SheetContent>
        </Sheet>
    )
}
import { Calendar, GraduationCap, Home, QrCode } from "lucide-react";
import { AccountMenu } from "./account-menu";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme/theme-toggle";
import { Separator } from "./ui/separator";

export function Header() {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center gap-6 px-6">
                <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
                <span>AcadFlow</span>
                <Separator orientation="vertical" className="h-6" />

                <nav className="flex items-center space-x-4 lg:space-x-6">
                    <NavLink to="/">
                        <Home className="h-4 w-4" /> Inicio
                    </NavLink>
                    <NavLink to="/events">
                        <Calendar className="h-4 w-4" /> Eventos
                    </NavLink>
                    <NavLink to="/inscricoes">
                        <QrCode className="h-4 w-4" /> Inscrições
                    </NavLink>
                    <NavLink to="/certificates">
                        <GraduationCap className="h-4 w-4" /> Certificado
                    </NavLink>
                </nav>
                <div className="ml-auto flex items-center gap-2">
                    <ThemeToggle />
                    <AccountMenu />
                </div>
            </div>
        </div>
    )
}
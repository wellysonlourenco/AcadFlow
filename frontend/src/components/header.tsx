import { AuthContext } from "@/context/AuthContext";
import { Calendar, CircleCheck, FileText, GraduationCap, Home, QrCode, Tags } from "lucide-react";
import { useContext } from "react";
import { AccountMenu } from "./account-menu";
import { NavLink } from "./nav-link";
import { SheetMobile } from "./sheet-mobile";
import { ThemeToggle } from "./theme/theme-toggle";
import { Separator } from "./ui/separator";

export function Header() {
    const { user } = useContext(AuthContext);

    return (
        <div className="border-b">
            <div className="flex h-16 items-center gap-6 px-6">
                <img src="/logo-header.png" alt="Logo" className="h-10 w-10" />
                <span className="hidden md:inline">AcadFlow</span>
                <Separator orientation="vertical" className="h-6 hidden md:block" />

                <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <NavLink to="/">
                        <Home className="h-4 w-4" /> Inicio
                    </NavLink>
                    <NavLink to="/events">
                        <Calendar className="h-4 w-4" /> Eventos
                    </NavLink>
                    {user && user.perfil === 'ADMIN' && (
                        <NavLink to="/categories">
                            <Tags className="h-4 w-4" /> Categoria
                        </NavLink>
                    )}
                    <NavLink to="/inscricoes">
                        <QrCode className="h-4 w-4" /> Inscrições
                    </NavLink>
                    <NavLink to="/certificates">
                        <GraduationCap className="h-4 w-4" /> Certificado
                    </NavLink>
                    {user && user.perfil === 'ADMIN' && (
                        <NavLink to="/validate-presence">
                            <CircleCheck className="h-4 w-4" /> Validar Presença
                        </NavLink>
                    )}
                    {user && user.perfil === 'ADMIN' && (
                        <NavLink to="/validate-presence">
                            <FileText className="h-4 w-4" /> Relatórios
                        </NavLink>
                    )}
                </nav>
                <SheetMobile />
                {/* <Separator orientation="vertical" className="h-6 hidden md:block" /> */}
                <div className="ml-auto flex items-center gap-2">
                    <ThemeToggle />
                    <AccountMenu />
                </div>
            </div>
        </div>
    )
}
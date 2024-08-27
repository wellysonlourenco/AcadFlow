import { Calendar, GraduationCap, Home, QrCode } from "lucide-react";
import { AccountMenu } from "./account-menu";
import { NavLink } from "./nav-link";
import { SheetMobile } from "./sheet-mobile";
import { ThemeToggle } from "./theme/theme-toggle";
import { Separator } from "./ui/separator";

export function Header() {
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
                    <NavLink to="/inscricoes">
                        <QrCode className="h-4 w-4" /> Inscrições
                    </NavLink>
                    <NavLink to="/certificates">
                        <GraduationCap className="h-4 w-4" /> Certificado
                    </NavLink>
                </nav>
                <SheetMobile />
                {/* <Sheet>
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
                </Sheet> */}


                <div className="ml-auto flex items-center gap-2">
                    <ThemeToggle />
                    <AccountMenu />
                </div>
            </div>
        </div>
    )
}
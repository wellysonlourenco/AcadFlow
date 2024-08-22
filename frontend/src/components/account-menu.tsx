import { ChevronDown, LogOut, User } from "lucide-react";
import { AvatarUser } from "./avatar-user";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function AccountMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 select-none">
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-medium">Wellyson Lourenco</span>
                        <span className="text-xs font-normal text-muted-foreground">wellyson@ifms.edu.br</span>
                    </div>
                    <AvatarUser />
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-rose-500 dark:text-rose-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sair</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
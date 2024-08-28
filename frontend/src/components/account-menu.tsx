import { AuthContext } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, LogOut, Ticket, User } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface UserResponseProfile {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    avatar: string;
}



export function AccountMenu() {
    const { signOut, user } = useContext(AuthContext);
    const queryClient = useQueryClient();


    const usuarioId = user?.id as number;


    const { data: userProfile, isLoading } = useQuery<UserResponseProfile>({
        queryKey: ["user-profile", usuarioId],
        queryFn: async () => {
            const response = await api.get(`/usuario/me/${usuarioId}`);
            return response.data;
        },
        enabled: !!usuarioId,
        placeholderData: keepPreviousData,
    });



    console.log("User Profile:", userProfile);

    if (isLoading) {
        return null;
    }


    const handleSignOut = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        signOut();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 select-none">
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-medium">{userProfile?.nome}</span>
                        <span className="text-xs font-normal text-muted-foreground">{userProfile?.email}</span>
                    </div>
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={userProfile?.avatar} alt="@shadcn" />
                        <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                    <Link to="/minha-conta" className="flex items-center gap-2">
                        <User className="w-4 h-4 mr-2" />
                        <span>Minha Conta</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to="/inscricoes" className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 mr-2" />
                        <span>Inscrições</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-rose-500 dark:text-rose-400" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sair</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Users2Icon } from "lucide-react";
import { useContext } from "react";

export interface TotalUsuariosResponse {
    totalUsers: number;
    adminCount: number;
    userCount: number;
}

export function TotalUsuariosCard() {

    const { data: totalCadastrados } = useQuery<TotalUsuariosResponse>({
        queryKey: ['total-usuarios'],
        queryFn: async () => {
            const response = await api.get(`/usuario/count`);
            return response.data;
        },
        retry: false, // Não tenta recarregar a página automaticamente
    })


    return (
        <Card>
            <CardHeader className="flex-row items-center space-y-0 justify-between pb-2">
                <CardTitle className="text-base font-semibold">Usuários Cadastrados</CardTitle>
                <Users2Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">
                    {totalCadastrados?.totalUsers ?? 0} usuários
                </span>
                <div className="text-sm text-muted-foreground">
                    <p>Administradores: {totalCadastrados?.adminCount ?? 0}</p>
                    <p>Participantes: {totalCadastrados?.userCount ?? 0}</p>
                </div>
            </CardContent>
        </Card>
    );
}
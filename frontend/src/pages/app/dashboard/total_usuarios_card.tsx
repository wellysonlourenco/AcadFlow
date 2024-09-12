import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {  Users2Icon } from "lucide-react";
import { useContext } from "react";

export interface TotalUsuariosResponse {
    total: number;
  }

export function TotalUsuariosCard() {
    const { user } = useContext(AuthContext);
    const usuarioId = user?.id as number;


    const { data: totalCadastrados, error, isLoading } = useQuery<TotalUsuariosResponse>({
        queryKey: ['total-usuarios'],
        queryFn: async () => {
            const response = await api.get(`/usuario/count`);
            return response.data;
        },
        refetchInterval: 1000 * 60 * 5,
        placeholderData:  { total: 0 },
        retry: false, // Evita tentativas de reexecução automática em caso de erro
    })

    if (isLoading) {
        return <div>Loading...</div>; // Pode personalizar a mensagem de carregamento
    }

    if (error) {
        return <div>Error loading data</div>; // Pode personalizar a mensagem de erro
    }

    return (
        <Card>
            <CardHeader className="flex-row items-center space-y-0 justify-between pb-2">
                <CardTitle className="text-base font-semibold">Usuarios Cadastrados</CardTitle>
                <Users2Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">{totalCadastrados?.total ?? 0}</span>
            </CardContent>
        </Card>
    );
}
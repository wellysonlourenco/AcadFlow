import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { CalendarX } from "lucide-react";
import { useContext } from "react";

export interface CargaHorariaTotalCardProps {
    usuarioId: number;
    totalHoras: number;
}



export function CargaHorariaTotalCard() {
    const { user } = useContext(AuthContext);



    const usuarioId = user?.id as number;


    const { data: totalHoras } = useQuery<CargaHorariaTotalCardProps>({
        queryKey: ['carga-horaria-total', usuarioId],
        queryFn: async () => {
            const response = await api.get(`/certificado/usuario/${usuarioId}/carga-horaria`);
            return response.data;
        },
        refetchInterval: 1000 * 60 * 5,
        staleTime: 0,  // Dados são sempre considerados obsoletos
        refetchOnWindowFocus: true,
        placeholderData: { usuarioId, totalHoras: 0 },
    })


    return (
        <Card>
            <CardHeader className="flex-row items-center space-y-0 justify-between pb-2">
                <CardTitle className="text-base font-semibold">Total da Carga Horária de Todos os Certificados</CardTitle>
                <CalendarX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">{totalHoras?.totalHoras} horas</span>
                {/* <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500 dark:text-emerald-400">-2 %</span> em relação ao mês passado.
                </p> */}
            </CardContent>
        </Card>
    );
}
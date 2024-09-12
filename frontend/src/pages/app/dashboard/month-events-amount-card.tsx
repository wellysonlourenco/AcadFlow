import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck } from "lucide-react";


export interface TotalEventosUltimoMesResponse {
    count: number;
  }


export function MonthEventsAmountCard() {


    const { data :  totalEventosUltimoMes } = useQuery<TotalEventosUltimoMesResponse>({
        queryKey: ['total-eventos-ultimo-mes'],
        queryFn: async () => {
            const response = await api.get('/evento/recent-count');
            return response.data;
        },
        refetchInterval: 1000 * 60 * 5,
        staleTime: 0,  // Dados são sempre considerados obsoletos
        refetchOnWindowFocus: true,
        placeholderData: { count: 0 },
    });


    return (
        <Card>
            <CardHeader className="flex-row items-center space-y-0 justify-between pb-2">
                <CardTitle className="text-sm font-semibold">Total de Eventos Cadastrados nos últimos 30 dias</CardTitle>
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">{totalEventosUltimoMes?.count} eventos</span>
                {/* <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500 dark:text-emerald-400">+2 %</span> em relação ao mês passado.
                </p> */}
            </CardContent>
        </Card>
    );
}
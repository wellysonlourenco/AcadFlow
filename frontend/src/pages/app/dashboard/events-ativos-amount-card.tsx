import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { QrCode } from "lucide-react";

export interface EventosAtivosResponse {
    count: number;
  }

//   /evento/active-count

export function TotalEventosAbertoCard() {

    const { data :  eventosAtivos } = useQuery<EventosAtivosResponse>({
        queryKey: ['eventos-ativos'],
        queryFn: async () => {
            const response = await api.get('/evento/count-ativo');
            return response.data;
        },
        placeholderData: { count: 0 },
    });



    return (
        <Card>
            <CardHeader className="flex-row items-center space-y-0 justify-between pb-2">
                <CardTitle className="text-base font-semibold">Eventos com inscrições abertas</CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">{eventosAtivos?.count} Eventos</span>
                <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 dark:text-green-400">Visualizar cards de eventos abertos para inscrição</span>
                </p>
            </CardContent>
        </Card>
    );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import colors from 'tailwindcss/colors';


// const data = [
//     { date: 'Fevereiro', revenue: 15 },
//     { date: 'Março', revenue: 25 },
//     { date: 'Abril', revenue: 45 },
//     { date: 'Maio', revenue: 50 },
//     { date: 'Junho', revenue: 5 },
//     { date: 'Julho', revenue: 2 },
//     { date: 'Agosto', revenue: 25 },
// ]


export interface CargaHorariaMensalResponse {
    usuarioId: number;
    cargaHorariaMensal: CargaHorariaMensal[];
}

export interface CargaHorariaMensal {
    mes: string;
    totalHoras: number;
}


// Componente de Tooltip personalizado
const CustomTooltip = ({ payload }: any) => {
    if (!payload || payload.length === 0) return null;

    // Obtém o valor do payload
    const value = payload[0]?.value;

    return (
        <div className="bg-gray-800 text-white p-2 rounded">
            <p className="text-center text-lg">{value} horas</p>
        </div>
    );
};



export function MovimentacaoCargaHorariaGrafico() {
    const { user } = useContext(AuthContext);

    const usuarioId = user?.id as number;

    const { data: totalHoras } = useQuery<CargaHorariaMensalResponse>({
        queryKey: ['carga-horaria-mensal', usuarioId],
        queryFn: async () => {
            const response = await api.get(`/certificado/usuario/${usuarioId}/carga-horaria-mensal`);
            return response.data;
        },
        refetchInterval: 1000 * 60 * 5,
        staleTime: 0,  // Dados são sempre considerados obsoletos
        refetchOnWindowFocus: true,
        placeholderData: { usuarioId, cargaHorariaMensal: [] },
    })

    const data = totalHoras?.cargaHorariaMensal.map((item) => ({
        date: item.mes,  // MM/YYYY format
        revenue: item.totalHoras,  // Horas acumuladas
    })) || [];

    const [opacity, setOpacity] = useState({ revenue: 1 });

    const handleMouseEnter = (o: any) => {
        const { dataKey } = o;
        setOpacity({ ...opacity, [dataKey]: 0.5 });
    };

    // Função de handle para mouse leave na legenda
    const handleMouseLeave = (o: any) => {
        const { dataKey } = o;
        setOpacity({ ...opacity, [dataKey]: 1 });
    };

    return (
        <Card className="col-span-6">
            <CardHeader className="flex-row items-center justify-between pb-8">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium">Somatória mensal da carga horária dos certificados</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={data} style={{ fontSize: 12 }}>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            dy={16}
                        />

                        <YAxis
                            stroke="#888"
                            axisLine={false}
                            tickLine={false}
                            width={80}
                        />

                        <CartesianGrid vertical={false} className="stroke-muted" />

                        {/* Adicionando Tooltip */}
                        {/* <Tooltip
                            contentStyle={{ backgroundColor: colors.gray['800'], borderColor: colors.gray['700'] }}
                            labelStyle={{ color: colors.gray['300'] }}
                            cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                        /> */}

                        <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />

                        <Tooltip cursor={false} content={<CustomTooltip />} />

                        <Line
                            type="bumpX"
                            strokeWidth={2}
                            dataKey="revenue"
                            stroke={colors.violet['400']}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
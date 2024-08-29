import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from 'recharts';
import colors from "tailwindcss/colors";
import { useEffect, useState } from 'react';
import { API_URL } from "@/lib/api";

// Definindo o tipo para os dados da API
type CategoriaEvento = {
    id: number;
    descricao: string;
    _count: {
        Evento: number;
    };
};

const COLORS = [
    colors.sky[500],
    colors.amber[500],
    colors.violet[500],
    colors.emerald[500],
    colors.rose[500],
];

export function CategoriaEventosChart() {
    const [data, setData] = useState<CategoriaEvento[]>([]);

    useEffect(() => {
        // Função para buscar os dados da API
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/categoria/contagem-eventos`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, []);

    // Transformando os dados para o formato esperado pelo gráfico
    const chartData = data.map(item => ({
        descricao: item.descricao,
        quantidade: item._count.Evento
    }));

    return (
        <Card className="col-span-3">
            <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Eventos por Categoria</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={240} >
                    <RechartsPieChart style={{ fontSize: 12 }}>
                        <Pie
                            data={chartData}
                            dataKey="quantidade"
                            nameKey="descricao"
                            cx="50%"
                            cy="50%"
                            outerRadius={86}
                            innerRadius={64}
                            strokeWidth={8}
                            labelLine={false}
                            label={({
                                cx,
                                cy,
                                midAngle,
                                innerRadius,
                                outerRadius,
                                value,
                                index,
                            }) => {
                                const RADIAN = Math.PI / 180
                                const radius = 12 + innerRadius + (outerRadius - innerRadius)
                                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                                const y = cy + radius * Math.sin(-midAngle * RADIAN)

                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        className="fill-muted-foreground text-xs"
                                        textAnchor={x > cx ? 'start' : 'end'}
                                        dominantBaseline="central"
                                    >
                                        {chartData[index].descricao.length > 1
                                            ? chartData[index].descricao.substring(0, 12).concat('...')
                                            : chartData[index].descricao}{' '}
                                        ({value})
                                    </text>
                                )
                            }}
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    className="stroke-background hover:opacity-80"
                                />
                            ))}
                        </Pie>
                    </RechartsPieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
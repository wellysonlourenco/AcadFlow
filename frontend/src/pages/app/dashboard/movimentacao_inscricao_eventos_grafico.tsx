import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import colors from 'tailwindcss/colors';

// Interfaces for the API responses
interface MonthlyEventData {
    month: string;
    eventCount: number;
  }
  
  interface EventsReportResponse {
    monthlyData: MonthlyEventData[];
    totalEvents: number;
  }
  
  interface MonthlyInscriptionData {
    month: string;
    inscriptionCount: number;
  }
  
  interface InscriptionsReportResponse {
    monthlyData: MonthlyInscriptionData[];
    totalInscriptions: number;
  }


// // Componente de Tooltip personalizado
// const CustomTooltip = ({ payload }: any) => {
//     if (!payload || payload.length === 0) return null;

//     // Obtém o valor do payload
//     const value = payload[0]?.value;

//     return (
//         <div className="bg-gray-800 text-white p-2 rounded">
//             <p className="text-center text-lg">{value} horas</p>
//         </div>
//     );
// };

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;
  
    return (
      <div className="bg-gray-800 text-white p-2 rounded">
        <p className="text-center font-bold">{label}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} className="text-center">
            {pld.name}: {pld.value}
          </p>
        ))}
      </div>
    );
  };



export function EventsInscriptionsChart() {
    const { user } = useContext(AuthContext);

    const usuarioId = user?.id as number;

    const [opacity, setOpacity] = useState({
        events: 1,
        inscriptions: 1
      });
    
      const { data: eventsData, isLoading } = useQuery<EventsReportResponse>({
        queryKey: ['events-report', usuarioId],
        queryFn: async () => {
          const response = await api.get('/evento/events-report');
          return response.data;
        },
        refetchInterval: 1000 * 60 * 5,
        staleTime: 0,  // Dados são sempre considerados obsoletos
        refetchOnWindowFocus: true,
        placeholderData: { monthlyData: [], totalEvents: 0 },
      });
    
      const { data: inscriptionsData,  } = useQuery<InscriptionsReportResponse>({
        queryKey: ['inscriptions-report', usuarioId],
        queryFn: async () => {
          const response = await api.get('/inscricao/inscriptions');
          return response.data;
        },
        refetchInterval: 1000 * 60 * 5,
        staleTime: 0,  // Dados são sempre considerados obsoletos
        refetchOnWindowFocus: true,
        placeholderData: { monthlyData: [], totalInscriptions: 0 },
      });
    
      const combinedData = eventsData?.monthlyData.map((eventItem, index) => ({
        date: eventItem.month,
        events: eventItem.eventCount,
        inscriptions: inscriptionsData?.monthlyData[index]?.inscriptionCount || 0,
      })) || [];
    
      const handleMouseEnter = (o: any) => {
        const { dataKey } = o;
        setOpacity({ ...opacity, [dataKey]: 0.5 });
      };
    
      const handleMouseLeave = (o: any) => {
        const { dataKey } = o;
        setOpacity({ ...opacity, [dataKey]: 1 });
      };

    if (isLoading ) {
        return <div>Loading chart data...</div>;
      }


    return (
        <Card className="col-span-6">
        <CardHeader className="flex-row items-center justify-between pb-8">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">Comparatico de eventos cadastrados e  inscrições de eventos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={combinedData} style={{ fontSize: 12 }}>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                dy={16}
              />
              <YAxis
                yAxisId="left"
                stroke="#888"
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#888"
                axisLine={false}
                tickLine={false}
                width={80}
                tick={false}
              />
              <CartesianGrid vertical={false} className="stroke-muted" />
              <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
              <Tooltip cursor={false} content={<CustomTooltip />} />
              <Line
                yAxisId="left"
                type="bumpX"
                dataKey="events"
                stroke={colors.red['500']}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
                // opacity={opacity}
                name="Eventos"
              />
              <Line
                yAxisId="right"
                type="bumpX"
                dataKey="inscriptions"
                stroke={colors.green['500']}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
                opacity={opacity.inscriptions}
                name="Inscrições"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
}
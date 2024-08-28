import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { EventList } from "./event-list";


export interface Categoria {
  id: number;
  descricao: string;
}

export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  local: string;
  quantidadeHoras: number;
  quantidadeVagas: number;
  status: string;
  imagem: string;
  categoriaId: number;
  dataCadastro: string;
  Categoria: Categoria;
}

export interface EventoResponse {
  eventos: Evento[];
  page: number;
  perPage: number;
  countPages: number;
  eventosCount: number;
}



export function EventCard() {
  const { data: eventoResponse, isLoading } = useQuery<EventoResponse>({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get(`/evento`);
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-32">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Eventos em Destaque</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {eventoResponse?.eventos.map((evento) => (
          <Card key={evento.id} className="w-72 h-[380px] overflow-hidden shadow-lg">
            <EventList evento={evento} />
          </Card>
        ))}
      </div>
    </div>
  );
}
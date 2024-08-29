import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Evento } from "./event-card";

interface EventListProps {
    evento: Evento;
}

export function EventList({ evento }: EventListProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="flex flex-col h-full">
            <img src={evento.imagem} alt={evento.nome} className="w-full h-40 object-cover" />
            <CardContent className="p-2">
                <h3 className="font-bold text-lg mb-2">{evento.nome}</h3>
                {/* <p className="text-sm text-gray-600 mb-2">{evento.descricao}</p> */}
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(evento.dataInicio)} - {formatDate(evento.dataFim)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 mr1 flex-shrink-0" />
                    <span>{evento.local}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{evento.quantidadeHoras} horas</span>
                </div>
            </CardContent>
            <CardFooter className="">
                <Button className="w-full">Ver detalhes</Button>
            </CardFooter>
        </div>
    );
}
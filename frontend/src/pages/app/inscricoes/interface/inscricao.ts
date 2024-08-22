import { Evento } from "../../events/interface/events-response";

export interface InscricaoResponse {
    inscricao: Inscricao[];
    page: number;
    limit: number;
    countPages: number;
    countInscricaoByUser: number;
  }
  
  export interface Inscricao {
    id: number;
    numeroInscricao: string;
    usuarioId: number;
    eventoId: number;
    dataInsc: string;
    Evento: Evento;
  }
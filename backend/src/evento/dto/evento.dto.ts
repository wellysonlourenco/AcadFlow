import { Status } from "@prisma/client";

export class EventoDto {
    nome: string;
    descricao: string
    dataInicio: Date
    dataFim: Date
    quantidadeHoras: number
    quantidadeVagas: number
    local: string
    status: Status
    categoriaId: number
    imagem: string
}
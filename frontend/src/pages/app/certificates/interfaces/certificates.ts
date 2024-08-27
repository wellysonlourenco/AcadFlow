export interface ParticipacaoResponse {
    id: number;
    numeroInscricao: string;
    usuarioId: number;
    eventoId: number;
    dataInsc: string;
    Evento: Evento;
    Certificado: Certificado[];
}

export interface Certificado {
    inscricaoId: number;
    chave: string;
    status: string;
    dataCadastro: string;
    url: string | null;
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
    imagem: string | null;
    categoriaId: number;
    dataCadastro: string;
}
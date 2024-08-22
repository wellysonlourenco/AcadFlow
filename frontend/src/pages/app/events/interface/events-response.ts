export interface EventoResponse {
  eventos: Evento[];
  page: number;
  perPage: number;
  countPages: number;
  eventosCount: number;
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

export interface Categoria {
  id: number;
  descricao: string;
}
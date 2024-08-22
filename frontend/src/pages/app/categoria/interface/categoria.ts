
  export interface CategoriaResponse {
    categorias: Categoria[];
    countCategorias: number;
  }
  
  export interface Categoria {
    id: number;
    descricao: string;
  }
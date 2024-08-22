import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoriaService } from './categoria.service';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}


  @Post()
  async createCategoria(
    @Body() body: { descricao: string }
  ) {
    return await this.categoriaService.create(body.descricao)
  }

  @Get('search')
  async getDescricao() : Promise<any[]>{
    return await this.categoriaService.findAll()

  }

  @Get('contagem-eventos')
  async getCategoriaComContagemDeEventos() {
    return this.categoriaService.getCategoriaComContagemDeEventos();
  }

  @Get(':id')
  @HttpCode(200) 
  async getCategoriaById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoriaService.getById(id);
  }



  // @Get()
  // @HttpCode(200) 
  // async getCategorias(
  //   @Query('page', pageValidatioPipe) page: PageParamSchema,
  //   @Query('limit', perPageValidationPipe) limit: PerPageParamSchema,
  //   @Query('search', searchValidationPipe) search: SearchParamSchema,
  //   @Query('sort', orderValidationPipe) sort: OrderParamSchema,
  // ) {
  //   const take = limit || 10;
  //   const skip = limit * (page - 1);
  //   const searchString = search || '';
  //   const orderBy = sort;
   
  //   const [categorias, countCategorias] = await Promise.all([
  //     this.categoriaService.get(take, skip, searchString, orderBy),
  //     this.categoriaService.getCategoriasCount()
  //   ])

  //   const countPages = Math.ceil(countCategorias / take);

  //   return { categorias, page, limit: take, countPages, countCategorias }

  // }



  
  @Put(':id')
  @HttpCode(200) 
  //@UsePipes(CategoriaValidationPipe)
  async updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { descricao: string }
  ) {
    return this.categoriaService.update(id, body.descricao);
  }


  @Delete(':id')
  @HttpCode(200) 
  async deleteCategoria(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoriaService.deleteCategoria(id);
  }

}

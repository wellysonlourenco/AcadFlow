import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CategoriaService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(descricao: string) {
        return await this.prisma.categoria.create({
            data: {
                descricao
            }
        })
    }

    async findAll () {
        const categoria =  await this.prisma.categoria.findMany({
            select: {
                id: true,
                descricao: true
            },
            orderBy: {
                descricao: 'asc'
            }

        })
        return categoria
    }



    async getById(id: number) {
        await this.exists(id);

        return await this.prisma.categoria.findUnique({
            where: {
                id
            }
        })
    }

    async get (take: number, skip: number, searchString: string, orderBy: 'asc' | 'desc') {
        
        return await this.prisma.categoria.findMany({
            take,
            skip,
            where: {
                descricao: { contains: searchString },
            },
            orderBy: {
                descricao: orderBy
            }
        })
    }

    async getDescricao () {
            
            return await this.prisma.categoria.findMany({ })
    }


    async update(id: number, descricao: string) {
        await this.exists(id);

        const categoria = await this.prisma.categoria.update({
            where: {
                id
            },
            data: {
                descricao
            }
        })
        return categoria;
    }


    async getCategorias(take: number, skip: number, searchString: string, orderBy: 'asc' | 'desc') {

        const categorias = await this.prisma.categoria.findMany({
            take: take || undefined,
            skip: skip || undefined,
            where: {
                descricao: { contains: searchString },
            },
            // orderBy: {
            //     descricao: orderBy
            // }
        });

        return categorias;
    }


    async getCategoriasCount() {
        return await this.prisma.categoria.count();
    }



    async deleteCategoria(id: number) {
        await this.exists(id);

        try {
            await this.prisma.categoria.delete({
                where: {
                    id
                }
            })
            return true;
        } catch (error) {
            throw new HttpException('Não é possível excluir a categoria, pois existem produtos associados a ela.', HttpStatus.BAD_REQUEST) // 400
        }
    }

    async exists(id: number) {
        if (!
            (
                await this.prisma.categoria.count({
                    where: {
                        id,
                    },
                })
            )
        ) {
            throw new HttpException(`A categoria ${id} não existe.`, HttpStatus.NOT_FOUND); // 404
        }
    }

}

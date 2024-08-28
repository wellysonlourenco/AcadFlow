import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { subDays } from 'date-fns';
import * as fs from 'fs/promises';
import { EventoDto } from './dto/evento.dto';

@Injectable()
export class EventoService {
    constructor (
        private readonly prisma: PrismaService,
    ) {}


    async create(
        nome: string,
        descricao: string,
        dataInicio: Date,
        dataFim: Date,
        quantidadeHoras: number,
        quantidadeVagas: number,
        local: string,
        status: Status,
        categoriaId: number,
        imagem: string,
    ) {


        quantidadeHoras = parseInt(quantidadeHoras.toString())
        quantidadeVagas = parseInt(quantidadeVagas.toString())
        categoriaId = parseInt(categoriaId.toString())
        dataInicio = new Date(dataInicio)
        dataFim = new Date(dataFim)

        console.log(nome, descricao, dataInicio, dataFim, quantidadeHoras, quantidadeVagas, local, status, categoriaId, imagem)

        return await this.prisma.evento.create({
            data: {
                nome,
                descricao,
                local,
                status: Status[status],
                quantidadeHoras, 
                quantidadeVagas, 
                categoriaId,
                dataInicio,
                dataFim,
                imagem,
            }
        })
    }


    //Total de eventos cadastrados nos últimos 30 dias 
    async countRecentEvents(): Promise<number> {
        const thirtyDaysAgo = subDays(new Date(), 30);

        return this.prisma.evento.count({
            where: {
                dataCadastro: {
                    gte: thirtyDaysAgo,
                },
            },
        });
    }

    //contar os eventos com status "ATIVO"
    async countActiveEvents(): Promise<number> {
        return this.prisma.evento.count({
            where: {
                status: 'ATIVO',
            },
        });
    }


    async getEventos(take: number, skip: number, searchString: string, orderBy: 'asc' | 'desc') {

        //searchString = searchString.toLowerCase();


        const eventos = await this.prisma.evento.findMany({
            take,
            skip,
            where: {
                nome: { contains: searchString, mode: "insensitive", },
                
            },
            include: {
                Categoria: true
            },
            orderBy: {
                nome: orderBy
            }
        });

        return eventos.map(evento => ({
            ...evento,
            imagem: evento.imagem ? `${process.env.APP_URL}/${evento.imagem}` : null
        }))
    }

    async getEventoById(id: number) {
        await this.exists(id);

        const evento = await this.prisma.evento.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                nome: true,
                descricao: true,
                dataInicio: true,
                dataFim: true,
                imagem: true,
                local: true,
            }
        })

        if(evento.imagem){
            evento.imagem = `${process.env.APP_URL}/${evento.imagem}`;
        } else {
            // await this.prisma.evento.update({
            //     where: {
            //         id
            //     },
            //     data: {
            //         imagem: null
            //     }
            // })

            evento.imagem = null;
        }

        return evento;
    }

    async findAll() {
        return await this.prisma.evento.findMany()
    }
    

    async getEventosCount() {
        return await this.prisma.evento.count()
    }

    async updateEvento(id: number, eventoDto: EventoDto) {
        await this.exists(id);

        const dataInicio = new Date(eventoDto.dataInicio)
        const dataFim = new Date(eventoDto.dataFim)

        return await this.prisma.evento.update({
            where: {
                id
            },
            data: {
                dataInicio,
                dataFim,
                ...eventoDto
            }
        })
    }

    async updateImagem(id: number, imagem: string) {
        await this.exists(id);

        return await this.prisma.evento.update({
            where: {
                id
            },
            data: {
                imagem
            }
        })
    }

    async deleteEvento(id: number) {
        const evento = await this.prisma.evento.findFirst({
            where: {
                id
            }
        })

        if(evento.imagem){
            try {
                await fs.unlink(`./assets/uploads/${evento.imagem}`)
            } catch (error) {
                throw new HttpException('Erro ao deletar arquivo', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        await this.prisma.evento.delete({
            where: {
                id
            }
        })

        return true;
    }


    async exists(id: number) {
        if (!
            (
                await this.prisma.evento.count({
                    where: {
                        id,
                    },
                })
        )
        ) {
            throw new HttpException(`O evento ${id} não existe.`, HttpStatus.NOT_FOUND);
        }
    }
}

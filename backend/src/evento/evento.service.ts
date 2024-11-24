import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { endOfMonth, startOfMonth, subDays, subMonths } from 'date-fns';
import { Response } from 'express';
import * as fs from 'fs/promises';
import { PDFDocument, rgb } from 'pdf-lib';
import { EventoDto } from './dto/evento.dto';

@Injectable()
export class EventoService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }


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

    // Pesquisa de eventos cadastrados por mês no intervalo de 6 meses
    async getEventsReport() {
        const now = new Date();
        const results = [];

        for (let i = 5; i >= 0; i--) {
            const startDate = startOfMonth(subMonths(now, i));
            const endDate = endOfMonth(subMonths(now, i));

            const eventCount = await this.prisma.evento.count({
                where: {
                    dataCadastro: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });

            results.push({
                month: startDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
                eventCount,
            });
        }

        const totalEvents = results.reduce((acc, item) => acc + item.eventCount, 0);
        return { monthlyData: results, totalEvents };
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
            orderBy: [
                { status: orderBy }, // Ordena primeiro pelo status
                { dataInicio: orderBy }, // Depois pela data de início
                { nome: orderBy }, // Por último pelo nome
            ],
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

        if (evento.imagem) {
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

    // Método para buscar todos os eventos com o número de inscrições e ordenar pela data de início
    async findAllEventsWithRegistrations() {
        return this.prisma.evento.findMany({
            include: {
                _count: {
                    select: {
                        Participante: true,  // Contando o número de inscrições por evento
                    },
                },
            },
            orderBy: {
                dataInicio: 'asc',  // Ordenando pela data de início em ordem crescente
            },
        });
    }

    // Método para gerar PDF com a lista de eventos e número de inscrições
    async generateEventPdf(res: Response) {
        const events = await this.findAllEventsWithRegistrations();

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([595, 842]);  // Dimensões de A4 no modo retrato
        const { height } = page.getSize();

        const fontSize = 12;
        let yPosition = height - fontSize * 2;

        // Título do PDF
        page.drawText('Lista de Eventos e o total de Inscrições', { x: 50, y: yPosition,   size: fontSize + 4 });
        yPosition -= fontSize * 2;

        // Cabeçalhos da Tabela
        const col1X = 50;
        const col2X = 250;
        const col3X = 450;

        page.drawText('Nome do Evento', { x: col1X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText('Data (Início - Fim)', { x: col2X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText('Numero de Inscrições', { x: col3X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });

        yPosition -= fontSize * 1.5;

        // Função auxiliar para truncar nomes de eventos longos
        const truncate = (str: string, maxLength: number) => {
            return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
        };

        // Iterando sobre os eventos e adicionando à tabela
        events.forEach((event) => {
            const truncatedName = truncate(event.nome, 30);  // Limita o nome a 30 caracteres
            const dateRange = `${new Date(event.dataInicio).toLocaleDateString()} - ${new Date(event.dataFim).toLocaleDateString()}`;
            const eventInfo = `Inscrições: ${event._count.Participante}`;

            page.drawText(truncatedName, { x: col1X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
            page.drawText(dateRange, { x: col2X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
            page.drawText(eventInfo, { x: col3X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });

            yPosition -= fontSize * 1.5;

            // Adicionar nova página se necessário (se o conteúdo exceder o tamanho da página)
            if (yPosition <= fontSize * 2) {
                page = pdfDoc.addPage([595, 842]);  // Nova página no modo retrato
                yPosition = height - fontSize * 2;  // Reiniciar a posição y
            }
        });

        const pdfBytes = await pdfDoc.save();

        // Configurações de resposta para download do PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="lista_eventos.pdf"',
            'Content-Length': pdfBytes.length,
        });

        res.end(pdfBytes);
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

        if (evento.imagem) {
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

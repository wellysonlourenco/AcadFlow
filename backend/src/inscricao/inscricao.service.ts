import { CertificadoService } from '@/certificado/certificado.service';
import { EventoService } from '@/evento/evento.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsuarioService } from '@/usuario/usuario.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from "crypto";
import { subDays } from 'date-fns';
import * as PDFDocument from 'pdfkit';
import { Stream } from 'stream';
import { InscricaoDto } from './dto/inscricao.dto';

@Injectable()
export class InscricaoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly usuarioService: UsuarioService,
        private readonly eventoService: EventoService,
        private readonly certificadoService: CertificadoService,
    ) { }


    async create(inscricaoDto: InscricaoDto) {
        const { usuarioId, eventoId } = inscricaoDto;

        await this.usuarioService.exists(usuarioId);
        await this.eventoService.exists(eventoId);

        console.log(eventoId)

        const numeroInscricao = usuarioId + crypto.randomBytes(1).toString('hex').toUpperCase() + eventoId + crypto.randomBytes(1).toString('hex').toUpperCase();

        console.log(numeroInscricao);
        try {
            const inscricao = await this.prisma.inscricao.create({
                data: {
                    usuarioId,
                    eventoId,
                    numeroInscricao,
                },
            });

            return inscricao;


        } catch (error) {
            console.error('Erro ao criar inscrição:', error);
            throw new HttpException('Erro ao criar inscrição', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    //Total de inscrições de todos os usuários nos últimos 30 dias
    async countRecentInscricoes(): Promise<number> {
        const thirtyDaysAgo = subDays(new Date(), 30);

        return this.prisma.inscricao.count({
            where: {
                dataInsc: {
                    gte: thirtyDaysAgo,
                },
            },
        });
    }


    async findByid(id: number) {
        await this.exists(id);

        const inscricao = await this.prisma.inscricao.findUnique({
            where: {
                id,
            },
        });

        return inscricao;
    }

    async findInscriptionsByUser(usuarioId: number, take: number, skip: number, orderBy: 'asc' | 'desc') {
        await this.usuarioService.exists(usuarioId);

        const inscricoes = await this.prisma.inscricao.findMany({
            take,
            skip,
            where: {
                usuarioId,
            },
            include: {
                Evento: true,
            },
            orderBy: {
                id: orderBy,
            }
        });

        return inscricoes
        // .map(inscricao => ({
        //     ...inscricao,
        //     certificado: inscricao.Certificado,
        // }));
    }

    async countInscricaoByUser(usuarioId: number) {
        await this.usuarioService.exists(usuarioId);

        const count = await this.prisma.inscricao.count({
            where: {
                usuarioId,
            },
        });

        return count;
    }

    // async findInscriptionsByEvent(eventoId: number, take: number, skip: number, orderBy: 'asc' | 'desc') {
    //     await this.eventoService.exists(eventoId);

    //     const inscricoes = await this.prisma.inscricao.findMany({
    //         take: take || undefined,
    //         skip: skip || undefined,
    //         where: {
    //             eventoId,
    //         },
    //         orderBy: {
    //             id: orderBy,
    //         }
    //     });

    //     return inscricoes;
    // }

    async getInscricoesByEventoId(eventoId: number) {
        return this.prisma.inscricao.findMany({
            where: { eventoId },
            include: {
                Usuario: true,  // incluir dados relacionados ao usuário
                Evento: true,   // incluir dados relacionados ao evento
            },
            orderBy: {
                Usuario: {
                    nome: 'asc',
                },
            }
        });
    }

    async generatePdf(eventoId: number): Promise<Stream> {
        const inscricoes = await this.getInscricoesByEventoId(eventoId);

        const doc = new PDFDocument();
        const stream = new Stream.PassThrough();

        doc.pipe(stream);

        doc.fontSize(18).text(`Lista de Inscrições para o Evento: ${inscricoes[0].Evento.nome}`, {
            align: 'center',
        });

        doc.moveDown();
        inscricoes.forEach((inscricao, index) => {
            doc.fontSize(10).text(`${index + 1}. Nome:  ${inscricao.Usuario.nome} - Inscricao:  ${inscricao.numeroInscricao} - E-mail: ${inscricao.Usuario.email} `);
            doc.moveDown();
        });

        doc.end();

        return stream;
    }


    async countInscricaoByEvent(eventoId: number) {
        await this.eventoService.exists(eventoId);

        const count = await this.prisma.inscricao.count({
            where: {
                eventoId,
            },
        });

        return count;
    }




    async findInscricaoByEventoIdAndUserId(eventoId: number, usuarioId: number): Promise<boolean> {

        await this.eventoService.exists(eventoId);

        await this.usuarioService.exists(usuarioId);

        const inscricao = await this.prisma.inscricao.findFirst({
            where: {
                eventoId,
                usuarioId,
            },
        });

        //console.log(inscricao)

        if (inscricao) {
            return true
        } else {
            return false
        }
    }



    async exists(id: number) {
        if (!
            (
                await this.prisma.inscricao.count({
                    where: {
                        id,
                    },
                })
            )
        ) {
            throw new HttpException(`A inscricao ${id} não existe.`, HttpStatus.NOT_FOUND);
        }
    }




}
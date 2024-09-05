import { EventoService } from '@/evento/evento.service';
import { PrismaService } from '@/prisma/prisma.service';
import { QrCodeService } from '@/qr-code-generator/qr-code-generator.service';
import { UsuarioService } from '@/usuario/usuario.service';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from "crypto";
import { endOfMonth, format, startOfMonth, subDays, subMonths } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import { Stream } from 'stream';
import { InscricaoDto } from './dto/inscricao.dto';
import { getHTML } from './template/getHTML';
import { getPdf } from './template/getPdf';

@Injectable()
export class InscricaoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly usuarioService: UsuarioService,
        private readonly eventoService: EventoService,
        private readonly mailerService: MailerService,
        private readonly qrCodeService: QrCodeService,
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

     // Pesquisa de inscrições por mês no intervalo de 6 meses
  async getTotalInscriptionsReport() {
    const now = new Date();
    const results = [];

    for (let i = 5; i >= 0; i--) {
      const startDate = startOfMonth(subMonths(now, i));
      const endDate = endOfMonth(subMonths(now, i));

      const inscriptionCount = await this.prisma.inscricao.count({
        where: {
          dataInsc: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      results.push({
        month: startDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
        inscriptionCount,
      });
    }

    const totalInscriptions = results.reduce((acc, item) => acc + item.inscriptionCount, 0);
    return { monthlyData: results, totalInscriptions };
  }


    // async sendEmailWithAttachment(id: number) {
    //     const inscricao = await this.prisma.inscricao.findUnique({
    //         where: { id },
    //         include: {
    //             Usuario: true,
    //             Evento: true,
    //         },
    //     });

    //     if (!inscricao) {
    //         throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
    //     }

    //     const { Evento: evento, Usuario: usuario, numeroInscricao, dataInsc } = inscricao;

    //     const html = getHTML({
    //         dataInsc: format(dataInsc ? new Date(dataInsc) : new Date(), 'dd/MM/yyyy'),
    //         eventname: evento.nome,
    //         username: usuario.nome,
    //         local: evento.local,
    //         qrCode: await this.qrCodeService.generateQrCode(numeroInscricao),
    //     });

    //     const pdfBuffer = await getPdf(html);

    //     if (!pdfBuffer) {
    //         throw new HttpException('Erro ao gerar PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }

    //     const tempDir = path.join(__dirname, '..', '..', 'tmp');
    //     if (!fs.existsSync(tempDir)) {
    //         fs.mkdirSync(tempDir, { recursive: true });
    //     }

    //     const tempFilePath = path.join(tempDir, `comprovante_${id}.pdf`);
    //     fs.writeFileSync(tempFilePath, pdfBuffer);

    //     try {
    //         await this.mailerService.sendMail({
    //             to: usuario.email,
    //             subject: 'Comprovante de Inscrição',
    //             template: 'comprovante',
    //             context: {
    //                 username: usuario.nome,
    //                 eventname: evento.nome,
    //             },
    //             attachments: [
    //                 {
    //                     filename: 'comprovante.pdf',
    //                     path: tempFilePath,
    //                 },
    //             ],
    //         });

    //         console.log('Email enviado com sucesso');
    //     } catch (error) {
    //         console.error('Erro ao enviar email:', error);
    //         throw new HttpException('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR);
    //     } finally {
    //         console.log(`Arquivo temporário deletado: ${tempFilePath}`);
    //         // Deletar o arquivo temporário
    //         //fs.unlinkSync(tempFilePath);
    //     }
    // }

    async enviarComprovantePorEmail(id: number) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { id },
            include: {
                Usuario: true,
                Evento: true,
            },
        });

        if (!inscricao) {
            throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
        }

        const { Evento: evento, Usuario: usuario, numeroInscricao, dataInsc } = inscricao;

        const html = await getHTML({
            dataInsc: format(dataInsc ? new Date(dataInsc) : new Date(), 'dd/MM/yyyy'),
            eventname: evento.nome,
            username: usuario.nome,
            local: evento.local,
            numeroInscricao: numeroInscricao,
            qrCode: await this.qrCodeService.generateQrCode(numeroInscricao),
        });

        const pdfBuffer = await getPdf(html);

        if (!pdfBuffer) {
            throw new HttpException('Erro ao gerar PDF', HttpStatus.INTERNAL_SERVER_ERROR);
        }


        const tempDir = path.join(__dirname, '..', '..', '..', 'tmp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFilePath = path.join(tempDir, `comprovante_${id}.pdf`);
        try {
            fs.writeFileSync(tempFilePath, pdfBuffer);
            console.log(`PDF salvo em: ${tempFilePath}`);
        } catch (error) {
            console.error('Erro ao salvar PDF:', error);
            throw new HttpException('Erro ao salvar PDF', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            await this.mailerService.sendMail({
                to: usuario.email,
                subject: 'Comprovante de Inscrição',
                template: 'comprovante',
                context: {
                    username: usuario.nome,
                    eventname: evento.nome,
                },
                attachments: [
                    {
                        filename: 'comprovante.pdf',
                        path: tempFilePath,
                        contentType: 'application/pdf',
                    },
                ],
            });

            console.log('Email enviado com sucesso');
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw new HttpException('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            // Deletar o arquivo temporário
            console.log(`Arquivo temporário deletado: ${tempFilePath}`);
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
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
import { PrismaService } from '@/prisma/prisma.service';
import { QrCodeService } from '@/qr-code-generator/qr-code-generator.service';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { getHTML } from './template/getHTML';
import { getPdf } from './template/getPdf';

@Injectable()
export class CertificadoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        private readonly qrCodeService: QrCodeService,
    ) { }




    async enviarCertificadoPorEmail(inscricaoId: number) {
        const certificado = await this.prisma.certificado.findUnique({
            where: {
                inscricaoId: inscricaoId,

            },
            include: {
                Inscricao: {
                    include: {
                        Usuario: true,
                        Evento: true
                    }
                }
            }
        });

        if (!certificado) {
            throw new HttpException('Certificado não encontrado', HttpStatus.NOT_FOUND);
        }


        const eventname = certificado.Inscricao?.Evento?.nome;
        const username = certificado.Inscricao?.Usuario?.nome;
        const key = certificado.chave;
        const dtStart = certificado.Inscricao?.Evento?.dataInicio;
        const qtdHours = certificado.Inscricao?.Evento?.quantidadeHoras;
        const createdAt = certificado.dataCadastro;
        const dtEnd = certificado.Inscricao?.Evento?.dataFim;
        const url = `http://localhost:3333/certificates/${eventname}.png`

        const html = getHTML({
            dtEnd: format(dtEnd ? new Date(dtEnd) : new Date(), 'dd/MM/yyyy'),
            dtStart: format(dtStart ? new Date(dtStart) : new Date(), 'dd/MM/yyyy'),
            eventname,
            qtdHours,
            username,
            qrCode: await this.qrCodeService.generateQrCode(`${key}`),
            createdAt: format(createdAt ? new Date(createdAt) : new Date(), 'dd/MM/yyyy'),
            key,
            url,
        })

        const pdfBuffer = await getPdf(html);

        if (!pdfBuffer) {
            throw new HttpException('Erro ao gerar PDF', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const tempDir = path.join(__dirname, '..', '..', '..', 'tmp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFilePath = path.join(tempDir, `certificado_${inscricaoId}.pdf`);
        try {
            fs.writeFileSync(tempFilePath, pdfBuffer);
            console.log(`PDF salvo em: ${tempFilePath}`);
        } catch (error) {
            console.error('Erro ao salvar PDF:', error);
            throw new HttpException('Erro ao salvar PDF', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            await this.mailerService.sendMail({
                to: certificado.Inscricao.Usuario.email,
                subject: 'Certificado de Participação',
                template: 'certificado', // Certifique-se de criar este template
                context: {
                    username: certificado.Inscricao.Usuario.nome,
                    eventname: certificado.Inscricao.Evento.nome,
                },
                attachments: [
                    {
                        filename: 'certificado.pdf',
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
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
                console.log(`Arquivo temporário deletado: ${tempFilePath}`);
            }
        }
    }








    // async create(inscricaoId: number,) {

    //     try {
    //         const certificado = await this.prisma.certificado.create({
    //             data: {
    //                 inscricaoId,
    //                 status: 'LIBERADO',
    //                 //url: url || undefined || null,
    //             },
    //         });

    //         return certificado;
    //     } catch (error) {
    //         console.error('Erro ao criar certificado:', error);
    //         throw new HttpException('Erro ao criar certificado', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // async enviarCertificadoPorEmail(inscricaoId: number): Promise<void> {
    //     const certificado = await this.prisma.certificado.findUnique({
    //         where: {
    //             inscricaoId: inscricaoId,

    //         },
    //         include: {
    //             Inscricao: {
    //                 include: {
    //                     Usuario: true,
    //                     Evento: true
    //                 }
    //             }
    //         }
    //     });

    //     if (!certificado) {
    //         throw new HttpException('Certificado não encontrado', HttpStatus.NOT_FOUND);
    //     }

    //     const pdfBuffer = await this.gerarPDFCertificado(certificado);
    //     await this.enviarEmailComCertificado(
    //         certificado.Inscricao.Usuario.email,
    //         pdfBuffer,
    //         certificado.Inscricao.Evento.nome
    //     );
    // }

    // private async gerarPDFCertificado(certificado: any): Promise<Buffer> {
    //     const html = getHTML({
    //         eventname: certificado.Inscricao.Evento.nome,
    //         username: certificado.Inscricao.Usuario.nome,
    //         dtStart: format(new Date(certificado.Inscricao.Evento.dataInicio), 'dd/MM/yyyy'),
    //         qtdHours: certificado.Inscricao.Evento.quantidadeHoras,
    //         dtEnd: format(new Date(certificado.Inscricao.Evento.dataFim), 'dd/MM/yyyy'),
    //         qrCode: await this.qrCodeService.generateQrCode(certificado.chave),
    //         createdAt: format(new Date(certificado.dataCadastro), 'dd/MM/yyyy'),
    //         key: certificado.chave,
    //         url: `${this.configService.get('APP_URL')}/certificates/${certificado.Inscricao.Evento.nome}.png`,
    //     });

    //     const pdfUint8Array = await getPdf(html);
    //     return Buffer.from(pdfUint8Array);
    // }

    // private async enviarEmailComCertificado(email: string, pdfBuffer: Buffer, eventName: string): Promise<void> {
    //     await this.mailerService.sendMail({
    //         to: email,
    //         subject: `Seu certificado para o evento ${eventName}`,
    //         text: `Segue em anexo o seu certificado para o evento ${eventName}.`,
    //         attachments: [
    //             {
    //                 filename: 'certificado.pdf',
    //                 content: pdfBuffer,
    //                 contentType: 'application/pdf',
    //             },
    //         ],
    //     });
    // }


    async gerarCertificado(numeroInscricao: string): Promise<any> {
        // Buscar a inscrição pelo numeroInscricao
        const inscricao = await this.prisma.inscricao.findFirst({
            where: { numeroInscricao },
        });

        if (!inscricao) {
            throw new NotFoundException('Inscrição não encontrada');
        }

        // Gerar o certificado associado a essa inscrição
        const certificado = await this.prisma.certificado.create({
            data: {
                inscricaoId: inscricao.id,
                dataCadastro: new Date(),
                status: 'LIBERADO',
                // url: 'certificado_a4.jpg',
            },
        });

        return certificado;
    }



    async exists(inscricaoId: number) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: {
                id: inscricaoId,
            },
        });

        if (!inscricao) {
            throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
        }
    }

    // async gerarCertificado(inscricaoId: number, status: Status) {
    //     await this.exists(inscricaoId);

    //     const certificado = await this.prisma.certificado.update ({
    //         where: {
    //             inscricaoId,
    //         },
    //         data: {
    //             status: 'LIBERADO',
    //         },
    //     });

    //     return certificado;
    // }

    //buscar a carga horária dos eventos relacionados aos certificados com status "LIBERADO".
    async getTotalCargaHoraria(): Promise<number> {
        const certificados = await this.prisma.certificado.findMany({
            where: { status: 'LIBERADO' },
            select: {
                Inscricao: {
                    select: {
                        Evento: {
                            select: {
                                quantidadeHoras: true,
                            },
                        },
                    },
                },
            },
        });

        const totalHoras = certificados.reduce((total, certificado) => {
            return total + (certificado.Inscricao?.Evento?.quantidadeHoras || 0);
        }, 0);

        return totalHoras;
    }

}

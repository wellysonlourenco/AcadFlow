import { PrismaService } from '@/prisma/prisma.service';
import { QrCodeService } from '@/qr-code-generator/qr-code-generator.service';
import { Body, Controller, Get, HttpException, HttpStatus, NotImplementedException, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { format } from "date-fns";
import { Response } from 'express';
import { CertificadoService } from './certificado.service';
import { getHTML } from './template/getHTML';
import { getPdf } from './template/getPdf';

@Controller('certificado')
export class CertificadoController {
  constructor(
    private readonly certificadoService: CertificadoService,
    private readonly prisma: PrismaService,
    private readonly qrCodeService: QrCodeService,

  ) { }

  @Post()
  async createCertificado(
    @Body('inscricaoId', ParseIntPipe) inscricaoId: number
  ) {
    return await this.certificadoService.create(inscricaoId);
  }

  @Get(':inscricaoId')
  async generateCertificateFile(
    @Param('inscricaoId', ParseIntPipe) inscricaoId: number,
    @Res() res: Response,
  ) {


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

    const file = await getPdf(html)

    if (!file) {
      throw new NotImplementedException('Server error')
    }
    res.setHeader('Content-Type', 'application/pdf')
    res.end(file)
  }

}

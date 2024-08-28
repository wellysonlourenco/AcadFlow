import { getPdf } from '@/certificado/template/getPdf';
import { PrismaService } from '@/prisma/prisma.service';
import { QrCodeService } from '@/qr-code-generator/qr-code-generator.service';
import { OrderParamSchema, orderValidationPipe, PageParamSchema, pageValidatioPipe, PerPageParamSchema, perPageValidationPipe } from '@/schema/page-param';
import { Body, Controller, Get, NotImplementedException, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { format } from "date-fns";
import { Response } from 'express';
import { InscricaoDto } from './dto/inscricao.dto';
import { InscricaoService } from './inscricao.service';
import { getHTML } from './template/getHTML';


@Controller('inscricao')
export class InscricaoController {
  constructor(
    private readonly inscricaoService: InscricaoService,
    private readonly qrCodeService: QrCodeService,
    private readonly prisma: PrismaService,
  ) { }


  @Post()
  async createInscricao(
    @Body() inscricaoDto: InscricaoDto
  ) {
    return await this.inscricaoService.create(inscricaoDto)
  }

  // @Get(':id')
  // async findInscricaoById(
  //   @Param('id', ParseIntPipe) id: number
  // ) {
  //   return await this.inscricaoService.findByid(id)
  // }

  
  @Get('recent-count')
  async getRecentInscricaoCount(): Promise<{ count: number }> {
    const count = await this.inscricaoService.countRecentInscricoes();
    return { count };
  }



  // @Get('evento/:id')
  // async findInscricaoByEventoId(
  //   @Param('id', ParseIntPipe) eventoId: number,
  //   @Query('page', pageValidatioPipe) page: PageParamSchema,
  //   @Query('limit', perPageValidationPipe) limit: PerPageParamSchema,
  //   @Query('sort', orderValidationPipe) sort: OrderParamSchema,
  // ) {

  //   const take = limit || 10;
  //   const skip = limit * (page - 1);
  //   const orderBy = sort;

  //   const evento = await this.inscricaoService.findInscriptionsByEvent(
  //     eventoId,
  //     take,
  //     skip,
  //     orderBy
  //   )

  //   const countEvento = await this.inscricaoService.countInscricaoByEvent(eventoId)

  //   const totalInscricao = countEvento || 0;
  //   const porPagina = limit || 10;
  //   const pagina = page || 1;
  //   const totalPaginas = Math.ceil(totalInscricao / limit);

  //   return { evento, pagina, porPagina, totalPaginas, totalInscricao }
  // }

  @Get('evento/:eventoId')
  async getInscricoesByEventoId(@Param('eventoId', ParseIntPipe) eventoId: number) {
    return this.inscricaoService.getInscricoesByEventoId(eventoId);
  }

  @Get('evento/:eventoId/pdf')
  async getInscricoesPdf(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Res() res: Response,
  ) {
    const pdfStream = await this.inscricaoService.generatePdf(eventoId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="inscricoes_evento_${eventoId}.pdf"`,
    });

    pdfStream.pipe(res);
  }


  @Get('evento/:eventoId/usuario/:usuarioId')
  async findInscricaoByEventoIdAndUserId(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number
  ) {
    return await this.inscricaoService.findInscricaoByEventoIdAndUserId(eventoId, usuarioId)
  }



  @Get('usuario/:id')
  async findInscricaoByUsuarioId(
    @Param('id', ParseIntPipe) usuarioId: number,
    @Query('page', pageValidatioPipe) page: PageParamSchema,
    @Query('limit', perPageValidationPipe) limit: PerPageParamSchema,
    @Query('sort', orderValidationPipe) sort: OrderParamSchema,
  ) {

    const take = limit || 10;
    const skip = limit * (page - 1);
    const orderBy = sort;


    const [inscricao, countInscricaoByUser] = await Promise.all([
      this.inscricaoService.findInscriptionsByUser(usuarioId, take, skip, orderBy),
      this.inscricaoService.countInscricaoByUser(usuarioId)
    ])

    const countPages = Math.ceil(countInscricaoByUser / take);

    return { inscricao, page, limit: take, countPages, countInscricaoByUser }

  }

  @Get('/certificates/usuario/:usuarioId')
  async getCertificatesByUserId(
    @Param('usuarioId', ParseIntPipe) usuarioId: number
  ) {
    const certificados =  await this.prisma.inscricao.findMany({
      where: {
        usuarioId
      },
      include: {
        Evento: true,
        Certificado: true
      }
    })
    return certificados
  }


  @Get(':id')
  async generateCertificateFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {


    const inscricao = await this.prisma.inscricao.findUnique({
      where: {
        id,
      },
      include: {
        Usuario: true,
        Evento: true
      }
    });


    const eventname = inscricao?.Evento?.nome;
    const username = inscricao?.Usuario?.nome;
    const dataInsc = inscricao?.dataInsc;
    const local = inscricao?.Evento?.local;
    const numeroInscricao = inscricao?.numeroInscricao;
    // const eventname = certificado.Inscricao?.Evento?.nome;
    // const username = certificado.Inscricao?.Usuario?.nome;
    // const key = certificado.chave;
    // const inscricao = certificado.Inscricao?.numeroInscricao;
    // const dtStart = certificado.Inscricao?.Evento?.dataInicio;
    // const qtdHours = certificado.Inscricao?.Evento?.quantidadeHoras;
    // const createdAt = certificado.dataCadastro;
    // const dtEnd = certificado.Inscricao?.Evento?.dataFim;
    // const url = `http://localhost:3333/certificates/${eventname}.png`

    const html = getHTML({
      dataInsc: format(dataInsc ? new Date(dataInsc) : new Date(), 'dd/MM/yyyy'),
      eventname,
      username,
      local,
      qrCode: await this.qrCodeService.generateQrCode(`${numeroInscricao}`),
    })

    const file = await getPdf(html)

    if (!file) {
      throw new NotImplementedException('Server error')
    }
    res.setHeader('Content-Type', 'application/pdf')
    res.end(file)
  }


}

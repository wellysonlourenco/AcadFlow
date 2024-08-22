import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

@Injectable()
export class CertificadoService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }


    async create(inscricaoId: number,) {

        try {
            const certificado = await this.prisma.certificado.create({
                data: {
                    inscricaoId,
                    status: 'LIBERADO',
                    //url: url || undefined || null,
                },
            });

            return certificado;
        } catch (error) {
            console.error('Erro ao criar certificado:', error);
            throw new HttpException('Erro ao criar certificado', HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    async gerarCertificado(inscricaoId: number, status: Status) {
        await this.exists(inscricaoId);

        const certificado = await this.prisma.certificado.update ({
            where: {
                inscricaoId,
            },
            data: {
                status: 'LIBERADO',
            },
        });

        return certificado;
    }
}

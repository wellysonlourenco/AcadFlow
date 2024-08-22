import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { CertificadoController } from './certificado.controller';
import { CertificadoService } from './certificado.service';

@Module({
  controllers: [CertificadoController],
  providers: [CertificadoService, PrismaService],
  exports: [CertificadoService],
})
export class CertificadoModule {}

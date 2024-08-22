import { PrismaService } from '@/prisma/prisma.service';
import { QrCodeService } from '@/qr-code-generator/qr-code-generator.service';
import { Module } from '@nestjs/common';
import { CertificadoController } from './certificado.controller';
import { CertificadoService } from './certificado.service';

@Module({
  controllers: [CertificadoController],
  providers: [CertificadoService,QrCodeService,  PrismaService],
  exports: [CertificadoService],
})
export class CertificadoModule {}

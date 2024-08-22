import { Module } from '@nestjs/common';
import { QrCodeController } from './qr-code-generator.controller';
import { QrCodeService } from './qr-code-generator.service';



@Module({
  controllers: [QrCodeController],
  providers: [QrCodeService],
})
export class QrCodeModule {}
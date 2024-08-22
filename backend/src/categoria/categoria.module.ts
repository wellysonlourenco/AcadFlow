import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, PrismaService],
})
export class CategoriaModule {}

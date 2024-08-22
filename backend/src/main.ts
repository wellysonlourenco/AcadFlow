import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { Env } from './env';
import { LogInterceptor } from './interceptors/log.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  app.useGlobalInterceptors(new LogInterceptor());


  app.use(express.static(__dirname + 'assets'));
  app.use('/', express.static('../assets/uploads/'));


  app.enableCors({
    origin:
      ['http://localhost:3001',],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });


  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get('PORT', { infer: true });
  await app.listen(port);


  Logger.log(
    `🚀 Aplicação está rodando: ${await app.getUrl()}`,
    //npx prisma studio
  )
}
bootstrap();
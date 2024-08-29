import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriaModule } from './categoria/categoria.module';
import { CertificadoModule } from './certificado/certificado.module';
import { envSchema } from './env';
import { EventoModule } from './evento/evento.module';
import { InscricaoModule } from './inscricao/inscricao.module';
import { PrismaModule } from './prisma/prisma.module';
import { QrCodeModule } from './qr-code-generator/qr-code-generator.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'assets/uploads'), 
      // rootPath: join(process.cwd(), 'assets', 'uploads'),
      exclude: ['/api*'],
      serveRoot: '/',
      serveStaticOptions: {
        index: false, // Desabilita a busca por index.html
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get('MAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get('DEFAULT_MAIL_FROM'),
        },
        template: {
          dir: join(__dirname, '..', '..', 'templates', 'mail'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    UsuarioModule,
    AuthModule,
    EventoModule,
    CertificadoModule,
    InscricaoModule,
    CategoriaModule,
    QrCodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        console.log(`Request... ${req.method} ${req.url}`);
        next();
      })
      .forRoutes('*');
  }
}

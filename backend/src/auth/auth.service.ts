import { PrismaService } from '@/prisma/prisma.service';
import { UsuarioService } from '@/usuario/usuario.service';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/user-create.dto';
import { UserForgotPasswordDto } from './dto/user-forgot-password.dto';
import { LoginUserDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly usersService: UsuarioService,
        private readonly mailer: MailerService ,
        private readonly configService: ConfigService,
    ) { }


    async createUser(createUserDto: CreateUserDto) {
        const { nome, email, senha, perfil } = createUserDto;

        const userWithSameEmail = await this.usersService.findOneByEmail(email);
        if (userWithSameEmail) {
            throw new HttpException('O usuário com esse e-mail já existe', HttpStatus.BAD_REQUEST);
        }

        const saltRounds = 8;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const user = await this.prisma.usuario.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                perfil,
            },
        });

        user.senha = undefined;
        return { user, message: 'Usuario cadastrado com sucesso!' }
    }


    async validateUser(email: string, senha: string) {
        const user = await this.usersService.findOneByEmail(email);

        if (!user || !(await bcrypt.compare(senha, user.senha))) {
            throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
        } else {
            return user;
        }
    }




    async login(loginUserDto: LoginUserDto) {
        const { email, senha } = loginUserDto;

        await this.validateUser(email, senha);

        const user = await this.usersService.findOneByEmail(email);

        const token = jwt.sign({ id: user.id, username: user.nome }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
        //const token = await this.createToken(email);
        return { token };
    }




    async updatePassword(id: number, senha: string, novaSenha: string) {
        await this.usersService.exists(id);


        const user = await this.usersService.getUserById(id);
        const isPasswordCorrect = await bcrypt.compare(senha, novaSenha);

        if (!isPasswordCorrect) {
            throw new HttpException('Senha Invalida', HttpStatus.UNAUTHORIZED);
        }

        const hashedNewPassword = await bcrypt.hash(novaSenha, 8);

        await this.prisma.usuario.update({
            where: { id: user.id },
            data: {
                senha: hashedNewPassword,
            },
        });

        return { message: 'Senha atualizada com sucesso!' };
    }


    // --------------Forgot-password-user----------------
    async forgotPassword(userForgotPasswordDto: UserForgotPasswordDto) {
        const { email } = userForgotPasswordDto;

        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '30 minutes', });

        //console.log('url', `${this.configService.get<string>('APP_FRONT_URL')}/reset-password?${token}`);
        //console.log('token', token);
        await this.mailer.sendMail({
            subject: 'Redefinição de senha - BemStoque',
            to: user.email,
            template: './forgot-password',
            context: {
                name: user.nome,
                url: `${this.configService.get<string>('APP_FRONT_URL')}/reset-password?${token}`,
            },
        })

        return { message: 'Email enviado com sucesso!' };
    }



    // --------------Reset-password-user----------------
    async reset(senha: string, token: string) {
        try {
            //await jwt.verify(token, process.env.JWT_SECRET_KEY);

            const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decodedToken.id;
            console.log(userId)


            const saltRounds = 8;
            const salt = await bcrypt.genSalt(saltRounds);
            senha = await bcrypt.hash(senha, salt);

            await
                this.prisma.usuario.update({
                    where: { id: userId },
                    data: { senha: senha },
                });

            return { message: 'Senha atualizada com sucesso!' };
        } catch (e) {
            throw new HttpException('Token invalido', HttpStatus.BAD_REQUEST);
        }
    }



}

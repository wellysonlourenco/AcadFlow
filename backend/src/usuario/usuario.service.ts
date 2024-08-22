import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Perfil } from '@prisma/client';
import * as fs from 'fs/promises';

@Injectable()
export class UsuarioService {
    constructor(private readonly prisma: PrismaService) { }


    async findOneByEmail(email: string) {
        return this.prisma.usuario.findFirst({
            where: { email },
            select: {
                id: true,
                nome: true,
                senha: true,
                email: true,
                perfil: true,
                avatar: true
            }
        });
    }


    async userById(id: number) {
        const user = await this.prisma.usuario.findUnique({
            where: {
                id
            }
        });

        return user;
    }

    async getUserById(id: number) {
        await this.exists(id);

        const user = await this.prisma.usuario.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                nome: true,
                email: true,
                perfil: true,
                avatar: true
            }
        })

        return {
            ...user,
            avatar: user.avatar ? `${process.env.APP_URL}/${user.avatar}` : null
        }

    }

    async userCount() {
        const count = await this.prisma.usuario.count({});
        return count;
    }

    async getUsers(take: number, skip: number, searchString: string, orderBy: 'asc' | 'desc') {

        const usuarios = await this.prisma.usuario.findMany({
            take,
            skip,
            where: {
                OR: [
                    { nome: { contains: searchString } },
                    { email: { contains: searchString } },
                ]
            },
            orderBy: {
                nome: orderBy
            }
        });

        return usuarios.map(user => ({
            ...user,
            avatar: user.avatar ? `${process.env.APP_URL}/${user.avatar}` : null
        }));
    }


    async updateUser(id: number, nome: string, email: string, perfil: Perfil, senha: string) {
        await this.exists(id);


        return await this.prisma.usuario.update({
            where: {
                id
            },
            data: {
                nome,
                email,
                perfil : Perfil[perfil],
                senha,
            }
        })
    }

    async updatePerfil(id: number, perfil: Perfil) {
        await this.exists(id);

        return await this.prisma.usuario.update({
            where: {
                id
            },
            data: {
                perfil
            }
        })
    }

    async uploadAvatar(id: number, avatar: string) {
        await this.exists(id);

        const users = await this.prisma.usuario.update({
            where: {
                id
            },
            data: {
                avatar
            }
        })
        return users;
    }


    async deleteUser(id: number): Promise<Boolean> {
        const user = await this.userById(id);

        if (user.avatar) {
            try {
                await fs.unlink(`./assets/uploads/${user.avatar}`)
            } catch (error) {
                throw new HttpException('Erro ao deletar arquivo', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        await this.prisma.usuario.delete({
            where: {
                id
            }
        })
        return true;
    }


    // ---------------exists----------------
    async exists(id: number) {
        if (
            !(await this.prisma.usuario.count({
                where: {
                    id,
                },
            }))
        ) {
            throw new HttpException(`O usuário ${id} não existe.`, HttpStatus.NOT_FOUND);
        }
    }


    // // ------------exists-mail ----------------
    // async existsEmail(email: string) {
    //     if (
    //         await this.prisma.usuario.count({
    //             where: {
    //                 email,
    //             },
    //         })
    //     ) {
    //         throw new HttpException(`O email ${email} já está em uso.`, HttpStatus.BAD_REQUEST);
    //     }
    // }
}

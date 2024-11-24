import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Perfil } from '@prisma/client';
import { Response } from 'express';
import * as fs from 'fs/promises';
import { PDFDocument, rgb } from 'pdf-lib';

@Injectable()
export class UsuarioService {
    constructor(private readonly prisma: PrismaService) { }


    async findEmails(email: string) {
        const user = await this.prisma.usuario.findUnique({
            where: {
                email
            }
        });

        user.avatar =  user.avatar ? `${process.env.APP_URL}/${user.avatar}` : null;
        return user;
    }

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

    async getUserStatistics() {
        const totalUsers = await this.prisma.usuario.count();
        const adminCount = await this.prisma.usuario.count({
          where: { perfil: 'ADMIN' },
        });
        const userCount = await this.prisma.usuario.count({
          where: { perfil: 'USER' },
        });
    
        return {
          totalUsers,
          adminCount,
          userCount,
        };
      }

    async userCount() {
        const count = await this.prisma.usuario.count({});
        return count;
    }

    async findAllUsers() {
        const users = this.prisma.usuario.findMany({
            select: {
                nome: true,
                email: true,
                perfil:  true,
    
            },
            orderBy: [
                { perfil: 'asc' },  
                { nome: 'asc' },     
            ],
        });
        return (await users).map(user => ({
            ...user,
            perfil: user.perfil === 'ADMIN' ? 'Administrador' : 'Participante'
        }));
    }

    // Método para gerar PDF com a lista de usuários
    async generateUserPdf(res: Response) {
        const users = await this.findAllUsers();

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([595, 842]);  // Dimensões de A4 no modo retrato
        const { height } = page.getSize();

        const fontSize = 12;
        let yPosition = height - fontSize * 2;

        // Título
        page.drawText('Lista de Usuários', { x: 50, y: yPosition, size: fontSize + 4 });
        yPosition -= fontSize * 2;

        // Cabeçalhos da Tabela
        const col1X = 50;
        const col2X = 200;
        const col3X = 400;

        page.drawText('Nome', { x: col1X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText('Email', { x: col2X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText('Perfil', { x: col3X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });

        yPosition -= fontSize * 1.5;

        // Iterando sobre os usuários e adicionando à tabela
        users.forEach((user) => {
            page.drawText(user.nome, { x: col1X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
            page.drawText(user.email, { x: col2X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
            page.drawText(user.perfil, { x: col3X, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });

            yPosition -= fontSize * 1.5;

            // Adicionar nova página se necessário (se o conteúdo exceder o tamanho da página)
            if (yPosition <= fontSize * 2) {
                page = pdfDoc.addPage([595, 842]);  // Nova página no modo retrato
                yPosition = height - fontSize * 2;  // Reiniciar a posição y
            }
        });


        const pdfBytes = await pdfDoc.save();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="lista_usuarios.pdf"',
            'Content-Length': pdfBytes.length,
        });

        res.end(pdfBytes);
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


    async updateUser(id: number, nome: string, senha: string) {
        await this.exists(id);

        
        return await this.prisma.usuario.update({
            where: {
                id
            },
            data: {
                nome,
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

    async updateRoleUser(id: number, perfil: Perfil) {
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

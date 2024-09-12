import { multerConfig } from '@/middleware/DiskStorage';
import { FileSizeValidationPipe } from '@/pipe/uploaded-file';
import { OrderParamSchema, orderValidationPipe, PageParamSchema, pageValidatioPipe, PerPageParamSchema, perPageValidationPipe, SearchParamSchema, searchValidationPipe } from '@/schema/page-param';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Perfil } from '@prisma/client';
import * as fs from 'fs/promises';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  usersService: any;
  constructor(private readonly usuarioService: UsuarioService) {}
  
    @Get('count')
    async countUsers() {
        const total =  await this.usuarioService.userCount();
        return { total: total}
    }
  
    @Get('me/:id')
    async getUserById(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.usuarioService.getUserById(id);
    }

    @Get(':email')
    async getUserEmail(
        @Param('email') email: string,
    ) {
        return await this.usuarioService.findEmails(email);
    }


    @Get()
    async getCategorias(
        @Query('page', pageValidatioPipe) page: PageParamSchema,
        @Query('limit', perPageValidationPipe) limit: PerPageParamSchema,
        @Query('search', searchValidationPipe) search: SearchParamSchema,
        @Query('sort', orderValidationPipe) sort: OrderParamSchema,
    ) {
        const take = limit || 10;
        const skip = limit * (page - 1);
        const searchString = search || '';
        let orderBy = sort;

        const [usuarios, countUsers] = await Promise.all([
            this.usuarioService.getUsers(take, skip, searchString, orderBy),
            this.usuarioService.userCount()
        ])

        const countPages = Math.ceil(countUsers / take);

        return { usuarios, page, limit: take, countPages, countUsers }

    }



    @Patch('avatar/:id')
    @UseInterceptors(FileInterceptor('avatar', multerConfig))
    async updateAvatar(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile(
            new FileSizeValidationPipe(),
        ) file: Express.Multer.File,
    ) {

        if (!file) {
            throw new HttpException('O arquivo nao é uma imagem', HttpStatus.BAD_REQUEST)
        }

        const usuario = await this.usuarioService.userById(id);

        console.log(usuario.avatar)
        if (usuario.avatar) {
            try {
                await fs.unlink(`./assets/uploads/${usuario.avatar}`)
            } catch (error) {
                usuario.avatar = null;
            }
        }

        const avatar = file.filename;
        const user = await this.usuarioService.uploadAvatar(id, avatar);
        return user
    }

    @Patch('perfil/:id')
    async RoleUserUpdate (
        @Param('id', ParseIntPipe) id: number,
        @Body('perfil') perfil: Perfil,
    ) {
        const user = await this.usuarioService.updateRoleUser(id, perfil);
        return user
    }
    


    
    @Put(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body('nome') nome: string,
        @Body('email') email: string,
        @Body('perfil') perfil: Perfil,
        @Body('senha') senha: string,
    ) {
        const user = await this.usuarioService.updateUser(id, nome, email, perfil, senha );
        return user
    }



    @Delete(':id')
    async deleteUser(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.usuarioService.deleteUser(id);
    }
}

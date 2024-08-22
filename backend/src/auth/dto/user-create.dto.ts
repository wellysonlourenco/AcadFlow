import { Perfil } from "@prisma/client";

export class CreateUserDto {
    nome: string;
    email: string;
    senha: string;
    perfil: Perfil;
}
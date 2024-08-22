import { Perfil } from "@prisma/client";

export class  UpdateUsuarioDto{
    nome: string;
    perfil: Perfil
    senha: string;
}
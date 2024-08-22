import { ZodValidationPipe } from "@/pipe/zod-validation-pipe"
import { Perfil } from "@prisma/client"
import { z } from "zod"

export const usuarioSchema = z.object({
    nome: z.string(),
    email: z.string().email({ message: "Endereço de e-mail invalido" }),
    senha: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
    perfil: z.nativeEnum(Perfil),
})

export type CreateUserBodySchema = z.infer<typeof usuarioSchema>
export const CreateUsuarioValidatioPipe = new ZodValidationPipe(usuarioSchema)

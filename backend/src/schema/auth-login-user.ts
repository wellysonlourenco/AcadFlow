import { ZodValidationPipe } from "@/pipe/zod-validation-pipe"
import { z } from "zod"

export const usuarioLoginSchema = z.object({
    email: z.string().email({ message: "Endereço de e-mail invalido" }),
    senha: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
})

export type LoginUserBodySchema = z.infer<typeof usuarioLoginSchema>
export const LoginUserValidationPipe = new ZodValidationPipe(usuarioLoginSchema)

import { ZodValidationPipe } from "@/pipe/zod-validation-pipe"
import { z } from "zod"

export const updatePasswordSchema = z.object({
    senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    novaSenha: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres" }),
})

export type UpdatePasswordUserBodySchema = z.infer<typeof updatePasswordSchema>
export const UpdatePasswordValidationPipe = new ZodValidationPipe(updatePasswordSchema)


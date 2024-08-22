import { ZodValidationPipe } from "@/pipe/zod-validation-pipe"
import { z } from "zod"

export const resetPasswordSchema = z.object({
    senha: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres" }),
})

export type ResetPasswordUserBodySchema = z.infer<typeof resetPasswordSchema>
export const ResetPasswordValidationPipe = new ZodValidationPipe(resetPasswordSchema)


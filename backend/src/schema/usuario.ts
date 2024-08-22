import { ZodValidationPipe } from "@/pipe/zod-validation-pipe"
import * as z from "zod"

export const usuarioSchema = z.object({
  id: z.coerce.number().int(),
  email: z.string().email({ message: "Endereço de e-mail invalido" }).optional(),
})

export type UserSchema = z.infer<typeof usuarioSchema>
export const usuarioValidationPipe = new ZodValidationPipe(usuarioSchema)


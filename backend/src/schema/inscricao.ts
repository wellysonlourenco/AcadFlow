import { z } from "zod";

export const inscricaoSchema = z.object ({
    numero: z.string().optional(),
    usuarioId: z.number(),
    eventoId: z.number(),
    dataInsc: z.coerce.date().optional(),
})
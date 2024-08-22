import { ZodValidationPipe } from "@/pipe/zod-validation-pipe";
import { Status } from "@prisma/client";
import { z } from "zod";

export const eventoSchema = z.object ({
    nome: z.string({ message: "O nome é obrigatório" }),
    descricao: z.string().optional(),
    dataInicio: z.coerce.date(),
    dataFim: z.coerce.date(),
    quantidateHoras: z.number(),
    quantidadeVagas: z.number().nullish(),
    categoriaId: z.number(),
    local: z.string().nullish(),
    status: z.nativeEnum(Status).default(Status.ATIVO),
    imagem: z.string().optional().nullish(),
})

export type EventoBodySchema = z.infer<typeof eventoSchema>
export const EventoValidationPipe = new ZodValidationPipe(eventoSchema)

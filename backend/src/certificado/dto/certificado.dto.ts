import { Certificado } from "@prisma/client";

export class CertificadoDto {
    inscricaoId: number;
    status?: Certificado;
    url?: string;
}
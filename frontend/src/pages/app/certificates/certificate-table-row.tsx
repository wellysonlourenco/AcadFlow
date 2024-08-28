import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { Mail, Printer } from "lucide-react";
import { useState } from "react";
import { ParticipacaoResponse } from "./interfaces/certificates";

export interface CertificateTableRowProps {
    participacao: ParticipacaoResponse;
}

export function CertificateTableRow({ participacao }: CertificateTableRowProps) {
    const certificado = participacao.Certificado[0];
    const [downloading, setDownloading] = useState(false);

    const handleGenerateCertificate = async () => {
        try {
            setDownloading(true);
            const response = await api.get(`/certificado/${participacao.id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${participacao.Evento.nome}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao gerar o comprovante:", error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <TableRow className="overflow-x-auto">
            {/* <TableCell className="whitespace-nowrap">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Detalhes do Certificado</span>
                        </Button>
                    </DialogTrigger>
                </Dialog>
            </TableCell> */}

            <TableCell className="font-mono text-sm font-medium whitespace-nowrap">
                {certificado.chave}
            </TableCell>
            <TableCell className="whitespace-nowrap text-xs">{participacao.Evento.nome}</TableCell>
            <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
                {participacao.numeroInscricao}
            </TableCell>
            <TableCell className="whitespace-nowrap text-xs">{participacao.Evento.quantidadeHoras} horas</TableCell>
            <TableCell className="whitespace-nowrap text-xs">
                {new Date(certificado.dataCadastro).toLocaleDateString()}
            </TableCell>
            <TableCell className="whitespace-nowrap">
                <div className="flex gap-x-1 items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateCertificate}
                        disabled={downloading}
                    >
                        <Printer className="h-4 w-4 mr-1" />
                        Imprimir
                    </Button>
                    <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Enviar e-mail
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
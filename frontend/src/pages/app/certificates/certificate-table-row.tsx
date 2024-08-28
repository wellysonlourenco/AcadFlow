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
        <TableRow>
            {/* <TableCell>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                            <Search className="h-3 w-3" />
                            <span className="sr-only">Detalhes do Certificado</span>
                        </Button>
                    </DialogTrigger>
                </Dialog>
            </TableCell> */}
            <TableCell className="font-mono text-xs font-medium">{certificado?.chave || 'N/A'}</TableCell>
            <TableCell className="">{participacao.Evento.nome}</TableCell>
            <TableCell className="text-muted-foreground">{participacao.numeroInscricao}</TableCell>
            <TableCell className="font-medium">{participacao.Evento.quantidadeHoras} horas</TableCell>
            <TableCell className="font-medium">
                {certificado ? new Date(certificado.dataCadastro).toLocaleDateString() : 'N/A'}
            </TableCell>
            <TableCell>
                <Button
                    variant="ghost"
                    className="text-foreground hover:underline"
                    onClick={handleGenerateCertificate}
                    disabled={downloading || !certificado}
                >
                    <Printer size={19} className="h-3 w-3 mr-2" /> Imprimir
                </Button>
            </TableCell>
            <TableCell>
                <Button variant="ghost" size="xs" className="" disabled={!certificado}>
                    <Mail className="h-3 w-3 mr-2" />
                    Enviar e-mail
                </Button>
            </TableCell>
        </TableRow>
    );
}
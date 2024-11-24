import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/services/api";
import { motion } from 'framer-motion';
import { Mail, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ParticipacaoResponse } from "./interfaces/certificates";

export interface CertificateTableRowProps {
    participacao: ParticipacaoResponse;
}

export function CertificateTableRow({ participacao }: CertificateTableRowProps) {
    const certificado = participacao.Certificado[0];
    const [downloading, setDownloading] = useState(false);
    const [send, setSend] = useState(false);


    const handleEnvioEmailCertificado = async () => {
        try {
            setSend(true);
            const response = await api.post(`certificado/enviar-email/${participacao.id}`, {
            });
            return response;

        } catch (error) {
            toast.error("Erro ao enviar por email o certificado!");
            //console.error("Erro ao enviar por email o certificado:", error);
        } finally {
            toast.success("Certificado enviado com sucesso!");
            setSend(false);
        }
    };

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
            toast.error("Erro ao gerar o comprovante!");
            //console.error("Erro ao gerar o comprovante:", error);
        } finally {
            toast.success("Certificado gerado com sucesso!");
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
            <TableCell className=" text-end">
                <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                        variant="ghost"
                        className="text-foreground hover:underline"
                        onClick={handleGenerateCertificate}
                        disabled={downloading || !certificado}
                    >
                        <Printer size={19} className="h-3 w-3 mr-2" /> Imprimir
                    </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={handleEnvioEmailCertificado}
                        className=""
                        disabled={send || !certificado}
                    >
                        <Mail className="h-3 w-3 mr-2" />
                        Enviar e-mail
                    </Button>
                </motion.div>
            </TableCell>
            {/* <TableCell>
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
            </TableCell> */}
        </TableRow>
    );
}
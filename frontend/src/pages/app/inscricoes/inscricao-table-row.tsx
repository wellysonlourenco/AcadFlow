import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { motion } from 'framer-motion';
import { Mail, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Evento } from "../events/interface/events-response";


interface InscricaoTableRowProps {
    inscricao: {
        id: number;
        numeroInscricao: string;
        usuarioId: number;
        eventoId: number;
        dataInsc: string;
        Evento: Evento;
    }
}

export function InscricaoTableRow({ inscricao }: InscricaoTableRowProps) {
    const [open, setOpen] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [send, setSend] = useState(false);



    const handleEnvioEmailComprovante = async () => {
        try {
            setSend(true);
            const response = await api.post(`inscricao/enviar-email/${inscricao.id}`, {
            });
            return response;

        } catch (error) {
            toast.error("Erro ao enviar por email o comprovante!");
            //console.error("Erro ao enviar por email o comprovante:", error);
        } finally {
            toast.success("Comprovante enviado com sucesso!");
            setSend(false);
        }
    };


    
    const handleGenerateComprovante = async () => {
        try {
            setDownloading(true);
    
            const response = await api.get(`inscricao/${inscricao.id}`, {
                responseType: 'blob',
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${inscricao.Evento.nome}.pdf`);
            document.body.appendChild(link);
            link.click();
    
            // Limpeza para liberar memória
            link.remove();
            window.URL.revokeObjectURL(url);
    
        } catch (error) {
            //console.error("Erro ao gerar o comprovante:", error);
            toast.error("Erro ao gerar o comprovante!");
        } finally {
            toast.success("Comprovante gerado com sucesso!");
            setDownloading(false);
        }
    };
    

    return (
        <TableRow>
            <TableCell className="font-medium">
                {inscricao.numeroInscricao}
            </TableCell>
            <TableCell className="hidden md:table-cell">{inscricao.Evento.nome}</TableCell>
            <TableCell className="text-end">
                {new Date(inscricao.dataInsc).toLocaleDateString()}
            </TableCell>

            <TableCell className=" text-end">
                <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                        variant="ghost"
                        className="text-foreground hover:underline"
                        onClick={handleGenerateComprovante}
                        disabled={downloading || !inscricao}
                    >
                        <Printer size={19} className="h-3 w-3 mr-2" /> Imprimir
                    </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={handleEnvioEmailComprovante}
                        className=""
                        disabled={send || !inscricao}
                    >
                        <Mail className="h-3 w-3 mr-2" />
                        Enviar e-mail
                    </Button>
                </motion.div>
            </TableCell>
        </TableRow>
    )
} 
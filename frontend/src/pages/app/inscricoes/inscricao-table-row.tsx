import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { Printer } from "lucide-react";
import { useState } from "react";
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
            console.error("Erro ao gerar o comprovante:", error);
        } finally {
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
                <Button
                variant="ghost"
                    className="text-foreground hover:underline"
                    onClick={() => setOpen(!open)}
                >
                    
                    <Button
                    variant="ghost"
                    className="text-foreground hover:underline"
                    onClick={handleGenerateComprovante}
                    disabled={downloading}
                >
                    <Printer size={19} />
                </Button>
                    
                </Button>
            </TableCell>
        </TableRow>
    )
} 
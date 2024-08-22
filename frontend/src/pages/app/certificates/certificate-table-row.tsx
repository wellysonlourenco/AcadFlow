import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Mail, Printer, Search } from "lucide-react";
import { CertificateDatails } from "./certificate-details";

//export interface EventTableRowProps { }

export function CertificateTableRow() {
    return (
        <TableRow>
            <TableCell>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                            <Search className="h-3 w-3" />
                            <span className="sr-only">Detalhes do Certificado</span>
                        </Button>
                    </DialogTrigger>

                    <CertificateDatails />

                </Dialog>
            </TableCell>
            <TableCell className="font-mono text-xs font-medium">123456</TableCell>
            <TableCell className="">ReactJs </TableCell>
            <TableCell className="text-muted-foreground">1223</TableCell>
            <TableCell className="font-medium">15 horas</TableCell>
            <TableCell className="font-medium">10/10/2023</TableCell>
            <TableCell>
                <Button variant="outline" size="xs" className="">
                    <Printer className="h-3 w-3 mr-2" />
                    Imprimir
                </Button>
            </TableCell>
            <TableCell>
                <Button variant="ghost" size="xs" className="">
                    <Mail className="h-3 w-3 mr-2" />
                    Enviar e-mail
                </Button>
            </TableCell>
        </TableRow>
    )
}
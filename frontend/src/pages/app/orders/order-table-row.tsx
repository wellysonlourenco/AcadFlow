import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight, Search, X } from "lucide-react";
import { OrderDatails } from "./order-details";

//export interface OrderTableRowProps { }

export function OrderTableRow() {
    return (
        <TableRow>
            <TableCell>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                            <Search className="h-3 w-3" />
                            <span className="sr-only">Detalhes do Pedido</span>
                        </Button>
                    </DialogTrigger>

                    <OrderDatails />

                </Dialog>
            </TableCell>
            <TableCell className="font-mono text-xs font-medium">asdasdasdas</TableCell>
            <TableCell className="text-muted-foreground">Há 15 minutos</TableCell>
            <TableCell className="">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="font-medium text-muted-foreground">Pendente</span>
                </div>
            </TableCell>
            <TableCell className="font-medium">Wellyson</TableCell>
            <TableCell className="font-medium">R$ 100,00</TableCell>
            <TableCell>
                <Button variant="outline" size="xs" className="">
                    <ArrowRight className="h-3 w-3 mr-2" />
                    Aprovar
                </Button>
            </TableCell>
            <TableCell>
                <Button variant="ghost" size="xs" className="">
                    <X className="h-3 w-3 mr-2" />
                    Cancelar
                </Button>
            </TableCell>
        </TableRow>
    )
}
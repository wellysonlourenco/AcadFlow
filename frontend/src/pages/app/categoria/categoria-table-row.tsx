import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { CategoriaTableRowActions } from "./categoria-table-row-actions";

interface CategoriaTableRowProps {
    categorias: {
        id: number;
        descricao: string;
    }
}


export function CategoriaTableRow({ categorias }: CategoriaTableRowProps) {
    const [open, setOpen] = useState(false);

    return (
        <TableRow>
            <TableCell className="sr-only">
                {categorias.id}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
                {categorias.descricao}
            </TableCell>
            <TableCell className="text-right">
                <CategoriaTableRowActions categorias={categorias} setFormOpen={setOpen} />
            </TableCell>
        </TableRow>
    )
}
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { z } from "zod";
import { CategoriaEditForm } from "./categoria-edit.form";

interface CategoriaTabelRowProps {
    categorias: {
        id: number;
        descricao: string;
    },
    setFormOpen: (value: boolean) => void;
    className?: string;
}

const formSchema = z.object({
    nome: z.string(),
    descricao: z.string().optional(),
})

type FormSchema = z.infer<typeof formSchema>

export function CategoriaTableRowActions ({ categorias }: CategoriaTabelRowProps) {
    const [open, setOpen] = useState(false)



    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <CategoriaEditForm categorias={categorias} setFormOpen={setOpen} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Update employee</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    )





}
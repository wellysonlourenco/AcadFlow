"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

export interface CategoriaSearch {
    id: number;
    descricao: string;
}

interface ComboboxCategoriasProps {
    value: number | null;
    onValueChange: (value: number) => void;
}

export function ComboboxCategorias({
    value,
    onValueChange,
}: ComboboxCategoriasProps) {
    const [open, setOpen] = React.useState(false);

    const { data: categorias = [] } = useQuery<CategoriaSearch[]>({
        queryKey: ["categorias-search"],
        queryFn: async () => {
            const response = await api.get("/categoria/search");
            return response.data;
        },
    });

    // Console log para debug
    React.useEffect(() => {
        console.log('ComboboxCategorias - value:', value);
        console.log('ComboboxCategorias - categorias:', categorias);
    }, [value, categorias]);

    const categoriasSearch = categorias?.map((categoria) => ({
        value: categoria.id,
        label: categoria.descricao,
    }));

    const selectedCategoria = categoriasSearch.find(
        (categoria) => categoria.value === value
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedCategoria
                        ? selectedCategoria.label
                        : "Selecionar a categoria..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[570px] p-0">
                <Command>
                    <CommandInput placeholder="Pesquisar a categoria..." />
                    <CommandList>
                        <CommandEmpty>Categoria não encontrada</CommandEmpty>
                        <CommandGroup>
                            {categoriasSearch.map((categoria) => (
                                <CommandItem
                                    key={categoria.value}
                                    value={categoria.label}
                                    onSelect={() => {
                                        onValueChange(categoria.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === categoria.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {categoria.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
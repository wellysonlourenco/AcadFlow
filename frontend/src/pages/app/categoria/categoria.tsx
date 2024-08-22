import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CategoriaTableRow } from "./categoria-table-row";
import { CategoriaResponse } from "./interface/categoria";

export function Categoria() {
    const [open, setOpen] = useState(false);

    const { data: categoriaResponse, isLoading } = useQuery<CategoriaResponse>({
        queryKey: ['categorias'],
        queryFn: async () => {
            const response = await api.get(`/categoria`);
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    if (isLoading) {
        return <div>Carregando...</div>
    }

    console.log(categoriaResponse);

    return (
        <>
            <Helmet title="Categorias" />
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
                <div className="space-y-2.5">
                    <form  className="flex items-center gap-2">
                        <div className="relative w-[220px]">
                            
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link to="/categoria-create">
                                Cadastrar Categoria
                                </Link>
                            </Button>
                        </div>
                    </form>

                    <div className="border rounded-md">
                        <Card >
                            <CardHeader>
                                <CardTitle>Categorias</CardTitle>
                                
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="sr-only">id</TableHead>
                                                <TableHead className="hidden md:table-cell">Descrição</TableHead>
                                                <TableHead className="sr-only">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categoriaResponse?.categorias.map((categorias) => (
                                                <CategoriaTableRow key={categorias.id} categorias={categorias} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
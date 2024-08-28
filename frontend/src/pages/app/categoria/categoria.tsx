import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { CategoriaCreateForm } from "./categoria-create-form";
import { CategoriaTableRow } from "./categoria-table-row";
import { CategoriaResponse } from "./interface/categoria";




export function Categoria() {
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const urlFilter = searchParams.get('filter') ?? '';
    const [filter, setFilter] = useState(urlFilter);

    const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const itemsPerPage = searchParams.get('itemsPerPage') ? Number(searchParams.get('itemsPerPage')) : 10;

    // const { data: categoriaEvento } = useQuery<CategoriaEvento>({
    //     queryKey: ['categoria-evento'],
    //     queryFn: async () => {
    //         const response = await api.get(`/categoria/contagem-eventos`);
    //         return response.data;
    //     },
    //     placeholderData: keepPreviousData,
    // });


    const { data: categoriaResponse, isLoading, refetch } = useQuery<CategoriaResponse>({
        queryKey: ['categorias', filter, currentPage, itemsPerPage],
        queryFn: async () => {
            const response = await api.get(`/categoria?page=${currentPage}&limit=${itemsPerPage}&search=${filter}`);
            return response.data;
        },
        placeholderData: keepPreviousData,
    });


    const totalPages = categoriaResponse?.countCategorias || 1;

    function handlePageChange(page: number) {
        setSearchParams((params) => {
            params.set('page', page.toString());
            return params;
        });
    }

    useEffect(() => {
        refetch();
    }, [filter, refetch]);

    function handleFilter(event: FormEvent) {
        event.preventDefault();

        setSearchParams((params) => {
            if (currentPage > 1) {
                params.set('page', '1');
            } else {
                params.delete('page');
            }

            if (filter === '') {
                params.delete('filter');
            } else {
                params.set('filter', filter);
            }

            return params;
        });

        refetch();
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFilter(event.target.value);
    }

    if (isLoading) {
        return <div>Carregando...</div>
    }

    console.log(categoriaResponse);

    return (
        <>
            <Helmet title="Categorias" />
            <div className="flex flex-col gap-4">
                <div className="space-y-2.5">
                    <form onSubmit={handleFilter} className="flex items-center gap-2">
                        <div className="relative w-1/6">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                value={filter}
                                onChange={handleInputChange}
                                placeholder="Pesquisar o nome do Evento"
                                className="rounded-md border border-gray-300 px-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-7"
                            />
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <div className="flex items-center">
                                <div className="ml-auto flex items-center gap-2">
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Cadastrar</Button>
                                        </DialogTrigger>

                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Cadastrar uma nova categoria</DialogTitle>
                                            </DialogHeader>
                                            <CategoriaCreateForm setFormOpen={setOpen} />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="border rounded-md">
                        <Card >
                            <CardHeader>
                                <CardTitle>Categorias</CardTitle>
                                <CardDescription>
                                    Total: {categoriaResponse?.countCategorias}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden sm:table-cell sr-only w-[100px] ">Imagem</TableHead>
                                                {/* <TableHead>Nome</TableHead> */}
                                                <TableHead className="px-4 hidden md:table-cell">Descrição</TableHead>
                                                {/* <TableHead className="hidden lg:table-cell">Categoria</TableHead>
                                                <TableHead className="hidden md:table-cell">Data de Início</TableHead>
                                                <TableHead className="hidden lg:table-cell">Data de Fim</TableHead>
                                                <TableHead className="hidden lg:table-cell">Carga Horária</TableHead>
                                                <TableHead className="hidden md:table-cell"> Local</TableHead> */}
                                                <TableHead className="sr-only">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categoriaResponse?.categorias.map((categorias) => (
                                                <CategoriaTableRow key={categorias.id} categorias={categorias} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <Pagination className="mt-4">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(i + 1)}
                                                    isActive={currentPage === i + 1}
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
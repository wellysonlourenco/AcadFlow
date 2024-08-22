import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ListFilter, Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { EventTableRow } from "./event-table-row";
import { EventoResponse } from "./interface/events-response";

export function Events() {
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const urlFilter = searchParams.get('filter') ?? '';
    const [filter, setFilter] = useState(urlFilter);
    const [columnVisibility, setColumnVisibility] = useState({
        imagem: true,
        descricao: true,
        categoria: true,
        dataInicio: true,
        dataFim: true,
        cargaHoraria: true,
        local: true,
        status: true,
    });

    const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const itemsPerPage = searchParams.get('itemsPerPage') ? Number(searchParams.get('itemsPerPage')) : 10;

    const { data: eventoResponse, isLoading, refetch } = useQuery<EventoResponse>({
        queryKey: ['eventos', filter, currentPage, itemsPerPage],
        queryFn: async () => {
            const response = await api.get(`/evento?page=${currentPage}&limit=${itemsPerPage}&search=${filter}`);
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    const totalPages = eventoResponse?.countPages || 1;



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

    //console.log(eventoResponse);


    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFilter(event.target.value);
    }

    if (isLoading) {
        return <div>Carregando...</div>
    }

    return (
        <>
            <Helmet title="Eventos" />
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
                <div className="space-y-2.5">
                    <form onSubmit={handleFilter} className="flex items-center gap-2">
                        <div className="relative w-1/6">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/> 
                            <Input
                                type="text"
                                value={filter}
                                onChange={handleInputChange}
                                placeholder="Pesquisar o nome do Evento"
                                className="rounded-md border border-gray-300 px-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-7"
                            />
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-1">
                                        <ListFilter className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            Exibição
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Visibilidade das Colunas</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem
                                        checked={columnVisibility.imagem}
                                        onCheckedChange={(checked) =>
                                            setColumnVisibility((prev) => ({ ...prev, imagem: checked }))
                                        }
                                    >
                                        Imagem
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={columnVisibility.descricao}
                                        onCheckedChange={(checked) =>
                                            setColumnVisibility((prev) => ({ ...prev, descricao: checked }))
                                        }
                                    >
                                        Descrição
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={columnVisibility.categoria}
                                        onCheckedChange={(checked) =>
                                            setColumnVisibility((prev) => ({ ...prev, categoria: checked }))
                                        }
                                    >
                                        Categoria
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={columnVisibility.dataInicio}
                                        onCheckedChange={(checked) =>
                                            setColumnVisibility((prev) => ({ ...prev, dataInicio: checked }))
                                        }
                                    >
                                        Data de Início
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={columnVisibility.dataFim}
                                        onCheckedChange={(checked) =>
                                            setColumnVisibility((prev) => ({ ...prev, dataFim: checked }))
                                        }
                                    >
                                        Data de Fim
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={columnVisibility.cargaHoraria}
                                        onCheckedChange={(checked) =>
                                            setColumnVisibility((prev) => ({ ...prev, cargaHoraria: checked }))
                                        }
                                    >
                                        Carga Horária
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={columnVisibility.local}
                                        onCheckedChange={(checked) =>
                                            setColumnVisibility((prev) => ({ ...prev, local: checked }))
                                        }
                                    >
                                        Local
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={columnVisibility.status}
                                        onCheckedChange={(checked) =>
                                            setColumnVisibility((prev) => ({ ...prev, status: checked }))
                                        }
                                    >
                                        Status
                                    </DropdownMenuCheckboxItem>

                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button variant="outline" asChild>
                                <Link to="/events-create">
                                    Criar Evento
                                </Link>
                            </Button>
                        </div>
                    </form>

                    <div className="border rounded-md">
                        <Card >
                            <CardHeader>
                                <CardTitle>Eventos</CardTitle>
                                <CardDescription>
                                    Quantidade: {eventoResponse?.eventosCount}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {columnVisibility.imagem && <TableHead className="hidden sm:table-cell w-[100px]">Imagem</TableHead>}
                                                <TableHead>Nome</TableHead>
                                                {columnVisibility.descricao && <TableHead className="hidden md:table-cell">Descrição</TableHead>}
                                                {columnVisibility.categoria && <TableHead className="hidden lg:table-cell">Categoria</TableHead>}
                                                {columnVisibility.dataInicio && <TableHead className="hidden md:table-cell">Data de Início</TableHead>}
                                                {columnVisibility.dataFim && <TableHead className="hidden lg:table-cell">Data de Fim</TableHead>}
                                                {columnVisibility.cargaHoraria && <TableHead className="hidden lg:table-cell">Carga Horária</TableHead>}
                                                {columnVisibility.local && <TableHead className="hidden md:table-cell"> Local</TableHead>}
                                                {columnVisibility.status && <TableHead>Status</TableHead>}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {eventoResponse?.eventos.map((evento) => (
                                                <EventTableRow key={evento.id} eventos={evento} columnVisibility={columnVisibility} />
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
    );
}
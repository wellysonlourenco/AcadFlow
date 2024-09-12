import { Paginacao } from "@/components/paginacao";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { InscricaoTableRow } from "./inscricao-table-row";
import { InscricaoResponse } from "./interface/inscricao";
import { SearchFilter } from "@/components/search-filters";

export function Inscricoes() {
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const urlFilter = searchParams.get('filter') ?? '';
    const [filter, setFilter] = useState(urlFilter);
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const usuarioId = user?.id as number;
    const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const itemsPerPage = searchParams.get('itemsPerPage') ? Number(searchParams.get('itemsPerPage')) : 10;

    console.log(usuarioId);

    const { data: inscricaoResponse, isLoading, refetch } = useQuery<InscricaoResponse>({

        queryKey: ['inscricoes', filter, currentPage, itemsPerPage, usuarioId],
        queryFn: async () => {
            const response = await api.get(`/inscricao/usuario/${usuarioId}?page=${currentPage}&limit=${itemsPerPage}`);
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    const totalPages = inscricaoResponse?.countPages || 1

    function handlePageChange(page: number) {
        setSearchParams((params) => {
            params.set('page', page.toString());
            return params;
        });
    }

    function handleRowsPerPageChange(newRowsPerPage: number) {
        setSearchParams((params) => {
            params.set('itemsPerPage', newRowsPerPage.toString());
            params.set('page', '1');
            return params;
        });
    }

    useEffect(() => {
        refetch();
    }, [filter, refetch]);


    function handleFilter(inscricao: FormEvent) {
        inscricao.preventDefault();

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

    function handleInputChange(inscricao: React.ChangeEvent<HTMLInputElement>) {
        setFilter(inscricao.target.value);
    }

    console.log(inscricaoResponse);
    
    return (
        <>
        <Helmet title="Inscrições" />
            <div className="flex flex-col gap-4">
                <div className="space-y-2.5">
                    <form onSubmit={handleFilter} className="flex items-center gap-2">
                    <div className="relative">
                            <SearchFilter filter={filter} handleInputChange={handleInputChange} />
                        </div>
                        {/* <div className="ml-auto flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link to="/events-create">
                                Criar Evento
                                </Link>
                            </Button>
                        </div> */}
                    </form>

                    <div className="border rounded-md">
                        <Card >
                            <CardHeader>
                                <CardTitle>Inscrições</CardTitle>
                                <CardDescription>
                                    Total de Inscricões: {inscricaoResponse?.countInscricaoByUser}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Numero da Inscrição</TableHead>
                                                <TableHead className="hidden md:table-cell">Evento</TableHead>
                                                <TableHead className="text-end">Data da inscrição</TableHead>
                                                <TableHead className=" text-end">Comprovante da Inscrição</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {inscricaoResponse?.inscricao.map((inscricao) => (
                                                <InscricaoTableRow key={inscricao.id} inscricao={inscricao} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <Paginacao
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    setCurrentPage={handlePageChange}
                                    rowsPerPage={itemsPerPage}
                                    setRowsPerPage={handleRowsPerPageChange}
                                    totalRows={inscricaoResponse?.countInscricaoByUser || 0}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
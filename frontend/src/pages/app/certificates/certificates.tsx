import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { CertificateTableRow } from "./certificate-table-row";
import { ParticipacaoResponse } from "./interfaces/certificates";

export function Certificates() {
    const [searchParams, setSearchParams] = useSearchParams();
    // const urlFilter = searchParams.get('filter') ?? '';
    // const [filter, setFilter] = useState(urlFilter);
    const { user } = useContext(AuthContext);

    const usuarioId = user?.id as number;
    const currentPage = Number(searchParams.get('page') ?? '1');
    const itemsPerPage = Number(searchParams.get('itemsPerPage') ?? '10');

    const { data: participacoes, isLoading, refetch } = useQuery<ParticipacaoResponse[]>({
        queryKey: ['inscricoes', usuarioId, currentPage, itemsPerPage],
        queryFn: async () => {
            const response = await api.get(`/inscricao/certificates/usuario/${usuarioId}`, {
                params: { page: currentPage, itemsPerPage }
            });
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    const totalItems = participacoes?.length ?? 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    function handlePageChange(page: number) {
        setSearchParams((params) => {
            params.set('page', page.toString());
            return params;
        });
    }

    useEffect(() => {
        refetch();
    }, [currentPage, itemsPerPage, refetch]);

    // function handleFilter(event: FormEvent) {
    //     event.preventDefault();
    //     setSearchParams((params) => {
    //         params.set('page', '1');
    //         if (filter === '') {
    //             params.delete('filter');
    //         } else {
    //             params.set('filter', filter);
    //         }
    //         return params;
    //     });
    // }

    // function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    //     setFilter(event.target.value);
    // }

    return (
        <>
            <Helmet title="Certificado" />
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Certificado</h1>
                <div className="space-y-2.5">
                    {/* <CertificateTableFilters onFilter={handleFilter} onInputChange={handleInputChange} filterValue={filter} /> */}

                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[64px]"></TableHead>
                                    <TableHead className="w-[140px]">Registro</TableHead>
                                    <TableHead>Evento</TableHead>
                                    <TableHead className="w-[180px]">Inscrição</TableHead>
                                    <TableHead className="w-[140px]">Carga Horária</TableHead>
                                    <TableHead className="w-[140px]">Emitido em</TableHead>
                                    <TableHead className="w-[164px]"></TableHead>
                                    <TableHead className="w-[132px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {participacoes?.map((participacao) => (
                                    <CertificateTableRow key={participacao.id} participacao={participacao} />
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
                </div>
            </div>
        </>
    )
}
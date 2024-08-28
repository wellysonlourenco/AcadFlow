import { TableLoading } from "@/components/table-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

    return (
        <>
            <Helmet title="Certificados" />
            <Card>
                <CardHeader>
                    <CardTitle>Certificados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="w-[64px]"></TableHead> */}
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
                                {isLoading ? (
                                    <TableLoading />
                                ) : (
                                    participacoes?.map((participacao) => (
                                        <CertificateTableRow key={participacao.id} participacao={participacao} />
                                    ))
                                )}
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
                            {Array.from({ length: totalPages }, (_, i) => (
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
        </>
    );
}
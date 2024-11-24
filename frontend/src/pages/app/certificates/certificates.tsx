import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { CertificateTableRow } from "./certificate-table-row";
import { ParticipacaoResponse } from "./interfaces/certificates";


export interface CargaHorariaTotalResponse {
    totalHoras: number;
  }

export function Certificates() {
    const { user } = useContext(AuthContext);

    const usuarioId = user?.id as number;

    const { data: cargaHorariaTotal } = useQuery<CargaHorariaTotalResponse>({
        queryKey: ['carga-horaria-total'],
        queryFn: async () => {
            const response = await api.get(`/certificado/usuario/${usuarioId}/carga-horaria`);
            return response.data;
        },
        placeholderData: { totalHoras: 0 },
    });


    const { data: participacoes, isLoading } = useQuery<ParticipacaoResponse[]>({
        queryKey: ['inscricoes', usuarioId],
        queryFn: async () => {
            const response = await api.get(`/inscricao/certificates/usuario/${usuarioId}`);
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    // Filtrar apenas as participações que têm certificados
    const participacoesComCertificado = participacoes?.filter(
        (participacao) => participacao.Certificado && participacao.Certificado.length > 0
    ) || [];


    return (
        <>
            <Helmet title="Certificados" />
            <Card>
                <CardHeader>
                    <CardTitle>Certificados</CardTitle>
                    <CardDescription>Confira os certificados dos eventos que você participou.</CardDescription>
                    <CardDescription className="font-bold"> Total de Horas: {cargaHorariaTotal?.totalHoras} horas</CardDescription>
                    {/* <CardDescription>Para baixar o certificado, clique no botão "Baixar".</CardDescription> */}
                </CardHeader>
                <CardContent>
                    {participacoesComCertificado.length > 0 ? (
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
                                        {/* <TableHead className="w-[164px]"></TableHead> */}
                                        <TableHead className="w-[250px] text-end">Certificado de participação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {participacoesComCertificado.map((participacao) => (
                                        <CertificateTableRow key={participacao.id} participacao={participacao} />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-96">
                            <p className="text-lg text-gray-500">Nenhum certificado encontrado.</p>
                        </div>
                    )}

                    {/* <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginatiosnItem>
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
                    </Pagination> */}
                </CardContent>
            </Card >
        </>
    );
}
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
    const { user } = useContext(AuthContext);

    const usuarioId = user?.id as number;

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
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Certificado</h1>
                <div className="space-y-2.5">
                    {participacoesComCertificado.length > 0 ? (
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
                                    {participacoesComCertificado.map((participacao) => (
                                        <CertificateTableRow key={participacao.id} participacao={participacao} />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p>Nenhum certificado disponível no momento.</p>
                    )}
                </div>
            </div>
        </>
    )
}
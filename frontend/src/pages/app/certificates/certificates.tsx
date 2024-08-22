import { Pagination } from "@/components/pagination";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Helmet } from "react-helmet-async";
import { CertificateTableFilters } from "./certificate-table-filters";
import { CertificateTableRow } from "./certificate-table-row";

export function Certificates() {
    return (
        <>
            <Helmet title="Certificado" />
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Certificado</h1>
                <div className="space-y-2.5">
                    <CertificateTableFilters />

                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[64px]"></TableHead>
                                    <TableHead className="w-[140px]">Registro</TableHead>
                                    <TableHead>Evento</TableHead>
                                    <TableHead className="w-[180px]">Inscrição</TableHead>
                                    <TableHead className="w-[140px]">Carha Horaria</TableHead>
                                    <TableHead className="w-[140px]">Emitido em</TableHead>
                                    <TableHead className="w-[164px]"></TableHead>
                                    <TableHead className="w-[132px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 10 }).map((_, i) => {
                                    return <CertificateTableRow key={i} />
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination pageIndex={0} totalCount={105} perPage={10} />
                </div>
            </div>
        </>
    )
}
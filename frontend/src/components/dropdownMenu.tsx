import { useRef, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { FileText } from "lucide-react";
import { api } from "@/services/api";


export function DropdownMenuRelatorio() {
    const downloadReport = async (endpoint: string) => {
        try {
            const response = await api.get(endpoint, {
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `report-${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading report:", error);
            // You might want to show an error message to the user here
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 p-2">
                <FileText className="h-4 w-4" /> <span>Relatórios</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Impressão</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => downloadReport('/usuario/download-pdf')}>
                    Relatório de Usuários
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => downloadReport('/evento/download-pdf')}>
                    Relatório de Eventos
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
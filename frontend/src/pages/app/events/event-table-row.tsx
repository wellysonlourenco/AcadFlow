import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, Navigation, Printer, X } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { Categoria } from "./interface/events-response";
import { motion } from 'framer-motion';

interface EventTableRowProps {
    eventos: {
        id: number;
        nome: string;
        descricao: string;
        dataInicio: string;
        dataFim: string;
        local: string;
        quantidadeHoras: number;
        quantidadeVagas: number;
        status: string;
        imagem: string;
        categoriaId: number;
        dataCadastro: string;
        Categoria: Categoria;
    },
    columnVisibility: {
        imagem: boolean;
        descricao: boolean;
        categoria: boolean;
        dataInicio: boolean;
        dataFim: boolean;
        cargaHoraria: boolean;
        local: boolean;
        // status: boolean;
    }
}

export function EventTableRow({ eventos, columnVisibility }: EventTableRowProps) {
    const [open, setOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [downloading, setDownloading] = useState(false);
    const relatorio = eventos.id;


    const isEventoAtivo = eventos.status === "ATIVO";



    //verifica se o usuário está inscrito no evento
    const { data: isInscrito, refetch: refetchInscricaoStatus } = useQuery({
        queryKey: ['inscricaoStatus', user?.id, eventos.id],
        queryFn: async () => {
            if (!user?.id) return false;
            const response = await api.get(`/inscricao/evento/${eventos.id}/usuario/${user.id}`);
            return response.data;
        },
        enabled: !!user?.id && isEventoAtivo,
    });


    const handleGenerateRelatorio = async () => {
        try {
            setDownloading(true);
            const response = await api.get(`/inscricao/evento/${eventos.id}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${eventos.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Erro ao gerar o relatório!");
            //console.error("Erro ao gerar o comprovante:", error);
        } finally {
            toast.success("Relatório gerado com sucesso!");
            setDownloading(false);
        }
    };



    //console.log(isInscrito)


    //inscreve o usuário no evento
    const inscricaoMutation = useMutation({
        mutationFn: (dados: { usuarioId: number, eventoId: number }) =>
            api.post('/inscricao', dados),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inscricaoStatus', user?.id, eventos.id] });
            toast.success('Inscrição realizada com sucesso!');
            setOpen(false);
            refetchInscricaoStatus();
        },
        onError: () => {
            toast.error('Erro ao realizar inscrição. Tente novamente.');
        }
    });

    const handleInscricao = () => {
        if (!user?.id) {
            toast.error('Você precisa estar logado para se inscrever.');
            return;
        }
        inscricaoMutation.mutate({ usuarioId: user.id, eventoId: eventos.id });
    };



    return (
        <TableRow>
            {columnVisibility.imagem && (
                <TableCell className="hidden sm:table-cell">
                    <img
                        alt="Imagem do Evento"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={eventos.imagem ? eventos.imagem : "events.png"}
                        width="64"
                    />
                </TableCell>
            )}
            <TableCell className="font-medium">
                {eventos.nome}
            </TableCell>

            {columnVisibility.descricao && <TableCell className="hidden md:table-cell">{eventos.descricao}</TableCell>}
            {columnVisibility.categoria && <TableCell className="hidden lg:table-cell">{eventos.Categoria.descricao}</TableCell>}
            {columnVisibility.dataInicio && <TableCell className="hidden md:table-cell">{new Date(eventos.dataInicio).toLocaleDateString()}</TableCell>}
            {columnVisibility.dataFim && <TableCell className="hidden lg:table-cell">{new Date(eventos.dataFim).toLocaleDateString()}</TableCell>}
            {columnVisibility.cargaHoraria && <TableCell className="hidden lg:table-cell">{eventos.quantidadeHoras} horas</TableCell>}
            {columnVisibility.local && (
                <TableCell className="hidden md:table-cell">
                    <div className="flex">
                        <Navigation className="h-4 pr-1" />
                        <span>{eventos.local}</span>
                    </div>
                </TableCell>
            )}


            <TableCell>
                {eventos.status === "ATIVO" ? (
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        Inscrições abertas
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        inscrições encerradas
                    </div>
                )}
            </TableCell>

            {user && user.perfil === 'USER' && (
                <TableCell>

                    {isEventoAtivo ? (
                        isInscrito ? (
                            <Button variant="ghost" size="sm" disabled>
                                <Check className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Inscrição realizada</span>
                                <span className="sm:hidden">Inscrito</span>
                            </Button>
                        ) : (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Fazer Inscrição</span>
                                        <span className="sm:hidden">Inscrever</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Confirmar Inscrição</DialogTitle>
                                        <DialogDescription>
                                            Você está prestes a se inscrever no evento "{eventos.nome}". Deseja continuar?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                                        <Button onClick={handleInscricao} disabled={inscricaoMutation.isPending}>
                                            {inscricaoMutation.isPending ? 'Inscrevendo...' : 'Confirmar Inscrição'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )
                    ) : (
                        <Button variant="ghost" size="sm" disabled>
                            <X className=" mr-2 h-4 w-4 text-red-500" />
                            <span className="hidden sm:inline">
                                Inscrições encerradas</span>
                            <span className="sm:hidden">Encerrado</span>
                        </Button>
                    )}
                </TableCell>
            )}

            {user && user.perfil === 'ADMIN' && (
                <TableCell>
                    <Button variant="ghost" size="sm">
                        Editar
                    </Button>
                    <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                        variant="ghost"
                        className="text-foreground hover:underline"
                        onClick={handleGenerateRelatorio}
                        disabled={downloading }
                    >
                        <Printer size={19} className="h-3 w-3 mr-2" /> Imprimir
                    </Button>
                </motion.div>
                </TableCell>
            )}
        </TableRow>
    )
}
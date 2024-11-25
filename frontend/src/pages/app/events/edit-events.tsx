import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api, API_URL } from "@/services/api";
import { queryClient } from "@/services/query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { ComboboxCategorias } from "../categoria/combobox-categorias";
import { EventCardImagem } from "./event-card-imagem";

const createFormEvent = z.object({
    nome: z.string().min(1, { message: 'Campo Obrigatorio' }),
    descricao: z.string().optional(),
    dataInicio: z.coerce.string({ message: 'Campo Obrigatorio' }),
    dataFim: z.coerce.date(),
    local: z.string().optional(),
    quantidadeHoras: z.number().min(1, { message: 'Mínimo 1 hora.' }),
    quantidadeVagas: z.number().optional(),
    categoriaId: z.number(),
    status: z.string().optional(),
});

type EditEventForm = z.infer<typeof createFormEvent>;

export function EditFormEvents() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [value, setValue] = useState("")

    const { data: evento, isLoading } = useQuery({
        queryKey: ['evento', id],
        queryFn: async () => {
          const response = await api.get(`/evento/${id}`);
          return response.data;
        },
        enabled: !!id,
      });



    const form = useForm<EditEventForm>({
        resolver: zodResolver(createFormEvent),
        mode: 'onChange',
        defaultValues: {
            nome: '',
            descricao: '',
            local: '',
            status: 'ativo',
            quantidadeVagas: 0,
            quantidadeHoras: 0,
        }
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        setError
    } = form;

    useEffect(() => {
        if (evento) {
          form.reset({
            nome: evento.nome || '',
            descricao: evento.descricao || '',
            local: evento.local || '',
            status: 'ativo',
            quantidadeVagas: evento.quantidadeVagas || 0,
            quantidadeHoras: evento.quantidadeHoras || 0,
            //imagem: produto.imagem || null,
          });
        }
      }, [evento, form]);
    

      const { mutateAsync } = useMutation({
        mutationFn: async (data: EditEventForm) => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const response = await api.patch(`/evento/${id}`, data);
          //console.log("response", response);
          return response.data;
        },
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: ['eventos'] });
          //console.log("Produto atualizado com sucesso!");
          toast.success('Evento atualizado com sucesso!', { duration: 1500 });
          navigate('/events');
          form.reset();
        },
        onError: (response) => {
          toast.error('Erro ao atualizar o evento', { duration: 1500 });
        },
      });
    
      const onSubmit = async (data: EditEventForm) => {
        try {
          await mutateAsync(data);
        } catch (error) {
          console.error(error);
        }
      };

    return (
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link to="/events">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Voltar</span>
                    </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Cadastrar Evento
                </h1>
                <Badge variant="outline" className="ml-auto sm:ml-0">
                    Novo
                </Badge>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button
                        type="submit"
                        variant="default"
                        size="sm"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        Salvar
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes do Evento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="nome">Nome do Evento:</Label>
                                    <Input
                                        id="nome"
                                        placeholder="Digite o nome do Evento"
                                        className={errors.nome ? "border-red-500" : ""}
                                        {...register("nome")}
                                    />
                                    {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="descricao">Descrição do Evento:</Label>
                                    <Textarea
                                        id="descricao"
                                        placeholder="Digite a descrição do Evento"
                                        className={errors.descricao ? "border-red-500" : ""}
                                        {...register("descricao")}
                                    />
                                    {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao.message}</p>}
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="local">Local do Evento:</Label>
                                    <Input
                                        id="local"
                                        placeholder="Digite o local do Evento"
                                        {...register("local")}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="categoriaId">Categoria do Evento:</Label>
                                    <Controller
                                        name="categoriaId"
                                        control={form.control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <ComboboxCategorias
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    field.onChange(value); // Atualiza o valor do campo com o ID da categoria
                                                }}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex w-full gap-3">
                                    <div className="flex-1 grid gap-3">
                                        <Label htmlFor="dataInicio">Data de Início:</Label>
                                        <Input
                                            id="dataInicio"
                                            type="date"
                                            {...register("dataInicio")}
                                        />
                                    </div>

                                    <div className="flex-1 grid gap-3">
                                        <Label htmlFor="dataFim">Data de Fim:</Label>
                                        <Input
                                            id="dataFim"
                                            type="date"
                                            {...register("dataFim")}
                                        />
                                        {errors.dataFim && <p className="text-red-500 text-sm">Precisa preencher a data</p>}
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Complementares</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Carga Horária</TableHead>
                                        <TableHead>Quantidade de vagas</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                className={errors.quantidadeHoras ? "border-red-500" : ""}
                                                {...register("quantidadeHoras", { valueAsNumber: true })}
                                            />
                                            {errors.quantidadeHoras && <p className="text-red-500 text-sm">{errors.quantidadeHoras.message}</p>}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                {...register("quantidadeVagas", { valueAsNumber: true })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
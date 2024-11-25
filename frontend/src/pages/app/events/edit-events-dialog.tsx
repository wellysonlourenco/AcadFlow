'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { queryClient } from '@/services/query-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComboboxCategorias } from './combobox-categorias';

const formSchema = z.object({
    nome: z.string().min(1, { message: 'Campo Obrigatório' }),
    descricao: z.string().optional(),
    dataInicio: z.coerce.date(),
    dataFim: z.coerce.date(),
    local: z.string().min(1, { message: 'Campo Obrigatório' }),
    quantidadeHoras: z.number().min(1, { message: 'Mínimo 1 hora.' }),
    quantidadeVagas: z.number().min(0),
    categoriaId: z.number(),
    status: z.string(),
});

const formatDateForInput = (dateString: string) => {
    return new Date(dateString);

};

type EditEventForm = z.infer<typeof formSchema>;

export default function EditEventsDialog() {
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const form = useForm<EditEventForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: '',
            descricao: '',
            dataInicio: new Date(),
            dataFim: new Date(),
            local: '',
            status: 'ATIVO',
            quantidadeVagas: 0,
            quantidadeHoras: 0,
        },
    });

    const { data: evento, isLoading } = useQuery({
        queryKey: ['evento', id],
        queryFn: async () => {
            const response = await api.get(`/evento/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    useEffect(() => {
        if (evento) {
            form.reset({
                nome: evento.nome,
                descricao: evento.descricao || '',
                dataInicio: formatDateForInput(evento.dataInicio),
                dataFim: formatDateForInput(evento.dataFim),
                local: evento.local,
                status: evento.status || 'ATIVO',
                quantidadeVagas: evento.quantidadeVagas,
                quantidadeHoras: evento.quantidadeHoras,
                categoriaId: evento.categoriaId,
            });
        }
    }, [evento, form]);

    const { mutateAsync: updateEvento } = useMutation({
        mutationFn: async (data: EditEventForm) => {
            const response = await api.patch(`/evento/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['eventos'] });
            toast.success('Evento atualizado com sucesso!');
            navigate('/events');
        },
        onError: () => {
            toast.error('Erro ao atualizar o evento');
        },
    });

    const onSubmit = async (data: EditEventForm) => {
        try {
            setIsSubmitting(true);
            await updateEvento(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <Dialog open={true} onOpenChange={() => navigate('/events')}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Editar Evento</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Evento</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dataInicio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Início</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dataFim"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Fim</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="local"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Local</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantidadeHoras"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Carga Horária</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantidadeVagas"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantidade de Vagas</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="categoriaId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <FormControl>
                                        <ComboboxCategorias
                                            value={field.value || null}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ATIVO">Inscrição Aberta</SelectItem>
                                            <SelectItem value="INATIVO">Inscrições encerradas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/events')}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar alterações'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
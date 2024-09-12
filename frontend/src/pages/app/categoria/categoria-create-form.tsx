import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/services/api';
import { cn } from '@/lib/utils';
import { queryClient } from '@/services/query-client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


const formSchema = z.object({
    descricao: z.string()
});

type CategoriaFormValue = z.infer<typeof formSchema>;


type CategoriaCreateFormProps = {
    setFormOpen: (value: boolean) => void;
    className?: string;

}

export function CategoriaCreateForm({ setFormOpen, className }: CategoriaCreateFormProps) {
    const [isError, setIsError] = React.useState(false);



    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            descricao: '',
        }
    })
    const {
        formState: { isSubmitting, errors },
        setError
    } = form
    const hasErrors = Object.keys(errors).length > 0

    const { mutateAsync } = useMutation({
        mutationFn: async (data: CategoriaFormValue) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await api.post('/categoria', data);
            return response.data;
        },
        onSuccess: (response) => {
            toast.success('Cadastrado com Sucesso!', { duration: 1000 })
            queryClient.invalidateQueries({ queryKey: ['categorias'] })
        },
        onError: (error) => {
            toast.error('Erro ao cadastrar', { duration: 2000 })
        },
        onSettled: () => {
            //setIsLoading(true)
            console.log("onSettled")
        }

    })



    async function onSubmit(data: CategoriaFormValue) {

        try {
            console.log(data)
            await mutateAsync(data)
            //toast.success('Cadastrado com Sucesso!')

        } catch (error) {
            toast.error('Credenciais inválidas.', { duration: 1500 })
        } finally {
            console.log("onSubmit")
            setFormOpen(false)
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>

                <FormField
                    control={form.control}
                    name="descricao"

                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição:</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Descrição da categoria" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {hasErrors ? (
                        'Submit'
                    ) : (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={isSubmitting ? 'Salvando' : 'Salvar'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                {isSubmitting ? 'Salvando...' : 'Salvar'}
                            </motion.span>
                        </AnimatePresence>
                    )}
                    {isSubmitting && <Loader2 className="h-6 w-6" />}
                </Button>
            </form>
        </Form>



    )

}
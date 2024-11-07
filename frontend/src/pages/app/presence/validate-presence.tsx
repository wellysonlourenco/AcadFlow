import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { queryClient } from "@/services/query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


const formSchema = z.object({
    numeroInscricao: z.string().nonempty(),
})

type PresenceFormValue = z.infer<typeof formSchema>;


export function ValidatePresence() {
    // const [inscriptionNumber, setInscriptionNumber] = useState('');
    // const [message, setMessage] = useState('');



    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            numeroInscricao: "",
        }
    })

    const { register, handleSubmit, setError, reset, formState: { isSubmitting, errors } } = form;

    // const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<PresenceFormValue>({
    //     resolver: zodResolver(formSchema),

    // });



    const { mutateAsync } = useMutation({
        mutationFn: async (data: PresenceFormValue) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await api.post('/certificado/gerar', data);
            return response.data;
        },
        onSuccess: (response) => {
            toast.success('Presença validada! Certificado liberado.', { duration: 1000 })
            queryClient.invalidateQueries({ queryKey: ['certificado'] })
            form.reset()
        },
        onError: (error) => {
            toast.error('Número de inscrição inválido.', { duration: 1500 })
        },
    })

    const onSubmit = async (data: PresenceFormValue) => {
        try {
            await mutateAsync(data);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
        <Helmet title="Validar Presença" />

        <Card className=" mx-auto w-[450px] mt-20 p-6  max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-bold mb-6">Validar Presença</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid gap-2 mb-7">
                        <Label htmlFor="numeroInscricao" className="block mb-2 text-sm font-medium text-foreground">
                            Número de Inscrição
                        </Label>
                        <Input
                            id="numeroInscricao"
                            type="text"
                            placeholder="Digite o número de inscrição"
                            {...register('numeroInscricao')}
                            className={'' + (errors.numeroInscricao ? 'border-red-500' : '')}
                        />{errors.numeroInscricao && <span className="text-red-500 text-sm">Campo Obrigatório!</span>}
                    </div>
                    <Button type="submit" className=" w-full" disabled={isSubmitting}>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={isSubmitting ? 'Salvando' : 'Salvar'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                {isSubmitting ? 'Validando Presença...' : 'Validar Presença'}
                            </motion.span>
                        </AnimatePresence>
                        {isSubmitting && <Loader2 className="h-6 w-6 ml-2 animate-spin" />}
                    </Button>
                </form>
            </CardContent>
        </Card>
        </>
    );
}
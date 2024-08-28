import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { queryClient } from "@/services/query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


const formSchema = z.object({
    inscricaoId: z.string()
})

type PresenceFormValue = z.infer<typeof formSchema>;


export function ValidatePresence() {
    // const [inscriptionNumber, setInscriptionNumber] = useState('');
    // const [message, setMessage] = useState('');


    const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<PresenceFormValue>({
        resolver: zodResolver(formSchema),
    });



    const { mutateAsync } = useMutation({
        mutationFn: async (data: PresenceFormValue) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await api.post('/certificado/gerar', data);
            return response.data;
        },
        onSuccess: (response) => {
            toast.success('Presença validada! Certificado liberado.', { duration: 1000 })
            queryClient.invalidateQueries({ queryKey: ['certificado'] })
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
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-6">Validar Presença</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Label htmlFor="inscription-number" className="block mb-2 text-sm font-medium text-gray-700">
                    Número de Inscrição
                </Label>
                <Input
                    id="inscription-number"
                    type="text"
                    placeholder="Digite o número de inscrição"
                    {...register('inscricaoId')}
                    className="mb-4"
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {errors.inscricaoId ? (
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
                                {isSubmitting ? 'Validando Presença...' : 'Validar Presença'}
                            </motion.span>
                        </AnimatePresence>
                    )}
                    {isSubmitting && <Loader2 className="h-6 w-6 ml-2 animate-spin" />}
                </Button>

            </form>
        </div>
    );
}
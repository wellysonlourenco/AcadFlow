import { AuthContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

const formSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    perfil: z.string().min(1, "Perfil é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

interface UserResponseProfile {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    avatar: string;
}




export function UserProfile() {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const usuarioId = user?.id as number;

    const { data: userProfile, isLoading } = useQuery<UserResponseProfile>({
        queryKey: ["user-profile", usuarioId],
        queryFn: async () => {
            const response = await api.get(`/usuario/me/${usuarioId}`);
            return response.data;
        },
        enabled: !!usuarioId,
        placeholderData: keepPreviousData,
    });

    console.log("User Profile:", userProfile);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        if (userProfile) {
            form.reset({
                nome: userProfile.nome || "",
                perfil: userProfile.perfil || "",
            });
        }
    }, [userProfile, form]);

    const { mutateAsync } = useMutation({
        mutationFn: async (data: FormValues) => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = await api.patch(`/users/${usuarioId}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            toast.success('Perfil atualizado com sucesso!');
            navigate('/');
        },
        onError: (error) => {
            toast.error('Erro durante a atualização: ' + error.message);
        }
    });

    const onSubmit = async (data: FormValues) => {
        await mutateAsync(data);
    };

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Perfil do Usuário</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-24 h-24">
                                <img src={userProfile?.avatar} />
                            </Avatar>
                        </div>
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="perfil"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Perfil</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Atualizando...' : 'Atualizar Perfil'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
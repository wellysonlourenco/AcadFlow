import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/services/api";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";


export interface UserResponse {
    id: number;
    nome: string;
    email: string;
    perfil: string;
  }

  interface SearchFormInputs {
    email: string;
}

export function AccountsRole() {
    const [searchEmail, setSearchEmail] = useState("");
    const [selectedProfile, setSelectedProfile] = useState<"ADMIN" | "USER" | null>(null);
    const { register, handleSubmit } = useForm<SearchFormInputs>();

    const { data: userProfile, isLoading, refetch } = useQuery<UserResponse>({
        queryKey: ["user-email", searchEmail],
        queryFn: async () => {
            const response = await api.get(`/usuario/${searchEmail}`);
            return response.data;
        },
        enabled: !!searchEmail,
        placeholderData: keepPreviousData,
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data: { perfil: "ADMIN" | "USER" }) => {
            const response = await api.patch(`/usuario/perfil/${userProfile?.id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Perfil do usuário atualizado com sucesso!");
            refetch();
            setSelectedProfile(null);
        },
        onError: (error) => {
            console.error("Erro ao atualizar perfil:", error);
            toast.error("Erro ao atualizar perfil do usuário.");
        },
    });

    const onSearch: SubmitHandler<SearchFormInputs> = (data) => {
        setSearchEmail(data.email);
        setSelectedProfile(null);
    };

    const onProfileChange = (perfil: "ADMIN" | "USER") => {
        setSelectedProfile(perfil);
    };

    const onConfirmUpdate = () => {
        if (selectedProfile && selectedProfile !== userProfile?.perfil) {
            updateProfileMutation.mutate({ perfil: selectedProfile });
        } else {
            toast.info("Nenhuma alteração para salvar.");
        }
    };

    return (
        <div className="container mx-auto p-6">
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Gerenciar Perfil de Usuário</CardTitle>
                <CardDescription>Pesquise um usuário por email para gerenciar seu perfil.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            type="email"
                            placeholder="Email do usuário"
                            {...register("email", { required: true })}
                        />
                        <Button type="submit">Pesquisar</Button>
                    </div>
                </form>

                {isLoading && <p className="text-center py-4">Carregando...</p>}

                {userProfile && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={`https://avatars.dicebear.com/api/initials/${userProfile.nome}.svg`} />
                                <AvatarFallback>{userProfile.nome.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium">{userProfile.nome}</h3>
                                <p className="text-sm text-gray-500">{userProfile.email}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Perfil atual: {userProfile.perfil}</Label>
                            <RadioGroup
                                value={selectedProfile || userProfile.perfil}
                                onValueChange={(value: "ADMIN" | "USER") => onProfileChange(value)}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="USER" id="user" />
                                    <Label htmlFor="user">Usuário</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ADMIN" id="admin" />
                                    <Label htmlFor="admin">Administrador</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <Button 
                            onClick={onConfirmUpdate}
                            disabled={!selectedProfile || selectedProfile === userProfile.perfil}
                            className="w-full mt-4"
                        >
                            Confirmar Alteração
                        </Button>
                    </div>
                )}

                {!isLoading && !userProfile && searchEmail && (
                    <p className="text-red-500 text-center py-4">Usuário não encontrado.</p>
                )}
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
                Clique em "Confirmar Alteração" para salvar as mudanças.
            </CardFooter>
        </Card>
    </div>
    );
}
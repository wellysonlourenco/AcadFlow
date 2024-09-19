import React, { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


const userDataSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
  });
  
  const passwordSchema = z.object({
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmaSenha: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  }).refine((data) => data.senha === data.confirmaSenha, {
    message: "As senhas não coincidem",
    path: ["confirmaSenha"],
  });
  
  type UserDataFormValues = z.infer<typeof userDataSchema>;
  type PasswordFormValues = z.infer<typeof passwordSchema>;
  
  interface UserResponseProfile {
    id: number;
    nome: string;
    email: string;
    avatar: string;
  }
  
  export function UserProfileUser() {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
    const userDataForm = useForm<UserDataFormValues>({
      resolver: zodResolver(userDataSchema),
    });
  
    const passwordForm = useForm<PasswordFormValues>({
      resolver: zodResolver(passwordSchema),
    });
  
    const { data: userProfile, isLoading } = useQuery<UserResponseProfile>({
      queryKey: ["user-profile", user?.id],
      queryFn: async () => {
        const response = await api.get(`/usuario/me/${user?.id}`);
        return response.data;
      },
      enabled: !!user?.id,
    });
  
    useEffect(() => {
      if (userProfile) {
        userDataForm.reset({ nome: userProfile.nome });
      }
    }, [userProfile, userDataForm]);
  
    const updateUserDataMutation = useMutation({
      mutationFn: (data: UserDataFormValues) => api.patch(`/usuario/${user?.id}`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-profile", user?.id] });
        toast.success("Perfil atualizado com sucesso");
        setIsEditing(false);
      },
      onError: () => {
        toast.error("Erro ao atualizar o perfil");
      },
    });
  
    const updatePasswordMutation = useMutation({
      mutationFn: (data: { senha: string }) => api.patch(`/usuario/${user?.id}`, data),
      onSuccess: () => {
        toast.success("Senha atualizada com sucesso");
        passwordForm.reset();
        setIsPasswordDialogOpen(false);
      },
      onError: () => {
        toast.error("Erro ao atualizar a senha");
      },
    });
  
    const updateAvatarMutation = useMutation({
      mutationFn: (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return api.patch(`/usuario/avatar/${user?.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-profile", user?.id] });
        toast.success("Avatar atualizado com sucesso");
      },
      onError: () => {
        toast.error("Erro ao atualizar o avatar");
      },
    });
  
    const onUserDataSubmit = (data: UserDataFormValues) => {
      updateUserDataMutation.mutate(data);
    };
  
    const onPasswordSubmit = (data: PasswordFormValues) => {
      updatePasswordMutation.mutate({ senha: data.senha });
    };
  
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        updateAvatarMutation.mutate(file);
      }
    };
  
    const toggleEdit = () => {
      if (isEditing) {
        userDataForm.reset({ nome: userProfile?.nome });
      }
      setIsEditing(!isEditing);
    };
  
    if (isLoading) {
      return <div>Carregando...</div>;
    }
  
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userProfile?.avatar} alt={userProfile?.nome} />
              <AvatarFallback>{userProfile?.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Input type="file" onChange={handleAvatarChange} accept="image/*" />
            </div>
          </div>
  
          <Form {...userDataForm}>
            <form onSubmit={userDataForm.handleSubmit(onUserDataSubmit)} className="space-y-4">
              <FormField
                control={userDataForm.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={userProfile?.email} disabled />
                </FormControl>
              </FormItem>
              <Button type="button" onClick={toggleEdit}>
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
              {isEditing && (
                <Button type="submit">Salvar</Button>
              )}
            </form>
          </Form>
  
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button>Atualizar Senha</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Atualizar Senha</DialogTitle>
              </DialogHeader>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="senha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmaSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Nova Senha</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Salvar Nova Senha</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }
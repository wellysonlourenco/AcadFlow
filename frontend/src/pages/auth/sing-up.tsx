import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";


const signUpForm = z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    senha: z.string().min(3),
    confirmSenha: z.string().min(3),
});

type SignUpForm = z.infer<typeof signUpForm>;


export function SignUp() {
    const { signUp } = useContext(AuthContext);
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignUpForm>();

    async function handleSignUp(data: SignUpForm) {
        if (data.senha !== data.confirmSenha) {
            toast.error('As senhas não conferem!');
            return;
        }

        try {
            await signUp({ nome: data.nome, email: data.email, senha: data.senha, perfil: 'USER' });
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
        }
    }

    

    return (
<>
            <Helmet title='Cadastro' />
            <div className="p-8">
                <Button variant="ghost" asChild className="absolute right-8 top-8">
                    <Link to="/sign-in">Fazer Login</Link>
                </Button>

                <div className="w-[350px] flex flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Criar Conta</h1>
                        <p className="text-sm text-muted-foreground">Cadastre com email acadêmico!</p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome</Label>
                            <Input id="nome" type="text" {...register('nome')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail:</Label>
                            <Input id="email" type="email" {...register('email')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="senha">Senha</Label>
                            <Input id="senha" type="password" {...register('senha')} />
                        </div>

                        <div className="space-y-2 pb-10">
                            <Label htmlFor="confirmSenha">Confirmar a Senha</Label>
                            <Input id="confirmSenha" type="password" {...register('confirmSenha')}/>
                        </div>

                        <Button className="w-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro'}
                        </Button>

                        <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
                            Ao continuar, você concorda com nossos {' '}
                            <a className="underline underline-offset-4" href="">Termos de serviço</a>{' '}
                            e {' '}
                            <a className="underline underline-offset-4" href="">Política de privacidade.</a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
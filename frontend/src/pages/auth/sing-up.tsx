import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";


const singUpForm = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
})

type SingUpForm = z.infer<typeof singUpForm>


export function SignUp() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { isSubmitted } } = useForm<SingUpForm>();

    async function handleSignUp(data: SingUpForm) {
        
        if (data.password !== data.confirmPassword) {
            toast.error('As senhas não conferem!');
            return;
        }

        try {
            console.log(data);
            await new Promise((resolve) => setTimeout(resolve, 2000));


            toast.success('Usuário cadastrado com sucesso!',
                {
                    action: {
                        label: 'Login',
                        onClick: () => navigate('/sing-in'),
                    }
                }
            );
        } catch {
            toast.error('Erro ao cadastrar o Usuario!');
        }



    }

    return (
        <>
            <Helmet title='Cadastro' />
            <div className="p-8 ">

                <Button variant="ghost" asChild className="absolute right-8 top-8">
                    <Link to="/sing-in">Fazer Login</Link>
                </Button>

                <div className="w-[350px] flex flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Criar Conta</h1>
                        <p className="text-sm text-muted-foreground">Cadastre com email academico!</p>
                    </div>


                    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" type="text" {...register('name')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail:</Label>
                            <Input id="email" type="text" {...register('email')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" {...register('password')} />
                        </div>

                        <div className="space-y-2 pb-10">
                            <Label htmlFor="confirmPassword">Confirmar a Senha</Label>
                            <Input id="confirmPassword" type="password" {...register('confirmPassword')}/>
                        </div>

                        <Button  className="w-full" type="submit">Finalizar Cadastro</Button>

                        <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
                            Ao continuar, você concordas com nossos {' '} <a className="underline underline-offset-4" href="">Termos de serviço</a>{' '} e {' '} <a className="underline underline-offset-4" href="">Política de privacidade.</a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
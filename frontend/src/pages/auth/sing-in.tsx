import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInFormSchema = z.object({
    email: z.string({required_error: "Campo obrigatório"}).email("E-mail inválido"),
    senha: z.string({required_error: "Campo obrigatório"}).min(5, "A senha deve ter pelo menos 5 caracteres"),
  });

type SignInForm = z.infer<typeof signInFormSchema>;

export function SignIn() {
  const { signIn, isAuth } = React.useContext(AuthContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function handleSignIn(data: SignInForm) {
  
    await signIn(data);
    
    // if(!isAuth){
    //   return <Navigate to="/" />;
    // }
    // if (!signed) {
    //   toast.error("Ocorreu um erro ao tentar fazer login!");
    // } else {
    //   toast.success("Autenticado com Sucesso!");
    // }
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Acessar Painel</h1>
            <p className="text-sm text-muted-foreground">Acompanhe os eventos pelo painel acadêmico!</p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label >Seu E-mail</Label>
              <Input
                id="email"
                type="email"
                className={errors.email ? "border-red-500" : ""}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2 pb-5">
              <Label >Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={errors.senha ? "border-red-500" : ""}
                  {...register("senha")}
                />
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.senha && (
                <p className="text-red-500 text-sm">{errors.senha.message}</p>
              )}
            </div>
            <Button className="w-full" type="submit">
              Acessar painel
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

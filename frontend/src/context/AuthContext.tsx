import { api } from "@/lib/api";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface IUser {
  id?: number;
  token?: string;
}

interface AuthContextData {
  user: IUser | null;
  signIn: ({ email, senha }: { email: string; senha: string }) => Promise<void>;
  signOut: () => void;
  isAuth: boolean;
}

interface UserProfileResponse {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean>(false);


  const fetchUserProfile = async (token: string) => {
    try {
      const decodedUser: UserProfileResponse = jwtDecode(token);
      const userId = decodedUser.id;
      const response = await api.get<UserProfileResponse>(`/usuario/me/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter perfil do usuário:", error);
      throw error;
    }
  };
  
  useEffect(() => {
    const loadingStoreData = async () => {
      const storageToken = localStorage.getItem("@Auth:token");
      if (storageToken) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${storageToken}`;
          const userProfile = await fetchUserProfile(storageToken);
          setUser({ token: storageToken, ...userProfile });
          setIsAuth(true);
          console.log("User loaded from storage:", userProfile);
        } catch (error) {
          console.error("Erro ao verificar token:", error);
          signOut();
        }
      }
    };
    
    loadingStoreData();
  }, []);
  
  const signIn = async ({ email, senha }: { email: string; senha: string }) => {
    try {
      const response = await api.post("/auth/login", { email, senha });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        const token = response.data.token;
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("@Auth:token", token);
        
        const userProfile = await fetchUserProfile(token);
        setUser({ token, ...userProfile });
        setIsAuth(true);

        toast.success("Login realizado com sucesso!");
        navigate('/'); // Redireciona para a página inicial após o login
      }
    } catch (error) {
      console.log(error);
      toast.error('Erro ao logar!')
    }
  };

  // const signIn = async ({ email, senha }: { email: string; senha: string }) => {
  //   try {
  //     const response = await api.post("/auth/login", { email, senha });

  //     if (response.data.error) {
  //       toast.error(response.data.error);
  //     } else {
  //       setUser({ token: response.data.token, id: response.data.id });
  //       toast.success("Login realizado com sucesso!");
  //       api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
  //       localStorage.setItem("@Auth:token", response.data.token);

  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error('Erro ao logar!')
  //   }
  // };

  const signOut = () => {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);
    api.defaults.headers.common["Authorization"] = '';
    toast.success("Logout realizado com sucesso!");
    navigate('/sign-in'); // Redireciona para a página inicial
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isAuth ,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
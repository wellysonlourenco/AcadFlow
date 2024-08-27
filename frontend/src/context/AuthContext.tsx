import { api } from "@/lib/api";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface IUser {
  id: number;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'USER';
  token: string;
}

type UserRole = 'ADMIN' | 'USER';


interface AuthContextData {
  user: IUser | null;
  signIn: ({ email, senha }: { email: string; senha: string }) => Promise<void>;
  signOut: () => void;
  isAuth: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

interface UserProfileResponse {
  id: number;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'USER';
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);


  const navigate = useNavigate();


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
      setIsLoading(true);
      const storageToken = localStorage.getItem("@Auth:token");
      if (storageToken) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${storageToken}`;
          const userProfile = await fetchUserProfile(storageToken);
          setUser({ ...userProfile, token: storageToken });
          setIsAuth(true);
          setIsAdmin(userProfile.perfil === 'ADMIN');
          console.log("User loaded from storage:", userProfile);
        } catch (error) {
          console.error("Erro ao verificar token:", error);
          signOut();
        }
      }
      setIsLoading(false);
      setIsInitialized(true);
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
        const fullUser = { ...userProfile, token };
        setUser(fullUser);
        setIsAuth(true);
        setIsAdmin(userProfile.perfil === 'ADMIN');

        toast.success("Login realizado com sucesso!");
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      toast.error('Erro ao logar!')
    }
  };

  const signOut = () => {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);
    setIsAdmin(false);
    api.defaults.headers.common["Authorization"] = '';
    toast.success("Logout realizado com sucesso!");
    navigate('/sign-in');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isAuth,
        isAdmin,
        isLoading,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
import { AuthProvider } from "@/context/AuthContext";
import { Categoria } from "@/pages/app/categoria/categoria";
import { Certificates } from "@/pages/app/certificates/certificates";
import { CreateFormEvents } from "@/pages/app/events/create-events";
import { Events } from "@/pages/app/events/events";
import { Inscricoes } from "@/pages/app/inscricoes/inscricao";
import { Participations } from "@/pages/app/participations/participations";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { AppLayout } from "../pages/_layouts/app";
import { AuthLayout } from "../pages/_layouts/auth";
import { Dashboard } from "../pages/app/dashboard/dashboards";
import { Orders } from "../pages/app/orders/orders";
import { SignIn } from "../pages/auth/sing-in";
import { SignUp } from "../pages/auth/sing-up";
import { ProtectedRoute } from "./ProtectedRoute";

const AuthProviderWrapper = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);


export const router = createBrowserRouter([
  {
    element: <AuthProviderWrapper />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: "/", element: <Dashboard /> },
              { path: "/orders", element: <Orders /> },
              { path: "/events", element: <Events /> },
              { path: "/categories", element: <Categoria /> },
              { path: "/events-create", element: <CreateFormEvents /> },
              { path: "/participations", element: <Participations /> },
              { path: "/inscricoes", element: <Inscricoes /> },
              { path: "/certificates", element: <Certificates /> },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "/sign-in", element: <SignIn /> },
          { path: "/sign-up", element: <SignUp /> }
        ],
      }
    ],
  },
]);
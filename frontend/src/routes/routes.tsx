import { AuthProvider } from "@/context/AuthContext";
import { Categoria } from "@/pages/app/categoria/categoria";
import { Certificates } from "@/pages/app/certificates/certificates";
import { CreateFormEvents } from "@/pages/app/events/create-events";
import { Events } from "@/pages/app/events/events";
import { Inscricoes } from "@/pages/app/inscricoes/inscricao";
import { createBrowserRouter, Outlet } from "react-router-dom";

import { AppLayout } from "@/pages/app/_layouts/app";
import { AuthLayout } from "@/pages/app/_layouts/auth";
import { UserProfile } from "@/pages/app/account/profile";
import { Dashboard } from "@/pages/app/dashboard/dashboard";
import { EventCard } from "@/pages/app/events/events-card/event-card";
import { ValidatePresence } from "@/pages/app/presence/validate-presence";
import { Orders } from "../pages/app/orders/orders";
import { SignIn } from "../pages/auth/sing-in";
import { SignUp } from "../pages/auth/sing-up";
import { ProtectedRoute } from "./ProtectedRoute";
import { AccountsRole } from "@/pages/app/account/accounts-role";
import { Account } from "@/pages/app/account/my-count";
import { UserProfileUser } from "@/pages/app/account/profileuser";
import EditEventsDialog from "@/pages/app/events/edit-events-dialog";

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
              { path: "/events-card", element: <EventCard /> },
              {
                element: <ProtectedRoute allowedRoles={['ADMIN']} />,
                children: [
                  { path: "/categories", element: <Categoria /> },
                  { path: "/roles", element: <AccountsRole /> },
                  { path: "/events-create", element: <CreateFormEvents /> },
                  { path: "/events/edit/:id" , element: <EditEventsDialog />},
                  { path: "/validate-presence", element: <ValidatePresence /> },
                ]
              },
              {
                element: <ProtectedRoute allowedRoles={['USER']} />,
                children: [
                  { path: "/certificates", element: <Certificates /> },
                ]
              },
              { path: "/conta", element: <Account /> },

              { path: "/inscricoes", element: <Inscricoes /> },
              { path: "/minha-conta", element: <UserProfileUser /> },
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
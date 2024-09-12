import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme/theme-provider";
import './globals.css';
import { router } from "./routes/routes";
import { queryClient } from "./services/query-client";


export function App() {

  return (
    <HelmetProvider>
      <ThemeProvider storageKey="acadflow-theme" defaultTheme="dark">
        <Helmet titleTemplate="%s | Acadflow" />
        <Toaster richColors />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}


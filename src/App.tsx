import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Hoje from "./pages/dashboard/Hoje";
import Casos from "./pages/dashboard/Casos";
import Importar from "./pages/dashboard/Importar";
import Modelos from "./pages/dashboard/Modelos";
import Relatorios from "./pages/dashboard/Relatorios";
import Conta from "./pages/dashboard/Conta";
import Ajuda from "./pages/dashboard/Ajuda";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Hoje />} />
            <Route path="casos" element={<Casos />} />
            <Route path="importar" element={<Importar />} />
            <Route path="modelos" element={<Modelos />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="conta" element={<Conta />} />
            <Route path="ajuda" element={<Ajuda />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

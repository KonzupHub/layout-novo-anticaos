import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Clock, Plus } from "lucide-react";
import { getTipoBadge, getStatusBadge } from "@/lib/mockCases";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "@/contexts/SearchContext";
import { ComoFuncionaModal } from "@/components/ComoFuncionaModal";
import type { Case } from "@/types/shared";

const Hoje = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const { searchTerm } = useSearch();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCases = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.getCases(undefined, token);
      if (response.ok) {
        // Se response.data for undefined ou null, usa array vazio
        setCases(response.data || []);
      } else {
        // Só mostra erro se realmente houver erro HTTP (4xx, 5xx)
        toast({
          title: "Erro ao carregar casos",
          description: response.error || "Não foi possível carregar os casos",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Erro ao carregar casos:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao carregar casos",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  // Calcular estatísticas dos casos
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  const semanaAtras = new Date(hoje);
  semanaAtras.setDate(semanaAtras.getDate() - 7);

  const venceHoje = cases.filter((caso) => {
    const prazoDate = new Date(caso.prazo);
    prazoDate.setHours(0, 0, 0, 0);
    return prazoDate.getTime() === hoje.getTime();
  }).length;

  const em24Horas = cases.filter((caso) => {
    const prazoDate = new Date(caso.prazo);
    prazoDate.setHours(0, 0, 0, 0);
    return prazoDate.getTime() > hoje.getTime() && prazoDate.getTime() <= amanha.getTime();
  }).length;

  const novosNaSemana = cases.filter((caso) => {
    if (!caso.createdAt) return false;
    const createdDate = new Date(caso.createdAt);
    return createdDate >= semanaAtras;
  }).length;

  // Filtrar casos pela busca
  const filteredCases = useMemo(() => {
    if (!searchTerm) return cases;
    const search = searchTerm.toLowerCase();
    return cases.filter((caso) =>
      caso.passageiro.toLowerCase().includes(search) ||
      caso.localizador.toLowerCase().includes(search) ||
      caso.fornecedor.toLowerCase().includes(search)
    );
  }, [cases, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-6">
        <p>Carregando casos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dia de hoje</h2>
            <p className="text-muted-foreground">Acompanhe os casos que precisam de atenção</p>
          </div>
          <ComoFuncionaModal />
        </div>
      </div>

      {/* Cartões de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-orange-50 to-background border-l-4 border-l-orange-500 dark:from-orange-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vence hoje</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venceHoje}</div>
            <p className="text-xs text-muted-foreground">caso{venceHoje !== 1 ? 's' : ''} precisa{venceHoje !== 1 ? 'm' : ''} de atenção</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-background border-l-4 border-l-yellow-500 dark:from-yellow-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em 24 horas</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{em24Horas}</div>
            <p className="text-xs text-muted-foreground">caso{em24Horas !== 1 ? 's' : ''} com prazo próximo</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-background border-l-4 border-l-green-500 dark:from-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos na semana</CardTitle>
            <Plus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{novosNaSemana}</div>
            <p className="text-xs text-muted-foreground">caso{novosNaSemana !== 1 ? 's' : ''} aberto{novosNaSemana !== 1 ? 's' : ''} recentemente</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Casos */}
      {filteredCases.length === 0 ? (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <AlertCircle className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? "Nenhum caso encontrado" : "Nenhum caso prioritário encontrado"}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchTerm
                ? "Nenhum caso corresponde à sua busca."
                : "Não há casos que precisem de atenção imediata hoje."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-b from-background to-muted/30 border-t-4 border-t-primary shadow-lg">
          <CardHeader>
            <CardTitle>Prioridades de hoje</CardTitle>
            <CardDescription>Casos que precisam de acompanhamento</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passageiro</TableHead>
                    <TableHead>Voo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((caso) => {
                    const tipoBadge = getTipoBadge(caso.tipo);
                    const statusBadge = getStatusBadge(caso.status);
                    
                    return (
                      <TableRow key={caso.id}>
                        <TableCell className="font-medium">{caso.passageiro}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{caso.fornecedor}</div>
                            <div className="text-muted-foreground">{caso.localizador}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={tipoBadge.color}>
                            {tipoBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{caso.prazo}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusBadge.color}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{caso.responsavel.nome.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{caso.responsavel.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/dashboard/caso/${caso.id}`}>
                            <Button variant="outline" size="sm">Ver caso</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredCases.map((caso) => {
                const tipoBadge = getTipoBadge(caso.tipo);
                const statusBadge = getStatusBadge(caso.status);
                
                return (
                  <Card key={caso.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{caso.passageiro}</CardTitle>
                          <CardDescription>
                            {caso.fornecedor} • {caso.localizador}
                          </CardDescription>
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{caso.responsavel.nome.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Badge variant="outline" className={tipoBadge.color}>
                          {tipoBadge.label}
                        </Badge>
                        <Badge variant="outline" className={statusBadge.color}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Prazo: {caso.prazo}</span>
                        <Link to={`/dashboard/caso/${caso.id}`}>
                          <Button variant="outline" size="sm">Ver caso</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Hoje;

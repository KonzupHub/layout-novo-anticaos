import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Clock, Plus } from "lucide-react";
import { getTipoBadge, getStatusBadge } from "@/lib/mockCases";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Case } from "@/types/shared";

const Hoje = () => {
  const { token } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, [token]);

  const loadCases = async () => {
    if (!token) return;

    try {
      const response = await api.getCases(undefined, token);
      if (response.ok && response.data) {
        setCases(response.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar casos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcula casos que vencem hoje
  const hoje = new Date().toISOString().split("T")[0];
  const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  
  const venceHoje = cases.filter((c) => {
    // Simplificado: verifica se o prazo contém "hoje" ou é a data de hoje
    return c.prazo.toLowerCase().includes("hoje") || c.prazo.includes(hoje);
  }).length;

  const vence24h = cases.filter((c) => {
    return c.prazo.toLowerCase().includes("amanhã") || c.prazo.includes(amanha) || 
           (c.prazo.toLowerCase().includes("24") && c.prazo.toLowerCase().includes("hora"));
  }).length;

  // Casos novos na semana (últimos 7 dias)
  const semanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const novosSemana = cases.filter((c) => {
    return new Date(c.createdAt) >= new Date(semanaAtras);
  }).length;

  const casosPrioritarios = cases.filter((c) => {
    return venceHoje > 0 || vence24h > 0;
  }).slice(0, 10); // Limita a 10 casos

  if (loading) {
    return (
      <div className="space-y-6">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dia de hoje</h2>
        <p className="text-muted-foreground">Acompanhe os casos que precisam de atenção</p>
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
            <p className="text-xs text-muted-foreground">caso{cases.length !== 1 ? 's' : ''} precisa de atenção</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-background border-l-4 border-l-yellow-500 dark:from-yellow-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em 24 horas</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vence24h}</div>
            <p className="text-xs text-muted-foreground">caso{cases.length !== 1 ? 's' : ''} com prazo próximo</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-background border-l-4 border-l-green-500 dark:from-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos na semana</CardTitle>
            <Plus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{novosSemana}</div>
            <p className="text-xs text-muted-foreground">caso{cases.length !== 1 ? 's' : ''} aberto{cases.length !== 1 ? 's' : ''} recentemente</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Casos */}
      <Card className="bg-gradient-to-b from-background to-muted/30 border-t-4 border-t-primary shadow-lg">
        <CardHeader>
          <CardTitle>Prioridades de hoje</CardTitle>
          <CardDescription>Casos que precisam de acompanhamento</CardDescription>
        </CardHeader>
        <CardContent>
          {casosPrioritarios.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum caso prioritário no momento</p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Passageiro</TableHead>
                      <TableHead>Localizador</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {casosPrioritarios.map((caso) => {
                      const tipoBadge = getTipoBadge(caso.tipo);
                      const statusBadge = getStatusBadge(caso.status);
                      
                      return (
                        <TableRow key={caso.id}>
                          <TableCell className="font-medium">{caso.passageiro}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{caso.localizador}</div>
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
                                <AvatarFallback>{caso.responsavel.avatar || caso.responsavel.nome[0]}</AvatarFallback>
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
                {casosPrioritarios.map((caso) => {
                  const tipoBadge = getTipoBadge(caso.tipo);
                  const statusBadge = getStatusBadge(caso.status);
                  
                  return (
                    <Card key={caso.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{caso.passageiro}</CardTitle>
                            <CardDescription>
                              {caso.localizador}
                            </CardDescription>
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{caso.responsavel.avatar || caso.responsavel.nome[0]}</AvatarFallback>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Hoje;
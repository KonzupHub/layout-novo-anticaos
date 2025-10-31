import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Clock, Plus } from "lucide-react";
import { mockCases, getTipoBadge, getStatusBadge } from "@/lib/mockCases";
import { Link } from "react-router-dom";

const Hoje = () => {
  return (
    <div className="space-y-6">
      {/* Badge de Demonstração */}
      <Badge variant="secondary" className="mb-2">🎭 Ambiente de demonstração</Badge>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dia de hoje</h2>
        <p className="text-muted-foreground">Acompanhe os casos que precisam de atenção</p>
      </div>

      {/* Cartões de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vence hoje</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">caso precisa de atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em 24 horas</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">casos com prazo próximo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos na semana</CardTitle>
            <Plus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">casos abertos recentemente</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Casos */}
      <Card>
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
                {mockCases.map((caso) => {
                  const tipoBadge = getTipoBadge(caso.tipo);
                  const statusBadge = getStatusBadge(caso.status);
                  
                  return (
                    <TableRow key={caso.id}>
                      <TableCell className="font-medium">{caso.passageiro}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{caso.voo}</div>
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
                            <AvatarFallback>{caso.responsavel.avatar}</AvatarFallback>
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
            {mockCases.map((caso) => {
              const tipoBadge = getTipoBadge(caso.tipo);
              const statusBadge = getStatusBadge(caso.status);
              
              return (
                <Card key={caso.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{caso.passageiro}</CardTitle>
                        <CardDescription>
                          {caso.voo} • {caso.localizador}
                        </CardDescription>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{caso.responsavel.avatar}</AvatarFallback>
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
    </div>
  );
};

export default Hoje;

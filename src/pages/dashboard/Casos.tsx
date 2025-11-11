import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { getTipoBadge, getStatusBadge } from "@/lib/mockCases";
import type { Case, CreateCaseDto } from "@/types/shared";
import { Plus } from "lucide-react";

const Casos = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<CreateCaseDto>({
    passageiro: "",
    localizador: "",
    fornecedor: "",
    tipo: "atraso",
    prazo: "",
    status: "em_andamento",
    responsavel: { nome: "" },
    notas: "",
  });

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

  const handleCreate = async () => {
    if (!token) return;

    try {
      const response = await api.createCase(formData, token);
      if (response.ok && response.data) {
        toast({ title: "Caso criado com sucesso" });
        setOpen(false);
        setFormData({
          passageiro: "",
          localizador: "",
          fornecedor: "",
          tipo: "atraso",
          prazo: "",
          status: "em_andamento",
          responsavel: { nome: "" },
          notas: "",
        });
        loadCases();
      } else {
        toast({
          title: "Erro ao criar caso",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar caso",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="space-y-6"><p>Carregando...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Casos</h1>
          <p className="text-muted-foreground">Gerencie todos os seus casos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Caso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Caso</DialogTitle>
              <DialogDescription>Preencha os dados do caso</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Passageiro</Label>
                  <Input value={formData.passageiro} onChange={(e) => setFormData({ ...formData, passageiro: e.target.value })} />
                </div>
                <div>
                  <Label>Localizador</Label>
                  <Input value={formData.localizador} onChange={(e) => setFormData({ ...formData, localizador: e.target.value })} />
                </div>
                <div>
                  <Label>Fornecedor</Label>
                  <Input value={formData.fornecedor} onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })} />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atraso">Atraso &gt; 4h</SelectItem>
                      <SelectItem value="cancelamento">Cancelamento</SelectItem>
                      <SelectItem value="overbooking">Overbooking</SelectItem>
                      <SelectItem value="mudanca_voo">Mudança de voo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Prazo</Label>
                  <Input value={formData.prazo} onChange={(e) => setFormData({ ...formData, prazo: e.target.value })} placeholder="Hoje, 18h" />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_andamento">Em andamento</SelectItem>
                      <SelectItem value="aguardando_resposta">Aguardando resposta</SelectItem>
                      <SelectItem value="documentacao_pendente">Documentação pendente</SelectItem>
                      <SelectItem value="encerrado">Encerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Responsável</Label>
                <Input value={formData.responsavel.nome} onChange={(e) => setFormData({ ...formData, responsavel: { nome: e.target.value } })} />
              </div>
              <div>
                <Label>Observações</Label>
                <Input value={formData.notas} onChange={(e) => setFormData({ ...formData, notas: e.target.value })} />
              </div>
              <Button onClick={handleCreate} className="w-full">Criar Caso</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Casos</CardTitle>
          <CardDescription>{cases.length} caso{cases.length !== 1 ? 's' : ''} encontrado{cases.length !== 1 ? 's' : ''}</CardDescription>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum caso encontrado</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Passageiro</TableHead>
                  <TableHead>Localizador</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((caso) => {
                  const tipoBadge = getTipoBadge(caso.tipo);
                  const statusBadge = getStatusBadge(caso.status);
                  return (
                    <TableRow key={caso.id}>
                      <TableCell className="font-medium">{caso.passageiro}</TableCell>
                      <TableCell>{caso.localizador}</TableCell>
                      <TableCell><Badge variant="outline" className={tipoBadge.color}>{tipoBadge.label}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={statusBadge.color}>{statusBadge.label}</Badge></TableCell>
                      <TableCell>{caso.prazo}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/dashboard/caso/${caso.id}`}>
                          <Button variant="outline" size="sm">Ver</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Casos;
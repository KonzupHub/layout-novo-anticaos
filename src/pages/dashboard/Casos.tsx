import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FolderOpen, Plus, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getTipoBadge, getStatusBadge } from "@/lib/mockCases";
import { useSearch } from "@/contexts/SearchContext";
import type { Case, CreateCaseDto, CaseType, CaseStatus } from "@/types/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Casos = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const { searchTerm } = useSearch();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Estados do formulário de criação
  const [formData, setFormData] = useState<CreateCaseDto>({
    passageiro: "",
    localizador: "",
    fornecedor: "",
    tipo: "atraso",
    prazo: "",
    status: "em_andamento",
    responsavel: {
      nome: "",
      avatar: "",
    },
    notas: "",
  });

  useEffect(() => {
    loadCases();
  }, [token]);

  const loadCases = async () => {
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
    } catch (error: any) {
      console.error("Erro ao carregar casos:", error);
      toast({
        title: "Erro ao carregar casos",
        description: error.message || "Erro de conexão com o servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Validação básica - todos os campos obrigatórios
    if (!formData.passageiro || !formData.localizador || !formData.fornecedor || !formData.prazo || !formData.responsavel.nome) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios (passageiro, localizador, fornecedor, prazo, responsável)",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const response = await api.createCase(formData, token);
      if (response.ok && response.data) {
        toast({
          title: "Caso criado com sucesso",
        });
        setShowCreateDialog(false);
        // Reset form
        setFormData({
          passageiro: "",
          localizador: "",
          fornecedor: "",
          tipo: "atraso",
          prazo: "",
          status: "em_andamento",
          responsavel: {
            nome: "",
            avatar: "",
          },
          notas: "",
        });
        // Recarrega a lista
        await loadCases();
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
    } finally {
      setCreating(false);
    }
  };

  const filteredCases = cases.filter((caso) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      caso.passageiro.toLowerCase().includes(search) ||
      caso.localizador.toLowerCase().includes(search) ||
      caso.fornecedor.toLowerCase().includes(search) ||
      caso.responsavel.nome.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <p>Carregando casos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Casos</h1>
          <p className="text-muted-foreground">Gerencie seus casos ANAC</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo caso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar novo caso</DialogTitle>
              <DialogDescription>
                Preencha os dados do caso ANAC
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCase} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="passageiro">Passageiro *</Label>
                  <Input
                    id="passageiro"
                    value={formData.passageiro}
                    onChange={(e) => setFormData({ ...formData, passageiro: e.target.value })}
                    placeholder="Nome do passageiro"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="localizador">Localizador *</Label>
                  <Input
                    id="localizador"
                    value={formData.localizador}
                    onChange={(e) => setFormData({ ...formData, localizador: e.target.value })}
                    placeholder="ABC123"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fornecedor">Fornecedor *</Label>
                  <Input
                    id="fornecedor"
                    value={formData.fornecedor}
                    onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                    placeholder="LATAM, GOL, AZUL..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value as CaseType })}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue />
                    </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="atraso">Atraso &gt; 4h</SelectItem>
                        <SelectItem value="cancelamento">Cancelamento</SelectItem>
                        <SelectItem value="overbooking">Overbooking</SelectItem>
                        <SelectItem value="mudanca_voo">Mudança de voo</SelectItem>
                        <SelectItem value="extravio">Extravio</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="prazo">Prazo *</Label>
                  <Input
                    id="prazo"
                    value={formData.prazo}
                    onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                    placeholder="Hoje, 18h"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as CaseStatus })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_andamento">Em andamento</SelectItem>
                      <SelectItem value="aguardando_resposta">Aguardando resposta</SelectItem>
                      <SelectItem value="documentacao_pendente">Documentação pendente</SelectItem>
                      <SelectItem value="encerrado">Encerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="responsavel">Responsável *</Label>
                  <Input
                    id="responsavel"
                    value={formData.responsavel.nome}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responsavel: { ...formData.responsavel, nome: e.target.value },
                      })
                    }
                    placeholder="Nome do responsável"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notas">Observações</Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Observações sobre o caso"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Criando..." : "Criar caso"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Casos */}
      {filteredCases.length === 0 ? (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <FolderOpen className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum caso encontrado</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              {searchTerm
                ? "Nenhum caso corresponde à sua busca."
                : "Comece criando seu primeiro caso ANAC."}
            </p>
            {!searchTerm && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeiro caso
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de casos ({filteredCases.length})</CardTitle>
            <CardDescription>Casos ANAC cadastrados</CardDescription>
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
                              <AvatarFallback>
                                {caso.responsavel.avatar || caso.responsavel.nome.charAt(0).toUpperCase()}
                              </AvatarFallback>
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
                          <AvatarFallback>
                            {caso.responsavel.avatar || caso.responsavel.nome.charAt(0).toUpperCase()}
                          </AvatarFallback>
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

export default Casos;

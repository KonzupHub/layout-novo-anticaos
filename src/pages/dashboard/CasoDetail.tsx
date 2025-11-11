import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { getTipoBadge, getStatusBadge } from "@/lib/mockCases";
import type { Case, UpdateCaseDto } from "@/types/shared";
import { ArrowLeft, FileText, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CasoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const [caso, setCaso] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Estados para edição
  const [status, setStatus] = useState<string>("");
  const [responsavelNome, setResponsavelNome] = useState("");
  const [notas, setNotas] = useState("");
  const [prazo, setPrazo] = useState("");

  useEffect(() => {
    loadCase();
  }, [id]);

  const loadCase = async () => {
    if (!id || !token) return;

    try {
      const response = await api.getCases(undefined, token);
      if (response.ok && response.data) {
        const foundCase = response.data.find((c) => c.id === id);
        if (foundCase) {
          setCaso(foundCase);
          setStatus(foundCase.status);
          setResponsavelNome(foundCase.responsavel.nome);
          setNotas(foundCase.notas || "");
          setPrazo(foundCase.prazo);
        } else {
          toast({
            title: "Caso não encontrado",
            variant: "destructive",
          });
          navigate("/dashboard/casos");
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar caso",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !token) return;

    setSaving(true);
    try {
      const updates: UpdateCaseDto = {
        status: status as any,
        responsavel: { nome: responsavelNome },
        notas,
        prazo,
      };

      const response = await api.updateCase(id, updates, token);
      if (response.ok && response.data) {
        setCaso(response.data);
        toast({
          title: "Caso atualizado com sucesso",
        });
      } else {
        toast({
          title: "Erro ao atualizar caso",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar caso",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!id || !token) return;

    setGeneratingPDF(true);
    try {
      const response = await api.generateCasePDF(id, token);
      if (response.ok && response.data) {
        // Abre o PDF em nova aba
        window.open(response.data.url, "_blank");
        toast({
          title: "PDF gerado com sucesso",
        });
      } else {
        toast({
          title: "Erro ao gerar PDF",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao gerar PDF",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <p>Carregando caso...</p>
      </div>
    );
  }

  if (!caso) {
    return null;
  }

  const tipoBadge = getTipoBadge(caso.tipo);
  const statusBadge = getStatusBadge(caso.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/casos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Detalhes do Caso</h1>
          <p className="text-muted-foreground">ID: {caso.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações do Caso */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Caso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Passageiro</Label>
              <p className="font-medium">{caso.passageiro}</p>
            </div>
            <div>
              <Label>Localizador</Label>
              <p className="font-medium">{caso.localizador}</p>
            </div>
            <div>
              <Label>Fornecedor</Label>
              <p className="font-medium">{caso.fornecedor}</p>
            </div>
            <div>
              <Label>Tipo</Label>
              <div className="mt-1">
                <Badge variant="outline" className={tipoBadge.color}>
                  {tipoBadge.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edição */}
        <Card>
          <CardHeader>
            <CardTitle>Editar Caso</CardTitle>
            <CardDescription>Atualize os campos permitidos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
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
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                value={responsavelNome}
                onChange={(e) => setResponsavelNome(e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>

            <div>
              <Label htmlFor="prazo">Prazo</Label>
              <Input
                id="prazo"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                placeholder="Prazo"
              />
            </div>

            <div>
              <Label htmlFor="notas">Observações</Label>
              <Textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Observações sobre o caso"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
              <Button
                onClick={handleGeneratePDF}
                variant="outline"
                disabled={generatingPDF}
              >
                <FileText className="h-4 w-4 mr-2" />
                {generatingPDF ? "Gerando..." : "Gerar Relatório PDF"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Atual */}
      <Card>
        <CardHeader>
          <CardTitle>Status Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={statusBadge.color}>
              {statusBadge.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Prazo: {caso.prazo}
            </span>
            <span className="text-sm text-muted-foreground">
              Responsável: {caso.responsavel.nome}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CasoDetail;

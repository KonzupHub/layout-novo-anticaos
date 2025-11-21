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
import type { Case, UpdateCaseDto, CaseStatus, AnacResumo } from "@/types/shared";
import { ArrowLeft, FileText, Save, Sparkles, AlertCircle, CheckCircle, Clock } from "lucide-react";
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
  const [generatingIA, setGeneratingIA] = useState(false);

  // Estados para edição
  const [status, setStatus] = useState<string>("");
  const [responsavelNome, setResponsavelNome] = useState("");
  const [notas, setNotas] = useState("");
  const [prazo, setPrazo] = useState("");
  const [resumoIa, setResumoIa] = useState("");
  const [mensagemSugerida, setMensagemSugerida] = useState("");

  useEffect(() => {
    loadCase();
  }, [id]);

  const loadCase = async () => {
    if (!id || !token) return;

    try {
      const response = await api.getCaseById(id, token);
      if (response.ok && response.data) {
        setCaso(response.data);
        setStatus(response.data.status);
        setResponsavelNome(response.data.responsavel.nome);
        setNotas(response.data.notas || "");
        setPrazo(response.data.prazo);
        setResumoIa(response.data.resumoIa || "");
        setMensagemSugerida(response.data.mensagemSugerida || "");
      } else {
        toast({
          title: "Caso não encontrado",
          description: response.error,
          variant: "destructive",
        });
        navigate("/dashboard/casos");
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
        status: status as CaseStatus,
        responsavel: { nome: responsavelNome },
        notas,
        prazo,
        resumoIa,
        mensagemSugerida,
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
          title: "Documento pronto",
        });
      } else {
        toast({
          title: "Erro ao gerar PDF",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const isStubMode = import.meta.env.VITE_API_BASE?.includes('localhost') || import.meta.env.DEV;
      if (isStubMode) {
        console.error('Erro ao gerar PDF:', error);
      }
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o documento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleGenerateIA = async () => {
    if (!id || !token) return;

    setGeneratingIA(true);
    try {
      const response = await api.generateCaseSummary(id, token);
      
      // Sucesso: IA funcionou e retornou dados válidos
      if (response.ok && response.data && response.data.resumo) {
        setResumoIa(response.data.resumo);
        if (response.data.mensagemSugerida) {
          setMensagemSugerida(response.data.mensagemSugerida);
        }
        toast({
          title: "Resumo gerado com sucesso",
        });
      } else if (response.ok && response.data && response.data.mensagemSugerida && !response.data.resumo) {
        // Apenas mensagem sugerida, sem resumo
        setMensagemSugerida(response.data.mensagemSugerida);
        toast({
          title: "Resumo gerado com sucesso",
        });
      } else {
        // Qualquer outro caso: erro, erroIA, sem dados, etc.
        toast({
          title: "IA indisponível no momento",
          description: "O caso continua salvo normalmente.",
          variant: "default",
        });
      }
    } catch (error: any) {
      // Qualquer erro de rede, CORS ou exceção
      toast({
        title: "IA indisponível no momento",
        description: "O caso continua salvo normalmente.",
        variant: "default",
      });
    } finally {
      setGeneratingIA(false);
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

      {/* MVP 2.0: Interpretação ANAC */}
      {(caso as any).anacResumo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Interpretação ANAC
            </CardTitle>
            <CardDescription>
              Análise baseada na Resolução 400 da ANAC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-semibold">Categoria do Incidente</Label>
              <p className="text-sm mt-1">{(caso as any).anacResumo.categoriaIncidente}</p>
            </div>

            <div>
              <Label className="font-semibold">Direitos Básicos Aplicáveis</Label>
              <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                {(caso as any).anacResumo.direitosBasicos.map((direito: string, idx: number) => (
                  <li key={idx}>{direito}</li>
                ))}
              </ul>
            </div>

            <div>
              <Label className="font-semibold">Prazos Importantes</Label>
              <div className="space-y-2 mt-2">
                {(caso as any).anacResumo.prazosImportantes.map((prazo: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                    {prazo.status === 'vencido' && <AlertCircle className="h-4 w-4 text-red-600" />}
                    {prazo.status === 'proximo_vencer' && <Clock className="h-4 w-4 text-yellow-600" />}
                    {prazo.status === 'dentro_prazo' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    <span className="flex-1">
                      {prazo.descricao} - {prazo.diasRestantes !== undefined ? `${prazo.diasRestantes} dias restantes` : 'Imediato'}
                    </span>
                    <Badge variant="outline" className={
                      prazo.status === 'vencido' ? 'border-red-600 text-red-600' :
                      prazo.status === 'proximo_vencer' ? 'border-yellow-600 text-yellow-600' :
                      'border-green-600 text-green-600'
                    }>
                      {prazo.status === 'vencido' ? 'Vencido' :
                       prazo.status === 'proximo_vencer' ? 'Próximo' :
                       'Dentro do prazo'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {(caso as any).anacResumo.alertasOperacionais.length > 0 && (
              <div>
                <Label className="font-semibold text-yellow-600">Alertas Operacionais</Label>
                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                  {(caso as any).anacResumo.alertasOperacionais.map((alerta: string, idx: number) => (
                    <li key={idx} className="text-yellow-700">{alerta}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* MVP 2.0: Resumo com IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Resumo do Caso (IA)
          </CardTitle>
          <CardDescription>
            Resumo gerado automaticamente com inteligência artificial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="resumoIa">Resumo</Label>
            <Textarea
              id="resumoIa"
              value={resumoIa}
              onChange={(e) => setResumoIa(e.target.value)}
              placeholder="O resumo será gerado automaticamente com IA ou pode ser preenchido manualmente"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="mensagemSugerida">Mensagem Sugerida para Cliente</Label>
            <Textarea
              id="mensagemSugerida"
              value={mensagemSugerida}
              onChange={(e) => setMensagemSugerida(e.target.value)}
              placeholder="Mensagem sugerida para comunicação com o passageiro"
              rows={2}
            />
          </div>
          <Button
            onClick={handleGenerateIA}
            disabled={generatingIA}
            variant="outline"
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {generatingIA ? "Gerando com IA..." : "Gerar Parecer com IA"}
          </Button>
        </CardContent>
      </Card>

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

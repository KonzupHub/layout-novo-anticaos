import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, Plus, Calendar, Search, Edit, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComoFuncionaModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-muted-foreground hover:text-foreground text-sm p-0 h-auto">
          Entenda como funciona este painel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Como funciona o Ordem em Dia</DialogTitle>
          <DialogDescription>
            Guia rápido das funcionalidades disponíveis no painel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Cadastro e Login */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Cadastro e Login</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crie sua conta com email, senha e dados da agência. Após o cadastro, faça login para acessar o painel.
                Se esquecer sua senha, use a opção "Esqueci minha senha" para receber um link de recuperação por email.
              </p>
            </CardContent>
          </Card>

          {/* Dia de Hoje */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Dia de Hoje</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                A página inicial mostra um resumo dos casos que precisam de atenção:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong>Vence hoje:</strong> Casos com prazo que vence hoje</li>
                <li><strong>Em 24 horas:</strong> Casos com prazo nos próximos dias</li>
                <li><strong>Novos na semana:</strong> Casos criados recentemente</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                Use a barra de busca no topo para filtrar casos por passageiro, localizador ou fornecedor.
              </p>
            </CardContent>
          </Card>

          {/* Casos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Criar e Gerenciar Casos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Na página "Casos", você pode:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong>Criar novo caso:</strong> Clique em "Novo caso" ou "Criar primeiro caso" (quando não houver casos)</li>
                <li><strong>Preencher dados:</strong> Passageiro, localizador, fornecedor, tipo de incidente, prazo, status e responsável</li>
                <li><strong>Tipos de incidente:</strong> Atraso maior que 4h, Cancelamento, Overbooking, Mudança de voo ou Extravio</li>
                <li><strong>Buscar casos:</strong> Use a barra de busca para encontrar casos específicos</li>
              </ul>
            </CardContent>
          </Card>

          {/* Edição */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Editar Casos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Clique em "Ver caso" em qualquer caso da lista para abrir os detalhes. Na página de detalhes, você pode:
                atualizar o status, alterar o responsável, editar as notas e ajustar o prazo. As alterações são salvas automaticamente.
              </p>
            </CardContent>
          </Card>

          {/* PDF */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Gerar Relatório PDF</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Na página de detalhes do caso, clique em "Gerar Relatório PDF" para criar um documento completo com todas as informações
                do caso, incluindo dados do passageiro, linha do tempo, prazos ANAC e resultado final. O PDF é gerado e aberto em nova aba.
              </p>
            </CardContent>
          </Card>

          {/* Busca */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Busca Rápida</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A barra de busca no topo do painel funciona nas páginas "Dia de Hoje" e "Casos". Digite o nome do passageiro,
                localizador ou fornecedor para filtrar a lista instantaneamente. Limpe o campo para ver todos os casos novamente.
              </p>
            </CardContent>
          </Card>

          {/* Em Desenvolvimento */}
          <Card className="border-dashed">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Em desenvolvimento</Badge>
                <CardTitle className="text-lg">Funcionalidades Futuras</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As seguintes funcionalidades estão em desenvolvimento e serão disponibilizadas em breve:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside mt-3">
                <li>Importação de casos via CSV</li>
                <li>Relatórios e análises</li>
                <li>Gestão de equipe e permissões</li>
                <li>Modelos de documentos personalizados</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}


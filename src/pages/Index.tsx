import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, CheckCircle, FileText, Mail, ListChecks, FileCheck, Globe, TrendingUp, Link as LinkIcon, Chrome } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Index = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.postEarlyAccess(email);
      
      if (response.ok) {
        toast({
          title: "Você será avisado das novidades!",
          description: "Email cadastrado com sucesso.",
        });
        setEmail("");
      } else {
        toast({
          title: "Erro ao cadastrar email",
          description: response.error || "Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar email",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Konzup Hub</h1>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button>Criar conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Gradiente violeta → marinho */}
      <section className="relative -mt-16 pt-32 pb-20 px-4 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/5 overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-[#0f1729] bg-clip-text text-transparent">
            Anti-caos operacional para turismo
          </h2>
          <p className="text-2xl font-semibold text-primary">
            Incidente resolvido, venda preservada
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            A margem do aéreo é apertada. Cada minuto gasto no retrabalho vira perda real. 
            A Konzup Hub corta o retrabalho e protege a venda.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Link to="/cadastro">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Começar agora
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection('como-funciona')}
              className="hover:scale-105 transition-all"
            >
              Ver como funciona
            </Button>
          </div>
        </div>
      </section>

      <main className="space-y-0">
        {/* Seção Prova - Background gradiente sutil */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-8 text-center space-y-4 border-t-4 border-t-primary shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-b from-background to-muted/50">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto">
                  <Clock className="w-10 h-10 text-primary" />
                </div>
                <p className="font-semibold text-lg">Menos horas perdidas na operação</p>
              </Card>
              <Card className="p-8 text-center space-y-4 border-t-4 border-t-primary shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-b from-background to-muted/50">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <p className="font-semibold text-lg">Prazos combinados cumpridos</p>
              </Card>
              <Card className="p-8 text-center space-y-4 border-t-4 border-t-primary shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-b from-background to-muted/50">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <p className="font-semibold text-lg">Relatório do caso pronto para cliente e fornecedor</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Como Funciona - Timeline visual */}
        <section id="como-funciona" className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl space-y-12">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-[#0f1729] bg-clip-text text-transparent">
                Como funciona
              </h3>
            </div>
            
            <div className="relative grid md:grid-cols-3 gap-8">
              {/* Linha conectora */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-1 bg-gradient-to-r from-primary via-primary to-[#0f1729] z-0"></div>
              
              <div className="relative text-center space-y-4 z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto shadow-lg animate-pulse">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">01</div>
                <p className="font-semibold text-lg">Encaminhe o e-mail do problema</p>
              </div>
              
              <div className="relative text-center space-y-4 z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto shadow-lg animate-pulse" style={{ animationDelay: '0.2s' }}>
                  <ListChecks className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">02</div>
                <p className="font-semibold text-lg">A plataforma abre o caso com prazos combinados e passo a passo</p>
              </div>
              
              <div className="relative text-center space-y-4 z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[#0f1729] flex items-center justify-center mx-auto shadow-lg animate-pulse" style={{ animationDelay: '0.4s' }}>
                  <FileCheck className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-[#0f1729] bg-clip-text text-transparent">03</div>
                <p className="font-semibold text-lg">Gere cartas e o relatório final e acompanhe o que vence hoje</p>
              </div>
            </div>

            <div className="text-center pt-6">
              <Button 
                variant="outline" 
                onClick={() => scrollToSection('exemplo-relatorio')}
                className="hover:scale-105 transition-all"
              >
                Ver exemplo
              </Button>
            </div>
          </div>
        </section>

        <Separator className="my-0" />

        {/* Exemplo de Relatório */}
        <section id="exemplo-relatorio" className="py-20 px-4 bg-muted/40">
          <div className="container mx-auto max-w-3xl">
            <Card className="p-10 shadow-2xl hover:shadow-2xl transition-all border-t-4 border-t-primary bg-gradient-to-br from-background via-background to-muted/50">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto">
                  <FileText className="w-12 h-12 text-primary" />
                </div>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-primary to-[#0f1729] bg-clip-text text-transparent">
                  Relatório do caso pronto em PDF
                </h4>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Documento completo com todos os dados, prazos, comunicações e evidências organizadas 
                  para apresentação ao cliente e fornecedor.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <Separator className="my-0" />

        {/* Por Que Usar */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-3xl text-center">
            <h3 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-[#0f1729] bg-clip-text text-transparent">
              Por que usar
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              O problema nasce no e-mail e explode em planilhas. Organizamos o pós-venda de atraso, 
              cancelamento, overbooking e mudança de voo com listas de conferência simples e documentos prontos.
            </p>
          </div>
        </section>

        <Separator className="my-0" />

        {/* Resultados */}
        <section className="py-20 px-4 bg-gradient-to-r from-muted/30 via-primary/5 to-muted/30">
          <div className="container mx-auto max-w-5xl space-y-12">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-[#0f1729] bg-clip-text text-transparent">
                Resultados
              </h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-10 text-center space-y-4 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-l-4 border-l-primary bg-gradient-to-br from-background to-muted/60">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto">
                  <Clock className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg font-semibold">Horas poupadas por semana</p>
              </Card>
              <Card className="p-10 text-center space-y-4 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-l-4 border-l-primary bg-gradient-to-br from-background to-muted/60">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg font-semibold">Casos encerrados dentro do prazo</p>
              </Card>
              <Card className="p-10 text-center space-y-4 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-l-4 border-l-primary bg-gradient-to-br from-background to-muted/60">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg font-semibold">Menos estorno e menos perda de cliente</p>
              </Card>
            </div>
          </div>
        </section>

        <Separator className="my-0" />

        {/* FAQ */}
        <section className="py-20 px-4 bg-primary/10">
          <div className="container mx-auto max-w-3xl space-y-8">
            <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-[#0f1729] bg-clip-text text-transparent">
              Perguntas frequentes
            </h3>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6 bg-background shadow-md hover:shadow-lg transition-all">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                  O que é
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  A Konzup Hub organiza o pós-venda de incidentes aéreos (atraso, cancelamento, 
                  overbooking, mudança de voo) com prazos da ANAC, cartas automáticas e relatório final.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border rounded-lg px-6 bg-background shadow-md hover:shadow-lg transition-all">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                  Como entra no dia a dia
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  Encaminhe o e-mail do problema para o endereço da plataforma. O caso abre automaticamente 
                  com prazos e lista de conferência. Você segue o passo a passo e gera os documentos.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border rounded-lg px-6 bg-background shadow-md hover:shadow-lg transition-all">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                  Privacidade e LGPD
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  Guardamos apenas os dados necessários para gestão dos casos. Você controla acesso da 
                  equipe e pode exportar ou excluir dados a qualquer momento.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator className="my-0" />

        {/* O Que Vem Por Aí - Gradiente + Glass morphism */}
        <section className="py-20 px-4 bg-gradient-to-br from-[#0f1729]/20 via-primary/15 to-[#0f1729]/20">
          <div className="container mx-auto max-w-5xl space-y-10">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 animate-pulse shadow-md">Em breve</Badge>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-[#0f1729] via-primary to-primary bg-clip-text text-transparent">
                O que vem por aí
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-8 space-y-4 backdrop-blur-sm bg-background/90 border-2 shadow-2xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold text-xl">Portal de status para cliente B2B</h4>
              </Card>
              
              <Card className="p-8 space-y-4 backdrop-blur-sm bg-background/90 border-2 shadow-2xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold text-xl">Indicadores de eficiência e venda preservada</h4>
              </Card>
              
              <Card className="p-8 space-y-4 backdrop-blur-sm bg-background/90 border-2 shadow-2xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <LinkIcon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold text-xl">Conectores opcionais com consolidadoras</h4>
              </Card>
              
              <Card className="p-8 space-y-4 backdrop-blur-sm bg-background/90 border-2 shadow-2xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Chrome className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold text-xl">Extensão de navegador para prazos no webmail</h4>
              </Card>
            </div>

            <Card className="p-10 max-w-md mx-auto shadow-2xl border-t-4 border-t-primary bg-gradient-to-br from-background to-muted/50">
              <form onSubmit={handleNotifyMe} className="space-y-4">
                <h4 className="font-bold text-xl text-center">Quero ser avisado</h4>
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2"
                />
                <Button type="submit" className="w-full shadow-lg hover:shadow-xl transition-all hover:scale-105" disabled={loading}>
                  {loading ? "Cadastrando..." : "Quero ser avisado"}
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer - Marinho escuro */}
      <footer className="bg-[#0f1729] text-white py-12 mt-0">
        <div className="container mx-auto px-4">
          <Separator className="mb-8 bg-white/10" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">© 2025 Konzup Hub</p>
            <div className="flex gap-6 text-sm">
              <Link to="/ajuda" className="text-white/70 hover:text-white transition-colors">Ajuda</Link>
              <Link to="/termos" className="text-white/70 hover:text-white transition-colors">Termos</Link>
              <Link to="/privacidade" className="text-white/70 hover:text-white transition-colors">Privacidade</Link>
              <a href="mailto:contato@konzup.com" className="text-white/70 hover:text-white transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

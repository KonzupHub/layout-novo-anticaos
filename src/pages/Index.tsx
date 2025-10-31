import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, FileText, Mail, ListChecks, FileCheck, Globe, TrendingUp, Link as LinkIcon, Chrome } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Você será avisado das novidades!",
        description: "Obrigado pelo interesse.",
      });
      setEmail("");
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

      <main className="container mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-foreground">
            Anti-caos operacional para turismo
          </h2>
          <p className="text-2xl font-semibold text-primary">
            Incidente resolvido, venda preservada
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A margem do aéreo é apertada. Cada minuto gasto no retrabalho vira perda real. 
            A Konzup Hub corta o retrabalho e protege a venda.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/cadastro">
              <Button size="lg">Começar agora</Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => scrollToSection('como-funciona')}>
              Ver como funciona
            </Button>
          </div>
        </section>

        {/* Seção Prova */}
        <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 text-center space-y-4">
            <Clock className="w-12 h-12 mx-auto text-primary" />
            <p className="font-medium">Menos horas perdidas na operação</p>
          </Card>
          <Card className="p-6 text-center space-y-4">
            <CheckCircle className="w-12 h-12 mx-auto text-primary" />
            <p className="font-medium">Prazos da ANAC cumpridos</p>
          </Card>
          <Card className="p-6 text-center space-y-4">
            <FileText className="w-12 h-12 mx-auto text-primary" />
            <p className="font-medium">Relatório do caso pronto para cliente e fornecedor</p>
          </Card>
        </section>

        {/* Como Funciona */}
        <section id="como-funciona" className="space-y-12 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Como funciona</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary">01</div>
              <p className="font-medium">Encaminhe o e-mail do problema</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <ListChecks className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary">02</div>
              <p className="font-medium">A plataforma abre o caso com prazos e passo a passo</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <FileCheck className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary">03</div>
              <p className="font-medium">Gere cartas e o relatório final e acompanhe o que vence hoje</p>
            </div>
          </div>

          <div className="text-center pt-6">
            <Button variant="outline" onClick={() => scrollToSection('exemplo-relatorio')}>
              Ver exemplo
            </Button>
          </div>
        </section>

        {/* Exemplo de Relatório */}
        <section id="exemplo-relatorio" className="max-w-3xl mx-auto">
          <Card className="p-8 bg-muted/30">
            <div className="text-center space-y-4">
              <FileText className="w-16 h-16 mx-auto text-primary" />
              <h4 className="text-2xl font-bold">Relatório do caso pronto em PDF</h4>
              <p className="text-muted-foreground">
                Documento completo com todos os dados, prazos, comunicações e evidências organizadas 
                para apresentação ao cliente e fornecedor.
              </p>
            </div>
          </Card>
        </section>

        {/* Por Que Usar */}
        <section className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Por que usar</h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            O problema nasce no e-mail e explode em planilhas. Organizamos o pós-venda de atraso, 
            cancelamento, overbooking e mudança de voo com listas de conferência simples e documentos prontos.
          </p>
        </section>

        {/* Resultados - SEM NÚMEROS */}
        <section className="space-y-12 max-w-5xl mx-auto">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Resultados</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8 text-center space-y-3">
              <Clock className="w-10 h-10 mx-auto text-primary" />
              <p className="text-lg font-semibold">Horas poupadas por semana</p>
            </Card>
            <Card className="p-8 text-center space-y-3">
              <CheckCircle className="w-10 h-10 mx-auto text-primary" />
              <p className="text-lg font-semibold">Casos encerrados dentro do prazo</p>
            </Card>
            <Card className="p-8 text-center space-y-3">
              <TrendingUp className="w-10 h-10 mx-auto text-primary" />
              <p className="text-lg font-semibold">Menos estorno e menos perda de cliente</p>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto space-y-6">
          <h3 className="text-3xl font-bold text-center mb-8">Perguntas frequentes</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">O que é</AccordionTrigger>
              <AccordionContent>
                A Konzup Hub organiza o pós-venda de incidentes aéreos (atraso, cancelamento, 
                overbooking, mudança de voo) com prazos da ANAC, cartas automáticas e relatório final.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">Como entra no dia a dia</AccordionTrigger>
              <AccordionContent>
                Encaminhe o e-mail do problema para o endereço da plataforma. O caso abre automaticamente 
                com prazos e lista de conferência. Você segue o passo a passo e gera os documentos.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Privacidade e LGPD</AccordionTrigger>
              <AccordionContent>
                Guardamos apenas os dados necessários para gestão dos casos. Você controla acesso da 
                equipe e pode exportar ou excluir dados a qualquer momento.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* O Que Vem Por Aí */}
        <section className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">Em breve</Badge>
            <h3 className="text-3xl font-bold">O que vem por aí</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <Globe className="w-10 h-10 text-primary" />
              <h4 className="font-semibold text-lg">Portal de status para cliente B2B</h4>
            </Card>
            
            <Card className="p-6 space-y-4">
              <TrendingUp className="w-10 h-10 text-primary" />
              <h4 className="font-semibold text-lg">Indicadores de eficiência e venda preservada</h4>
            </Card>
            
            <Card className="p-6 space-y-4">
              <LinkIcon className="w-10 h-10 text-primary" />
              <h4 className="font-semibold text-lg">Conectores opcionais com consolidadoras</h4>
            </Card>
            
            <Card className="p-6 space-y-4">
              <Chrome className="w-10 h-10 text-primary" />
              <h4 className="font-semibold text-lg">Extensão de navegador para prazos no webmail</h4>
            </Card>
          </div>

          <Card className="p-8 max-w-md mx-auto">
            <form onSubmit={handleNotifyMe} className="space-y-4">
              <h4 className="font-semibold text-center">Quero ser avisado</h4>
              <Input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full">Quero ser avisado</Button>
            </form>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Konzup Hub</p>
            <div className="flex gap-6 text-sm">
              <Link to="/ajuda" className="text-muted-foreground hover:text-primary">Ajuda</Link>
              <Link to="/termos" className="text-muted-foreground hover:text-primary">Termos</Link>
              <Link to="/privacidade" className="text-muted-foreground hover:text-primary">Privacidade</Link>
              <a href="mailto:contato@konzup.com" className="text-muted-foreground hover:text-primary">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, CheckCircle, FileText, Mail, ListChecks, FileCheck, Globe, TrendingUp, Link as LinkIcon, Chrome, Plane, Users, Luggage } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const caseExamples = [
  {
    id: "cancelamento",
    title: "Cancelamento de Voo",
    company: "Viagens Horizonte Ltda",
    caseNumber: "#2025-001",
    type: "Cancelamento de voo",
    airline: "Azul Linhas Aéreas",
    flight: "AD 4321",
    date: "10/01/2025",
    route: "GRU → SSA",
    client: "Maria Silva Santos",
    cpf: "123.456.789-00",
    email: "maria.silva@email.com",
    timeline: [
      { time: "10/01 08:30", event: "Recebimento do e-mail de cancelamento" },
      { time: "10/01 09:15", event: "Caso aberto automaticamente" },
      { time: "10/01 10:00", event: "Carta de reclamação enviada" },
      { time: "12/01 14:20", event: "Reacomodação confirmada para voo AD 4325" },
      { time: "15/01 11:00", event: "Caso encerrado - Cliente satisfeito" }
    ],
    result: "Caso resolvido com sucesso. Cliente reacomodado em voo alternativo sem custos adicionais.",
    icon: Plane
  },
  {
    id: "atraso",
    title: "Atraso Superior a 4h",
    company: "TurExpresso Viagens",
    caseNumber: "#2025-002",
    type: "Atraso de voo",
    airline: "LATAM Airlines",
    flight: "LA 3456",
    date: "12/01/2025",
    route: "CGH → REC",
    client: "João Pedro Costa",
    cpf: "987.654.321-00",
    email: "joao.costa@email.com",
    timeline: [
      { time: "12/01 14:00", event: "Notificação de atraso de 5h recebida" },
      { time: "12/01 14:10", event: "Caso aberto - prazo ANAC ativado" },
      { time: "12/01 15:00", event: "Assistência material providenciada (voucher)" },
      { time: "12/01 16:30", event: "Cliente informado sobre compensação" },
      { time: "13/01 09:00", event: "Embarque realizado - Caso encerrado" }
    ],
    result: "Assistência material oferecida conforme Resolução 400. Cliente embarcou no dia seguinte com compensação.",
    icon: Clock
  },
  {
    id: "overbooking",
    title: "Overbooking / Preterição",
    company: "Mundial Turismo",
    caseNumber: "#2025-003",
    type: "Preterição de embarque",
    airline: "GOL Linhas Aéreas",
    flight: "G3 1234",
    date: "08/01/2025",
    route: "SDU → BSB",
    client: "Ana Carolina Mendes",
    cpf: "456.789.123-00",
    email: "ana.mendes@email.com",
    timeline: [
      { time: "08/01 18:00", event: "Cliente impedido de embarcar (overbooking)" },
      { time: "08/01 18:05", event: "Caso aberto - prioridade ALTA" },
      { time: "08/01 18:20", event: "Reacomodação imediata no próximo voo (1h)" },
      { time: "08/01 18:30", event: "Compensação financeira solicitada" },
      { time: "10/01 10:00", event: "Compensação confirmada - Caso encerrado" }
    ],
    result: "Cliente reacomodada em menos de 1h. Compensação financeira de R$ 1.000 aprovada pela cia aérea.",
    icon: Users
  },
  {
    id: "mudanca-aeronave",
    title: "Mudança de Aeronave",
    company: "Fly Tours",
    caseNumber: "#2025-004",
    type: "Mudança de equipamento",
    airline: "Azul Linhas Aéreas",
    flight: "AD 2789",
    date: "05/01/2025",
    route: "VCP → FOR",
    client: "Carlos Eduardo Lima",
    cpf: "321.654.987-00",
    email: "carlos.lima@email.com",
    timeline: [
      { time: "05/01 06:00", event: "Notificação de mudança de aeronave" },
      { time: "05/01 06:15", event: "Caso aberto - verificação de assentos" },
      { time: "05/01 07:00", event: "Confirmação de assento equivalente" },
      { time: "05/01 08:30", event: "Embarque realizado sem problemas" },
      { time: "05/01 12:00", event: "Caso encerrado - Sem necessidade de ações" }
    ],
    result: "Mudança de aeronave comunicada no prazo. Assento equivalente garantido. Nenhuma ação adicional necessária.",
    icon: Plane
  },
  {
    id: "extravio-bagagem",
    title: "Extravio de Bagagem",
    company: "Rotas do Brasil",
    caseNumber: "#2025-005",
    type: "Extravio de bagagem",
    airline: "LATAM Airlines",
    flight: "LA 4567",
    date: "03/01/2025",
    route: "GIG → MAO",
    client: "Fernanda Oliveira",
    cpf: "789.123.456-00",
    email: "fernanda.oliveira@email.com",
    timeline: [
      { time: "03/01 22:00", event: "Cliente relata bagagem não localizada" },
      { time: "03/01 22:10", event: "Caso aberto - RIB registrado" },
      { time: "03/01 22:30", event: "Assistência emergencial autorizada (R$ 500)" },
      { time: "05/01 10:00", event: "Bagagem localizada em Brasília" },
      { time: "06/01 14:00", event: "Bagagem entregue - Caso encerrado" }
    ],
    result: "Bagagem localizada e entregue em 72h. Assistência emergencial fornecida. Cliente satisfeito com a resolução.",
    icon: Luggage
  }
];

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

      {/* Hero Section - Gradiente violeta → marinho */}
      <section className="relative -mt-16 pt-32 pb-20 px-4 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/5 overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-[#0f1729] bg-clip-text text-transparent">
            Ordem em Dia operacional para turismo
          </h2>
          <p className="text-2xl font-semibold text-primary">
            Incidente resolvido, venda preservada
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            A margem do aéreo é apertada. Cada minuto gasto no retrabalho vira perda real. 
            A Ordem em Dia corta o retrabalho e protege a venda.
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
                <p className="font-semibold text-lg">Prazos da ANAC cumpridos</p>
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
                <p className="font-semibold text-lg">A plataforma abre o caso com prazos e passo a passo</p>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="hover:scale-105 transition-all shadow-md hover:shadow-xl hover:border-primary"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Ver exemplos de casos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      Exemplos de Relatórios de Casos
                    </DialogTitle>
                  </DialogHeader>

                  <Tabs defaultValue="cancelamento" className="w-full animate-fade-in">
                    <TabsList className="grid w-full grid-cols-5 mb-6">
                      {caseExamples.map((example) => {
                        const IconComponent = example.icon;
                        return (
                          <TabsTrigger key={example.id} value={example.id} className="text-xs">
                            <IconComponent className="w-3 h-3 mr-1" />
                            {example.title.split(' ')[0]}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {caseExamples.map((example, exampleIdx) => {
                      const IconComponent = example.icon;
                      return (
                        <TabsContent 
                          key={example.id} 
                          value={example.id}
                          className="animate-in fade-in-0 slide-in-from-right-4 duration-200"
                        >
                          <div className="space-y-6 p-6 bg-gradient-to-br from-muted/30 to-primary/5 rounded-lg border border-primary/20">
                            {/* Header com badge animado */}
                            <div className="border-b pb-4 animate-fade-in">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-bold text-primary">{example.company}</h3>
                                  <p className="text-sm text-muted-foreground">CNPJ: 12.345.678/0001-90</p>
                                  <p className="text-sm text-muted-foreground">Data: 15/01/2025</p>
                                </div>
                                <Badge className="animate-scale-in bg-primary/20 text-primary border-primary">
                                  {example.type}
                                </Badge>
                              </div>
                            </div>

                            {/* Dados do Caso */}
                            <div className="space-y-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                              <h4 className="font-bold text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Dados do Caso
                              </h4>
                              <div className="grid grid-cols-2 gap-3 text-sm bg-background/50 p-4 rounded-lg">
                                <div>
                                  <span className="font-semibold">Número do Caso:</span> {example.caseNumber}
                                </div>
                                <div>
                                  <span className="font-semibold">Tipo:</span> {example.type}
                                </div>
                                <div>
                                  <span className="font-semibold">Cia Aérea:</span> {example.airline}
                                </div>
                                <div>
                                  <span className="font-semibold">Voo:</span> {example.flight}
                                </div>
                                <div>
                                  <span className="font-semibold">Data do voo:</span> {example.date}
                                </div>
                                <div>
                                  <span className="font-semibold">Trecho:</span> {example.route}
                                </div>
                              </div>
                            </div>

                            {/* Cliente */}
                            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
                              <h4 className="font-bold text-lg flex items-center gap-2">
                                <Mail className="w-5 h-5 text-primary" />
                                Cliente Afetado
                              </h4>
                              <div className="bg-background/50 p-4 rounded-lg text-sm">
                                <p className="font-semibold">{example.client}</p>
                                <p className="text-muted-foreground">CPF: {example.cpf}</p>
                                <p className="text-muted-foreground">Contato: {example.email}</p>
                              </div>
                            </div>

                            {/* Timeline animada */}
                            <div className="space-y-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
                              <h4 className="font-bold text-lg flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Linha do Tempo
                              </h4>
                              <div className="space-y-3 text-sm">
                                {example.timeline.map((item, idx) => (
                                  <div 
                                    key={idx} 
                                    className="flex gap-3 items-start animate-slide-in-right"
                                    style={{ animationDelay: `${400 + (idx * 50)}ms` }}
                                  >
                                    <Badge variant="outline" className="shrink-0">{item.time}</Badge>
                                    <p className="flex-1">{item.event}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Prazos ANAC */}
                            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '700ms' }}>
                              <h4 className="font-bold text-lg flex items-center gap-2">
                                <ListChecks className="w-5 h-5 text-primary" />
                                Cumprimento de Prazos ANAC
                              </h4>
                              <div className="space-y-2 text-sm bg-background/50 p-4 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span>Assistência material oferecida dentro de 1h</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span>Reacomodação em até 24h conforme Resolução 400</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span>Comunicação ao passageiro imediata</span>
                                </div>
                              </div>
                            </div>

                            {/* Resultado Final com gradiente */}
                            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6 rounded-lg border-l-4 border-l-primary animate-fade-in" style={{ animationDelay: '800ms' }}>
                              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Resultado Final
                              </h4>
                              <p className="text-sm">{example.result}</p>
                            </div>
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </DialogContent>
              </Dialog>
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
                  A Ordem em Dia organiza o pós-venda de incidentes aéreos (atraso, cancelamento, 
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
                <Button type="submit" className="w-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Quero ser avisado
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

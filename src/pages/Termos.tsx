import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Termos = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-bold text-primary">Konzup Hub</h1>
          </Link>
          <Link to="/">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Termos de Uso</CardTitle>
            <p className="text-sm text-muted-foreground">Última atualização: Janeiro de 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3">1. Ambiente de Demonstração</h3>
              <p className="text-muted-foreground">
                Este é um ambiente de demonstração da plataforma Konzup Hub. Os dados e funcionalidades 
                apresentados são fictícios e servem apenas para fins de avaliação.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Uso da Plataforma</h3>
              <p className="text-muted-foreground">
                A Konzup Hub é uma plataforma de gestão de pós-venda para incidentes aéreos. 
                Ao usar a plataforma, você concorda em utilizá-la de acordo com a legislação vigente 
                e as normas da ANAC.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Propriedade Intelectual</h3>
              <p className="text-muted-foreground">
                Todo o conteúdo, design e funcionalidades da plataforma são de propriedade da Konzup Hub 
                e protegidos por direitos autorais.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Limitação de Responsabilidade</h3>
              <p className="text-muted-foreground">
                A Konzup Hub fornece ferramentas para organização e gestão, mas a responsabilidade 
                final sobre o atendimento aos prazos e conformidade legal permanece com o usuário.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Modificações</h3>
              <p className="text-muted-foreground">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                Alterações significativas serão comunicadas aos usuários.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Contato</h3>
              <p className="text-muted-foreground">
                Para dúvidas sobre estes termos, entre em contato em: contato@konzup.com
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Termos;

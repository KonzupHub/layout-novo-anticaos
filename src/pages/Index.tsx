import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
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

      <main className="container mx-auto px-4 py-16 space-y-16">
        <section className="text-center space-y-6 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-foreground">
            Anti-caos operacional para turismo
          </h2>
          <p className="text-xl text-muted-foreground">
            Problema de viagem resolvido no prazo e sem perder venda
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg">Começar agora</Button>
            </Link>
            <Button size="lg" variant="outline">Ver como funciona</Button>
          </div>
        </section>

        <section className="text-center">
          <p className="text-muted-foreground">
            Landing page em desenvolvimento - Fases 1 e 2 concluídas
          </p>
        </section>
      </main>
    </div>
  );
};

export default Index;

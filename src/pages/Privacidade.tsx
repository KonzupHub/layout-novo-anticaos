import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacidade = () => {
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
            <CardTitle className="text-3xl">Política de Privacidade</CardTitle>
            <p className="text-sm text-muted-foreground">Última atualização: Janeiro de 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3">1. Coleta de Dados</h3>
              <p className="text-muted-foreground">
                Coletamos apenas os dados necessários para a gestão dos casos de pós-venda: 
                informações de passageiros, detalhes de voos, comunicações relacionadas aos incidentes 
                e dados da agência.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Uso dos Dados</h3>
              <p className="text-muted-foreground">
                Os dados são utilizados exclusivamente para:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Gestão e acompanhamento de casos</li>
                <li>Geração de relatórios e documentos</li>
                <li>Comunicação com clientes e fornecedores</li>
                <li>Atender prazos combinados e normas da ANAC</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Compartilhamento</h3>
              <p className="text-muted-foreground">
                Não compartilhamos dados com terceiros, exceto quando necessário para a resolução 
                dos casos (comunicação com companhias aéreas) ou quando exigido por lei.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Segurança</h3>
              <p className="text-muted-foreground">
                Implementamos medidas de segurança técnicas e organizacionais para proteger 
                seus dados contra acesso não autorizado, perda ou alteração.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Direitos do Titular (LGPD)</h3>
              <p className="text-muted-foreground">
                Você tem direito a:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Acessar seus dados</li>
                <li>Corrigir dados incompletos ou incorretos</li>
                <li>Solicitar a exclusão de dados</li>
                <li>Exportar seus dados</li>
                <li>Revogar consentimento a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Retenção de Dados</h3>
              <p className="text-muted-foreground">
                Mantemos os dados pelo período necessário para cumprimento de obrigações legais 
                e contratuais. Dados de casos encerrados são mantidos conforme exigências regulatórias.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">7. Cookies</h3>
              <p className="text-muted-foreground">
                Utilizamos cookies essenciais para o funcionamento da plataforma e para 
                manter sua sessão ativa. Não utilizamos cookies de rastreamento.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">8. Contato</h3>
              <p className="text-muted-foreground">
                Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, 
                entre em contato: privacidade@konzup.com
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Privacidade;

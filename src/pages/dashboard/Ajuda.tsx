import { HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Ajuda = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ajuda</h1>
        <p className="text-muted-foreground">Guia rápido e perguntas frequentes</p>
      </div>
      
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-primary/20">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-primary/10 p-6 mb-4">
            <HelpCircle className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Em breve</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </p>
          <Badge variant="secondary" className="mt-4">🚧 Em desenvolvimento</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ajuda;

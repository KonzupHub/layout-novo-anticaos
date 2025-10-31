import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aceita qualquer valor ou campos vazios
    localStorage.setItem("konzup_user", JSON.stringify({ email: email || "demo@konzup.com" }));
    toast({
      title: "Bem-vindo à demonstração do Konzup Hub!",
    });
    navigate("/dashboard");
  };

  const handleDemoLogin = () => {
    setEmail("demo@konzup.com");
    setPassword("demo");
    
    // Login imediato
    setTimeout(() => {
      localStorage.setItem("konzup_user", JSON.stringify({ email: "demo@konzup.com" }));
      toast({
        title: "Bem-vindo à demonstração do Konzup Hub!",
      });
      navigate("/dashboard");
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-2">🎭 Ambiente de demonstração</Badge>
          <h1 className="text-3xl font-bold text-primary">Konzup Hub</h1>
          <p className="mt-2 text-muted-foreground">Entre na sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/esqueci-senha"
              className="text-sm text-primary hover:underline"
            >
              Esqueci a senha
            </Link>
          </div>

          <div className="space-y-3">
            <Button type="submit" className="w-full">
              Entrar
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleDemoLogin}
            >
              Entrar na demonstração
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/cadastro" className="text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

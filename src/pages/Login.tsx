import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (email && password) {
      localStorage.setItem("konzup_user", JSON.stringify({ email }));
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao Konzup Hub!",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Erro no login",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Konzup Hub</h1>
          <p className="mt-2 text-muted-foreground">Entre na sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
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
                required
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

          <Button type="submit" className="w-full">
            Entrar
          </Button>

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

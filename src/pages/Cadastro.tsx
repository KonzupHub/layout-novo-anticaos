import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Cadastro = () => {
  const [cnpj, setCnpj] = useState("");
  const [agencia, setAgencia] = useState("");
  const [cidade, setCidade] = useState("");
  const [usuarios, setUsuarios] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cnpj && agencia && cidade && usuarios && email && password) {
      localStorage.setItem("konzup_user", JSON.stringify({ email, agencia }));
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Konzup Hub.",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Erro no cadastro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Konzup Hub</h1>
          <p className="mt-2 text-muted-foreground">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>

            <div>
              <Label htmlFor="agencia">Nome da Agência</Label>
              <Input
                id="agencia"
                type="text"
                value={agencia}
                onChange={(e) => setAgencia(e.target.value)}
                placeholder="Sua Agência"
                required
              />
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="São Paulo"
                required
              />
            </div>

            <div>
              <Label htmlFor="usuarios">Número de usuários</Label>
              <Select value={usuarios} onValueChange={setUsuarios} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 usuários</SelectItem>
                  <SelectItem value="6-10">6-10 usuários</SelectItem>
                  <SelectItem value="11-20">11-20 usuários</SelectItem>
                  <SelectItem value="20+">Mais de 20 usuários</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

          <Button type="submit" className="w-full">
            Criar conta
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;

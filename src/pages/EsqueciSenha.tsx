import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const EsqueciSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "E-mail obrigatório",
        description: "Por favor, informe seu e-mail",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    } catch (error: any) {
      console.error("Erro ao enviar e-mail:", error);
      let message = "Erro ao enviar e-mail de recuperação";
      
      if (error.code === "auth/user-not-found") {
        message = "E-mail não cadastrado";
      } else if (error.code === "auth/invalid-email") {
        message = "E-mail inválido";
      }
      
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary">Esqueci minha senha</h1>
          <p className="mt-2 text-muted-foreground">
            {sent 
              ? "Enviamos um e-mail com instruções para redefinir sua senha"
              : "Digite seu e-mail para receber um link de recuperação"
            }
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">
                Voltar para o login
              </Link>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Não recebeu o e-mail? Verifique sua caixa de spam ou{" "}
              <button
                onClick={() => setSent(false)}
                className="text-primary hover:underline"
              >
                tente novamente
              </button>
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Voltar para o login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EsqueciSenha;


import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const Importar = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !token) return;

    setUploading(true);
    try {
      const response = await api.uploadCSV(file, token);
      if (response.ok && response.data) {
        setResult(response.data);
        toast({
          title: "CSV processado com sucesso",
        });
      } else {
        toast({
          title: "Erro ao processar CSV",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao processar CSV",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Importar planilha</h1>
        <p className="text-muted-foreground">Faça upload do CSV da consolidadora para verificar divergências</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload de CSV</CardTitle>
          <CardDescription>Selecione o arquivo CSV para processar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button onClick={handleUpload} disabled={!file || uploading}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Processando..." : "Processar CSV"}
            </Button>
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{file.name}</span>
              <Badge variant="secondary">{(file.size / 1024).toFixed(2)} KB</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Análise</CardTitle>
            <CardDescription>Divergências e estatísticas encontradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Linhas Processadas</p>
                <p className="text-2xl font-bold">{result.totais.linhasProcessadas}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Divergências</p>
                <p className="text-2xl font-bold text-orange-600">{result.totais.divergenciasEncontradas}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Não Encontrados</p>
                <p className="text-2xl font-bold text-red-600">{result.totais.casosNaoEncontrados}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Com Divergência</p>
                <p className="text-2xl font-bold text-yellow-600">{result.totais.casosComDivergencia}</p>
              </div>
            </div>

            {result.pendencias.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Pendências Encontradas</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {result.pendencias.map((p: any, idx: number) => (
                    <Card key={idx} className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Localizador: {p.localizador}</p>
                          <p className="text-sm text-muted-foreground">{p.motivo}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Importar;
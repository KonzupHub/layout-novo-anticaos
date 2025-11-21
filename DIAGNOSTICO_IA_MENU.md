# Diagnóstico: Botão IA e Menu Lateral

**Data**: 2025-11-19  
**Objetivo**: Capturar informações reais do Network e Console antes de fazer correções

---

## 1. Código Atual do Menu Lateral

### Arquivo: `src/components/layout/AppSidebar.tsx`

**Classes CSS atuais para o NavLink** (linhas 54-62):

```typescript
className={({ isActive }) =>
  cn(
    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all relative",
    "w-full text-left",
    isActive
      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-sm before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary-foreground before:rounded-l-md"
      : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  )
}
```

**Análise das classes atuais**:

**Estado Ativo (`isActive === true`)**:
- `bg-gradient-to-r from-primary to-primary/80` - Gradiente de fundo do primary
- `text-primary-foreground` - Texto com cor do foreground do primary
- `hover:from-primary/90 hover:to-primary/70` - Hover com gradiente mais intenso
- `shadow-sm` - Sombra sutil
- `before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary-foreground before:rounded-l-md` - Barra vertical esquerda usando pseudo-elemento `before`

**Estado Normal (`isActive === false`)**:
- `text-foreground` - Texto padrão
- `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground` - Hover com fundo e texto do accent do sidebar

---

## 2. Código Atual da Função handleGenerateIA

### Arquivo: `src/pages/dashboard/CasoDetail.tsx` (linhas 150-189)

```typescript
const handleGenerateIA = async () => {
  if (!id || !token) return;

  setGeneratingIA(true);
  try {
    const response = await api.generateCaseSummary(id, token);
    if (response.ok && response.data) {
      if (response.data.erroIA) {
        toast({
          title: "IA indisponível",
          description: response.data.erroIA,
          variant: "default",
        });
      } else {
        if (response.data.resumo) {
          setResumoIa(response.data.resumo);
        }
        if (response.data.mensagemSugerida) {
          setMensagemSugerida(response.data.mensagemSugerida);
        }
        toast({
          title: "Resumo gerado com sucesso",
        });
      }
    } else {
      toast({
        title: "Erro ao gerar resumo",
        description: response.error || "Não foi possível gerar o resumo com IA",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    toast({
      title: "Erro ao gerar resumo",
      description: "Não foi possível gerar o resumo. Tente novamente.",
      variant: "destructive",
    });
  } finally {
    setGeneratingIA(false);
  }
};
```

### Função da API: `src/lib/api.ts` (linhas 183-188)

```typescript
async generateCaseSummary(id: string, token?: string | null): Promise<ApiResponse<{ resumo: string; mensagemSugerida?: string; erroIA?: string }>> {
  return request('/ia/sugerir-resumo', {
    method: 'POST',
    body: JSON.stringify({ casoId: id }),
  }, token);
}
```

### Função request: `src/lib/api.ts` (linhas 14-92)

A função `request` faz:
- URL: `${API_BASE}${endpoint}` onde `API_BASE = import.meta.env.VITE_API_BASE || 'https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api'`
- Headers: `Content-Type: application/json` + `Authorization: Bearer ${token}`
- Body: O que foi passado em `options.body` (no caso, `JSON.stringify({ casoId: id })`)

---

## 3. Informações Esperadas da Requisição

### Quando o botão "Gerar Parecer com IA" é clicado:

**Nome da requisição no Network**: `sugerir-resumo` ou `/ia/sugerir-resumo`

**URL completa**: 
- Em produção: `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api/ia/sugerir-resumo`
- Em dev local: `http://localhost:8080/api/ia/sugerir-resumo` (se `VITE_API_BASE` estiver configurado)

**Método HTTP**: `POST`

**Headers enviados**:
```
Content-Type: application/json
Authorization: Bearer <token-do-usuario>
```

**Corpo da requisição (Request Payload)**:
```json
{
  "casoId": "<id-do-caso-aberto>"
}
```

**Possíveis respostas do backend**:

1. **Sucesso com IA funcionando**:
```json
{
  "ok": true,
  "resumo": "Texto gerado pela IA...",
  "mensagemSugerida": "Mensagem sugerida para cliente..."
}
```

2. **Sucesso mas IA falhou (erro tratado)**:
```json
{
  "ok": true,
  "resumo": null,
  "mensagemSugerida": null,
  "erroIA": "Serviço de IA temporariamente indisponível. O caso foi salvo normalmente."
}
```

3. **Erro de autenticação**:
```json
{
  "ok": false,
  "error": "Token inválido ou expirado"
}
```

4. **Erro de caso não encontrado**:
```json
{
  "ok": false,
  "error": "Caso não encontrado"
}
```

5. **Erro geral**:
```json
{
  "ok": false,
  "error": "Mensagem de erro do backend"
}
```

**Status codes esperados**:
- `200 OK` - Quando a requisição foi processada (mesmo que a IA tenha falhado)
- `400 Bad Request` - Quando o body está incorreto
- `401 Unauthorized` - Quando o token está inválido
- `403 Forbidden` - Quando o usuário não tem permissão para o caso
- `404 Not Found` - Quando o caso não existe
- `500 Internal Server Error` - Quando há erro no servidor

---

## 4. Como Capturar as Informações Reais

### Passos para diagnóstico:

1. **Rodar o frontend localmente**:
   ```bash
   npm run dev
   ```

2. **Abrir o navegador em**: `http://localhost:5173` (ou a porta que o Vite usar)

3. **Fazer login** com um usuário de teste

4. **Criar ou abrir um caso** existente

5. **Abrir DevTools** (F12 ou Cmd+Option+I)

6. **Aba Network**:
   - Limpar a lista (ícone de lixeira)
   - Filtrar por "XHR" ou "Fetch"
   - Clicar no botão "Gerar Parecer com IA"
   - Localizar a requisição `sugerir-resumo`
   - Clicar nela e ver:
     - **Headers** > **Request Headers**: Copiar todos os headers
     - **Payload** ou **Request**: Copiar o JSON do body
     - **Response**: Copiar o JSON completo da resposta
     - **Status Code**: Anotar o código HTTP

7. **Aba Console**:
   - Limpar o console
   - Clicar no botão "Gerar Parecer com IA"
   - Copiar qualquer erro em vermelho que apareça
   - Copiar qualquer log do tipo `[API]` que apareça

---

## 5. Próximos Passos

Após capturar as informações reais do Network e Console:

1. **Analisar a resposta do backend**:
   - Se `ok: true` mas `erroIA` presente → Ajustar tratamento para não mostrar como erro destrutivo
   - Se `ok: false` → Verificar qual é o erro específico e ajustar mensagem
   - Se status code diferente de 200 → Verificar se é erro de rede, CORS, ou backend

2. **Ajustar handleGenerateIA** conforme necessário

3. **Melhorar estilos do menu lateral** conforme solicitado

---

**NOTA**: Este arquivo serve como referência. As informações reais devem ser capturadas manualmente no navegador ao clicar no botão.


# Diagnóstico: IA não gera resumo em produção

**Data**: 2025-11-21

## Tarefa 1: Comparação Serviço de Teste vs Produção

### Serviços Cloud Run

**Produção**: `konzup-hub-backend`
- URL: `https://konzup-hub-backend-336386698724.us-central1.run.app`
- Imagem: `us-central1-docker.pkg.dev/ordem-em-dia/cloud-run-source-deploy/konzup-hub-backend@sha256:9b60256b...`
- Variáveis de ambiente:
  - `FIREBASE_PROJECT_ID=ordem-em-dia`
  - `GCLOUD_PROJECT=ordem-em-dia`
  - `LOCAL_STUB=false`
  - `VERTEX_AI_PROJECT_ID=carbon-bonsai-395917` ✅

**Teste**: `konzup-hub-backend-mvp2-test`
- URL: `https://konzup-hub-backend-mvp2-test-336386698724.us-central1.run.app`
- Imagem: `us-central1-docker.pkg.dev/ordem-em-dia/cloud-run-source-deploy/konzup-hub-backend-mvp2-test@sha256:f6d38759...`
- Variáveis de ambiente:
  - `VERTEX_AI_PROJECT_ID=carbon-bonsai-395917` ✅
  - `FIREBASE_PROJECT_ID=ordem-em-dia`
  - `GCLOUD_PROJECT=ordem-em-dia`
  - `LOCAL_STUB=false`

**Conclusão**: Ambos os serviços têm as mesmas variáveis de ambiente, incluindo `VERTEX_AI_PROJECT_ID=carbon-bonsai-395917`. As imagens são diferentes, indicando builds diferentes.

## Tarefa 2: Teste da Rota de IA em Produção

**URL de produção**: `https://konzup-hub-backend-336386698724.us-central1.run.app/api`

**Teste sem autenticação**:
```bash
curl -X POST https://konzup-hub-backend-336386698724.us-central1.run.app/api/ia/sugerir-resumo \
  -H "Content-Type: application/json" \
  -d '{"tipo":"atraso","descricao":"voo atrasou 5 horas","prazoDias":7}'
```

**Resposta**:
```json
{
  "ok": false,
  "error": "Token de autenticação não fornecido"
}
```

**Observação**: A rota requer autenticação. O frontend está enviando requisições autenticadas, mas recebendo `{ ok: true, erroIA: "..." }`.

## Tarefa 3: Inspeção da Implementação

### Arquivo: `backend/src/routes/ia.ts`

**Tratamento de erro** (linhas 134-163):
- Captura erros do `sugerirResumoCaso`
- Retorna `{ ok: true, resumo: null, mensagemSugerida: null, erroIA: "..." }` quando há erro
- Retorna `{ ok: false, error: "..." }` apenas em erros gerais não relacionados à IA

### Arquivo: `backend/src/services/gemini.ts`

**Inicialização do VertexAI** (linhas 29-48):
- Usa `VERTEX_AI_PROJECT_ID` do ambiente (carbon-bonsai-395917)
- Passa `project` e `location` no construtor
- **Problema potencial**: O SDK pode estar usando Application Default Credentials do projeto `ordem-em-dia` em vez de respeitar o parâmetro `project`

**Tratamento de erro** (linhas 112-129):
- Logs básicos, mas não detecta se o SDK está usando projeto errado
- Não verifica se o erro menciona projeto incorreto

## Tarefa 4: Diagnóstico Objetivo

### 1. Resposta atual em produção

Quando o frontend chama `/api/ia/sugerir-resumo`, o backend responde:
```json
{
  "ok": true,
  "resumo": null,
  "mensagemSugerida": null,
  "erroIA": "Não foi possível gerar resumo com IA no momento. O caso continua funcionando normalmente."
}
```

### 2. Projeto efetivo usado pelo Vertex AI

**Configuração**: `VERTEX_AI_PROJECT_ID=carbon-bonsai-395917` ✅

**Problema potencial**: O SDK `@google-cloud/vertexai` pode estar usando as Application Default Credentials do projeto `ordem-em-dia` (onde o Cloud Run está rodando) em vez de respeitar o parâmetro `project: carbon-bonsai-395917`.

**Evidência dos logs anteriores** (19/11):
- Erro mencionava `"project ordem-em-dia"` mesmo com `VERTEX_AI_PROJECT_ID=carbon-bonsai-395917`
- Após habilitar API no projeto `ordem-em-dia`, funcionou temporariamente

### 3. Tipo de erro

**Hipótese**: O SDK está usando o projeto `ordem-em-dia` (via ADC) em vez de `carbon-bonsai-395917` (parâmetro), resultando em erro de permissão ou modelo não encontrado.

## Tarefa 5: Correção Aplicada

### Mudanças em `backend/src/services/gemini.ts`

1. **Logs detalhados adicionados**:
   - Log da configuração na inicialização
   - Log antes de chamar o modelo
   - Log após receber resposta
   - Log detalhado de erros com detecção de projeto incorreto

2. **Detecção de projeto incorreto**:
   - Verifica se o erro menciona `ordem-em-dia` ou `336386698724`
   - Lança erro específico se detectar uso de projeto incorreto

3. **Mensagens de erro melhoradas**:
   - Erros específicos para permissão, modelo não encontrado, cota excedida
   - Erro específico quando detecta uso de projeto incorreto

### Próximos Passos

1. Fazer deploy do backend atualizado
2. Monitorar logs para ver qual projeto está sendo usado efetivamente
3. Se o problema persistir, considerar usar credenciais explícitas do projeto `carbon-bonsai-395917`


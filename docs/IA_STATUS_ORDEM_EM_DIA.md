# Status da IA no Ordem em Dia - Diagnóstico Completo

**Data do diagnóstico**: Janeiro 2025  
**Objetivo**: Mapear o estado atual da funcionalidade de IA e identificar o que precisa ser feito para ativá-la

---

## 1. O que a IA faz hoje no código

### Rota de IA

**Endpoint**: `POST /api/ia/sugerir-resumo`

**Localização no código**:
- Rota: `backend/src/routes/ia.ts`
- Serviço: `backend/src/services/gemini.ts`

### Input esperado

A rota espera um JSON com os seguintes campos:

```json
{
  "tipo": "atraso",
  "descricao": "voo atrasou 5 horas, passageiro perdeu conexão e ficou sem assistência",
  "prazoDias": 7
}
```

- **tipo** (string, obrigatório): Tipo de incidente (ex: "atraso", "cancelamento", "overbooking", "mudanca_voo", "extravio")
- **descricao** (string, obrigatório): Descrição detalhada do incidente
- **prazoDias** (number, obrigatório): Prazo em dias para ação

### Resposta gerada

A IA gera um resumo objetivo e profissional do caso, com as seguintes características:
- Máximo de 3 frases
- Escrito em português brasileiro
- Sem formatação (sem HTML, sem markdown)
- Destaca os pontos principais do incidente
- Menciona o prazo de forma natural

**Exemplo de resposta esperada**:
```json
{
  "ok": true,
  "resumo": "Caso de atraso de voo com 5 horas de espera, resultando em perda de conexão e falta de assistência ao passageiro. Prazo de 7 dias para medidas corretivas conforme regulamentação ANAC."
}
```

### Como se encaixa no produto

A funcionalidade de IA foi projetada para:
- **Gerar resumos automáticos de casos**: Ajudar agências a criar resumos profissionais de incidentes aéreos
- **Integração futura no PDF**: O código do PDF já tem um comentário indicando que no futuro o resumo pode vir da rota de IA
- **Automação de documentação**: Reduzir trabalho manual na criação de relatórios e documentação de casos

**Status atual**: A rota existe no backend mas **não está integrada no frontend**. Nenhum componente do dashboard chama essa rota atualmente.

---

## 2. Situação em produção

### Teste realizado

**Data**: Janeiro 2025  
**URL testada**: `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api/ia/sugerir-resumo`  
**Método**: POST

**Payload de teste**:
```json
{
  "tipo": "atraso",
  "descricao": "voo atrasou 5 horas, passageiro perdeu conexão",
  "prazoDias": 7
}
```

### Erro retornado

```json
{
  "ok": false,
  "error": "Sem permissão para acessar o Vertex AI. Verifique as credenciais."
}
```

### Logs do Cloud Run

Os logs mostram o erro detalhado:

```
status: 'PERMISSION_DENIED',
[cause]: GoogleApiError: Vertex AI API has not been used in project ordem-em-dia before or it is disabled. 
Enable it by visiting https://console.developers.google.com/apis/api/aiplatform.googleapis.com/overview?project=ordem-em-dia 
then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
```

**Erro raiz**: A API Vertex AI (aiplatform.googleapis.com) **não está habilitada** no projeto `ordem-em-dia`.

---

## 3. Diagnóstico técnico

### Configuração atual do código

**Arquivo**: `backend/src/services/gemini.ts`

**Configurações identificadas**:
- **Modelo**: `gemini-2.5-flash`
- **Projeto GCP**: Usa `process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'ordem-em-dia'`
  - Em produção, deve estar usando `ordem-em-dia` (fallback)
- **Região**: `us-central1`
- **Credenciais**: Em produção, usa Application Default Credentials do Cloud Run

**Service Account do Cloud Run**:
- **Email**: `336386698724-compute@developer.gserviceaccount.com`
- **Tipo**: Service account padrão do Compute Engine/Cloud Run

### Problemas identificados

#### 1. API Vertex AI não habilitada ❌

**Status**: A API `aiplatform.googleapis.com` **não está habilitada** no projeto `ordem-em-dia`.

**Evidência**:
- Logs do Cloud Run mostram erro explícito: "Vertex AI API has not been used in project ordem-em-dia before or it is disabled"
- Comando `gcloud services list --enabled` não retorna a API `aiplatform.googleapis.com` habilitada
- A API está **disponível** no projeto (aparece em `--available`), mas **não está habilitada**

**Impacto**: Mesmo que o service account tivesse todas as permissões, a API precisa estar habilitada primeiro.

#### 2. Permissões do Service Account (a verificar após habilitar API)

**Service Account atual**: `336386698724-compute@developer.gserviceaccount.com`

**Papéis necessários** (após habilitar a API):
- `roles/aiplatform.user` - Para usar modelos do Vertex AI
- Ou `roles/vertexai.user` - Papel específico do Vertex AI (se disponível)

**Status atual**: 
- O service account tem o papel `roles/editor` (papel amplo do GCP)
- **NÃO tem** o papel específico `roles/aiplatform.user` necessário para usar Vertex AI
- Mesmo que a API fosse habilitada, o service account precisaria do papel adicional

#### 3. Configuração do projeto (possível inconsistência)

**Observação no código**:
```typescript
// O arquivo JSON tem project_id: carbon-bonsai-395917, mas o Vertex AI pode estar no ordem-em-dia
const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'ordem-em-dia';
```

**Análise**:
- O código usa fallback para `ordem-em-dia`
- Em produção no Cloud Run, `GCLOUD_PROJECT` deve estar definido como `ordem-em-dia`
- O projeto correto parece ser `ordem-em-dia` (onde o Cloud Run está rodando)

**Recomendação**: Confirmar que a variável de ambiente `GCLOUD_PROJECT` está definida no Cloud Run como `ordem-em-dia`.

---

## 4. Ações necessárias

### Ações que eu (Tati) preciso fazer no Console do Google Cloud

#### 🔴 Crítico - Habilitar API Vertex AI

1. **Habilitar a API Vertex AI no projeto `ordem-em-dia`**
   - Acessar: https://console.developers.google.com/apis/api/aiplatform.googleapis.com/overview?project=ordem-em-dia
   - Clicar em "Habilitar"
   - Aguardar alguns minutos para propagação

2. **Verificar billing**
   - Confirmar que o projeto `ordem-em-dia` tem billing habilitado
   - Vertex AI requer billing ativo

#### 🟡 Importante - Configurar permissões

3. **Dar permissões ao Service Account do Cloud Run**
   - Service Account: `336386698724-compute@developer.gserviceaccount.com`
   - Papel necessário: `roles/aiplatform.user`
   - Como fazer:
     ```bash
     gcloud projects add-iam-policy-binding ordem-em-dia \
       --member="serviceAccount:336386698724-compute@developer.gserviceaccount.com" \
       --role="roles/aiplatform.user"
     ```
   - Ou via Console: IAM & Admin > IAM > Adicionar > Service Account > Papel "Vertex AI User"

4. **Verificar variáveis de ambiente no Cloud Run**
   - Confirmar que `GCLOUD_PROJECT=ordem-em-dia` está definido
   - Se não estiver, adicionar na configuração do serviço

#### 🟢 Opcional - Verificações adicionais

5. **Verificar quotas do Vertex AI**
   - Acessar: https://console.cloud.google.com/iam-admin/quotas?project=ordem-em-dia
   - Filtrar por "Vertex AI" ou "AI Platform"
   - Confirmar que não há limites restritivos

6. **Testar após configuração**
   - Fazer uma chamada de teste para `/api/ia/sugerir-resumo`
   - Verificar logs do Cloud Run para confirmar sucesso

---

### Ações que podem ser feitas via código (próxima rodada)

#### ✅ Melhorias no código

1. **Adicionar autenticação à rota de IA**
   - Atualmente a rota não requer autenticação
   - Adicionar middleware de autenticação para evitar uso indevido e controlar custos

2. **Melhorar tratamento de erros**
   - Adicionar mais detalhes nos logs para debug
   - Retornar mensagens de erro mais específicas (sem expor detalhes sensíveis)

3. **Adicionar validação de input**
   - Validar valores permitidos para `tipo` (enum)
   - Validar tamanho máximo de `descricao`
   - Validar range de `prazoDias`

4. **Otimizar o prompt**
   - Testar diferentes prompts para melhor qualidade de resposta
   - Adicionar contexto sobre regulamentação ANAC se necessário

5. **Adicionar cache/rate limiting**
   - Implementar cache para evitar chamadas repetidas
   - Adicionar rate limiting para controlar custos

#### ✅ Integração no frontend

6. **Criar componente de IA no frontend**
   - Botão "Gerar resumo com IA" na página de detalhes do caso
   - Mostrar loading durante geração
   - Exibir resumo gerado e permitir edição antes de salvar

7. **Integrar no PDF**
   - Usar o resumo gerado pela IA na seção "Resultado Final" do PDF
   - Manter opção de edição manual

8. **Adicionar feedback do usuário**
   - Permitir que o usuário avalie a qualidade do resumo
   - Coletar feedback para melhorar o prompt

---

## 5. Resumo executivo

### Estado atual da IA

❌ **A IA não está funcional em produção**

**Motivo principal**: A API Vertex AI não está habilitada no projeto `ordem-em-dia`.

**Status do código**:
- ✅ Backend implementado e funcional (código correto)
- ✅ Rota `/api/ia/sugerir-resumo` existe e está acessível
- ❌ API não habilitada no GCP
- ❌ Service account pode não ter permissões (a verificar após habilitar API)
- ❌ Frontend não integrado (não é bloqueador, mas não há UI para usar)

### Passos que dependem de você (Tati) no Console

1. **🔴 Habilitar API Vertex AI** no projeto `ordem-em-dia`
   - URL: https://console.developers.google.com/apis/api/aiplatform.googleapis.com/overview?project=ordem-em-dia
   - Clicar em "Habilitar" e aguardar propagação (alguns minutos)

2. **🔴 Dar papel `roles/aiplatform.user`** ao service account `336386698724-compute@developer.gserviceaccount.com`
   - **Status atual**: Service account tem apenas `roles/editor`, não tem permissão específica para Vertex AI
   - **Como fazer**: Via Console (IAM & Admin > IAM) ou via CLI (comando fornecido na seção 4)
   - **Importante**: Fazer isso APÓS habilitar a API

3. **🟡 Verificar variável `GCLOUD_PROJECT`** no Cloud Run (deve ser `ordem-em-dia`)
   - Verificar na configuração do serviço `konzup-hub-backend`
   - Se não estiver definido, adicionar

4. **🟢 Verificar billing** do projeto
   - Confirmar que billing está habilitado (Vertex AI requer billing ativo)

**Tempo estimado**: 10-15 minutos (mais tempo de propagação da API após habilitar)

### Recomendações para MVP 2.0 focado em ANAC

Após você habilitar a API e configurar permissões, recomendo na próxima rodada:

1. **Testar a rota de IA** para confirmar que está funcionando
2. **Adicionar autenticação** à rota para segurança
3. **Criar UI no frontend** para usar a IA:
   - Botão "Gerar resumo com IA" no detalhe do caso
   - Campo de texto editável para o resumo gerado
4. **Integrar no PDF**:
   - Usar resumo da IA na seção "Resultado Final"
   - Manter opção de edição manual
5. **Melhorar o prompt** com contexto ANAC:
   - Adicionar informações sobre regulamentação
   - Focar em prazos e obrigações legais
6. **Adicionar validações e tratamento de erros** robustos

**Prioridade**: Alta - A IA pode ser um diferencial importante para o produto, especialmente para agências que precisam gerar muitos relatórios.

---

**Próximos passos**: Após você habilitar a API e configurar permissões, podemos testar e integrar a IA no frontend em uma próxima rodada de desenvolvimento.


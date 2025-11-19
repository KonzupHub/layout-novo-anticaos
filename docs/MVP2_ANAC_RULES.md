# MVP 2.0 - Motor de Regras ANAC e IA

**Data**: Janeiro 2025  
**Versão**: MVP 2.0  
**Branch**: `mvp2-anac-rules`

---

## O que é o Ordem em Dia

O **Ordem em Dia** é um sistema de gestão de casos de incidentes aéreos para agências de turismo. Ele ajuda agências a organizar, acompanhar e documentar casos relacionados a atrasos, cancelamentos, overbooking e outros incidentes que afetam passageiros, sempre em conformidade com a **Resolução 400 da ANAC**.

O sistema permite:
- Criar e gerenciar casos de incidentes aéreos
- Acompanhar prazos e obrigações legais
- Gerar relatórios PDF profissionais
- Obter interpretações automáticas da Resolução 400
- Gerar pareceres com inteligência artificial

---

## O que mudou no MVP 2.0

### Novos Campos no Modelo de Caso

O modelo de caso foi estendido com campos opcionais para capturar mais informações sobre o voo:

- `numeroVoo`: Número do voo (ex: LA1234)
- `dataVoo`: Data do voo (formato: YYYY-MM-DD ou DD/MM/YYYY)
- `horarioPrevisto`: Horário previsto de partida (formato: HH:MM)
- `horarioReal`: Horário real de partida (formato: HH:MM)
- `origem`: Aeroporto de origem
- `destino`: Aeroporto de destino
- `canalVenda`: Canal de venda (ex: "Site", "Agência física")
- `consolidadora`: Nome da consolidadora, se aplicável
- `timelineIncidente`: Campo de texto separado para descrever a linha do tempo do incidente
- `resumoIa`: Resumo gerado automaticamente pela IA
- `mensagemSugerida`: Mensagem sugerida para comunicação com o passageiro

### Motor de Regras da Resolução 400

Foi criado um **motor de regras** que interpreta automaticamente cada caso segundo a Resolução 400 da ANAC. Este motor:

1. **Categoriza o incidente** conforme a regulamentação
2. **Calcula prazos importantes** baseados no tipo de incidente e data do voo
3. **Lista direitos básicos** aplicáveis ao passageiro
4. **Gera alertas operacionais** quando prazos estão próximos ou vencidos

### Integração com IA

A rota de IA (`/api/ia/sugerir-resumo`) foi aprimorada para:

- Aceitar `casoId` opcional para buscar dados completos do caso
- Receber contexto de prazos ANAC do motor de regras
- Gerar resumos mais precisos e contextualizados
- Tratar erros de forma segura (não quebra o fluxo do caso)

### Interface do Usuário

A tela de detalhe do caso agora inclui:

- **Seção "Interpretação ANAC"**: Mostra categoria, direitos, prazos e alertas
- **Seção "Resumo do Caso (IA)"**: Campos editáveis para resumo e mensagem sugerida
- **Botão "Gerar Parecer com IA"**: Chama o backend para gerar resumo automaticamente

### PDF Atualizado

O PDF gerado agora inclui:

- **Seção "Cumprimento de Prazos ANAC"**: Dados reais do motor de regras (substitui texto genérico)
- **Seção "Resultado Final"**: Usa `resumoIa` quando disponível

---

## Como funciona o motor de regras da Resolução 400

### Arquivo Principal

**Localização**: `backend/src/services/anacRules.ts`

**Função principal**: `interpretarCasoANAC(caso: Case): AnacResumo`

### Fluxo de Funcionamento

1. **Recebe um caso** completo (com todos os campos, incluindo os novos)
2. **Identifica o tipo** de incidente (`atraso`, `cancelamento`, `overbooking`, `mudanca_voo`, `extravio`)
3. **Calcula prazos** baseados em:
   - Tipo de incidente
   - Data do voo (se disponível)
   - Data atual
4. **Retorna objeto estruturado** com:
   - Categoria do incidente
   - Direitos básicos aplicáveis
   - Lista de prazos importantes (com status: dentro_prazo, proximo_vencer, vencido)
   - Alertas operacionais

### Exemplo de Resposta do Motor

```typescript
{
  categoriaIncidente: "Atraso de voo superior a 4 horas",
  direitosBasicos: [
    "Assistência material (alimentação, comunicação, hospedagem se necessário)",
    "Reembolso proporcional ou reacomodação em voo alternativo",
    "Compensação financeira se atraso superior a 4 horas"
  ],
  prazosImportantes: [
    {
      descricao: "Oferecer assistência material ou reembolso",
      prazoDias: 7,
      prazoLimite: "2025-01-25T00:00:00.000Z",
      status: "dentro_prazo",
      diasRestantes: 3
    }
  ],
  alertasOperacionais: []
}
```

---

## Cenários cobertos pelo motor

### ✅ Cenários Implementados

1. **Atraso maior que 4 horas**
   - Prazo: 7 dias para oferecer assistência material ou reembolso
   - Direitos: Assistência material, reembolso/reacomodação, compensação financeira

2. **Cancelamento**
   - Prazo: 7 dias para oferecer reacomodação ou reembolso
   - Direitos: Reacomodação sem custo, reembolso integral, assistência material

3. **Overbooking (Preterição)**
   - Prazo: Imediato para reacomodação + 7 dias para compensação
   - Direitos: Reacomodação imediata, compensação financeira, assistência material

4. **Mudança de voo**
   - Prazo: Comunicação imediata
   - Direitos: Comunicação prévia, assento equivalente, assistência se necessário

5. **Extravio de bagagem**
   - Prazo: Assistência emergencial imediata + 7 dias para localização
   - Direitos: Assistência emergencial, localização em 7 dias, compensação se não localizada

### ❌ Cenários não cobertos ainda

1. **Atrasos menores que 4 horas**: Não são cobertos pela Resolução 400, mas podem ser registrados no sistema
2. **Casos complexos**: Situações com múltiplos incidentes simultâneos
3. **Variações regionais**: Regras específicas de outros países ou acordos bilaterais
4. **Casos de força maior**: Situações excepcionais que podem alterar prazos
5. **Integração com dados externos**: Não busca status real de voos ou informações de companhias aéreas
6. **Cálculo de compensação financeira**: Valores específicos não são calculados, apenas mencionados

### Limitações conhecidas

- **Versão simplificada inicial**: O código está comentado indicando que é uma primeira versão do trilho de regras
- **Prazos fixos**: Baseados apenas no tipo de incidente, sem considerar outros fatores contextuais
- **Sem validação de data**: Não valida se a data do voo é futura ou passada
- **Alertas básicos**: Apenas baseados em status de prazo, sem análise mais profunda

---

## Como a rota de IA é chamada pelo backend

### Endpoint

**Rota**: `POST /api/ia/sugerir-resumo`  
**Autenticação**: Obrigatória (Bearer token)

### Modo 1: Com casoId (Recomendado - MVP 2.0)

**Payload**:
```json
{
  "casoId": "abc123def456"
}
```

**Fluxo**:
1. Backend busca o caso completo do banco de dados
2. Verifica permissão (caso pertence ao CNPJ do usuário)
3. Calcula interpretação ANAC usando `interpretarCasoANAC(caso)`
4. Monta prompt com:
   - Tipo de incidente
   - Descrição (usa `timelineIncidente` ou `notas`)
   - Prazo em dias (calculado a partir dos prazos ANAC)
   - Contexto completo da Resolução 400 (categoria, prazos, direitos)
5. Chama Vertex AI no projeto `carbon-bonsai-395917`
6. Retorna resumo e mensagem sugerida

**Resposta de sucesso**:
```json
{
  "ok": true,
  "resumo": "Caso de atraso de voo com 5 horas de espera, resultando em perda de conexão. Prazo de 7 dias para oferecer assistência material ou reembolso conforme Resolução 400 da ANAC.",
  "mensagemSugerida": "Informamos que conforme Resolução 400 da ANAC, você tem direito a: Assistência material (alimentação, comunicação, hospedagem se necessário). Estamos trabalhando para resolver seu caso."
}
```

**Resposta quando IA falha** (mas não quebra o fluxo):
```json
{
  "ok": true,
  "resumo": null,
  "mensagemSugerida": null,
  "erroIA": "Serviço de IA temporariamente indisponível. O caso foi salvo normalmente."
}
```

### Modo 2: Simples (Compatibilidade - MVP 1.0)

**Payload**:
```json
{
  "tipo": "atraso",
  "descricao": "voo atrasou 5 horas, passageiro perdeu conexão",
  "prazoDias": 7
}
```

**Resposta**: Mesma estrutura do Modo 1, mas sem contexto ANAC no prompt.

### Tratamento de Erros

O backend trata erros de forma segura:

1. **Log completo no servidor**: Todos os erros são logados com detalhes (tipo, casoId, CNPJ, stack trace)
2. **Mensagem amigável no frontend**: Erros técnicos são convertidos em mensagens simples
3. **Fluxo não quebrado**: Se a IA falhar, o caso continua funcionando normalmente (sem resumo, mas salvo)

**Erros tratados**:
- `PERMISSION_DENIED`: "Serviço de IA temporariamente indisponível"
- `QUOTA_EXCEEDED`: "Limite de uso de IA atingido"
- Outros: "Não foi possível gerar resumo com IA no momento"

---

## Project ID do Vertex AI

### Configuração

**Sempre usa**: `carbon-bonsai-395917`

**Arquivo**: `backend/src/services/gemini.ts`

**Código**:
```typescript
const VERTEX_AI_PROJECT_ID = process.env.VERTEX_AI_PROJECT_ID || 'carbon-bonsai-395917';
```

### Por que este projeto?

- O Cloud Run roda no projeto `ordem-em-dia`
- Mas as chamadas de Vertex AI devem usar `carbon-bonsai-395917` (onde existem créditos)
- Esta separação permite que o backend rode em um projeto e a IA use créditos de outro

### Variável de Ambiente

**Recomendação**: Definir `VERTEX_AI_PROJECT_ID=carbon-bonsai-395917` no Cloud Run para garantir consistência, mas o código já tem fallback para este valor.

---

## Exemplos de Payload e Resposta

### Exemplo 1: Criar caso com novos campos

**Request**: `POST /api/cases`
```json
{
  "passageiro": "Maria Silva",
  "localizador": "ABC123",
  "fornecedor": "LATAM",
  "tipo": "atraso",
  "prazo": "Hoje, 18h",
  "status": "em_andamento",
  "responsavel": {
    "nome": "João Santos"
  },
  "numeroVoo": "LA1234",
  "dataVoo": "2025-01-20",
  "horarioPrevisto": "14:30",
  "horarioReal": "19:45",
  "origem": "GRU",
  "destino": "GIG",
  "timelineIncidente": "Voo atrasou 5 horas devido a problemas técnicos. Passageiro perdeu conexão."
}
```

**Response**: `201 Created`
```json
{
  "ok": true,
  "data": {
    "id": "abc123",
    "passageiro": "Maria Silva",
    "localizador": "ABC123",
    "fornecedor": "LATAM",
    "tipo": "atraso",
    "anacResumo": {
      "categoriaIncidente": "Atraso de voo superior a 4 horas",
      "direitosBasicos": [...],
      "prazosImportantes": [...],
      "alertasOperacionais": []
    },
    ...
  }
}
```

### Exemplo 2: Gerar resumo com IA

**Request**: `POST /api/ia/sugerir-resumo`
```json
{
  "casoId": "abc123"
}
```

**Response**: `200 OK`
```json
{
  "ok": true,
  "resumo": "Caso de atraso de voo com 5 horas de espera, resultando em perda de conexão. Prazo de 7 dias para oferecer assistência material ou reembolso conforme Resolução 400 da ANAC.",
  "mensagemSugerida": "Informamos que conforme Resolução 400 da ANAC, você tem direito a: Assistência material (alimentação, comunicação, hospedagem se necessário). Estamos trabalhando para resolver seu caso."
}
```

### Exemplo 3: Atualizar caso com resumo da IA

**Request**: `PATCH /api/cases/abc123`
```json
{
  "resumoIa": "Caso de atraso de voo com 5 horas de espera...",
  "mensagemSugerida": "Informamos que conforme Resolução 400..."
}
```

**Response**: `200 OK`
```json
{
  "ok": true,
  "data": {
    "id": "abc123",
    "resumoIa": "Caso de atraso de voo com 5 horas de espera...",
    "mensagemSugerida": "Informamos que conforme Resolução 400...",
    "anacResumo": {...},
    ...
  }
}
```

---

## Arquitetura Técnica

### Fluxo Completo

```
Frontend (CasoDetail.tsx)
  ↓
  Clica "Gerar Parecer com IA"
  ↓
  Chama api.generateCaseSummary(casoId)
  ↓
Backend (routes/ia.ts)
  ↓
  Busca caso completo do banco
  ↓
  Calcula interpretação ANAC (anacRules.ts)
  ↓
  Monta prompt com contexto ANAC
  ↓
  Chama Vertex AI (gemini.ts)
    - Project ID: carbon-bonsai-395917
    - Modelo: gemini-2.5-flash
    - Região: us-central1
  ↓
  Retorna resumo e mensagem sugerida
  ↓
Frontend
  ↓
  Preenche campos resumoIa e mensagemSugerida
  ↓
  Usuário edita se necessário
  ↓
  Salva caso (PATCH /api/cases/:id)
```

### Integração com PDF

Quando o PDF é gerado (`POST /api/cases/:id/pdf`):

1. Busca caso completo (incluindo `resumoIa` e novos campos)
2. Calcula interpretação ANAC
3. Gera PDF com:
   - Seção "Cumprimento de Prazos ANAC" usando dados reais do motor
   - Seção "Resultado Final" usando `resumoIa` se disponível

---

## Notas Importantes

- **Todos os novos campos são opcionais**: O sistema continua funcionando com casos criados no MVP 1.0
- **Compatibilidade retroativa**: Casos antigos recebem interpretação ANAC mesmo sem os novos campos
- **IA não é obrigatória**: Se a IA falhar, o caso continua funcionando normalmente
- **Validações leves**: Formatos básicos são validados, mas não bloqueiam o usuário excessivamente

---

## Resultados dos Testes Automatizados

### Builds

- ✅ **Backend**: Compilação TypeScript sem erros
- ✅ **Frontend**: Build Vite sem erros

### Testes Unitários

- ✅ **PDF Service**: 2 testes passando
  - Gera PDF válido para um caso
  - Gera PDF mesmo sem observações
- ✅ **CSV Service**: 2 testes passando
- ⚠️ **Correção aplicada**: Removidos emojis Unicode do PDF (não suportados pela fonte padrão)

### Limitações Conhecidas Identificadas nos Testes

1. **Emojis no PDF**: Fonte padrão (WinAnsi) não suporta emojis Unicode
   - **Solução aplicada**: Substituídos por prefixos textuais `[OK]`, `[PROXIMO]`, `[VENCIDO]`

2. **Testes do motor de regras**: Não há testes unitários específicos para `anacRules.ts`
   - **Recomendação**: Adicionar testes unitários em próxima iteração

3. **Testes de integração IA**: Não há testes automatizados para a rota de IA
   - **Recomendação**: Adicionar testes de integração mockando Vertex AI

---

**Última atualização**: Janeiro 2025  
**Status dos testes**: ✅ Todos os testes automatizados passando  
**Próximos passos**: Testes manuais conforme roteiro em `TESTES_MVP2.md`


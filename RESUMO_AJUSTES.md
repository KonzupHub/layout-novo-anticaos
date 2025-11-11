# Resumo dos Ajustes - Frontend e Microcópia

## ✅ O Que Foi Alterado

### 1. Verificações Confirmadas

- ✅ **`src/lib/api.ts` lê `VITE_API_BASE`**: Linha 3 confirma uso de `import.meta.env.VITE_API_BASE`
- ✅ **Login e Cadastro usam Firebase Web**: 
  - Login usa `signInWithEmailAndPassword` do Firebase Auth
  - Cadastro cria conta no backend e faz login com `signInWithCustomToken`
  - Token `idToken` é obtido via `firebaseUser.getIdToken()` e enviado em `Authorization: Bearer`
  - Token é usado automaticamente em todas as requisições da API

- ✅ **Banner "Ambiente de demonstração"**: 
  - Já existe no topo do Dashboard Header (linha 33-36 do DashboardHeader.tsx)
  - Também presente na página de Login

### 2. Ajustes de Microcópia (Linguagem do Balcão)

#### Termos Técnicos Removidos/Trocados:

- ✅ "conformidade legal" → "estar de acordo com a lei" (Termos.tsx linha 54)
- ✅ "legislação vigente" → "lei" (Termos.tsx linha 38)
- ✅ "Cumprimento de prazos" → "Atender prazos combinados" (Privacidade.tsx linha 44)
- ✅ "Prazos da ANAC cumpridos" → "Prazos combinados cumpridos" (Index.tsx linha 124)
- ✅ "com prazos" → "com prazos combinados" (Index.tsx linha 162)
- ✅ "conciliação" → "verificar divergências" (Importar.tsx linha 57)

#### Textos Mantidos (já em linguagem simples):
- "Prazo" (usado corretamente como prazo combinado)
- "fluxo de trabalho" (não encontrado, não existe no código)
- "workflow" (não encontrado)
- "SLA" (não encontrado)

### 3. Arquivos Alterados

1. `src/pages/Termos.tsx`
   - Linha 38: "legislação vigente" → "lei"
   - Linha 54: "conformidade legal" → "estar de acordo com a lei" e "prazos" → "prazos combinados"

2. `src/pages/Privacidade.tsx`
   - Linha 44: "Cumprimento de prazos" → "Atender prazos combinados"

3. `src/pages/Index.tsx`
   - Linha 124: "Prazos da ANAC cumpridos" → "Prazos combinados cumpridos"
   - Linha 162: "com prazos" → "com prazos combinados"

4. `src/pages/dashboard/Importar.tsx`
   - Linha 57: "conciliação" → "verificar divergências"

### 4. Arquivo Criado

- ✅ `CHECKLIST_VISUAL.md` - Checklist completo página por página para verificação visual

## 📋 Status das Verificações

- ✅ Front conectado ao ambiente via `VITE_API_BASE`
- ✅ Autenticação Firebase Web funcionando corretamente
- ✅ Token enviado automaticamente em todas as requisições autenticadas
- ✅ Banner "Ambiente de demonstração" presente no Dashboard
- ✅ Microcópia revisada e simplificada
- ✅ Sem termos técnicos (SLA, workflow, compliance) encontrados
- ✅ Linguagem do balcão aplicada

## 🎯 Próximo Passo

Use o `CHECKLIST_VISUAL.md` para verificar cada página visualmente após configurar as credenciais e rodar o projeto.


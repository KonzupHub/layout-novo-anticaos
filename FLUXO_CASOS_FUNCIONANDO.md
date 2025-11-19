# Fluxo de Casos Funcionando em Produção

## Rotas do Backend em Produção

Todas as rotas abaixo estão funcionando em: `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api`

### Rotas de Casos (requerem autenticação)

1. **GET /api/cases**
   - Lista todos os casos do usuário autenticado
   - Suporta filtros opcionais: `?status=em_andamento&tipo=atraso`
   - Retorna: Array de casos

2. **POST /api/cases**
   - Cria um novo caso
   - Campos obrigatórios: `passageiro`, `localizador`, `fornecedor`, `tipo`, `prazo`, `status`, `responsavel.nome`
   - Campos opcionais: `notas`, `responsavel.avatar`
   - Retorna: Caso criado com ID

3. **GET /api/cases/:id**
   - Busca um caso específico por ID
   - Verifica se o caso pertence ao CNPJ do usuário
   - Retorna: Dados completos do caso

4. **PATCH /api/cases/:id**
   - Atualiza campos de um caso existente
   - Campos permitidos: `status`, `responsavel`, `notas`, `prazo`
   - Verifica se o caso pertence ao CNPJ do usuário
   - Retorna: Caso atualizado

5. **POST /api/cases/:id/pdf**
   - Gera PDF do caso e faz upload no Cloud Storage
   - Retorna: URL assinada para download do PDF

### Rota Pública (não requer autenticação)

- **GET /api/cases/examples** - Retorna casos de exemplo para a landing page

---

## Componentes do Frontend Usando Dados Reais

### 1. Página "Hoje" (`src/pages/dashboard/Hoje.tsx`)
- ✅ Usa `api.getCases()` para carregar casos reais
- ✅ Calcula estatísticas reais (vence hoje, em 24h, novos na semana)
- ✅ Exibe lista de casos prioritários
- ✅ Link para ver detalhes de cada caso

### 2. Página "Casos" (`src/pages/dashboard/Casos.tsx`)
- ✅ Usa `api.getCases()` para listar todos os casos
- ✅ Usa `api.createCase()` para criar novos casos
- ✅ Formulário completo de criação com validação
- ✅ Busca/filtro de casos
- ✅ Link para ver detalhes de cada caso

### 3. Página "Detalhes do Caso" (`src/pages/dashboard/CasoDetail.tsx`)
- ✅ Usa `api.getCaseById()` para carregar dados do caso
- ✅ Usa `api.updateCase()` para salvar alterações
- ✅ Formulário de edição (status, responsável, prazo, notas)
- ✅ Botão para gerar PDF (usa `api.generateCasePDF()`)

---

## Como Usar (Fluxo Completo)

### 1. Entrar na Página "Casos"
- Após fazer login, clique em **"Casos"** no menu lateral
- Você verá a lista de todos os seus casos (ou mensagem se não houver nenhum)

### 2. Criar um Novo Caso
- Clique no botão **"Novo caso"** (canto superior direito)
- Preencha o formulário:
  - **Passageiro**: Nome do passageiro
  - **Localizador**: Código do voo (ex: ABC123)
  - **Fornecedor**: Companhia aérea (ex: LATAM, GOL, AZUL)
  - **Tipo**: Selecione (Atraso > 4h, Cancelamento, Overbooking, Mudança de voo)
  - **Prazo**: Data/hora do prazo (ex: "Hoje, 18h" ou "2025-01-20T18:00:00Z")
  - **Status**: Selecione (Em andamento, Aguardando resposta, Documentação pendente, Encerrado)
  - **Responsável**: Nome do responsável
  - **Observações**: (opcional) Notas sobre o caso
- Clique em **"Criar caso"**
- O caso será criado e aparecerá na lista

### 3. Ver Detalhes de um Caso
- Na lista de casos, clique no botão **"Ver caso"** de qualquer caso
- Você verá:
  - Informações do caso (passageiro, localizador, fornecedor, tipo)
  - Status atual com badge colorido
  - Formulário de edição

### 4. Editar um Caso
- Na página de detalhes, use o formulário "Editar Caso":
  - Altere o **Status** (dropdown)
  - Altere o **Responsável** (campo de texto)
  - Altere o **Prazo** (campo de texto)
  - Altere as **Observações** (textarea)
- Clique em **"Salvar alterações"**
- As alterações serão salvas e você verá uma mensagem de sucesso

---

## Observações Importantes

- Todas as rotas requerem autenticação (token JWT do Firebase)
- Os casos são filtrados automaticamente pelo CNPJ do usuário logado
- Você só pode ver/editar casos da sua própria agência
- O campo "prazo" aceita qualquer formato de texto (ex: "Hoje, 18h" ou ISO 8601)
- O PDF é gerado e salvo no Cloud Storage, retornando uma URL assinada

---

## Status das Páginas

✅ **Funcionando com dados reais:**
- Hoje
- Casos
- Detalhes do Caso

⚠️ **Páginas com "Em breve" (não fazem parte do CRUD de casos):**
- Importar
- Relatórios
- Conta
- Modelos
- Ajuda


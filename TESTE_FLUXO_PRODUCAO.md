# Checklist de Teste do Fluxo Completo em Produção

## Status dos Testes Automatizados

✅ **Backend Health Check**: Funcionando
✅ **Rota de Exemplos**: Funcionando
✅ **Backend em Produção**: `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app`

## Frontend

🌐 **URL de Produção**: `https://ordem.konzuphub.com`

---

## Checklist de Testes Manuais

### 1. Teste de Autenticação

- [ ] **Cadastro de Nova Conta**
  - Acesse: `https://ordem.konzuphub.com`
  - Clique em "Começar agora" ou "Cadastrar"
  - Preencha o formulário:
    - Email válido
    - Senha (mínimo 6 caracteres)
    - CNPJ da agência
    - Nome da agência
    - Cidade
    - Nome completo
  - Verifique se a conta é criada e o login é feito automaticamente
  - ✅ **Resultado esperado**: Redirecionamento para o dashboard

- [ ] **Login**
  - Se já tiver conta, faça logout
  - Clique em "Entrar"
  - Digite email e senha
  - ✅ **Resultado esperado**: Login bem-sucedido e redirecionamento para dashboard

---

### 2. Teste da Página "Hoje"

- [ ] **Carregamento da Página**
  - Após login, verifique se a página "Hoje" carrega
  - ✅ **Resultado esperado**: 
    - Três cartões de resumo (Vence hoje, Em 24 horas, Novos na semana)
    - Lista de casos prioritários (ou mensagem "Nenhum caso prioritário encontrado")

- [ ] **Cartões de Resumo**
  - Verifique se os números nos cartões refletem os casos reais
  - ✅ **Resultado esperado**: Números calculados corretamente a partir dos casos

- [ ] **Lista de Casos**
  - Se houver casos, verifique se aparecem na tabela (desktop) ou cards (mobile)
  - Clique em "Ver caso" em um caso
  - ✅ **Resultado esperado**: Redirecionamento para página de detalhes do caso

---

### 3. Teste da Página "Casos"

- [ ] **Listagem de Casos**
  - Navegue para a página "Casos" no menu lateral
  - ✅ **Resultado esperado**: Lista completa de todos os casos

- [ ] **Criar Novo Caso**
  - Clique no botão "Criar novo caso"
  - Preencha o formulário:
    - Passageiro: Nome do passageiro
    - Localizador: Código do voo (ex: ABC123)
    - Fornecedor: Companhia aérea (ex: LATAM)
    - Tipo: Selecione um tipo (Atraso, Cancelamento, etc.)
    - Prazo: Data e hora do prazo
    - Status: Selecione um status
    - Responsável: Nome do responsável
    - Notas: Observações sobre o caso
  - Clique em "Salvar Caso"
  - ✅ **Resultado esperado**: 
    - Caso criado com sucesso
    - Mensagem de sucesso exibida
    - Lista de casos atualizada
    - Dialog fechado

- [ ] **Verificar Caso Criado**
  - Verifique se o caso aparece na lista
  - Clique em "Ver caso" no caso recém-criado
  - ✅ **Resultado esperado**: Página de detalhes carrega com os dados corretos

---

### 4. Teste da Página de Detalhes do Caso

- [ ] **Carregamento dos Dados**
  - Na página de detalhes, verifique se todos os dados do caso aparecem corretamente
  - ✅ **Resultado esperado**: 
    - Passageiro, localizador, fornecedor
    - Tipo e status com badges coloridos
    - Prazo
    - Responsável
    - Notas

- [ ] **Editar Caso**
  - Altere o status (ex: de "em_andamento" para "resolvido")
  - Altere o responsável
  - Adicione ou edite as notas
  - Altere o prazo
  - Clique em "Salvar alterações"
  - ✅ **Resultado esperado**: 
    - Alterações salvas com sucesso
    - Mensagem de sucesso exibida
    - Dados atualizados na tela

- [ ] **Gerar PDF**
  - Clique no botão "Gerar PDF"
  - Aguarde o processamento
  - ✅ **Resultado esperado**: 
    - PDF gerado e baixado automaticamente
    - Ou link para download do PDF exibido
    - PDF contém todas as informações do caso formatadas

---

### 5. Teste de Navegação

- [ ] **Navegação entre Páginas**
  - Teste navegar entre:
    - Hoje → Casos → Detalhes do Caso
    - Casos → Detalhes do Caso → Voltar para Casos
  - ✅ **Resultado esperado**: Navegação fluida, sem erros

- [ ] **Links e Botões**
  - Verifique se todos os links "Ver caso" funcionam
  - Verifique se o botão de logout funciona
  - ✅ **Resultado esperado**: Todos os links e botões funcionam corretamente

---

### 6. Teste de Responsividade

- [ ] **Desktop**
  - Teste em resolução desktop (1920x1080 ou similar)
  - ✅ **Resultado esperado**: Layout em tabela, todos os elementos visíveis

- [ ] **Tablet**
  - Teste em resolução tablet (768px ou similar)
  - ✅ **Resultado esperado**: Layout adaptado, cards em vez de tabela

- [ ] **Mobile**
  - Teste em resolução mobile (375px ou similar)
  - ✅ **Resultado esperado**: Layout mobile otimizado, cards empilhados

---

### 7. Teste de Erros

- [ ] **Caso Não Encontrado**
  - Tente acessar uma URL de caso inexistente: `/dashboard/caso/inexistente`
  - ✅ **Resultado esperado**: Mensagem de erro amigável ou redirecionamento

- [ ] **Sem Conexão**
  - Desative a internet temporariamente
  - Tente criar ou editar um caso
  - ✅ **Resultado esperado**: Mensagem de erro de conexão exibida

- [ ] **Token Expirado**
  - Aguarde o token expirar (ou force logout)
  - Tente acessar uma página protegida
  - ✅ **Resultado esperado**: Redirecionamento para login

---

## Testes Automatizados com Token

Para testar as rotas autenticadas via script:

1. Faça login no frontend
2. Abra o DevTools (F12) > Network
3. Faça uma requisição qualquer (ex: listar casos)
4. Copie o token do header `Authorization: Bearer <TOKEN>`
5. Execute:
   ```bash
   ./test-production-flow.sh <TOKEN>
   ```

Isso testará:
- ✅ Listar casos
- ✅ Criar caso
- ✅ Buscar caso por ID
- ✅ Atualizar caso
- ✅ Gerar PDF

---

## Problemas Conhecidos

Nenhum problema conhecido no momento.

---

## Notas

- O backend está rodando em modo **não-stub** (produção real)
- Todas as rotas de casos requerem autenticação (exceto `/api/cases/examples`)
- O frontend está hospedado na Cloudflare Pages
- O backend está hospedado no Google Cloud Run

---

## Resultado Final

Após completar todos os testes, marque aqui:

- [ ] ✅ Todos os testes passaram
- [ ] ⚠️ Alguns testes falharam (descreva abaixo)
- [ ] ❌ Muitos testes falharam (descreva abaixo)

**Observações finais:**

_________________________________________________
_________________________________________________
_________________________________________________


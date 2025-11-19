# Roteiro de Testes Manuais - MVP 2.0

**Data**: Janeiro 2025  
**Versão**: MVP 2.0  
**Objetivo**: Validar funcionalidades do motor de regras ANAC e integração com IA

---

## Pré-requisitos

1. **Acesso ao sistema**: Frontend em `https://ordem.konzuphub.com` (ou ambiente local)
2. **Conta de teste**: Use a conta de teste existente no sistema
   - Email: `teste@konzup.com`
   - Senha: (consulte documentação interna ou configure uma nova conta)
3. **Navegador**: Chrome, Firefox ou Safari atualizado
4. **DevTools**: Abra o DevTools (F12) para monitorar requisições e erros

---

## Roteiro de Testes

### 1. Criar Novo Caso com Campos Novos

**Objetivo**: Validar que os novos campos são aceitos e salvos corretamente.

**Passos**:
1. Faça login no sistema
2. Vá para a página **Casos** (menu lateral ou `/dashboard/casos`)
3. Clique no botão **"Novo caso"** (canto superior direito)
4. Preencha os campos obrigatórios:
   - Passageiro: `Maria Silva`
   - Localizador: `ABC123`
   - Fornecedor: `LATAM`
   - Tipo: `Atraso > 4h`
   - Prazo: `Hoje, 18h`
   - Status: `Em andamento`
   - Responsável: `João Santos`
5. Preencha os **novos campos opcionais**:
   - Número de voo: `LA1234`
   - Data do voo: `2025-01-20` (ou `20/01/2025`)
   - Horário previsto: `14:30`
   - Horário real: `19:45`
   - Origem: `GRU`
   - Destino: `GIG`
   - Canal de venda: `Site`
   - Consolidadora: `CVC`
   - Linha do tempo do incidente: `Voo atrasou 5 horas devido a problemas técnicos. Passageiro perdeu conexão e ficou sem assistência.`
6. Clique em **"Criar caso"**

**Resultado esperado**:
- ✅ Caso é criado com sucesso
- ✅ Toast de sucesso aparece
- ✅ Modal fecha
- ✅ Caso aparece na lista de casos
- ✅ Todos os campos novos são salvos

**Validações a testar**:
- ❌ Tentar criar com localizador inválido (ex: `ABC`) → Deve mostrar erro
- ❌ Tentar criar com número de voo inválido (ex: `1234`) → Deve mostrar erro
- ❌ Tentar criar com data inválida (ex: `20-01-2025`) → Deve mostrar erro
- ❌ Tentar criar com horário inválido (ex: `14:30:00`) → Deve mostrar erro

---

### 2. Ver Interpretação ANAC

**Objetivo**: Validar que a seção "Interpretação ANAC" aparece e mostra dados corretos.

**Passos**:
1. Na lista de casos, clique em **"Ver caso"** no caso criado anteriormente
2. Role a página até a seção **"Interpretação ANAC"**

**Resultado esperado**:
- ✅ Seção "Interpretação ANAC" aparece abaixo dos cards de informações
- ✅ Mostra **Categoria do Incidente**: "Atraso de voo superior a 4 horas"
- ✅ Mostra **Direitos Básicos Aplicáveis** com lista de direitos:
  - Assistência material (alimentação, comunicação, hospedagem se necessário)
  - Reembolso proporcional ou reacomodação em voo alternativo
  - Compensação financeira se atraso superior a 4 horas
- ✅ Mostra **Prazos Importantes** com:
  - Descrição do prazo
  - Dias restantes (se calculável)
  - Status visual (badge colorido: verde/amarelo/vermelho)
- ✅ Se houver alertas, mostra **Alertas Operacionais**

**Validações a testar**:
- ✅ Testar com diferentes tipos de incidente:
  - Atraso → Deve mostrar prazo de 7 dias
  - Cancelamento → Deve mostrar prazo de 7 dias para reacomodação
  - Overbooking → Deve mostrar prazo imediato + 7 dias
  - Mudança de voo → Deve mostrar comunicação imediata
  - Extravio → Deve mostrar assistência imediata + 7 dias

---

### 3. Usar Botão de Parecer com IA

**Objetivo**: Validar que o botão gera resumo e mensagem sugerida corretamente.

**Passos**:
1. Na página de detalhes do caso, role até a seção **"Resumo do Caso (IA)"**
2. Clique no botão **"Gerar Parecer com IA"**
3. Aguarde o processamento (pode levar alguns segundos)

**Resultado esperado (sucesso)**:
- ✅ Botão mostra estado de loading ("Gerando com IA...")
- ✅ Toast de sucesso aparece: "Resumo gerado com sucesso"
- ✅ Campo **"Resumo"** é preenchido automaticamente com texto gerado pela IA
- ✅ Campo **"Mensagem Sugerida para Cliente"** é preenchido automaticamente
- ✅ Resumo menciona o tipo de incidente e prazos da Resolução 400
- ✅ Mensagem sugerida menciona direitos do passageiro

**Resultado esperado (quando IA falha)**:
- ✅ Toast aparece: "IA indisponível" ou mensagem similar
- ✅ Campos não são preenchidos
- ✅ Caso continua funcionando normalmente
- ✅ Não há erro que quebra a página

**Validações a testar**:
- ✅ Verificar no DevTools (Network) que a requisição foi feita para `/api/ia/sugerir-resumo`
- ✅ Verificar que o payload contém `casoId`
- ✅ Verificar que a resposta contém `resumo` e `mensagemSugerida`

---

### 4. Editar o Parecer

**Objetivo**: Validar que os campos de resumo e mensagem são editáveis.

**Passos**:
1. Após gerar o parecer com IA (ou mesmo sem gerar)
2. Edite o campo **"Resumo"** manualmente
3. Edite o campo **"Mensagem Sugerida para Cliente"** manualmente
4. Clique em **"Salvar alterações"** (botão no card de edição)

**Resultado esperado**:
- ✅ Campos são editáveis (não são read-only)
- ✅ Ao salvar, toast de sucesso aparece
- ✅ Caso é atualizado no banco de dados
- ✅ Ao recarregar a página, os valores editados são mantidos

**Validações a testar**:
- ✅ Editar apenas o resumo (deixar mensagem vazia)
- ✅ Editar apenas a mensagem (deixar resumo vazio)
- ✅ Editar ambos os campos
- ✅ Deletar todo o conteúdo e salvar (deve permitir campos vazios)

---

### 5. Salvar Caso Completo

**Objetivo**: Validar que todos os campos são salvos corretamente.

**Passos**:
1. Na página de detalhes do caso
2. Edite qualquer campo editável:
   - Status
   - Responsável
   - Prazo
   - Observações
   - Resumo IA
   - Mensagem Sugerida
3. Clique em **"Salvar alterações"**

**Resultado esperado**:
- ✅ Toast de sucesso aparece
- ✅ Todos os campos são salvos
- ✅ Interpretação ANAC é recalculada (se tipo ou data mudou)
- ✅ Ao recarregar, todos os valores são mantidos

**Validações a testar**:
- ✅ Salvar apenas um campo
- ✅ Salvar múltiplos campos de uma vez
- ✅ Salvar sem alterar nada (não deve dar erro)

---

### 6. Gerar PDF

**Objetivo**: Validar que o PDF inclui interpretação ANAC e resumo da IA.

**Passos**:
1. Na página de detalhes do caso
2. Certifique-se de que o caso tem:
   - Interpretação ANAC (automático)
   - Resumo IA preenchido (gerado ou editado manualmente)
3. Clique no botão **"Gerar Relatório PDF"**
4. Aguarde o processamento
5. PDF deve abrir em nova aba

**Resultado esperado**:
- ✅ PDF é gerado sem erros
- ✅ PDF abre em nova aba do navegador
- ✅ PDF contém todas as seções do MVP 1.0:
  - Cabeçalho
  - Identificação e categoria
  - Dados do caso
  - Cliente afetado
  - Linha do tempo
- ✅ **Seção "Cumprimento de Prazos ANAC"** contém:
  - Categoria do incidente
  - Lista de prazos importantes com status
  - Dados reais do motor de regras (não texto genérico)
- ✅ **Seção "Resultado Final"** contém:
  - Resumo da IA (se disponível)
  - Ou texto padrão (se resumo não disponível)

**Validações a testar**:
- ✅ Gerar PDF com resumo IA preenchido
- ✅ Gerar PDF sem resumo IA (deve usar texto padrão)
- ✅ Gerar PDF com diferentes tipos de incidente
- ✅ Verificar que prazos no PDF correspondem aos prazos calculados

---

### 7. Teste de Falha da IA (Permissão/API Desabilitada)

**Objetivo**: Validar que o sistema continua funcionando mesmo quando a IA falha.

**Cenário de teste**:
Este teste pode ser simulado de duas formas:

**Opção A - Simular no backend** (se tiver acesso):
1. Desabilitar temporariamente a API Vertex AI no projeto `carbon-bonsai-395917`
2. Ou remover permissões do service account
3. Tentar gerar parecer com IA

**Opção B - Testar comportamento esperado**:
1. Criar um caso normalmente
2. Tentar gerar parecer com IA
3. Se a IA falhar (por qualquer motivo), verificar comportamento

**Resultado esperado**:
- ✅ Se a IA falhar por falta de permissão:
  - Toast aparece: "Serviço de IA temporariamente indisponível. O caso foi salvo normalmente."
  - Campos de resumo e mensagem não são preenchidos
  - Caso continua funcionando normalmente
  - Não há erro que quebra a página
  - Usuário pode preencher campos manualmente
- ✅ Se a IA falhar por quota excedida:
  - Toast aparece: "Limite de uso de IA atingido. O caso foi salvo normalmente."
  - Mesmo comportamento acima
- ✅ Logs no servidor devem conter detalhes completos do erro (para debug)

**Validações a testar**:
- ✅ Verificar que o caso pode ser salvo mesmo sem resumo IA
- ✅ Verificar que o PDF pode ser gerado mesmo sem resumo IA
- ✅ Verificar que não há erros no console do navegador
- ✅ Verificar que a página não quebra ou fica em estado de loading infinito

---

## Checklist de Validação Completa

Use este checklist para garantir que todos os testes foram executados:

### Funcionalidades Básicas
- [ ] Criar caso com todos os campos novos
- [ ] Criar caso apenas com campos obrigatórios (campos novos vazios)
- [ ] Editar caso existente adicionando campos novos
- [ ] Listar casos (deve incluir `anacResumo` na resposta)

### Interpretação ANAC
- [ ] Seção ANAC aparece na tela de detalhes
- [ ] Categoria do incidente está correta
- [ ] Direitos básicos estão corretos para cada tipo
- [ ] Prazos são calculados corretamente
- [ ] Status dos prazos está correto (dentro_prazo, proximo_vencer, vencido)
- [ ] Alertas aparecem quando necessário

### Integração com IA
- [ ] Botão "Gerar Parecer com IA" funciona
- [ ] Resumo é gerado e preenchido automaticamente
- [ ] Mensagem sugerida é gerada e preenchida automaticamente
- [ ] Campos são editáveis após geração
- [ ] Campos são salvos corretamente
- [ ] Comportamento quando IA falha é adequado

### Validações
- [ ] Validação de localizador funciona
- [ ] Validação de número de voo funciona
- [ ] Validação de data funciona
- [ ] Validação de horário funciona
- [ ] Mensagens de erro são claras e amigáveis

### PDF
- [ ] PDF é gerado sem erros
- [ ] PDF contém seção ANAC com dados reais
- [ ] PDF contém resumo IA quando disponível
- [ ] PDF funciona mesmo sem resumo IA
- [ ] Layout do PDF está correto

### Tratamento de Erros
- [ ] IA falha graciosamente (não quebra o fluxo)
- [ ] Mensagens de erro são amigáveis
- [ ] Logs no servidor contêm detalhes completos

---

## Problemas Conhecidos e Limitações

### Limitações do Motor de Regras (Versão Inicial)

1. **Recorte conservador**: Apenas 5 tipos de incidente cobertos
2. **Prazos fixos**: Baseados apenas no tipo, sem considerar outros fatores
3. **Sem validação de data**: Não valida se data do voo é futura ou passada
4. **Alertas básicos**: Apenas baseados em status de prazo

### Limitações da IA

1. **Depende de Vertex AI**: Requer API habilitada e permissões corretas
2. **Project ID fixo**: Sempre usa `carbon-bonsai-395917`
3. **Sem cache**: Cada chamada gera novo resumo (pode ter custos)

### Limitações do Frontend

1. **Campos novos não aparecem no formulário de criação**: Apenas no detalhe
2. **Validações leves**: Formatos básicos, não validações complexas

---

## Próximos Passos Após Testes

1. **Coletar feedback**: Anotar problemas encontrados durante os testes
2. **Refinar motor de regras**: Ajustar prazos e direitos baseado em feedback
3. **Melhorar validações**: Adicionar validações mais robustas se necessário
4. **Otimizar IA**: Adicionar cache ou melhorar prompt baseado em resultados

---

**Última atualização**: Janeiro 2025  
**Responsável pelos testes**: Equipe de desenvolvimento


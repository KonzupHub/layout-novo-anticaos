# Layout do PDF de Relatórios de Casos

## Visão Geral

O PDF gerado pelo sistema Ordem em Dia foi redesenhado para seguir uma estrutura similar ao modal de exemplos da landing page, com seções claras e organizadas.

## Estrutura do PDF

### 1. Cabeçalho do Relatório
- **Título**: "RELATÓRIO DE CASO DE INCIDENTE AÉREO"
- **Nome da Agência**: Obtido do banco de dados através do CNPJ do caso
- **CNPJ**: Formatado (XX.XXX.XXX/XXXX-XX) se disponível e válido
- **Data de Emissão**: Data e hora atual em formato brasileiro

### 2. Identificação e Categoria do Caso
- **Badge de Categoria**: Retângulo destacado com a categoria do incidente:
  - Cancelamento de voo
  - Atraso de voo
  - Preterição ou Overbooking
  - Mudança de equipamento
  - Outros (para tipos não mapeados)
- **Número do Caso**: ID único do caso

### 3. Dados do Caso
Seção com informações principais em grid de 2 colunas:
- Companhia Aérea (fornecedor)
- Localizador
- Status atual
- Prazo
- Responsável

### 4. Cliente Afetado
- Nome do passageiro
- (Futuro: campos de contato se adicionados ao modelo Case)

### 5. Linha do Tempo
Marcos principais baseados nas datas do caso:
- Abertura do caso (createdAt)
- Última atualização (updatedAt, se diferente de createdAt)
- Encerramento (se status = 'encerrado')

Cada marco exibe data formatada e descrição do evento.

### 6. Cumprimento de Prazos ANAC
Texto contextual baseado no status e prazo do caso:
- Se em andamento: indica que prazos estão sendo monitorados
- Se aguardando resposta: menciona acompanhamento contínuo
- Se encerrado: confirma cumprimento dos prazos
- Referência à Resolução 400 da ANAC

### 7. Resultado Final
Seção destacada com retângulo azul claro contendo:
- **Se encerrado**: Data de encerramento + notas (ou texto padrão)
- **Se em andamento**: Texto padrão + notas se disponíveis

**Nota**: Há um TODO no código indicando que no futuro esta seção pode usar a rota de IA `/api/ia/sugerir-resumo` para gerar o texto automaticamente.

## Características Técnicas

- **Biblioteca**: pdf-lib (mantida do código original)
- **Formato**: A4 (595x842 pontos)
- **Fontes**: Helvetica e Helvetica Bold
- **Cores**: Tons de azul para destaques, cinza para textos secundários
- **Quebra de Página**: Automática quando necessário
- **Espaçamento**: Seções bem separadas com linhas divisórias

## Arquivos Modificados

1. **backend/src/services/pdf.ts**
   - Função `generateCaseReport` completamente redesenhada
   - Novas funções auxiliares: `getCategoriaTipo`, `formatCNPJ`, `formatDate`
   - Comentários documentando layout antigo vs. novo

2. **backend/src/routes/cases.ts**
   - Rota `POST /api/cases/:id/pdf` atualizada para buscar dados da agência
   - Passa objeto `agencia` para `generateCaseReport`

## Contrato da API

A rota `POST /api/cases/:id/pdf` mantém o mesmo contrato externo:
- **Entrada**: ID do caso via parâmetro de rota, autenticação via Bearer token
- **Saída**: 
  ```json
  {
    "ok": true,
    "data": {
      "url": "https://...",
      "filename": "casos/.../..."
    }
  }
  ```

## Notas de Implementação

- O PDF usa apenas dados reais do caso, nunca valores fictícios
- Campos opcionais são omitidos elegantemente se não existirem
- A lógica de prazos ANAC é genérica por enquanto (não há cálculo específico no backend)
- O layout é inspirado na landing, mas não é uma cópia pixel-perfect
- A landing page (`src/pages/Index.tsx`) não foi alterada

## Testes

Para testar localmente:
1. Inicie o backend em modo stub: `npm run dev:backend`
2. Crie um caso via API
3. Gere o PDF: `POST /api/cases/:id/pdf` com token de autenticação
4. Abra o PDF gerado em `backend/.tmp/casos/...`


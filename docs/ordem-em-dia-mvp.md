# Ordem em Dia - MVP - Documentação para Cliente

## O que é o Ordem em Dia

O Ordem em Dia é uma plataforma de gestão de pós-venda para incidentes aéreos desenvolvida pela Konzup Hub. A plataforma ajuda agências de turismo a organizar, acompanhar e documentar casos de incidentes aéreos (atrasos, cancelamentos, overbooking, mudança de voo e extravio de bagagem), garantindo o cumprimento dos prazos regulatórios da ANAC e preservando a relação com o cliente.

## Funcionalidades Disponíveis no MVP

### ✅ Cadastro e Autenticação

- **Criação de conta**: Cadastro com email, senha, CNPJ da agência, nome da agência, cidade e nome do responsável
- **Login**: Autenticação segura com email e senha
- **Recuperação de senha**: Funcionalidade "Esqueci minha senha" que envia link de recuperação por email

### ✅ Gestão de Casos

- **Criar casos**: Cadastro completo de casos ANAC com os seguintes campos:
  - Nome do passageiro
  - Localizador do voo
  - Fornecedor (companhia aérea)
  - Tipo de incidente: Atraso maior que 4h, Cancelamento, Overbooking, Mudança de voo ou Extravio
  - Prazo para ação
  - Status: Em andamento, Aguardando resposta, Documentação pendente ou Encerrado
  - Responsável pelo caso
  - Observações e notas

- **Listar casos**: Visualização de todos os casos cadastrados na página "Casos"
- **Editar casos**: Atualização de status, responsável, notas e prazo na página de detalhes
- **Buscar casos**: Busca rápida por nome do passageiro, localizador ou fornecedor

### ✅ Dashboard "Dia de Hoje"

- **Resumo visual**: Cards mostrando:
  - Casos que vencem hoje
  - Casos com prazo nas próximas 24 horas
  - Novos casos criados na semana
- **Lista de prioridades**: Visualização dos casos que precisam de atenção imediata
- **Busca integrada**: Filtro rápido de casos diretamente na página inicial

### ✅ Geração de Relatórios PDF

- **Relatório completo**: Geração de PDF com todas as informações do caso, incluindo:
  - Dados da agência
  - Identificação e categoria do caso
  - Dados do passageiro
  - Linha do tempo do caso
  - Cumprimento de prazos ANAC
  - Resultado final
- **Download automático**: PDF gerado e aberto em nova aba do navegador

## Inteligência Artificial (IA)

**Status atual**: A funcionalidade de IA está **em desenvolvimento** e **não está ativa** no MVP atual.

O backend possui uma rota de IA (Gemini Vertex AI) que pode gerar resumos de casos, mas esta funcionalidade:
- Não está integrada na interface do usuário
- Não está disponível para uso no painel
- Está em fase de desenvolvimento e testes

**Não prometemos ou vendemos IA como funcionalidade pronta no MVP atual.**

## Funcionalidades em Desenvolvimento

As seguintes funcionalidades estão planejadas mas **não estão disponíveis** no MVP:

- ❌ Importação de casos via arquivo CSV
- ❌ Relatórios e análises estatísticas
- ❌ Gestão de equipe e permissões de usuários
- ❌ Modelos de documentos personalizados
- ❌ Integração com IA para geração automática de resumos
- ❌ Portal de status para clientes B2B
- ❌ Indicadores de eficiência e venda preservada

## Tecnologias Utilizadas

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Autenticação**: Firebase Authentication
- **Banco de dados**: Firestore (Google Cloud)
- **Armazenamento**: Cloud Storage (Google Cloud)
- **Deploy**: Cloudflare Pages (frontend) + Cloud Run (backend)

## Acesso e Suporte

- **URL de produção**: https://ordem.konzuphub.com
- **Contato**: contato@konzup.com
- **Documentação técnica**: Disponível no repositório do projeto

## Notas Importantes

1. **Responsabilidade**: A Konzup Hub fornece ferramentas para organização e gestão, mas a responsabilidade final sobre o atendimento aos prazos regulatórios e estar de acordo com a legislação permanece com o usuário.

2. **Dados**: Os dados são armazenados de forma segura no Google Cloud Platform, seguindo as melhores práticas de segurança e privacidade.

3. **Atualizações**: O sistema está em constante evolução. Novas funcionalidades serão adicionadas gradualmente.

---

**Última atualização**: Janeiro de 2025  
**Versão do MVP**: 1.0


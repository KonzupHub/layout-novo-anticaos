# Konzup Hub - Landing Page Documentation

## 📋 Visão Geral

Esta é a documentação completa da landing page do **Konzup Hub**, uma plataforma para automatização do processo pós-venda de incidentes aéreos (atrasos, cancelamentos, overbooking, etc.). Esta documentação é especialmente útil para integração com backend e trabalho em editores como Cursor AI.

---

## 🎯 Objetivo da Plataforma

O Konzup Hub automatiza todo o fluxo de gestão de casos de incidentes aéreos para agências de turismo, incluindo:
- Monitoramento automático de voos
- Abertura automática de casos (atrasos, cancelamentos, overbooking)
- Geração de cartas de reclamação
- Acompanhamento de prazos ANAC
- Relatórios e dashboards

---

## 📁 Estrutura da Landing Page

**Arquivo Principal:** `src/pages/Index.tsx`

### Seções da Página

1. **Header/Navigation**
   - Logo "Konzup Hub"
   - Links: Início, Como Funciona, Benefícios, Futuro, FAQ
   - Botões: Login e Cadastrar

2. **Hero Section**
   - Título principal com destaque em gradiente
   - Subtítulo explicativo
   - Call-to-action: "Solicitar acesso antecipado"
   - Botão secundário: "Ver exemplos de casos"

3. **How It Works (Como Funciona)**
   - 6 cards com steps do processo
   - Ícones visuais para cada etapa
   - Badges indicando status "Automático"

4. **Case Examples Modal (Dialog)**
   - 5 exemplos de casos reais com tabs
   - Estrutura detalhada de cada caso (dados, timeline, resultado)
   - Animações fluidas ao abrir/navegar

5. **Benefits Section**
   - 6 cards destacando vantagens
   - Métricas de eficiência (80% redução de tempo, etc.)

6. **Future Features Section**
   - Cards com funcionalidades em desenvolvimento
   - Badge "Em breve"

7. **FAQ Section**
   - Accordion com perguntas frequentes

8. **CTA Final Section**
   - Form de cadastro de e-mail
   - Call-to-action para early access

9. **Footer**
   - Links: Termos de Uso, Privacidade, Ajuda
   - Copyright

---

## 🗂️ Mock Data: `caseExamples`

Array com 5 casos detalhados de incidentes aéreos reais:

```typescript
const caseExamples = [
  {
    id: "cancelamento",
    title: "Cancelamento de Voo",
    company: "Viagens Horizonte Ltda",
    caseNumber: "#2025-001",
    type: "Cancelamento de voo",
    airline: "Azul Linhas Aéreas",
    flight: "AD 4321",
    date: "10/01/2025",
    route: "GRU → SSA",
    client: { name, cpf, email },
    timeline: [...],
    result: "string",
    icon: "PlaneOff"
  },
  // + 4 outros casos (atraso, overbooking, mudança aeronave, extravio bagagem)
]
```

### Tipos de Casos Incluídos:
1. **Cancelamento de Voo** (`id: "cancelamento"`)
   - Icon: `Plane`
   - Fluxo: Notificação → Caso aberto → Carta enviada → Reacomodação

2. **Atraso Superior a 4h** (`id: "atraso"`)
   - Icon: `Clock`
   - Fluxo: Atraso detectado → Assistência material → Compensação

3. **Overbooking/Preterição** (`id: "overbooking"`)
   - Icon: `Users`
   - Fluxo: Impedimento de embarque → Reacomodação imediata → Compensação

4. **Mudança de Aeronave** (`id: "mudanca-aeronave"`)
   - Icon: `Plane`
   - Fluxo: Notificação → Verificação de assentos → Confirmação

5. **Extravio de Bagagem** (`id: "extravio-bagagem"`)
   - Icon: `Luggage`
   - Fluxo: Relato → RIB → Assistência emergencial → Localização → Entrega

---

## 🎨 Design System & Animações

### Componentes UI Utilizados
- `Button` (variants: default, outline, ghost)
- `Card`, `CardContent`
- `Badge` (outline variant)
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogTrigger`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- `Input`
- `useToast()` (notificações)

### Animações Implementadas
- **Dialog entrada:** `animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300`
- **Tabs:** `animate-fade-in`
- **Tab Content:** `animate-in fade-in-0 slide-in-from-right-4 duration-200`
- **Elementos internos:** Staggered animations com delays (100ms, 200ms, 300ms...)
- **Timeline items:** `animate-slide-in-right` com delays progressivos
- **Hover effects:** `hover:scale-105 transition-all` em botões

### Cores Semânticas (HSL via design system)
- `primary` - Cor principal da marca
- `primary-foreground` - Texto sobre primary
- `muted` - Backgrounds sutis
- `muted-foreground` - Textos secundários
- `background` - Background principal
- `foreground` - Texto principal
- `accent` - Cor de destaque
- `border` - Bordas

---

## 🔌 Integrações Backend Necessárias

### Endpoints a Implementar

1. **POST `/api/early-access`**
   - Body: `{ email: string }`
   - Response: `{ success: boolean, message: string }`
   - Usado no form de "Solicitar acesso antecipado"

2. **POST `/api/newsletter`** (futuro)
   - Body: `{ email: string }`
   - Response: `{ success: boolean, message: string }`

3. **GET `/api/cases/examples`** (futuro)
   - Response: Array de casos (substituir mock `caseExamples`)
   - Estrutura: `{ id, title, company, caseNumber, type, airline, flight, date, route, client, timeline, result, icon }`

4. **Autenticação** (já tem páginas `/login` e `/cadastro`)
   - Implementar auth no backend (Supabase/Firebase/JWT)
   - Proteger rotas `/dashboard/*`

---

## 🚀 Como Trabalhar com Cursor AI

### 1. Clonar o Repositório
```bash
git clone <your-github-repo-url>
cd konzup-hub
```

### 2. Instalar Dependências
```bash
npm install
# ou
bun install
```

### 3. Ler esta Documentação no Cursor
```
@LANDING_PAGE.md Leia esta documentação e me ajude a entender a estrutura da landing page
```

### 4. Prompts Úteis para Cursor Agent AI

**Para entender a estrutura:**
```
@LANDING_PAGE.md Explique a estrutura da landing page e como os componentes estão organizados
```

**Para integrar backend:**
```
@LANDING_PAGE.md Preciso implementar o endpoint POST /api/early-access que recebe um email e salva no banco de dados. Use Supabase. Mostre o código do edge function.
```

**Para conectar auth:**
```
@LANDING_PAGE.md As páginas /login e /cadastro já existem no frontend. Implemente autenticação completa com Supabase, incluindo signup, login, logout e proteção de rotas do dashboard.
```

**Para substituir mock data:**
```
@LANDING_PAGE.md O array caseExamples em src/pages/Index.tsx é mock data. Crie um endpoint GET /api/cases/examples que retorna casos reais do banco de dados, e atualize o frontend para consumir essa API.
```

**Para adicionar novas features:**
```
@LANDING_PAGE.md Quero adicionar um filtro de busca na lista de casos do dashboard. Sugira a melhor arquitetura backend e mostre como implementar.
```

---

## 📦 Tecnologias Utilizadas

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** (estilização)
- **Radix UI** (componentes acessíveis)
- **Lucide React** (ícones)
- **React Router DOM** (rotas)
- **TanStack Query** (data fetching - preparado para uso)
- **Sonner** (toasts)

### Backend (a implementar)
- **Supabase** (recomendado)
  - PostgreSQL Database
  - Auth (Email/Password, OAuth)
  - Storage (documentos, PDFs)
  - Edge Functions (serverless APIs)
- Alternativas: Firebase, AWS Amplify, Node.js + Express

---

## 📝 Próximos Passos (Roadmap Backend)

### Fase 1: Autenticação (Prioridade Alta)
- [ ] Implementar Supabase Auth
- [ ] Conectar páginas `/login` e `/cadastro`
- [ ] Adicionar proteção de rotas no `/dashboard`
- [ ] Implementar logout

### Fase 2: Early Access (Prioridade Alta)
- [ ] Criar tabela `early_access_requests` no Supabase
- [ ] Implementar endpoint POST `/api/early-access`
- [ ] Conectar form da landing page com API
- [ ] Adicionar confirmação por e-mail (opcional)

### Fase 3: Casos (Core Feature)
- [ ] Criar schema de banco de dados para casos
- [ ] Tabelas: `cases`, `clients`, `airlines`, `case_timeline`
- [ ] Implementar CRUD de casos
- [ ] Substituir mock data por dados reais
- [ ] Adicionar filtros e busca

### Fase 4: Monitoramento de Voos (Automação)
- [ ] Integrar API de monitoramento de voos (FlightAware, AviationStack)
- [ ] Criar webhook para notificações de atrasos/cancelamentos
- [ ] Implementar abertura automática de casos
- [ ] Notificar clientes por e-mail/SMS

### Fase 5: Documentos & Relatórios
- [ ] Implementar geração de PDFs (cartas de reclamação)
- [ ] Storage de documentos no Supabase Storage
- [ ] Templates de cartas personalizáveis
- [ ] Assinatura digital (opcional)

### Fase 6: Dashboard Analytics
- [ ] Métricas de casos (abertos, resolvidos, pendentes)
- [ ] Gráficos de desempenho (recharts já instalado)
- [ ] Exportação de relatórios
- [ ] Notificações de prazos

---

## 🔐 Variáveis de Ambiente Necessárias

Criar arquivo `.env.local`:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# APIs Externas (futuro)
VITE_FLIGHT_API_KEY=your-flight-api-key
VITE_EMAIL_SERVICE_KEY=your-email-service-key

# Ambiente
VITE_ENV=development
```

---

## 🐛 Debug & Troubleshooting

### Problema: Animações não funcionam
- Verificar se `tailwindcss-animate` está instalado
- Checar `tailwind.config.ts` para animações customizadas

### Problema: Tabs não trocam
- Verificar import correto de `@/components/ui/tabs`
- Confirmar que `value` dos `TabsTrigger` correspondem aos `TabsContent`

### Problema: Toast não aparece
- Verificar se `<Toaster />` está no `App.tsx`
- Importar `useToast()` corretamente

### Problema: Roteamento quebrado
- Verificar `BrowserRouter` no `App.tsx`
- Checar se rotas estão definidas corretamente
- Em produção, configurar `_redirects` para SPA

---

## 📞 Contato & Suporte

Para dúvidas sobre esta documentação ou estrutura do projeto:
- Revisar este arquivo `LANDING_PAGE.md`
- Checar componentes em `src/components/ui/`
- Consultar rotas em `src/App.tsx`
- Ver páginas do dashboard em `src/pages/dashboard/`

---

## 📄 Licença

Projeto privado - Konzup Hub © 2025

---

**Última atualização:** 2025-01-11  
**Versão da documentação:** 1.0  
**Mantido por:** Equipe Konzup Hub

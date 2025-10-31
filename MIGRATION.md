# 🚀 Guia de Migração - Konzup Hub

Este documento contém todas as instruções necessárias para continuar o desenvolvimento no Cursor com Google Cloud.

---

## ✅ Status das Funcionalidades

### ✓ Funcional (Mockup Completo)
- ✅ **Página Institucional** (`src/pages/Index.tsx`) - 100% funcional
- ✅ **Dashboard - Dia de Hoje** (`src/pages/dashboard/Hoje.tsx`) - Mockup completo com dados de exemplo
- ✅ **Sistema de Login/Cadastro** (`src/pages/Login.tsx`, `src/pages/Cadastro.tsx`) - UI completa
- ✅ **Páginas Legais** (Termos, Privacidade) - Completas

### 🚧 Em Desenvolvimento (Pendente de Backend)
- 🚧 **Casos** - UI precisa de funcionalidade real
- 🚧 **Importar** - Aguardando implementação
- 🚧 **Modelos** - Aguardando implementação
- 🚧 **Relatórios** - Aguardando implementação
- 🚧 **Ajuda** - Aguardando implementação
- 🚧 **Conta** - Aguardando implementação

---

## 🎯 PRIORIDADE: Formulário "Quero ser avisado"

### Problema Atual
O formulário em `src/pages/Index.tsx` (linha ~329) apenas exibe um toast de confirmação, mas **NÃO salva o email** em nenhum lugar.

### O que precisa ser feito

#### 1. Criar Google Cloud Function

Crie uma Cloud Function no Google Cloud Platform:

```javascript
// functions/saveWaitlistEmail/index.js

const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

exports.saveWaitlistEmail = async (req, res) => {
  // CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Apenas POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email } = req.body;

    // Validação
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'Email inválido' });
      return;
    }

    // Salvar no Firestore
    const docRef = await firestore.collection('waitlist').add({
      email: email.toLowerCase().trim(),
      createdAt: new Date().toISOString(),
      source: 'konzup-hub-landing',
      status: 'pending'
    });

    console.log('Email salvo:', docRef.id);

    res.status(200).json({ 
      success: true, 
      message: 'Email cadastrado com sucesso!',
      id: docRef.id 
    });

  } catch (error) {
    console.error('Erro ao salvar email:', error);
    res.status(500).json({ 
      error: 'Erro ao processar solicitação',
      details: error.message 
    });
  }
};
```

#### 2. Deploy da Cloud Function

```bash
# No terminal do Google Cloud Console
gcloud functions deploy saveWaitlistEmail \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region=us-central1
```

Após o deploy, você receberá uma URL como:
```
https://us-central1-SEU-PROJETO.cloudfunctions.net/saveWaitlistEmail
```

#### 3. Atualizar o Frontend

No arquivo `src/pages/Index.tsx`, localize a função `handleNotifyMe` (linha ~14) e substitua por:

```typescript
const handleNotifyMe = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validação básica
  if (!email || !email.includes('@')) {
    toast.error("Por favor, insira um email válido");
    return;
  }

  try {
    // Chamar a Cloud Function
    const response = await fetch('https://us-central1-SEU-PROJETO.cloudfunctions.net/saveWaitlistEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao cadastrar email');
    }

    // Sucesso
    toast.success("Email cadastrado! Você será avisado em primeira mão 🚀");
    setEmail(''); // Limpar o campo

  } catch (error) {
    console.error('Erro ao cadastrar email:', error);
    toast.error("Erro ao cadastrar email. Tente novamente.");
  }
};
```

#### 4. Criar Variável de Ambiente (Opcional, mas recomendado)

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_CLOUD_FUNCTION_URL=https://us-central1-SEU-PROJETO.cloudfunctions.net/saveWaitlistEmail
```

E use no código:

```typescript
const response = await fetch(import.meta.env.VITE_CLOUD_FUNCTION_URL, {
  // ... resto do código
});
```

---

## 📦 Dependências Necessárias

Para o Google Cloud Functions:
```json
{
  "dependencies": {
    "@google-cloud/firestore": "^7.0.0"
  }
}
```

Não há dependências adicionais necessárias no frontend.

---

## 🔐 Configuração do Firestore

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie/selecione seu projeto
3. Vá em **Firestore Database** → **Criar banco de dados**
4. Escolha o modo **Produção**
5. Selecione a região (preferencialmente `us-central`)

### Regras de Segurança Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas leitura para admins
    match /waitlist/{document=**} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow write: if false; // Apenas via Cloud Function
    }
  }
}
```

---

## 🚨 Avisos Importantes

### ❌ NÃO Migrar
- `components.json` (configuração Lovable)
- `package-lock.json` e `bun.lockb` (serão regenerados)
- `.lovable/` (se existir)

### ✅ Migrar Tudo Isso
- Todo o `/src`
- `index.html`
- `tailwind.config.ts`
- `vite.config.ts`
- `tsconfig*.json`
- `.gitignore`
- `README.md` e este `MIGRATION.md`

### 🔄 Regenerar no Cursor
Após clonar, rode:
```bash
npm install
```

---

## 📋 Checklist de Migração

- [ ] Código no GitHub
- [ ] Projeto clonado no Cursor
- [ ] `npm install` executado
- [ ] Google Cloud Function criada
- [ ] Firestore configurado
- [ ] URL da Cloud Function obtida
- [ ] Frontend atualizado com a URL
- [ ] Teste: enviar email no formulário
- [ ] Verificar: email salvo no Firestore
- [ ] Deploy: hospedar frontend (Vercel, Netlify, etc)

---

## 🧪 Testando a Integração

1. Execute o projeto localmente:
```bash
npm run dev
```

2. Acesse a página inicial
3. Role até o formulário "Quero ser avisado"
4. Insira um email de teste
5. Clique em "Quero ser avisado"
6. Verifique se o toast de sucesso aparece
7. Confira no Firestore Console se o email foi salvo

---

## 📞 Suporte

Se encontrar problemas:
- Verifique os logs da Cloud Function no Google Cloud Console
- Verifique o console do navegador (F12) para erros de CORS ou rede
- Teste a Cloud Function diretamente com curl:

```bash
curl -X POST \
  https://us-central1-SEU-PROJETO.cloudfunctions.net/saveWaitlistEmail \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com"}'
```

---

## 🎯 Próximos Passos (Futuro)

Após implementar o formulário de waitlist:

1. **Autenticação Real** - Implementar login/cadastro com Firebase Auth
2. **Casos** - Backend para CRUD de casos de turismo
3. **Importar** - Upload de arquivos e processamento
4. **Modelos** - Sistema de templates de relatórios
5. **Relatórios** - Geração de PDFs com dados reais
6. **Ajuda** - Sistema de suporte/FAQ dinâmico
7. **Conta** - Gerenciamento de perfil de usuário

---

**Desenvolvido com Lovable → Migrando para Google Cloud**  
*Data de criação: 2025*

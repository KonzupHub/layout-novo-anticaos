# Variáveis de Ambiente do Frontend para Produção

Este documento lista as variáveis de ambiente `VITE_*` necessárias para o frontend em produção na Cloudflare Pages.

## Variáveis Obrigatórias

### `VITE_FIREBASE_API_KEY`
- **Descrição**: Chave da API do Firebase para autenticação
- **Onde encontrar**: Firebase Console > Project Settings > General > Your apps > Web app config
- **Exemplo**: `AIzaSyCkHVgsaIjwuggNKIv9rpa4M50ODyuy3L4`
- **Obrigatória**: Sim

### `VITE_FIREBASE_AUTH_DOMAIN`
- **Descrição**: Domínio de autenticação do Firebase
- **Onde encontrar**: Firebase Console > Project Settings > General > Your apps > Web app config
- **Exemplo**: `ordem-em-dia.firebaseapp.com`
- **Obrigatória**: Sim

### `VITE_FIREBASE_PROJECT_ID`
- **Descrição**: ID do projeto Firebase
- **Onde encontrar**: Firebase Console > Project Settings > General
- **Exemplo**: `ordem-em-dia`
- **Obrigatória**: Sim

### `VITE_FIREBASE_STORAGE_BUCKET`
- **Descrição**: Bucket do Firebase Storage
- **Onde encontrar**: Firebase Console > Project Settings > General > Your apps > Web app config
- **Exemplo**: `ordem-em-dia.firebasestorage.app`
- **Obrigatória**: Sim

### `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Descrição**: ID do remetente de mensagens do Firebase
- **Onde encontrar**: Firebase Console > Project Settings > General > Your apps > Web app config
- **Exemplo**: `336386698724`
- **Obrigatória**: Sim

### `VITE_FIREBASE_APP_ID`
- **Descrição**: ID do app web no Firebase
- **Onde encontrar**: Firebase Console > Project Settings > General > Your apps > Web app config
- **Exemplo**: `1:336386698724:web:82c7283acb674603ac6bf1`
- **Obrigatória**: Sim

## Variáveis Opcionais

### `VITE_API_BASE`
- **Descrição**: URL base da API do backend
- **Valor padrão**: `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api`
- **Recomendação**: Deixe vazio para usar o padrão (recomendado)
- **Quando configurar**: Apenas se precisar apontar para outro backend
- **Obrigatória**: Não

## Configuração na Cloudflare Pages

1. Acesse o projeto no Cloudflare Pages
2. Vá em **Settings** > **Environment variables**
3. Selecione o ambiente **Production**
4. Adicione cada variável `VITE_*` listada acima
5. Para `VITE_API_BASE`, deixe vazio ou não adicione (usará o padrão)

## Nota Importante

O frontend está configurado para usar automaticamente a URL do Cloud Run em produção se `VITE_API_BASE` não estiver definida. Isso significa que você pode deixar essa variável em branco na Cloudflare Pages e o sistema funcionará corretamente.


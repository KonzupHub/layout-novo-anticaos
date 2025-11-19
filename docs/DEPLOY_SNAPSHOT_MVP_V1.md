# Snapshot do Deploy MVP v1 - Ordem em Dia

**Data do snapshot**: Janeiro 2025  
**Objetivo**: Backup do estado atual do código em produção

## Informações do Repositório

### Branch de Backup
- **Nome**: `backup-ordemdia-mvp-v1`
- **Status**: Criada e enviada para o remoto (GitHub)
- **URL**: https://github.com/KonzupHub/anti-caos-konzup/tree/backup-ordemdia-mvp-v1

### Tag de Release
- **Nome**: `ordemdia-mvp-v1`
- **Status**: Criada e enviada para o remoto (GitHub)
- **Mensagem**: "Snapshot do MVP v1 - Estado em produção Janeiro 2025"
- **URL**: https://github.com/KonzupHub/anti-caos-konzup/releases/tag/ordemdia-mvp-v1

### Commit Atual (MVP v1)
- **Hash**: `812718928a6dbf3aee3a18e07adb0c0828e47a4b`
- **Mensagem**: `feat: adiciona modal Como Funciona, documentação MVP e ajustes finais`
- **Branch**: `main`

## Deploy em Produção

### Backend (Cloud Run)

- **Projeto GCP**: `ordem-em-dia`
- **Serviço**: `konzup-hub-backend`
- **Região**: `us-central1`
- **URL**: https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app
- **Revisão atual em produção**: `konzup-hub-backend-00007-c5x`
- **Service Account**: `336386698724-compute@developer.gserviceaccount.com`

### Frontend (Cloudflare Pages)

- **Domínio**: https://ordem.konzuphub.com
- **Domínio alternativo**: https://anti-caos-konzup.pages.dev
- **Build automático**: Sim (via GitHub)
- **Commit em produção**: `8127189` (mesmo commit da tag `ordemdia-mvp-v1`)

## Funcionalidades do MVP v1

### ✅ Funcionalidades Ativas

- Cadastro e autenticação de usuários
- Criação, listagem e edição de casos ANAC
- Dashboard "Dia de Hoje" com prioridades
- Busca de casos
- Geração de relatórios PDF
- Recuperação de senha
- Modal "Como Funciona"

### ⚠️ Funcionalidades em Desenvolvimento

- IA para geração de resumos (backend implementado, mas não funcional em produção)
- Importação de casos via CSV
- Relatórios e análises
- Gestão de equipe

## Notas Importantes

- Este snapshot representa o estado estável do MVP v1 em produção
- Para restaurar este estado, use a branch `backup-ordemdia-mvp-v1` ou a tag `ordemdia-mvp-v1`
- O frontend está em Cloudflare Pages com deploy automático via GitHub
- O backend está em Cloud Run no projeto `ordem-em-dia`


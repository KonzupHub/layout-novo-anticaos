# Verificação de Billing Account - Projetos Ordem em Dia e Carbon Bonsai

**Data da Verificação**: 2025-11-19

## Objetivo

Verificar qual conta de billing está associada a cada um dos projetos GCP:
- `ordem-em-dia`
- `carbon-bonsai-395917`

## Comandos Executados

### 1. Verificação do Projeto `ordem-em-dia`

```bash
gcloud billing projects describe ordem-em-dia --format="json"
```

**Resultado**:
```json
{
  "billingAccountName": "billingAccounts/01B40C-01D702-2AD61B",
  "billingEnabled": true,
  "name": "projects/ordem-em-dia/billingInfo",
  "projectId": "ordem-em-dia"
}
```

### 2. Verificação do Projeto `carbon-bonsai-395917`

```bash
gcloud billing projects describe carbon-bonsai-395917 --format="json"
```

**Resultado**:
```json
{
  "billingAccountName": "billingAccounts/01B40C-01D702-2AD61B",
  "billingEnabled": true,
  "name": "projects/carbon-bonsai-395917/billingInfo",
  "projectId": "carbon-bonsai-395917"
}
```

### 3. Verificação Cruzada

```bash
gcloud billing projects list --billing-account=01B40C-01D702-2AD61B --format="json"
```

**Resultado**: Ambos os projetos aparecem na lista de projetos associados à mesma billing account.

## Informações dos Projetos

### Projeto `ordem-em-dia`
- **Project ID**: `ordem-em-dia`
- **Project Number**: `336386698724`
- **Nome**: `Ordem em Dia`
- **Billing Account**: `billingAccounts/01B40C-01D702-2AD61B`
- **Billing Habilitado**: ✅ `true`

### Projeto `carbon-bonsai-395917`
- **Project ID**: `carbon-bonsai-395917`
- **Project Number**: `250731393365`
- **Nome**: `Konzup`
- **Billing Account**: `billingAccounts/01B40C-01D702-2AD61B`
- **Billing Habilitado**: ✅ `true`

## Conclusão

### ✅ **Usam a mesma billing account**

Ambos os projetos (`ordem-em-dia` e `carbon-bonsai-395917`) estão associados à **mesma conta de billing**:

- **Billing Account ID**: `01B40C-01D702-2AD61B`
- **Billing Account Name**: `billingAccounts/01B40C-01D702-2AD61B`

### Implicações

Como ambos os projetos compartilham a mesma billing account, os custos de uso do Vertex AI no projeto `carbon-bonsai-395917` serão cobrados na mesma conta de billing que o projeto `ordem-em-dia`. Isso é consistente com a estratégia de usar o projeto `carbon-bonsai-395917` para Vertex AI enquanto o Cloud Run roda no projeto `ordem-em-dia`.

---

**Última atualização**: 2025-11-19


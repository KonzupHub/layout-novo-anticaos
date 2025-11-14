# IA Gemini Vertex - Documentação

## O que esta rota faz

A rota `POST /api/ia/sugerir-resumo` utiliza o Google Vertex AI com o modelo Gemini para gerar um resumo objetivo e profissional de casos de incidentes aéreos.

O resumo é gerado automaticamente a partir de:
- Tipo do incidente (atraso, cancelamento, overbooking, etc.)
- Descrição do caso
- Prazo em dias para ação

## Modelo e Região

- **Modelo:** `gemini-2.5-flash`
- **Região:** `us-central1`
- **Projeto:** `ordem-em-dia`

O modelo `gemini-2.5-flash` foi escolhido por ser:
- Rápido e eficiente
- Custo-benefício adequado
- Capaz de gerar textos em português brasileiro
- Estável e confiável

## Exemplo de JSON de Entrada

```json
{
  "tipo": "atraso",
  "descricao": "voo atrasou 5 horas, passageiro perdeu conexão e ficou sem assistência",
  "prazoDias": 7
}
```

### Campos Obrigatórios

- `tipo` (string): Tipo do incidente (ex: "atraso", "cancelamento", "overbooking")
- `descricao` (string): Descrição detalhada do incidente
- `prazoDias` (number): Prazo em dias para ação (deve ser um número positivo)

## Exemplo de JSON de Saída (Sucesso)

```json
{
  "ok": true,
  "resumo": "Caso de atraso de voo com 5 horas de espera. Passageiro perdeu conexão e não recebeu assistência adequada. Prazo de 7 dias para apresentar reclamação à companhia aérea."
}
```

## Exemplo de JSON de Saída (Erro)

```json
{
  "ok": false,
  "error": "Campo \"descricao\" é obrigatório e deve ser uma string"
}
```

## Comandos curl para Teste

### Teste Local (Desenvolvimento)

```bash
curl -X POST http://localhost:8080/api/ia/sugerir-resumo \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "atraso",
    "descricao": "voo atrasou 5 horas, passageiro perdeu conexão e ficou sem assistência",
    "prazoDias": 7
  }'
```

### Teste em Produção (Cloud Run)

```bash
curl -X POST https://ordem.konzuphub.com/api/ia/sugerir-resumo \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "atraso",
    "descricao": "voo atrasou 5 horas, passageiro perdeu conexão e ficou sem assistência",
    "prazoDias": 7
  }'
```

## Exemplos de Uso

### Caso de Cancelamento

```bash
curl -X POST https://ordem.konzuphub.com/api/ia/sugerir-resumo \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "cancelamento",
    "descricao": "voo cancelado sem aviso prévio, passageiro ficou sem alternativa de voo no mesmo dia",
    "prazoDias": 7
  }'
```

### Caso de Overbooking

```bash
curl -X POST https://ordem.konzuphub.com/api/ia/sugerir-resumo \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "overbooking",
    "descricao": "passageiro foi impedido de embarcar devido a overbooking, não recebeu compensação imediata",
    "prazoDias": 7
  }'
```

## Segurança

**IMPORTANTE:** Esta rota atualmente não requer autenticação. Em produção, é **altamente recomendado** proteger esta rota com autenticação para:

- Evitar uso indevido
- Controlar custos da API do Vertex AI
- Garantir que apenas usuários autorizados possam usar o serviço

## Limitações

- O resumo gerado tem no máximo 3 frases
- O texto é limpo automaticamente (sem HTML, sem markdown)
- Em caso de erro na API do Vertex AI, uma mensagem genérica é retornada
- A rota pode ter latência dependendo da resposta do Vertex AI

## Códigos de Status HTTP

- `200`: Sucesso - Resumo gerado com sucesso
- `400`: Erro de validação - Campos obrigatórios faltando ou inválidos
- `500`: Erro interno - Problema ao chamar o Vertex AI ou processar a resposta


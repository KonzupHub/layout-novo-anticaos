#!/bin/bash
# Teste direto do Gemini usando gcloud

PROJECT_ID="ordem-em-dia"
REGION="us-central1"
MODEL="gemini-2.5-flash"

echo "=== Testando acesso ao Gemini no projeto $PROJECT_ID ==="
echo ""

# Tenta fazer uma chamada simples usando a API REST do Vertex AI
curl -X POST \
  "https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{
      "prompt": "Teste"
    }]
  }' 2>&1 | head -30


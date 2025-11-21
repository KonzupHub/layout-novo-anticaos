#!/bin/bash
# Teste usando a API REST do Vertex AI diretamente

PROJECT_ID="ordem-em-dia"
REGION="us-central1"
MODEL="gemini-2.5-flash"

echo "=== Testando Vertex AI API REST ==="
echo "Projeto: $PROJECT_ID"
echo "Região: $REGION"
echo "Modelo: $MODEL"
echo ""

TOKEN=$(gcloud auth print-access-token)

# Tenta usar a API generativa do Vertex AI
curl -X POST \
  "https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:generateContent" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Teste"
      }]
    }]
  }' 2>&1 | head -50


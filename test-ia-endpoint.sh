#!/bin/bash
# Script para testar o endpoint de IA localmente

TOKEN="test-token-placeholder"
CASO_ID="test-case-id"

echo "=== Testando POST /api/ia/sugerir-resumo ==="
echo ""
echo "Payload:"
echo '{"casoId": "'$CASO_ID'"}'
echo ""

curl -X POST http://localhost:8080/api/ia/sugerir-resumo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"casoId": "'$CASO_ID'"}' \
  -v 2>&1 | tee /tmp/ia-response.log

echo ""
echo "=== Resposta completa salva em /tmp/ia-response.log ==="

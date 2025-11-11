#!/bin/bash

API_BASE="http://localhost:8080/api"

echo "========================================="
echo "  Testes de API - Konzup Hub"
echo "========================================="
echo ""

echo "=== 1. Health Check ==="
curl -X GET "$API_BASE/health" -w "\nStatus: %{http_code}\n"
echo -e "\n"

echo "=== 2. POST /api/waitlist ==="
curl -X POST "$API_BASE/waitlist" \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com"}' \
  -w "\nStatus: %{http_code}\n"
echo -e "\n"

echo "=== 3. POST /api/auth/signup ==="
SIGNUP_RESPONSE=$(curl -s -X POST "$API_BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"usuario@teste.com",
    "senha":"123456",
    "cnpj":"12345678000190",
    "nomeAgencia":"Agência Teste",
    "cidade":"São Paulo",
    "nome":"João Silva"
  }')
echo "$SIGNUP_RESPONSE"
echo ""

# Extrai token do signup (modo stub retorna customToken)
TOKEN=$(echo "$SIGNUP_RESPONSE" | grep -o '"customToken":"[^"]*' | cut -d'"' -f4 || echo "")

if [ -z "$TOKEN" ] || [ "$TOKEN" = "" ]; then
  echo "⚠️  Token não encontrado na resposta do signup."
  echo "   Em modo STUB, você pode usar qualquer token como 'stub-token-123'"
  TOKEN="stub-token-123"
fi

echo "Token extraído: ${TOKEN:0:20}..."
echo -e "\n"

echo "=== 4. POST /api/auth/login ==="
echo "ℹ️  Nota: Login é feito via Firebase SDK no frontend"
echo "   Para testar endpoints protegidos, use o token do signup acima"
echo -e "\n"

echo "=== 5. GET /api/cases (requer autenticação) ==="
curl -X GET "$API_BASE/cases" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nStatus: %{http_code}\n"
echo -e "\n"

echo "=== 6. POST /api/cases (requer autenticação) ==="
CREATE_CASE_RESPONSE=$(curl -s -X POST "$API_BASE/cases" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "passageiro":"Maria Silva",
    "localizador":"ABC123",
    "fornecedor":"LATAM",
    "tipo":"atraso",
    "prazo":"Hoje, 18h",
    "status":"em_andamento",
    "responsavel":{"nome":"João Santos"},
    "notas":"Caso de teste criado via curl"
  }')
echo "$CREATE_CASE_RESPONSE"
echo ""

# Extrai ID do caso criado
CASE_ID=$(echo "$CREATE_CASE_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4 || echo "")

if [ -n "$CASE_ID" ] && [ "$CASE_ID" != "" ]; then
  echo "✅ Caso criado com ID: $CASE_ID"
  echo ""
  
  echo "=== 7. POST /api/cases/:id/pdf (requer autenticação) ==="
  curl -X POST "$API_BASE/cases/$CASE_ID/pdf" \
    -H "Authorization: Bearer $TOKEN" \
    -w "\nStatus: %{http_code}\n"
  echo -e "\n"
else
  echo "⚠️  ID do caso não encontrado. Pulando teste de PDF."
  echo "   Você pode testar manualmente com:"
  echo "   curl -X POST \"$API_BASE/cases/SEU_CASE_ID/pdf\" -H \"Authorization: Bearer $TOKEN\""
  echo -e "\n"
fi

echo "=== 8. POST /api/upload-csv (requer autenticação e arquivo) ==="
if [ -f "tests/planilha-exemplo.csv" ]; then
  curl -X POST "$API_BASE/upload-csv" \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@tests/planilha-exemplo.csv" \
    -w "\nStatus: %{http_code}\n"
else
  echo "⚠️  Arquivo tests/planilha-exemplo.csv não encontrado."
  echo "   Criando caso de teste primeiro..."
  # Cria mais um caso para ter dados para comparar no CSV
  curl -s -X POST "$API_BASE/cases" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "passageiro":"Pedro Costa",
      "localizador":"XYZ789",
      "fornecedor":"GOL",
      "tipo":"cancelamento",
      "prazo":"Amanhã, 10h",
      "status":"aguardando_resposta",
      "responsavel":{"nome":"Ana Lima"},
      "notas":"Caso para teste de CSV"
    }' > /dev/null
  
  echo "   Execute o teste novamente após criar o arquivo CSV em tests/planilha-exemplo.csv"
fi
echo -e "\n"

echo "========================================="
echo "  Testes concluídos"
echo "========================================="
echo ""
echo "Para testar com token manualmente:"
echo "  export TOKEN='seu-token-aqui'"
echo "  curl -X GET \"$API_BASE/cases\" -H \"Authorization: Bearer \$TOKEN\""
echo ""

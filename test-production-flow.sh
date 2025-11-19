#!/bin/bash

# Script de teste do fluxo completo em produção
# Ordem em Dia - Teste de API

API_BASE="https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api"
FRONTEND_URL="https://ordem.konzuphub.com"

echo "=========================================="
echo "TESTE DO FLUXO COMPLETO EM PRODUÇÃO"
echo "Ordem em Dia - Konzup Hub"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    
    echo -e "${YELLOW}Testando: ${method} ${endpoint}${NC}"
    
    if [ -n "$token" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data" \
            "${API_BASE}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${API_BASE}${endpoint}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Status: $http_code${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
    elif [ "$http_code" -eq 401 ] || [ "$http_code" -eq 403 ]; then
        echo -e "${YELLOW}⚠ Status: $http_code (Autenticação necessária)${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
    else
        echo -e "${RED}✗ Status: $http_code${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
    fi
    echo ""
}

# 1. Health Check (público)
echo "1. HEALTH CHECK"
echo "---------------"
test_endpoint "GET" "/health" ""
echo ""

# 2. Casos de exemplo (público)
echo "2. CASOS DE EXEMPLO (público)"
echo "----------------------------"
test_endpoint "GET" "/cases/examples" ""
echo ""

# 3. Testar rotas que requerem autenticação
echo "3. ROTAS QUE REQUEREM AUTENTICAÇÃO"
echo "-----------------------------------"
echo "As seguintes rotas requerem token de autenticação:"
echo "  - GET  /api/cases (listar casos)"
echo "  - POST /api/cases (criar caso)"
echo "  - GET  /api/cases/:id (buscar caso por ID)"
echo "  - PATCH /api/cases/:id (atualizar caso)"
echo "  - POST /api/cases/:id/pdf (gerar PDF)"
echo ""
echo -e "${YELLOW}Para testar essas rotas:${NC}"
echo "1. Acesse o frontend: $FRONTEND_URL"
echo "2. Faça login ou crie uma conta"
echo "3. Use o DevTools (F12) > Network para ver as requisições"
echo "4. Copie o token do header Authorization"
echo "5. Execute este script novamente com: ./test-production-flow.sh <TOKEN>"
echo ""

# Se um token foi fornecido, testar rotas autenticadas
if [ -n "$1" ]; then
    TOKEN=$1
    echo "Token fornecido. Testando rotas autenticadas..."
    echo ""
    
    # Listar casos
    echo "4. LISTAR CASOS"
    echo "--------------"
    test_endpoint "GET" "/cases" "" "$TOKEN"
    
    # Criar um caso de teste
    echo "5. CRIAR CASO DE TESTE"
    echo "---------------------"
    test_case_data='{
        "passageiro": "Teste Automatizado",
        "localizador": "TEST123",
        "fornecedor": "LATAM",
        "tipo": "atraso",
        "prazo": "2025-01-20T18:00:00Z",
        "status": "em_andamento",
        "responsavel": {
            "nome": "Sistema de Teste"
        },
        "notas": "Caso criado automaticamente para teste do fluxo"
    }'
    CREATE_RESPONSE=$(test_endpoint "POST" "/cases" "$test_case_data" "$TOKEN")
    
    # Extrair ID do caso criado (se sucesso)
    CASE_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id' 2>/dev/null)
    
    if [ -n "$CASE_ID" ] && [ "$CASE_ID" != "null" ]; then
        echo "6. BUSCAR CASO POR ID"
        echo "---------------------"
        test_endpoint "GET" "/cases/$CASE_ID" "" "$TOKEN"
        
        echo "7. ATUALIZAR CASO"
        echo "-----------------"
        update_data='{
            "status": "resolvido",
            "notas": "Caso atualizado pelo teste automatizado"
        }'
        test_endpoint "PATCH" "/cases/$CASE_ID" "$update_data" "$TOKEN"
        
        echo "8. GERAR PDF DO CASO"
        echo "--------------------"
        test_endpoint "POST" "/cases/$CASE_ID/pdf" "" "$TOKEN"
    fi
fi

echo ""
echo "=========================================="
echo "TESTE CONCLUÍDO"
echo "=========================================="
echo ""
echo "Próximos passos para teste manual:"
echo "1. Acesse: $FRONTEND_URL"
echo "2. Faça login"
echo "3. Teste o fluxo completo:"
echo "   - Criar novo caso (página Casos)"
echo "   - Ver lista de casos (página Hoje e Casos)"
echo "   - Ver detalhes de um caso (clicar em 'Ver caso')"
echo "   - Editar caso (na página de detalhes)"
echo "   - Gerar PDF (botão 'Gerar PDF')"
echo ""


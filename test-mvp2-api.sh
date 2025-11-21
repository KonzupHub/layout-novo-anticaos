#!/bin/bash
# Script de teste das APIs do MVP 2.0

BASE_URL="https://konzup-hub-backend-mvp2-test-rsdkbytqeq-uc.a.run.app/api"
echo "=== Testando Backend MVP 2.0 ==="
echo "Base URL: $BASE_URL"
echo ""

# 1. Health check
echo "1. Health Check:"
curl -s "$BASE_URL/health" | jq '.'
echo ""

# 2. Verificar se precisa de autenticação para /cases
echo "2. Testando /cases (sem auth - deve retornar erro):"
curl -s "$BASE_URL/cases" | jq '.'
echo ""

echo "=== Testes concluídos ==="

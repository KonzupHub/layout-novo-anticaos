#!/bin/bash
# Script para testar endpoints de casos em produção

BASE_URL="https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api"
echo "=== Testando Endpoints de Casos em Produção ==="
echo "Base URL: $BASE_URL"
echo ""

# 1. Health check (sem auth)
echo "1. Health Check (sem autenticação):"
curl -s "$BASE_URL/health" | jq '.'
echo ""

# 2. Tentar GET /cases sem auth (deve retornar erro de autenticação)
echo "2. GET /cases (sem autenticação - deve retornar erro):"
curl -s "$BASE_URL/cases" | jq '.'
echo ""

echo "=== Nota: Para testar com autenticação, é necessário um token Firebase ID token ==="

#!/bin/bash
# Script para testar a requisição de IA como o frontend faria

API_BASE="${VITE_API_BASE:-https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api}"
ENDPOINT="/ia/sugerir-resumo"

# Precisamos de um token válido e um casoId válido
# Por enquanto, vamos apenas mostrar como seria a requisição

echo "=== DIAGNÓSTICO: Requisição de IA ==="
echo ""
echo "URL completa: ${API_BASE}${ENDPOINT}"
echo "Método: POST"
echo "Headers esperados:"
echo "  Content-Type: application/json"
echo "  Authorization: Bearer <token>"
echo ""
echo "Body esperado (JSON):"
echo '  { "casoId": "<id-do-caso>" }'
echo ""
echo "Para testar com um caso real, você precisa:"
echo "1. Fazer login no frontend"
echo "2. Criar ou abrir um caso"
echo "3. Clicar no botão 'Gerar Parecer com IA'"
echo "4. Abrir DevTools > Network e ver a requisição"
echo ""

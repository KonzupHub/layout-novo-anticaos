#!/bin/bash
# Script para criar índice do Firestore via gcloud

PROJECT_ID="ordem-em-dia"
COLLECTION="cases"

echo "Criando índice composto para coleção 'cases'..."
echo "Campos: cnpj (ASC), createdAt (DESC)"

# Criar arquivo temporário de índice
cat > /tmp/firestore-index.json << 'INDEXJSON'
{
  "indexes": [
    {
      "collectionGroup": "cases",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "cnpj",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
INDEXJSON

echo "Arquivo de índice criado em /tmp/firestore-index.json"
echo "Para criar o índice, use:"
echo "  gcloud firestore indexes create --project=$PROJECT_ID --source=/tmp/firestore-index.json"
echo ""
echo "OU crie manualmente no console:"
echo "  https://console.firebase.google.com/project/$PROJECT_ID/firestore/indexes"

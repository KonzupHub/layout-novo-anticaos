PORT=8080
FIREBASE_PROJECT_ID=
GCLOUD_PROJECT=
GCS_BUCKET=
CORS_ORIGIN=http://localhost:5173
GOOGLE_APPLICATION_CREDENTIALS=.keys/konzup-sa.json
NODE_ENV=development

# Modo STUB para desenvolvimento sem credenciais Google
# Quando LOCAL_STUB=true:
# - Usa repositório em memória (dados perdidos ao reiniciar)
# - Ignora Firebase Admin e Cloud Storage
# - Salva PDFs em backend/.tmp
# - Autenticação mockada (aceita qualquer token)
LOCAL_STUB=true

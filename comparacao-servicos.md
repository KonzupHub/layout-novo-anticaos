# Comparação: Serviço de Teste vs Produção

## Serviços Cloud Run

### Produção: konzup-hub-backend
- URL: https://konzup-hub-backend-336386698724.us-central1.run.app
- Imagem: us-central1-docker.pkg.dev/ordem-em-dia/cloud-run-source-deploy/konzup-hub-backend@sha256:9b60256b7b10e1bc650910e50b218f229d16b83fdba6540b8fcf95df34bd1a58

### Teste: konzup-hub-backend-mvp2-test
- URL: https://konzup-hub-backend-mvp2-test-336386698724.us-central1.run.app
- Imagem: us-central1-docker.pkg.dev/ordem-em-dia/cloud-run-source-deploy/konzup-hub-backend-mvp2-test@sha256:f6d38759e77189e91b0918aa66962b2612629700e3e9823d0acf5416bd91f44e

## Variáveis de Ambiente

### Produção (konzup-hub-backend)
- FIREBASE_PROJECT_ID=ordem-em-dia
- GCLOUD_PROJECT=ordem-em-dia
- LOCAL_STUB=false
- VERTEX_AI_PROJECT_ID=carbon-bonsai-395917

### Teste (konzup-hub-backend-mvp2-test)
- VERTEX_AI_PROJECT_ID=carbon-bonsai-395917
- FIREBASE_PROJECT_ID=ordem-em-dia
- GCLOUD_PROJECT=ordem-em-dia
- LOCAL_STUB=false

## Conclusão
Ambos os serviços têm as mesmas variáveis de ambiente, incluindo VERTEX_AI_PROJECT_ID=carbon-bonsai-395917.
As imagens são diferentes, indicando que são builds diferentes.

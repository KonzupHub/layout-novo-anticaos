// Verificar estrutura esperada
const backendResponse = {
  "ok": true,
  "resumo": "texto do resumo",
  "mensagemSugerida": "mensagem"
};

// O que o frontend faz
const response = backendResponse; // request() retorna diretamente
console.log('response.ok:', response.ok);
console.log('response.data:', response.data);
console.log('response.data?.resumo:', response.data?.resumo);

// O frontend espera response.data.resumo, mas response.data é undefined
// Então precisa ser: { ok: true, data: { resumo: "...", mensagemSugerida: "..." } }

// Testar estrutura da resposta
const response = {
  "ok": true,
  "resumo": "Voo com atraso de 3 horas resultou na perda de conexão do passageiro, exigindo assistência e reacomodação conforme a Resolução 400 da ANAC. A agência deve agir imediatamente para minimizar impactos ao passageiro e cumprir os direitos. Prazo para ação do incidente é de 3 dias."
};

// O que o frontend espera
console.log('Frontend espera: response.data.resumo');
console.log('Resposta atual: response.resumo');
console.log('');
console.log('Estrutura atual:', JSON.stringify(response, null, 2));
console.log('');
console.log('Para funcionar, precisa ser:', JSON.stringify({ ok: true, data: response }, null, 2));

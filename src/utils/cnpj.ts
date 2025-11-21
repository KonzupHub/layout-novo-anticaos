/**
 * Remove caracteres não numéricos do CNPJ
 */
export function limparCNPJ(cnpj: string): string {
  return cnpj.replace(/[^\d]/g, '');
}

/**
 * Formata CNPJ com máscara visual (XX.XXX.XXX/XXXX-XX)
 */
export function formatarCNPJ(cnpj: string): string {
  const numeros = limparCNPJ(cnpj);
  if (numeros.length !== 14) return cnpj;
  return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Valida CNPJ brasileiro
 * Verifica formato, dígitos verificadores e sequências repetidas
 */
export function validarCNPJ(cnpj: string): boolean {
  const numeros = limparCNPJ(cnpj);
  
  // Verifica se tem 14 dígitos
  if (numeros.length !== 14) return false;
  
  // Verifica se não é sequência repetida (ex: 11111111111111)
  if (/^(\d)\1+$/.test(numeros)) return false;
  
  // Valida primeiro dígito verificador
  let tamanho = numeros.length - 2;
  let sequencia = numeros.substring(0, tamanho);
  const digitos = numeros.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(sequencia.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  // Valida segundo dígito verificador
  tamanho = tamanho + 1;
  sequencia = numeros.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(sequencia.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
}


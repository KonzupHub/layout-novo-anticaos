import { VertexAI } from '@google-cloud/vertexai';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import type { AnacResumo } from '../types/anac.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração de credenciais para desenvolvimento local
// Em produção no Cloud Run, usa Application Default Credentials automaticamente
if (process.env.NODE_ENV !== 'production' && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const credentialsPath = path.resolve(__dirname, '../../keys/carbon-bonsai-395917-16f679bb2e29.json');
  // Verifica se o arquivo existe antes de definir
  if (existsSync(credentialsPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
  }
}

// MVP 2.0: Vertex AI sempre usa o projeto carbon-bonsai-395917 (onde existem créditos)
// O Cloud Run roda em ordem-em-dia, mas as chamadas de Vertex AI devem usar carbon-bonsai-395917
const VERTEX_AI_PROJECT_ID = process.env.VERTEX_AI_PROJECT_ID || 'carbon-bonsai-395917';
const LOCATION = 'us-central1';
const MODEL = 'gemini-2.5-flash';

// Inicializa o cliente Vertex AI
// Em produção, usa Application Default Credentials automaticamente
// Em desenvolvimento, usa GOOGLE_APPLICATION_CREDENTIALS se configurado
const vertexAIOptions: {
  project: string;
  location: string;
} = {
  project: VERTEX_AI_PROJECT_ID,
  location: LOCATION,
};

const vertexAI = new VertexAI(vertexAIOptions);

const model = vertexAI.getGenerativeModel({
  model: MODEL,
});

export interface DadosCaso {
  tipo: string;
  descricao: string;
  prazoDias: number;
  anacResumo?: AnacResumo; // MVP 2.0: contexto de prazos ANAC
}

/**
 * Gera um resumo de caso usando Gemini Vertex AI
 * @param dadosDoCaso - Dados do caso (tipo, descrição, prazo em dias)
 * @returns Resumo gerado em português, sem HTML ou markdown
 */
export async function sugerirResumoCaso(dadosDoCaso: DadosCaso): Promise<string> {
  try {
    const { tipo, descricao, prazoDias, anacResumo } = dadosDoCaso;

    // Monta o prompt em português com contexto ANAC se disponível
    let contextoANAC = '';
    if (anacResumo) {
      const prazosTexto = anacResumo.prazosImportantes
        .map(p => `${p.descricao} (${p.diasRestantes !== undefined ? `${p.diasRestantes} dias restantes` : 'imediato'})`)
        .join(', ');
      contextoANAC = `\n\nContexto Resolução 400 ANAC:\n- Categoria: ${anacResumo.categoriaIncidente}\n- Prazos: ${prazosTexto || 'Nenhum prazo específico'}\n- Direitos aplicáveis: ${anacResumo.direitosBasicos.slice(0, 2).join(', ')}`;
    }

    const prompt = `Você é um assistente especializado em resumir casos de incidentes aéreos para agências de turismo, seguindo a Resolução 400 da ANAC.

Gere um resumo objetivo e profissional do seguinte caso:

Tipo de incidente: ${tipo}
Descrição: ${descricao}
Prazo para ação: ${prazoDias} dias${contextoANAC}

O resumo deve:
- Ser claro e direto
- Destacar os pontos principais do incidente
- Referenciar os prazos da Resolução 400 quando relevante
- Ser escrito em português brasileiro
- Não usar formatação (sem HTML, sem markdown, sem quebras de linha excessivas)
- Ter no máximo 3 frases

Resumo:`;

    // Chama o modelo Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const texto = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!texto) {
      throw new Error('Resposta vazia do modelo Gemini');
    }

    // Limpa o texto: remove markdown, HTML e quebras de linha excessivas
    let resumo = texto
      .replace(/\*\*/g, '') // Remove markdown bold
      .replace(/\*/g, '') // Remove markdown italic
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
      .replace(/<[^>]+>/g, '') // Remove HTML tags
      .replace(/\n{3,}/g, '\n\n') // Remove múltiplas quebras de linha
      .trim();

    // Garante que não tenha mais de 3 frases
    const frases = resumo.split(/[.!?]+/).filter((f: string) => f.trim().length > 0);
    if (frases.length > 3) {
      resumo = frases.slice(0, 3).join('. ') + '.';
    }

    return resumo;
  } catch (error: unknown) {
    console.error('Erro ao gerar resumo com Gemini:', error);
    
    if (error instanceof Error) {
      // Erros específicos do Vertex AI
      if (error.message.includes('PERMISSION_DENIED')) {
        throw new Error('Sem permissão para acessar o Vertex AI. Verifique as credenciais.');
      }
      if (error.message.includes('NOT_FOUND')) {
        throw new Error('Modelo ou projeto não encontrado. Verifique a configuração.');
      }
      if (error.message.includes('QUOTA_EXCEEDED')) {
        throw new Error('Cota do Vertex AI excedida.');
      }
    }
    
    throw new Error('Erro ao gerar resumo do caso. Tente novamente mais tarde.');
  }
}


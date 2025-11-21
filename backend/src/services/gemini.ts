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

// Log da configuração para diagnóstico
console.log('[Vertex AI] Configuração:', {
  project: VERTEX_AI_PROJECT_ID,
  location: LOCATION,
  model: MODEL,
  nodeEnv: process.env.NODE_ENV,
  hasCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Inicializa o cliente Vertex AI
// IMPORTANTE: Em produção no Cloud Run, o SDK pode usar as Application Default Credentials
// do projeto onde o Cloud Run está rodando (ordem-em-dia), mas precisamos forçar o uso
// do projeto correto (carbon-bonsai-395917) através do parâmetro project.
// O SDK deve respeitar o parâmetro project, mas vamos garantir com logs e tratamento de erro.
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

    // Log antes de chamar o modelo para diagnóstico
    console.log('[Vertex AI] Chamando modelo Gemini:', {
      project: VERTEX_AI_PROJECT_ID,
      location: LOCATION,
      model: MODEL,
      promptLength: prompt.length,
    });

    // Chama o modelo Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const texto = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('[Vertex AI] Resposta recebida:', {
      hasText: !!texto,
      textLength: texto.length,
      candidatesCount: response.candidates?.length || 0,
    });
    
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
    // Log detalhado do erro para diagnóstico
    console.error('[Vertex AI] Erro ao gerar resumo com Gemini:', error);
    console.error('[Vertex AI] Detalhes do erro:', {
      project: VERTEX_AI_PROJECT_ID,
      location: LOCATION,
      model: MODEL,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack?.substring(0, 500) : undefined,
      // Verifica se o erro menciona projeto incorreto
      mentionsWrongProject: error instanceof Error && (
        error.message.includes('ordem-em-dia') || 
        error.message.includes('336386698724')
      ),
    });
    
    if (error instanceof Error) {
      // Erros específicos do Vertex AI
      if (error.message.includes('PERMISSION_DENIED') || error.message.includes('403')) {
        console.error('[Vertex AI] Erro de permissão detectado. Verifique se a service account tem roles/aiplatform.user no projeto', VERTEX_AI_PROJECT_ID);
        throw new Error('Sem permissão para acessar o Vertex AI. Verifique as credenciais.');
      }
      if (error.message.includes('NOT_FOUND') || error.message.includes('404')) {
        console.error('[Vertex AI] Erro de modelo/projeto não encontrado. Verifique se o modelo', MODEL, 'existe no projeto', VERTEX_AI_PROJECT_ID);
        throw new Error('Modelo ou projeto não encontrado. Verifique a configuração.');
      }
      if (error.message.includes('QUOTA_EXCEEDED') || error.message.includes('429')) {
        throw new Error('Cota do Vertex AI excedida.');
      }
      // Verifica se o erro menciona projeto incorreto
      if (error.message.includes('ordem-em-dia') || error.message.includes('336386698724')) {
        console.error('[Vertex AI] ATENÇÃO: Erro menciona projeto ordem-em-dia. O SDK pode estar usando ADC do projeto errado.');
        throw new Error('Configuração de projeto incorreta. O SDK está usando o projeto ordem-em-dia em vez de carbon-bonsai-395917.');
      }
    }
    
    throw new Error('Erro ao gerar resumo do caso. Tente novamente mais tarde.');
  }
}


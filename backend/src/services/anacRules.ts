/**
 * Motor de Regras da Resolução 400 da ANAC
 * 
 * MVP 2.0 - Versão simplificada inicial
 * 
 * Este módulo implementa uma primeira versão conservadora do trilho de regras
 * baseado na Resolução 400 da ANAC, focando nos tipos de incidente mais comuns:
 * - Atraso maior que 4 horas
 * - Cancelamento
 * - Overbooking
 * - Mudança de voo
 * - Extravio
 * 
 * As regras são aplicadas de forma determinística baseadas no tipo de incidente
 * e nas informações disponíveis no caso.
 */

import type { Case, CaseType } from '../types/shared.js';
import type { AnacResumo, PrazoANAC } from '../types/anac.js';

/**
 * Calcula os prazos ANAC baseados no tipo de incidente e data do voo
 */
function calcularPrazos(tipo: CaseType, dataVoo?: string): PrazoANAC[] {
  const prazos: PrazoANAC[] = [];
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Calcula data base (data do voo ou hoje)
  let dataBase = hoje;
  if (dataVoo) {
    const dataVooParsed = new Date(dataVoo);
    if (!isNaN(dataVooParsed.getTime())) {
      dataBase = dataVooParsed;
      dataBase.setHours(0, 0, 0, 0);
    }
  }

  switch (tipo) {
    case 'atraso':
      // Atraso > 4h: 7 dias para oferecer assistência material ou reembolso
      const prazoAssistencia = new Date(dataBase);
      prazoAssistencia.setDate(prazoAssistencia.getDate() + 7);
      const diasRestantesAssistencia = Math.ceil((prazoAssistencia.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      prazos.push({
        descricao: 'Oferecer assistência material ou reembolso',
        prazoDias: 7,
        prazoLimite: prazoAssistencia,
        status: diasRestantesAssistencia < 0 ? 'vencido' : diasRestantesAssistencia <= 2 ? 'proximo_vencer' : 'dentro_prazo',
        diasRestantes: diasRestantesAssistencia,
      });
      break;

    case 'cancelamento':
      // Cancelamento: 7 dias para oferecer reacomodação ou reembolso
      const prazoReacomodacao = new Date(dataBase);
      prazoReacomodacao.setDate(prazoReacomodacao.getDate() + 7);
      const diasRestantesReacomodacao = Math.ceil((prazoReacomodacao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      prazos.push({
        descricao: 'Oferecer reacomodação ou reembolso',
        prazoDias: 7,
        prazoLimite: prazoReacomodacao,
        status: diasRestantesReacomodacao < 0 ? 'vencido' : diasRestantesReacomodacao <= 2 ? 'proximo_vencer' : 'dentro_prazo',
        diasRestantes: diasRestantesReacomodacao,
      });
      break;

    case 'overbooking':
      // Overbooking: Imediato para reacomodação + 7 dias para compensação
      prazos.push({
        descricao: 'Reacomodação imediata',
        prazoDias: 0,
        status: 'dentro_prazo',
      });
      
      const prazoCompensacao = new Date(dataBase);
      prazoCompensacao.setDate(prazoCompensacao.getDate() + 7);
      const diasRestantesCompensacao = Math.ceil((prazoCompensacao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      prazos.push({
        descricao: 'Compensação financeira',
        prazoDias: 7,
        prazoLimite: prazoCompensacao,
        status: diasRestantesCompensacao < 0 ? 'vencido' : diasRestantesCompensacao <= 2 ? 'proximo_vencer' : 'dentro_prazo',
        diasRestantes: diasRestantesCompensacao,
      });
      break;

    case 'mudanca_voo':
      // Mudança de voo: Comunicação imediata + assistência se necessário
      prazos.push({
        descricao: 'Comunicação ao passageiro',
        prazoDias: 0,
        status: 'dentro_prazo',
      });
      break;

    case 'extravio':
      // Extravio: 7 dias para localização + assistência emergencial imediata
      prazos.push({
        descricao: 'Assistência emergencial',
        prazoDias: 0,
        status: 'dentro_prazo',
      });
      
      const prazoLocalizacao = new Date(dataBase);
      prazoLocalizacao.setDate(prazoLocalizacao.getDate() + 7);
      const diasRestantesLocalizacao = Math.ceil((prazoLocalizacao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      prazos.push({
        descricao: 'Localização da bagagem',
        prazoDias: 7,
        prazoLimite: prazoLocalizacao,
        status: diasRestantesLocalizacao < 0 ? 'vencido' : diasRestantesLocalizacao <= 2 ? 'proximo_vencer' : 'dentro_prazo',
        diasRestantes: diasRestantesLocalizacao,
      });
      break;
  }

  return prazos;
}

/**
 * Retorna os direitos básicos aplicáveis ao tipo de incidente
 */
function getDireitosBasicos(tipo: CaseType): string[] {
  const direitos: Record<CaseType, string[]> = {
    atraso: [
      'Assistência material (alimentação, comunicação, hospedagem se necessário)',
      'Reembolso proporcional ou reacomodação em voo alternativo',
      'Compensação financeira se atraso superior a 4 horas',
    ],
    cancelamento: [
      'Reacomodação em voo alternativo sem custo adicional',
      'Reembolso integral do valor pago',
      'Assistência material durante espera',
    ],
    overbooking: [
      'Reacomodação imediata em voo alternativo',
      'Compensação financeira conforme Resolução 400',
      'Assistência material durante espera',
    ],
    mudanca_voo: [
      'Comunicação prévia sobre mudança',
      'Assento equivalente ou superior',
      'Assistência se mudança causar atraso significativo',
    ],
    extravio: [
      'Assistência emergencial imediata (itens essenciais)',
      'Localização e entrega da bagagem em até 7 dias',
      'Compensação se bagagem não for localizada',
    ],
  };

  return direitos[tipo] || [];
}

/**
 * Retorna alertas operacionais baseados no tipo e status do caso
 */
function getAlertasOperacionais(caso: Case): string[] {
  const alertas: string[] = [];

  // Alerta se prazo está próximo ou vencido
  const prazos = calcularPrazos(caso.tipo, caso.dataVoo);
  const prazosVencidos = prazos.filter(p => p.status === 'vencido');
  const prazosProximos = prazos.filter(p => p.status === 'proximo_vencer');

  if (prazosVencidos.length > 0) {
    alertas.push(`⚠️ ${prazosVencidos.length} prazo(s) ANAC vencido(s) - ação urgente necessária`);
  } else if (prazosProximos.length > 0) {
    alertas.push(`⏰ ${prazosProximos.length} prazo(s) ANAC próximo(s) de vencer - atenção necessária`);
  }

  // Alertas específicos por tipo
  if (caso.tipo === 'overbooking' && caso.status !== 'encerrado') {
    alertas.push('Reacomodação deve ser oferecida imediatamente');
  }

  if (caso.tipo === 'extravio' && caso.status !== 'encerrado') {
    alertas.push('Assistência emergencial deve ser oferecida imediatamente');
  }

  if (caso.tipo === 'mudanca_voo' && !caso.timelineIncidente) {
    alertas.push('Comunicação ao passageiro deve ser registrada');
  }

  return alertas;
}

/**
 * Função principal: interpreta um caso segundo a Resolução 400 da ANAC
 * 
 * @param caso - Caso a ser interpretado
 * @returns Objeto com categoria, direitos, prazos e alertas
 */
export function interpretarCasoANAC(caso: Case): AnacResumo {
  const categoriaIncidente = getCategoriaIncidente(caso.tipo);
  const direitosBasicos = getDireitosBasicos(caso.tipo);
  const prazosImportantes = calcularPrazos(caso.tipo, caso.dataVoo);
  const alertasOperacionais = getAlertasOperacionais(caso);

  return {
    categoriaIncidente,
    direitosBasicos,
    prazosImportantes,
    alertasOperacionais,
  };
}

/**
 * Retorna a categoria do incidente conforme Resolução 400
 */
function getCategoriaIncidente(tipo: CaseType): string {
  const categorias: Record<CaseType, string> = {
    atraso: 'Atraso de voo superior a 4 horas',
    cancelamento: 'Cancelamento de voo',
    overbooking: 'Preterição (Overbooking)',
    mudanca_voo: 'Mudança de voo ou equipamento',
    extravio: 'Extravio de bagagem',
  };

  return categorias[tipo] || 'Incidente aéreo';
}


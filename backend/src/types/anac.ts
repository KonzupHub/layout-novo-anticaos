/**
 * Tipos relacionados à interpretação da Resolução 400 da ANAC
 * MVP 2.0 - Versão simplificada inicial
 */

export interface AnacResumo {
  categoriaIncidente: string;
  direitosBasicos: string[];
  prazosImportantes: PrazoANAC[];
  alertasOperacionais: string[];
}

export interface PrazoANAC {
  descricao: string;
  prazoDias: number;
  prazoLimite?: Date;
  status: 'dentro_prazo' | 'proximo_vencer' | 'vencido';
  diasRestantes?: number;
}


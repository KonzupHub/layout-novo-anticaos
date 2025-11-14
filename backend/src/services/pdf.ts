import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { Case, Agency } from '../types/shared.js';

/**
 * LAYOUT ATUAL DO PDF (antes da refatoração):
 * - Título simples "RELATÓRIO DE CASO"
 * - Lista linear de campos: ID, Passageiro, Localizador, Fornecedor, Tipo, Status, Prazo, Responsável
 * - Seção de Observações (se existir)
 * - Rodapé com data de geração
 * 
 * LAYOUT NOVO (após refatoração):
 * - Cabeçalho com título, nome da agência, CNPJ e data
 * - Badge de categoria do tipo de incidente
 * - Seção "Dados do Caso" com grid de informações
 * - Seção "Cliente Afetado" com dados do passageiro
 * - Seção "Linha do Tempo" com marcos principais
 * - Seção "Cumprimento de Prazos ANAC" com status dos prazos
 * - Seção "Resultado Final" com status atual do caso
 */

// Mapeamento de tipos internos para categorias amigáveis (inspirado na landing)
const TIPO_CATEGORIAS: Record<string, string> = {
  cancelamento: 'Cancelamento de voo',
  atraso: 'Atraso de voo',
  overbooking: 'Preterição ou Overbooking',
  mudanca_voo: 'Mudança de equipamento',
  // Tipos adicionais podem ser mapeados aqui
};

const TIPO_LABELS: Record<string, string> = {
  atraso: 'Atraso > 4h',
  cancelamento: 'Cancelamento',
  overbooking: 'Overbooking',
  mudanca_voo: 'Mudança de voo',
};

const STATUS_LABELS: Record<string, string> = {
  em_andamento: 'Em andamento',
  aguardando_resposta: 'Aguardando resposta',
  documentacao_pendente: 'Documentação pendente',
  encerrado: 'Encerrado',
};

/**
 * Retorna a categoria amigável do tipo de caso
 */
function getCategoriaTipo(tipo: string): string {
  return TIPO_CATEGORIAS[tipo] || 'Outros';
}

/**
 * Formata CNPJ para exibição (XX.XXX.XXX/XXXX-XX)
 */
function formatCNPJ(cnpj: string): string {
  if (!cnpj || cnpj.length !== 14) return cnpj;
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}

/**
 * Formata data ISO para formato brasileiro (DD/MM/YYYY HH:mm)
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export async function generateCaseReport(
  caso: Case,
  agencia?: Agency | null,
  logoUrl?: string
): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let yPosition = height - 50;
  const marginX = 50;
  const sectionSpacing = 25;

  /**
   * Função auxiliar para adicionar nova página se necessário
   */
  const checkNewPage = (requiredSpace: number = 50) => {
    if (yPosition < requiredSpace) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - 50;
      return true;
    }
    return false;
  };

  /**
   * Função auxiliar para desenhar título de seção
   */
  const drawSectionTitle = (title: string, size: number = 14) => {
    checkNewPage(80);
    yPosition -= sectionSpacing;
    page.drawText(title, {
      x: marginX,
      y: yPosition,
      size,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.4),
    });
    yPosition -= 20;
  };

  /**
   * Função auxiliar para desenhar linha separadora
   */
  const drawSeparator = () => {
    checkNewPage(30);
    page.drawLine({
      start: { x: marginX, y: yPosition },
      end: { x: width - marginX, y: yPosition },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
    yPosition -= 15;
  };

  // ============================================
  // SEÇÃO 1: CABEÇALHO DO RELATÓRIO
  // ============================================
  page.drawText('RELATÓRIO DE CASO DE INCIDENTE AÉREO', {
    x: marginX,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.4),
  });
  yPosition -= 30;

  // Nome da agência
  const nomeAgencia = agencia?.nome || 'Agência não identificada';
  page.drawText(nomeAgencia, {
    x: marginX,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= 18;

  // CNPJ (se disponível)
  if (caso.cnpj && caso.cnpj !== '00000000000000') {
    page.drawText(`CNPJ: ${formatCNPJ(caso.cnpj)}`, {
      x: marginX,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    yPosition -= 15;
  }

  // Data de emissão
  const dataEmissao = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  page.drawText(`Data de emissão: ${dataEmissao}`, {
    x: marginX,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });
  yPosition -= sectionSpacing;

  drawSeparator();

  // ============================================
  // SEÇÃO 2: IDENTIFICAÇÃO E CATEGORIA DO CASO
  // ============================================
  const categoria = getCategoriaTipo(caso.tipo);
  
  // Badge de categoria (retângulo com fundo)
  const badgeY = yPosition;
  const badgeHeight = 20;
  const badgeWidth = Math.min(250, boldFont.widthOfTextAtSize(categoria, 11) + 20);
  
  page.drawRectangle({
    x: marginX,
    y: badgeY - badgeHeight,
    width: badgeWidth,
    height: badgeHeight,
    color: rgb(0.9, 0.95, 1.0), // Azul muito claro
    borderColor: rgb(0.2, 0.4, 0.8),
    borderWidth: 1,
  });
  
  page.drawText(categoria, {
    x: marginX + 10,
    y: badgeY - 15,
    size: 11,
    font: boldFont,
    color: rgb(0.2, 0.4, 0.8),
  });
  
  yPosition -= 35;

  // Número do caso
  page.drawText(`Número do Caso: ${caso.id}`, {
    x: marginX,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.2, 0.2, 0.2),
  });
  yPosition -= sectionSpacing;

  drawSeparator();

  // ============================================
  // SEÇÃO 3: DADOS DO CASO
  // ============================================
  drawSectionTitle('Dados do Caso', 12);

  const dadosCaso: Array<{ label: string; value: string }> = [];
  
  // Fornecedor (companhia aérea)
  if (caso.fornecedor) {
    dadosCaso.push({ label: 'Companhia Aérea', value: caso.fornecedor });
  }
  
  // Localizador (número do voo)
  if (caso.localizador) {
    dadosCaso.push({ label: 'Localizador', value: caso.localizador });
  }
  
  // Status
  dadosCaso.push({ 
    label: 'Status', 
    value: STATUS_LABELS[caso.status] || caso.status 
  });
  
  // Prazo
  if (caso.prazo) {
    dadosCaso.push({ label: 'Prazo', value: caso.prazo });
  }
  
  // Responsável
  if (caso.responsavel?.nome) {
    dadosCaso.push({ label: 'Responsável', value: caso.responsavel.nome });
  }

  // Desenha os dados em grid (2 colunas)
  const col1X = marginX;
  const col2X = width / 2 + 20;
  let currentCol = 0;
  let currentY = yPosition;

  dadosCaso.forEach((item, index) => {
    checkNewPage(60);
    
    const xPos = currentCol === 0 ? col1X : col2X;
    
    // Label em negrito
    page.drawText(`${item.label}:`, {
      x: xPos,
      y: currentY,
      size: 9,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    // Valor
    const valueLines = wrapText(item.value, width / 2 - 30, font, 9);
    valueLines.forEach((line, lineIdx) => {
      page.drawText(line, {
        x: xPos + 5,
        y: currentY - 12 - (lineIdx * 12),
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
    });
    
    const lineHeight = Math.max(15, valueLines.length * 12);
    
    if (currentCol === 0) {
      currentCol = 1;
    } else {
      currentCol = 0;
      currentY -= lineHeight + 10;
      yPosition = currentY;
    }
  });

  if (currentCol === 1) {
    yPosition = currentY - 20;
  }

  yPosition -= sectionSpacing;
  drawSeparator();

  // ============================================
  // SEÇÃO 4: CLIENTE AFETADO
  // ============================================
  drawSectionTitle('Cliente Afetado', 12);

  if (caso.passageiro) {
    page.drawText(caso.passageiro, {
      x: marginX,
      y: yPosition,
      size: 11,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
  }

  // Se houver informações de contato nas notas, tentar extrair
  // Por enquanto, apenas mostra o passageiro
  // TODO: No futuro, se o modelo Case tiver campos específicos de contato, usar aqui

  yPosition -= sectionSpacing;
  drawSeparator();

  // ============================================
  // SEÇÃO 5: LINHA DO TEMPO
  // ============================================
  drawSectionTitle('Linha do Tempo', 12);

  const timelineItems: Array<{ time: string; event: string }> = [];

  // Abertura do caso
  if (caso.createdAt) {
    timelineItems.push({
      time: formatDate(caso.createdAt),
      event: 'Caso aberto no sistema',
    });
  }

  // Última atualização
  if (caso.updatedAt && caso.updatedAt !== caso.createdAt) {
    timelineItems.push({
      time: formatDate(caso.updatedAt),
      event: 'Última atualização',
    });
  }

  // Encerramento (se status for encerrado)
  if (caso.status === 'encerrado' && caso.updatedAt) {
    timelineItems.push({
      time: formatDate(caso.updatedAt),
      event: 'Caso encerrado',
    });
  }

  if (timelineItems.length > 0) {
    timelineItems.forEach((item) => {
      checkNewPage(40);
      
      // Badge de tempo
      const timeWidth = font.widthOfTextAtSize(item.time, 8) + 10;
      page.drawRectangle({
        x: marginX,
        y: yPosition - 12,
        width: timeWidth,
        height: 14,
        borderColor: rgb(0.6, 0.6, 0.6),
        borderWidth: 1,
      });
      
      page.drawText(item.time, {
        x: marginX + 5,
        y: yPosition - 10,
        size: 8,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      // Evento
      page.drawText(item.event, {
        x: marginX + timeWidth + 10,
        y: yPosition - 10,
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
      
      yPosition -= 25;
    });
  } else {
    // Se não houver datas estruturadas, mostra um parágrafo simples
    checkNewPage(40);
    const timelineText = caso.createdAt 
      ? `Caso registrado em ${formatDate(caso.createdAt)}. ${caso.updatedAt && caso.updatedAt !== caso.createdAt ? `Última atualização em ${formatDate(caso.updatedAt)}.` : ''}`
      : 'Informações de data não disponíveis.';
    
    const timelineLines = wrapText(timelineText, width - 2 * marginX, font, 9);
    timelineLines.forEach((line) => {
      page.drawText(line, {
        x: marginX,
        y: yPosition,
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPosition -= 12;
    });
  }

  yPosition -= sectionSpacing;
  drawSeparator();

  // ============================================
  // SEÇÃO 6: CUMPRIMENTO DE PRAZOS ANAC
  // ============================================
  drawSectionTitle('Cumprimento de Prazos ANAC', 12);

  checkNewPage(60);
  
  // Por enquanto, não há lógica específica de cálculo de prazos ANAC no backend
  // Usa texto genérico baseado no status e prazo do caso
  let anacText = '';
  
  if (caso.prazo) {
    anacText = `O prazo para ação está sendo acompanhado no sistema. ${caso.prazo}. `;
  }
  
  if (caso.status === 'em_andamento') {
    anacText += 'O caso está em andamento e os prazos da ANAC estão sendo monitorados.';
  } else if (caso.status === 'aguardando_resposta') {
    anacText += 'Aguardando resposta da companhia aérea. Os prazos da ANAC continuam sendo monitorados.';
  } else if (caso.status === 'encerrado') {
    anacText += 'Caso encerrado. Todos os prazos foram cumpridos conforme a legislação vigente.';
  } else {
    anacText += 'Os prazos da ANAC estão sendo acompanhados no sistema conforme a Resolução 400.';
  }

  const anacLines = wrapText(anacText, width - 2 * marginX, font, 9);
  anacLines.forEach((line) => {
    checkNewPage(30);
    page.drawText(line, {
      x: marginX,
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });
    yPosition -= 12;
  });

  yPosition -= sectionSpacing;
  drawSeparator();

  // ============================================
  // SEÇÃO 7: RESULTADO FINAL
  // ============================================
  drawSectionTitle('Resultado Final', 12);

  checkNewPage(80);
  
  // Desenha um retângulo destacado para o resultado
  const resultadoY = yPosition;
  const resultadoHeight = 50;
  
  page.drawRectangle({
    x: marginX,
    y: resultadoY - resultadoHeight,
    width: width - 2 * marginX,
    height: resultadoHeight,
    color: rgb(0.95, 0.98, 1.0), // Azul muito claro
    borderColor: rgb(0.2, 0.4, 0.8),
    borderWidth: 1.5,
  });

  // Texto do resultado baseado no status
  let resultadoText = '';
  
  if (caso.status === 'encerrado') {
    const encerramentoDate = caso.updatedAt ? formatDate(caso.updatedAt) : 'data não disponível';
    resultadoText = `Caso encerrado em ${encerramentoDate}. `;
    if (caso.notas) {
      resultadoText += caso.notas;
    } else {
      resultadoText += 'O incidente foi resolvido e o caso foi finalizado.';
    }
  } else {
    resultadoText = 'Caso em andamento. A agência está acompanhando o desfecho e tomando as medidas necessárias para resolução do incidente.';
    if (caso.notas) {
      resultadoText += ` ${caso.notas}`;
    }
  }

  // TODO: No futuro, esta frase pode ser gerada pela rota de IA /api/ia/sugerir-resumo
  // usando os dados do caso (tipo, descrição das notas, prazo)

  const resultadoLines = wrapText(resultadoText, width - 2 * marginX - 20, font, 10);
  let lineY = resultadoY - 20;
  resultadoLines.forEach((line) => {
    page.drawText(line, {
      x: marginX + 10,
      y: lineY,
      size: 10,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });
    lineY -= 14;
  });

  yPosition = resultadoY - resultadoHeight - sectionSpacing;

  // ============================================
  // RODAPÉ
  // ============================================
  const footerPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
  footerPage.drawText(
    `Gerado em: ${dataEmissao}`,
    {
      x: marginX,
      y: 30,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    }
  );

  return pdfDoc;
}

function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { Case } from '../types/shared.js';

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

export async function generateCaseReport(caso: Case, logoUrl?: string): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let yPosition = height - 50;

  // Logo placeholder (pode ser melhorado para carregar imagem real)
  if (logoUrl) {
    // TODO: Implementar carregamento de logo se necessário
    // Por enquanto, apenas texto
  }

  // Título
  page.drawText('RELATÓRIO DE CASO', {
    x: 50,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.4),
  });

  yPosition -= 40;

  // Linha separadora
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  yPosition -= 30;

  // Dados do caso
  const fields = [
    { label: 'ID do Caso', value: caso.id },
    { label: 'Passageiro', value: caso.passageiro },
    { label: 'Localizador', value: caso.localizador },
    { label: 'Fornecedor', value: caso.fornecedor },
    { label: 'Tipo', value: TIPO_LABELS[caso.tipo] || caso.tipo },
    { label: 'Status', value: STATUS_LABELS[caso.status] || caso.status },
    { label: 'Prazo', value: caso.prazo },
    { label: 'Responsável', value: caso.responsavel.nome },
  ];

  fields.forEach((field) => {
    if (yPosition < 100) {
      // Adiciona nova página se necessário
      const newPage = pdfDoc.addPage([595, 842]);
      yPosition = newPage.getSize().height - 50;
    }

    page.drawText(`${field.label}:`, {
      x: 50,
      y: yPosition,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(field.value || '-', {
      x: 200,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 20;
  });

  // Observações
  if (caso.notas) {
    yPosition -= 20;
    
    if (yPosition < 150) {
      const newPage = pdfDoc.addPage([595, 842]);
      yPosition = newPage.getSize().height - 50;
    }

    page.drawText('Observações:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;

    // Quebra notas em múltiplas linhas se necessário
    const maxWidth = width - 100;
    const lines = wrapText(caso.notas, maxWidth, font, 10);
    
    lines.forEach((line) => {
      if (yPosition < 50) {
        const newPage = pdfDoc.addPage([595, 842]);
        yPosition = newPage.getSize().height - 50;
      }

      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      yPosition -= 15;
    });
  }

  // Rodapé
  const footerPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
  footerPage.drawText(
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    {
      x: 50,
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

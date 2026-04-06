import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Inspection } from '@/types/inspection';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const severityLabels: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  completed: 'Concluída',
};

export function generateReport(inspection: Inspection) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(30, 35, 50);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(230, 180, 60);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE INSPEÇÃO ROBÓTICA', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 190);
  doc.text('Ambientes Confinados', pageWidth / 2, 28, { align: 'center' });
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth / 2, 35, { align: 'center' });

  y = 50;

  // Inspection details
  doc.setTextColor(230, 180, 60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DA INSPEÇÃO', 14, y);
  y += 2;

  autoTable(doc, {
    startY: y,
    body: [
      ['Data', format(new Date(inspection.date), "dd/MM/yyyy", { locale: ptBR })],
      ['Local', inspection.location],
      ['Responsável', inspection.responsible],
      ['Status', statusLabels[inspection.status] || inspection.status],
      ['Descrição', inspection.description || '-'],
    ],
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3, textColor: [200, 200, 210] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40, textColor: [180, 180, 190] },
    },
    alternateRowStyles: { fillColor: [35, 40, 55] },
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // Fault locations
  if (inspection.faultLocations.length > 0) {
    doc.setTextColor(230, 180, 60);
    doc.setFontSize(12);
    doc.text('LOCALIZAÇÃO DAS FALHAS', 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Latitude', 'Longitude', 'Descrição']],
      body: inspection.faultLocations.map((loc, i) => [
        String(i + 1),
        loc.lat.toFixed(6),
        loc.lng.toFixed(6),
        loc.description,
      ]),
      headStyles: { fillColor: [45, 50, 70], textColor: [230, 180, 60], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3, textColor: [200, 200, 210] },
      alternateRowStyles: { fillColor: [35, 40, 55] },
    });

    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // Technical notes
  if (inspection.notes.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setTextColor(230, 180, 60);
    doc.setFontSize(12);
    doc.text('ANOTAÇÕES TÉCNICAS', 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [['Severidade', 'Data/Hora', 'Observação']],
      body: inspection.notes.map(n => [
        severityLabels[n.severity] || n.severity,
        new Date(n.timestamp).toLocaleString('pt-BR'),
        n.text,
      ]),
      headStyles: { fillColor: [45, 50, 70], textColor: [230, 180, 60], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3, textColor: [200, 200, 210] },
      alternateRowStyles: { fillColor: [35, 40, 55] },
      columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 35 } },
    });

    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // Images
  if (inspection.images.length > 0) {
    if (y > 180) { doc.addPage(); y = 20; }
    doc.setTextColor(230, 180, 60);
    doc.setFontSize(12);
    doc.text('IMAGENS DA INSPEÇÃO', 14, y);
    y += 8;

    const imgWidth = 80;
    const imgHeight = 60;
    let x = 14;

    inspection.images.forEach((img, i) => {
      if (y + imgHeight + 10 > doc.internal.pageSize.getHeight() - 10) {
        doc.addPage();
        y = 20;
        x = 14;
      }
      try {
        doc.addImage(img.url, 'JPEG', x, y, imgWidth, imgHeight);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 160);
        doc.text(img.name, x, y + imgHeight + 4);
      } catch {
        doc.setFontSize(8);
        doc.text(`[Imagem: ${img.name}]`, x, y + 30);
      }
      if (x + imgWidth + 14 + imgWidth > pageWidth) {
        x = 14;
        y += imgHeight + 12;
      } else {
        x += imgWidth + 10;
      }
    });
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(30, 35, 50);
    doc.rect(0, doc.internal.pageSize.getHeight() - 12, pageWidth, 12, 'F');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 130);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 4, { align: 'center' });
  }

  doc.save(`inspecao_${inspection.id.slice(0, 8)}_${format(new Date(), 'yyyyMMdd')}.pdf`);
}

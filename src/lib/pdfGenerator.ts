import { jsPDF } from 'jspdf';
import { StlModelItem, CartItem } from '../types';

interface QuotePdfData {
  quoteNumber: string;
  clientName?: string;
  clientCompany?: string;
  clientEmail?: string;
  items: Array<{
    fileName: string;
    materialName: string;
    volumeCm3: number;
    infill: number;
    layerHeight: number;
    postProcessing: string;
    quantity: number;
    unitPriceNet: number;
    totalNet: number;
  }>;
  subtotalNet: number;
  vatAmount: number;
  grandTotal: number;
  notes?: string;
}

export function generateFormalQuotePdf(data: QuotePdfData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 18;

  // Background subtle technical banner
  doc.setFillColor(14, 19, 31); // #0e131f
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Brand Header
  doc.setTextColor(0, 210, 254); // #00d2fe
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PROJECT 3D', 14, currentY);

  doc.setFontSize(9);
  doc.setTextColor(240, 244, 248);
  doc.text('PROTOTIPADO INDUSTRIAL RÁPIDO & FABRICACIÓN ADITIVA', 14, currentY + 6);

  // Facility Info on Top Right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.text('Planta Torrijos: Pol. Industrial, Av. de los Trabajadores nº 23', pageWidth - 14, currentY, { align: 'right' });
  doc.text('45500 Torrijos (Toledo, España) · Tel: +34 925 77 12 34', pageWidth - 14, currentY + 4, { align: 'right' });
  doc.text('CIF: B-45918234 · ingenieria@project3d-torrijos.es', pageWidth - 14, currentY + 8, { align: 'right' });

  currentY = 40;

  // Document Title & Reference Box
  doc.setFillColor(22, 29, 47); // #161d2f
  doc.roundedRect(14, currentY, pageWidth - 28, 20, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 210, 254);
  doc.text('PRESUPUESTO TÉCNICO FORMAL', 18, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(240, 244, 248);
  doc.text(`Nº Referencia: ${data.quoteNumber}`, 18, currentY + 14);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const expiryDate = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  doc.text(`Fecha de Emisión: ${formattedDate}`, pageWidth - 18, currentY + 7, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11); // Amber
  doc.text(`Validez de la Oferta: 15 días naturales (${expiryDate})`, pageWidth - 18, currentY + 14, { align: 'right' });

  currentY += 26;

  // Client Data Box
  doc.setDrawColor(35, 45, 66);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, pageWidth - 28, 16, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('DATOS DEL CLIENTE / RECEPTOR:', 18, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const clientLine = `${data.clientName || 'Cliente Industrial'} ${
    data.clientCompany ? `· ${data.clientCompany}` : ''
  } · ${data.clientEmail || 'Contacto vía Cotizador 3D Web'}`;
  doc.text(clientLine, 18, currentY + 11);

  currentY += 22;

  // Table Header
  doc.setFillColor(14, 19, 31);
  doc.rect(14, currentY, pageWidth - 28, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 210, 254);
  doc.text('DESCRIPCIÓN / ARCHIVO', 17, currentY + 4.5);
  doc.text('MATERIAL / PARÁMETROS', 68, currentY + 4.5);
  doc.text('ACABADO', 124, currentY + 4.5);
  doc.text('UDS', 152, currentY + 4.5);
  doc.text('UNIT. (€)', 166, currentY + 4.5);
  doc.text('TOTAL (€)', pageWidth - 17, currentY + 4.5, { align: 'right' });

  currentY += 7;

  // Table Rows
  data.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(245, 247, 250);
      doc.rect(14, currentY, pageWidth - 28, 10, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    // Truncate file name if too long
    const shortName = item.fileName.length > 25 ? `${item.fileName.substring(0, 23)}...` : item.fileName;
    doc.text(shortName, 17, currentY + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${item.volumeCm3.toFixed(1)} cm³`, 17, currentY + 8);

    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(item.materialName, 68, currentY + 4);
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Infill ${item.infill}% · Capa ${item.layerHeight}mm`, 68, currentY + 8);

    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(item.postProcessing, 124, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.text(`${item.quantity}`, 154, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.text(`€${item.unitPriceNet.toFixed(2)}`, 166, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`€${item.totalNet.toFixed(2)}`, pageWidth - 17, currentY + 6, { align: 'right' });

    currentY += 10;
  });

  currentY += 4;

  // Totals Box
  const totalsBoxX = pageWidth - 80;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(totalsBoxX, currentY, 66, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal Neto:', totalsBoxX + 4, currentY + 6);
  doc.text(`€${data.subtotalNet.toFixed(2)}`, pageWidth - 18, currentY + 6, { align: 'right' });

  doc.text('I.V.A. (21% España):', totalsBoxX + 4, currentY + 12);
  doc.text(`€${data.vatAmount.toFixed(2)}`, pageWidth - 18, currentY + 12, { align: 'right' });

  doc.setDrawColor(203, 213, 225);
  doc.line(totalsBoxX + 4, currentY + 15, pageWidth - 18, currentY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(2, 132, 199); // Blue
  doc.text('TOTAL:', totalsBoxX + 4, currentY + 22);
  doc.text(`€${data.grandTotal.toFixed(2)}`, pageWidth - 18, currentY + 22, { align: 'right' });

  // Notes & Quality conditions
  currentY += 32;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('CONDICIONES TÉCNICAS Y GARANTÍAS DE FABRICACIÓN:', 14, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('· Tolerancias dimensionales conforme a ISO 2768-m (SLA: ±0.05 mm | SLS: ±0.10 mm | FDM: ±0.20 mm).', 14, currentY + 5);
  doc.text('· Entrega en 24h a 48h tras confirmación técnica en planta de Torrijos (Toledo) o envío asegurado.', 14, currentY + 9);
  doc.text('· Control de calidad metrológico mediante máquina tridimensional de coordenadas (CMM).', 14, currentY + 13);
  doc.text('· Para aceptar este presupuesto, devuelva firmado este documento o confirme en la plataforma web.', 14, currentY + 17);

  // Signatures
  currentY += 26;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, currentY, 70, currentY);
  doc.line(pageWidth - 70, currentY, pageWidth - 14, currentY);

  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Por Project 3D Torrijos S.L.', 14, currentY + 4);
  doc.text('Dpto. de Ingeniería Aditiva', 14, currentY + 7);

  doc.text('Conforme y Aceptado Cliente', pageWidth - 14, currentY + 4, { align: 'right' });
  doc.text('Firma y Sello de Empresa', pageWidth - 14, currentY + 7, { align: 'right' });

  // Download trigger
  doc.save(`Presupuesto_${data.quoteNumber}_Project3D_Torrijos.pdf`);
}

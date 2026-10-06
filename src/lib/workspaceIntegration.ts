import { StlModelItem, AuthUser } from '../types';
import { getMaterialById, getPostProcessingLabel } from './pricingEngine';

export interface WorkspaceExportData {
  quoteReference: string;
  user: AuthUser;
  items: StlModelItem[];
  subtotalNet: number;
  vatAmount: number;
  grandTotal: number;
  deliveryDate: string;
  notes?: string;
}

export interface GmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  rfc2822RawBase64: string;
  webComposeUrl: string;
}

export interface GoogleSheetsPayload {
  spreadsheetHeaders: string[];
  rows: (string | number)[][];
  tsvContent: string;
  csvContent: string;
  apiPayload: {
    range: string;
    majorDimension: 'ROWS';
    values: (string | number)[][];
  };
}

/**
 * Generate structured Gmail API message and 1-click web compose link
 */
export function generateGmailPayload(data: WorkspaceExportData): GmailPayload {
  const { quoteReference, user, items, subtotalNet, vatAmount, grandTotal, deliveryDate } = data;
  const to = user.email || 'cliente@empresa.com';
  const subject = `[Project 3D Torrijos] Presupuesto Oficial ${quoteReference} · Prototipado Rápido`;

  const itemRowsHtml = items
    .map((item, idx) => {
      const mat = getMaterialById(item.config.materialId);
      const postProc = getPostProcessingLabel(item.config.postProcessing, 'es');
      return `
      <tr style="border-bottom: 1px solid #e2e8f0; font-family: 'JetBrains Mono', monospace; font-size: 12px;">
        <td style="padding: 10px 8px; font-weight: bold; color: #0f172a;">${idx + 1}. ${item.fileName}</td>
        <td style="padding: 10px 8px; color: #475569;">${mat.name} (${mat.technology})</td>
        <td style="padding: 10px 8px; color: #475569;">${item.metrics.boundingBox.x}×${item.metrics.boundingBox.y}×${item.metrics.boundingBox.z} mm</td>
        <td style="padding: 10px 8px; text-align: center; color: #0284c7; font-weight: bold;">${item.metrics.volumeCm3.toFixed(1)} cm³</td>
        <td style="padding: 10px 8px; text-align: center; color: #334155;">${item.config.quantity} uds</td>
        <td style="padding: 10px 8px; text-align: right; color: #0f172a;">€${item.breakdown.unitPriceNet.toFixed(2)}</td>
        <td style="padding: 10px 8px; text-align: right; font-weight: bold; color: #0284c7;">€${item.breakdown.subtotalNet.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="7" style="padding: 2px 8px 10px; font-size: 11px; color: #64748b; font-style: italic;">
          ↳ Config: Infill ${item.config.infillPercent}%, Capa ${item.config.layerHeightMm}mm | Acabado: ${postProc}
        </td>
      </tr>
    `;
    })
    .join('');

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a;">
  <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(15,23,42,0.06);">
    <!-- Header -->
    <div style="border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a;">PROJECT 3D · PROTOTIPADO RÁPIDO</h1>
        <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">Polígono Industrial Torrijos · Av. de los Trabajadores nº 23, 45500 Torrijos (Toledo)</p>
      </div>
    </div>

    <!-- Client & Order Info -->
    <div style="background: #f1f5f9; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px;">
      <p style="margin: 2px 0;"><strong>Referencia:</strong> <span style="font-family: monospace; color: #0284c7; font-weight: bold;">${quoteReference}</span></p>
      <p style="margin: 2px 0;"><strong>Destinatario:</strong> ${user.name} (${user.company || 'Sector Industrial'})</p>
      <p style="margin: 2px 0;"><strong>Fecha de emisión:</strong> ${new Date().toLocaleDateString('es-ES')} (Validez: 15 días)</p>
      <p style="margin: 2px 0;"><strong>Plazo estimado de entrega:</strong> <span style="color: #059669; font-weight: bold;">${deliveryDate}</span> (Hub Torrijos)</p>
    </div>

    <!-- Parts Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; color: #64748b;">
          <th style="padding: 8px; text-align: left;">Pieza (.STL)</th>
          <th style="padding: 8px; text-align: left;">Tecnología</th>
          <th style="padding: 8px; text-align: left;">Dimensiones</th>
          <th style="padding: 8px; text-align: center;">Volumen</th>
          <th style="padding: 8px; text-align: center;">Cant.</th>
          <th style="padding: 8px; text-align: right;">Unitario</th>
          <th style="padding: 8px; text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemRowsHtml}
      </tbody>
    </table>

    <!-- Totals -->
    <div style="border-top: 1px solid #cbd5e1; padding-top: 16px; margin-bottom: 24px; text-align: right; font-family: 'JetBrains Mono', monospace;">
      <p style="margin: 4px 0; font-size: 13px; color: #475569;">Subtotal Neto: <strong>€${subtotalNet.toFixed(2)}</strong></p>
      <p style="margin: 4px 0; font-size: 13px; color: #475569;">IVA (21% Oficial): <strong>€${vatAmount.toFixed(2)}</strong></p>
      <p style="margin: 8px 0 0; font-size: 18px; font-weight: 800; color: #0284c7;">TOTAL PRESUPUESTADO: €${grandTotal.toFixed(2)}</p>
    </div>

    <!-- Quality Assurance Note -->
    <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 12px; color: #065f46;">
      <strong>Garantía Técnica de Planta:</strong> Tolerancia dimensional estándar de ±0.05 mm en resinas SLA y ±0.15 mm en termoplásticos FDM. Se incluye desoporte y control dimensional previo a expedición bajo norma ISO 9001.
    </div>

    <!-- Contact & Signoff -->
    <div style="font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px;">
      <p style="margin: 4px 0;">Para formalizar la orden de fabricación, responde a este correo o llámanos al <strong>+34 925 77 12 34</strong>.</p>
      <p style="margin: 4px 0;">Equipo de Ingeniería y Producción · <strong>Project 3D Torrijos</strong></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const textBody = `
PROJECT 3D · PROTOTIPADO RÁPIDO INDUSTRIAL (TORRIJOS, TOLEDO)
Presupuesto Oficial Ref: ${quoteReference}
Fecha: ${new Date().toLocaleDateString('es-ES')} | Validez: 15 días
Cliente: ${user.name} (${user.company || 'Sector Industrial'}) - ${to}

RESUMEN DE PIEZAS FABRICACIÓN:
${items
  .map(
    (item, i) =>
      `[${i + 1}] ${item.fileName}
  - Dimensiones: ${item.metrics.boundingBox.x} × ${item.metrics.boundingBox.y} × ${item.metrics.boundingBox.z} mm
  - Volumen neto: ${item.metrics.volumeCm3.toFixed(2)} cm³
  - Material: ${getMaterialById(item.config.materialId).name} (Infill ${item.config.infillPercent}%, Capa ${item.config.layerHeightMm}mm)
  - Acabado: ${getPostProcessingLabel(item.config.postProcessing, 'es')}
  - Cantidad: ${item.config.quantity} uds | Precio Ud: €${item.breakdown.unitPriceNet.toFixed(2)} | Subtotal: €${item.breakdown.subtotalNet.toFixed(2)}`
  )
  .join('\n\n')}

DESGLOSE ECONÓMICO:
- Subtotal Neto: €${subtotalNet.toFixed(2)}
- IVA Oficial (21%): €${vatAmount.toFixed(2)}
- TOTAL A PAGAR (+IVA): €${grandTotal.toFixed(2)}
- Plazo de Fabricación y Entrega: ${deliveryDate} (Hub Torrijos)

CONTACTO PLANTA:
Polígono Industrial Torrijos, Av. de los Trabajadores nº 23, 45500 Torrijos (Toledo)
Tel: +34 925 77 12 34 | ingenieria@project3d-torrijos.es
  `.trim();

  // RFC 2822 standard email message formatting
  const rfc2822Raw = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    btoa(unescape(encodeURIComponent(htmlBody))),
  ].join('\r\n');

  // Web compose URL
  const webComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    to
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(textBody)}`;

  return {
    to,
    subject,
    htmlBody,
    textBody,
    rfc2822RawBase64: btoa(unescape(encodeURIComponent(rfc2822Raw))),
    webComposeUrl,
  };
}

/**
 * Generate structured Google Sheets API table rows and CSV/TSV format
 */
export function generateGoogleSheetsPayload(data: WorkspaceExportData): GoogleSheetsPayload {
  const { quoteReference, user, items, deliveryDate } = data;
  const isoDate = new Date().toISOString().split('T')[0];

  const spreadsheetHeaders = [
    'Fecha',
    'ID Presupuesto',
    'Cliente',
    'Empresa',
    'Email',
    'Pieza STL',
    'X (mm)',
    'Y (mm)',
    'Z (mm)',
    'Volumen (cm³)',
    'Material',
    'Infill (%)',
    'Capa (mm)',
    'Posprocesado',
    'Cantidad',
    'Materia Prima (€)',
    'Tiempo Máq (€)',
    'Setup (€)',
    'Unitario Neto (€)',
    'Subtotal Neto (€)',
    'IVA 21% (€)',
    'Total (+IVA €)',
    'Plazo Entrega',
    'Estado',
  ];

  const rows: (string | number)[][] = items.map((item) => {
    const mat = getMaterialById(item.config.materialId);
    const postProc = getPostProcessingLabel(item.config.postProcessing, 'es');

    return [
      isoDate,
      quoteReference,
      user.name,
      user.company || 'Industrial',
      user.email,
      item.fileName,
      item.metrics.boundingBox.x,
      item.metrics.boundingBox.y,
      item.metrics.boundingBox.z,
      parseFloat(item.metrics.volumeCm3.toFixed(2)),
      mat.name,
      item.config.infillPercent,
      item.config.layerHeightMm,
      postProc,
      item.config.quantity,
      item.breakdown.materialCost,
      item.breakdown.machineCost,
      item.breakdown.setupFee,
      item.breakdown.unitPriceNet,
      item.breakdown.subtotalNet,
      item.breakdown.vatAmount,
      item.breakdown.totalWithVat,
      deliveryDate,
      'Cotizado',
    ];
  });

  const tsvLines = [
    spreadsheetHeaders.join('\t'),
    ...rows.map((row) => row.map((cell) => String(cell).replace(/\t/g, ' ')).join('\t')),
  ];
  const tsvContent = tsvLines.join('\n');

  const csvLines = [
    spreadsheetHeaders.map((h) => `"${h}"`).join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const str = String(cell).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(',')
    ),
  ];
  const csvContent = csvLines.join('\n');

  return {
    spreadsheetHeaders,
    rows,
    tsvContent,
    csvContent,
    apiPayload: {
      range: 'Presupuestos!A1:X',
      majorDimension: 'ROWS',
      values: [spreadsheetHeaders, ...rows],
    },
  };
}

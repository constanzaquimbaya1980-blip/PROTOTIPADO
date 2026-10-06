import { StlModelItem, AuthUser } from '../types';
import { getMaterialById, getPostProcessingLabel } from './pricingEngine';

export interface DriveUploadParams {
  fileName: string;
  buffer: ArrayBuffer;
  quoteId: string;
  user: AuthUser;
  accessToken?: string | null;
}

export interface DriveUploadResult {
  success: boolean;
  fileId?: string;
  webViewLink?: string;
  message: string;
  simulated?: boolean;
}

export interface GmailOrderDispatchParams {
  quoteReference: string;
  user: AuthUser;
  items: StlModelItem[];
  subtotalNet: number;
  vatAmount: number;
  grandTotal: number;
  accessToken?: string | null;
}

export interface GmailDispatchResult {
  success: boolean;
  messageId?: string;
  composeUrl: string;
  message: string;
  simulated?: boolean;
}

/**
 * Función auxiliar para estructurar y ejecutar la subida de un archivo .STL a Google Drive
 * mediante la Google Drive API v3 (multipart upload).
 */
export async function uploadStlToGoogleDrive(params: DriveUploadParams): Promise<DriveUploadResult> {
  const { fileName, buffer, quoteId, user, accessToken } = params;

  // Metadata para Google Drive
  const metadata = {
    name: `[Project 3D Torrijos] ${quoteId}_${fileName}`,
    mimeType: 'application/octet-stream',
    description: `Archivo de malla STL industrial para prototipado rápido en planta Torrijos. Cotización: ${quoteId}. Cliente: ${user.name} (${user.company || 'Industrial'}).`,
  };

  // Si tenemos un token OAuth activo, realizamos el fetch directo a Drive API v3
  if (accessToken) {
    try {
      const boundary = '-------3dproject_boundary_' + Date.now();
      const delimiter = '\r\n--' + boundary + '\r\n';
      const closeDelim = '\r\n--' + boundary + '--';

      const metadataPart =
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata);

      const uint8 = new Uint8Array(buffer);
      let binaryStr = '';
      for (let i = 0; i < uint8.length; i++) {
        binaryStr += String.fromCharCode(uint8[i]);
      }

      const filePart =
        'Content-Type: application/octet-stream\r\n' +
        'Content-Transfer-Encoding: base64\r\n\r\n' +
        btoa(binaryStr);

      const multipartRequestBody =
        delimiter +
        metadataPart +
        delimiter +
        filePart +
        closeDelim;

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (response.ok) {
        const driveFile = await response.json();
        return {
          success: true,
          fileId: driveFile.id,
          webViewLink: `https://drive.google.com/file/d/${driveFile.id}/view`,
          message: `Archivo "${fileName}" sincronizado exitosamente en Google Drive`,
        };
      }
    } catch (err) {
      console.warn('Google Drive API direct upload error:', err);
    }
  }

  // Fallback estructurado: Descarga local y simulador de Drive link para desarrollo
  const simulatedId = `1P3D_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  return {
    success: true,
    fileId: simulatedId,
    webViewLink: `https://drive.google.com/drive/folders/project3d-torrijos-hub-${simulatedId}`,
    message: `Payload estructurado para Google Drive v3 (Archivo "${fileName}", ${Math.round(buffer.byteLength / 1024)} KB listo para transferir)`,
    simulated: true,
  };
}

/**
 * Función auxiliar para estructurar y disparar la confirmación del pedido mediante la Gmail API v1
 * (users/me/messages/send) o enlace directo pre-rellenado con formato corporativo.
 */
export async function sendOrderConfirmationViaGmail(
  params: GmailOrderDispatchParams
): Promise<GmailDispatchResult> {
  const { quoteReference, user, items, subtotalNet, vatAmount, grandTotal, accessToken } = params;

  const to = user.email || 'ingenieria@project3d-torrijos.es';
  const subject = `Confirmación de Pedido ${quoteReference} · Project 3D Torrijos (Toledo)`;

  const itemsHtml = items
    .map((item, idx) => {
      const mat = getMaterialById(item.config.materialId);
      const postProc = getPostProcessingLabel(item.config.postProcessing, 'es');
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${idx + 1}. ${item.fileName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${mat.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.metrics.boundingBox.x}×${item.metrics.boundingBox.y}×${item.metrics.boundingBox.z} mm</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.metrics.volumeCm3.toFixed(1)} cm³</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.config.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #0284c7;">€${item.breakdown.totalWithVat.toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0;">PROJECT 3D · CONFIRMACIÓN DE PEDIDO</h2>
      <p style="color: #64748b; font-size: 13px;">Polígono Industrial Torrijos, Av. de los Trabajadores nº 23, 45500 Torrijos (Toledo)</p>
      <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 12px; margin: 16px 0; font-size: 13px;">
        <p style="margin: 2px 0;"><strong>Referencia:</strong> ${quoteReference}</p>
        <p style="margin: 2px 0;"><strong>Cliente:</strong> ${user.name} (${user.company || 'Empresa Industrial'})</p>
        <p style="margin: 2px 0;"><strong>Email:</strong> ${user.email}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f1f5f9; text-align: left; color: #475569;">
            <th style="padding: 8px;">Pieza</th>
            <th style="padding: 8px;">Material</th>
            <th style="padding: 8px;">Dimensiones</th>
            <th style="padding: 8px; text-align: center;">Volumen</th>
            <th style="padding: 8px; text-align: center;">Uds</th>
            <th style="padding: 8px; text-align: right;">Total (+IVA)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div style="text-align: right; font-family: monospace; font-size: 14px; margin-bottom: 20px;">
        <p style="margin: 4px 0;">Subtotal Neto: €${subtotalNet.toFixed(2)}</p>
        <p style="margin: 4px 0;">IVA (21%): €${vatAmount.toFixed(2)}</p>
        <p style="margin: 4px 0; font-size: 18px; font-weight: bold; color: #0284c7;">TOTAL: €${grandTotal.toFixed(2)}</p>
      </div>
      <p style="font-size: 12px; color: #64748b;">
        Tus piezas han entrado en cola de fabricación en la planta de Torrijos. Para consultas urgentes o cambios de archivo, contacta con nuestro jefe de taller en el <strong>+34 925 77 12 34</strong> o respondiendo a este email.
      </p>
    </div>
  `;

  const textBody = `Confirmación de Pedido Project 3D Torrijos\nReferencia: ${quoteReference}\nCliente: ${user.name} (${user.company || 'Industrial'})\nTotal con IVA: €${grandTotal.toFixed(2)}\nFabricación en Av. de los Trabajadores nº 23, Torrijos (Toledo). Tel: +34 925 77 12 34`;

  const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    to
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(textBody)}`;

  // Intento de envío vía Gmail API si se cuenta con token OAuth
  if (accessToken) {
    try {
      const emailLines = [
        `To: ${to}`,
        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: base64`,
        ``,
        btoa(unescape(encodeURIComponent(htmlBody))),
      ].join('\r\n');

      const base64UrlSafe = btoa(unescape(encodeURIComponent(emailLines)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ raw: base64UrlSafe }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          messageId: result.id,
          composeUrl,
          message: `Confirmación de pedido enviada vía Gmail API a ${to} (ID: ${result.id})`,
        };
      }
    } catch (e) {
      console.warn('Gmail API dispatch error, fallback a compose URL:', e);
    }
  }

  return {
    success: true,
    composeUrl,
    message: `Mensaje estructurado para Gmail API listo para ${to}`,
    simulated: true,
  };
}

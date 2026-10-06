import React, { useState } from 'react';
import {
  X,
  Mail,
  Table,
  Copy,
  Check,
  ExternalLink,
  Download,
  FileSpreadsheet,
  Send,
  ShieldCheck,
  CloudUpload,
  CheckCircle2,
} from 'lucide-react';
import { generateGmailPayload, generateGoogleSheetsPayload, WorkspaceExportData } from '../lib/workspaceIntegration';
import { uploadStlToGoogleDrive, sendOrderConfirmationViaGmail } from '../lib/googleDriveAndGmail';
import { StlModelItem, AuthUser } from '../types';

interface WorkspaceExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: StlModelItem[];
  user: AuthUser;
  quoteReference: string;
  accessToken?: string | null;
}

export const WorkspaceExportModal: React.FC<WorkspaceExportModalProps> = ({
  isOpen,
  onClose,
  models,
  user,
  quoteReference,
  accessToken,
}) => {
  const [activeTab, setActiveTab] = useState<'gmail' | 'sheets' | 'drive'>('gmail');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Status states for Drive and Gmail API execution
  const [isUploadingDrive, setIsUploadingDrive] = useState(false);
  const [driveUploadResult, setDriveUploadResult] = useState<any | null>(null);
  const [isSendingGmail, setIsSendingGmail] = useState(false);
  const [gmailSendResult, setGmailSendResult] = useState<any | null>(null);

  if (!isOpen || models.length === 0) return null;

  const subtotalNet = models.reduce((acc, m) => acc + m.breakdown.subtotalNet, 0);
  const vatAmount = subtotalNet * 0.21;
  const grandTotal = subtotalNet + vatAmount;
  const deliveryDate = models[0]?.breakdown.estimatedDeliveryDate || '48h';

  const exportData: WorkspaceExportData = {
    quoteReference,
    user,
    items: models,
    subtotalNet,
    vatAmount,
    grandTotal,
    deliveryDate,
  };

  const gmailData = generateGmailPayload(exportData);
  const sheetsData = generateGoogleSheetsPayload(exportData);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadCsv = () => {
    const blob = new Blob([sheetsData.csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Project3D_${quoteReference}_Sheets.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDriveUpload = async () => {
    if (models.length === 0) return;
    setIsUploadingDrive(true);
    try {
      const activeItem = models[0];
      const result = await uploadStlToGoogleDrive({
        fileName: activeItem.fileName,
        buffer: activeItem.buffer,
        quoteId: quoteReference,
        user,
        accessToken,
      });
      setDriveUploadResult(result);
    } catch (e: any) {
      setDriveUploadResult({ success: false, message: e.message || 'Error en subida a Drive' });
    } finally {
      setIsUploadingDrive(false);
    }
  };

  const handleGmailDirectSend = async () => {
    setIsSendingGmail(true);
    try {
      const result = await sendOrderConfirmationViaGmail({
        quoteReference,
        user,
        items: models,
        subtotalNet,
        vatAmount,
        grandTotal,
        accessToken,
      });
      setGmailSendResult(result);
    } catch (e: any) {
      setGmailSendResult({ success: false, message: e.message });
    } finally {
      setIsSendingGmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-[#0284c7]">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#0284c7] font-bold block">
                Google Workspace Integration · Drive, Gmail & Sheets
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Flujo B2B de Presupuesto y Archivos STL ({quoteReference})
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-6 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('gmail')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-t-lg transition-colors border-t border-x ${
              activeTab === 'gmail'
                ? 'bg-white text-slate-900 border-slate-300 -mb-px'
                : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            <Mail className="w-4 h-4 text-red-500" />
            <span>Gmail API</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drive')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-t-lg transition-colors border-t border-x ${
              activeTab === 'drive'
                ? 'bg-white text-slate-900 border-slate-300 -mb-px'
                : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            <CloudUpload className="w-4 h-4 text-sky-500" />
            <span>Google Drive API (.STL)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-t-lg transition-colors border-t border-x ${
              activeTab === 'sheets'
                ? 'bg-white text-slate-900 border-slate-300 -mb-px'
                : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Google Sheets API</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB 1: GMAIL API */}
          {activeTab === 'gmail' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 block">Destinatario configurado:</span>
                  <span className="font-semibold text-slate-900">{gmailData.to}</span>
                  <span className="text-slate-500 text-[11px] ml-2 font-mono">({user.company || 'Industrial'})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSendingGmail}
                    onClick={handleGmailDirectSend}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingGmail ? 'Enviando...' : 'Disparar Gmail API'}</span>
                  </button>

                  <a
                    href={gmailData.webComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Abrir en Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {gmailSendResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-2 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{gmailSendResult.message}</span>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Asunto Oficial
                </label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 text-[11px] select-all">
                  {gmailData.subject}
                </div>
              </div>

              {/* Text Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Cuerpo del Mensaje (Formato Texto & HTML)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy(gmailData.textBody, 'text')}
                    className="text-[11px] text-[#0284c7] hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedType === 'text' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'text' ? '¡Copiado!' : 'Copiar texto'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[10px] text-slate-700 max-h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {gmailData.textBody}
                </pre>
              </div>

              {/* RFC 2822 payload */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">
                    Payload MIME Base64 (Gmail API messages.send)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(gmailData.rfc2822RawBase64, 'mime')}
                    className="text-[11px] text-[#0284c7] hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedType === 'mime' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'mime' ? '¡Copiado!' : 'Copiar Base64'}</span>
                  </button>
                </div>
                <div className="p-2 bg-slate-100 rounded border border-slate-200 font-mono text-[9px] text-slate-600 truncate">
                  {gmailData.rfc2822RawBase64.substring(0, 120)}...
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE DRIVE (.STL UPLOAD) */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Subida de Malla 3D a Google Drive</span>
                  <span className="text-[11px] text-slate-600">
                    Sube el archivo STL activo con metadatos de fabricación a la carpeta compartida de ingeniería en Torrijos.
                  </span>
                </div>
                <button
                  type="button"
                  disabled={isUploadingDrive}
                  onClick={handleDriveUpload}
                  className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                >
                  <CloudUpload className="w-4 h-4" />
                  <span>{isUploadingDrive ? 'Subiendo a Drive...' : 'Subir STL a Google Drive'}</span>
                </button>
              </div>

              {driveUploadResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{driveUploadResult.message}</span>
                  </div>
                  {driveUploadResult.webViewLink && (
                    <a
                      href={driveUploadResult.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0284c7] underline text-[11px] flex items-center gap-1 pt-1"
                    >
                      <span>Abrir carpeta o archivo en Google Drive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* STL Info */}
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 space-y-2">
                <span className="font-semibold text-slate-800 block text-xs">Archivos listos para transferencia:</span>
                {models.map((m, idx) => (
                  <div key={m.id} className="flex items-center justify-between text-[11px] font-mono bg-white p-2 rounded border border-slate-200">
                    <span className="font-bold text-slate-900">{idx + 1}. {m.fileName}</span>
                    <span className="text-slate-500">{(m.fileSizeBytes / 1024).toFixed(1)} KB · {m.metrics.boundingBox.x}×{m.metrics.boundingBox.y}×{m.metrics.boundingBox.z} mm</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 font-semibold block">
                    {models.length} {models.length === 1 ? 'fila estructurada' : 'filas estructuradas'} listas para Google Sheets
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Incluye cotas X/Y/Z, volumen cm³, material, parámetros de corte y desglose neto + IVA
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(sheetsData.tsvContent, 'sheets')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {copiedType === 'sheets' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'sheets' ? '¡Fila Copiada!' : 'Copiar para Pegar en Sheets'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Table Data Preview */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left font-mono text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-600">
                      <th className="p-2">Pieza STL</th>
                      <th className="p-2">X×Y×Z (mm)</th>
                      <th className="p-2 text-right">Volumen</th>
                      <th className="p-2">Material</th>
                      <th className="p-2 text-center">Uds</th>
                      <th className="p-2 text-right">Unitario</th>
                      <th className="p-2 text-right">Total (+IVA)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {models.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2 font-semibold text-slate-900 font-sans">{item.fileName}</td>
                        <td className="p-2 text-slate-600">{item.metrics.boundingBox.x}×{item.metrics.boundingBox.y}×{item.metrics.boundingBox.z}</td>
                        <td className="p-2 text-right text-[#0284c7] font-semibold">{item.metrics.volumeCm3.toFixed(1)} cm³</td>
                        <td className="p-2 text-slate-700">{item.config.materialId}</td>
                        <td className="p-2 text-center text-slate-800">{item.config.quantity}</td>
                        <td className="p-2 text-right text-slate-800">€{item.breakdown.unitPriceNet.toFixed(2)}</td>
                        <td className="p-2 text-right font-bold text-[#0284c7]">€{item.breakdown.totalWithVat.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* JSON for Sheets API */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">
                    JSON Payload (Google Sheets API spreadsheets.values.append)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(sheetsData.apiPayload, null, 2), 'json')}
                    className="text-[11px] text-[#0284c7] hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedType === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'json' ? '¡Copiado!' : 'Copiar JSON'}</span>
                  </button>
                </div>
                <pre className="p-2.5 bg-slate-100 rounded border border-slate-200 font-mono text-[9px] text-slate-600 max-h-36 overflow-y-auto">
                  {JSON.stringify(sheetsData.apiPayload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Quality Notice */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Estructura conforme a especificación Google Drive & Gmail API
            </span>
            <span>Project 3D Torrijos (Toledo)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

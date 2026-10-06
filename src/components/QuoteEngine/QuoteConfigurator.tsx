import React, { useState } from 'react';
import {
  Upload,
  Layers,
  Sliders,
  Zap,
  ShoppingCart,
  FileText,
  ShieldCheck,
  Download,
  Trash2,
  Box,
  Plus,
  Lock,
  Bookmark,
  Share2,
  Table,
  History,
  Check,
} from 'lucide-react';
import { PostProcessingOption, PriceBreakdown, QuoteConfig, StlMetrics, StlModelItem } from '../../types';
import { INDUSTRIAL_MATERIALS, getMaterialById } from '../../lib/pricingEngine';
import { useI18n } from '../../i18n/I18nContext';

interface QuoteConfiguratorProps {
  models: StlModelItem[];
  activeModelId: string;
  onSelectModel: (id: string) => void;
  onRemoveModel: (id: string) => void;
  metrics: StlMetrics | null;
  config: QuoteConfig;
  breakdown: PriceBreakdown | null;
  onConfigChange: (newConfig: QuoteConfig) => void;
  onFileUpload: (files: FileList | File[]) => void;
  onLoadSample: (sampleType: 'gear' | 'bracket' | 'enclosure') => void;
  onAddToCart: () => void;
  onAddAllToCart: () => void;
  onRequestReview: () => void;
  onDownloadPdf: () => void;
  onExportWorkspace?: () => void;
  onSaveUserQuote?: () => void;
  onOpenSavedQuotes?: () => void;
  savedQuotesCount?: number;
  isProcessing: boolean;
  thinWallCount?: number;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
}

export const QuoteConfigurator: React.FC<QuoteConfiguratorProps> = ({
  models,
  activeModelId,
  onSelectModel,
  onRemoveModel,
  metrics,
  config,
  breakdown,
  onConfigChange,
  onFileUpload,
  onLoadSample,
  onAddToCart,
  onAddAllToCart,
  onRequestReview,
  onDownloadPdf,
  onExportWorkspace,
  onSaveUserQuote,
  onOpenSavedQuotes,
  savedQuotesCount = 0,
  isProcessing,
  thinWallCount = 0,
  isLoggedIn = true,
  onOpenAuth,
}) => {
  const { t } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragOver(true);
    } else if (e.type === 'dragleave') {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        if (file.name.toLowerCase().endsWith('.stl')) {
          validFiles.push(file);
        }
      }
      if (validFiles.length > 0) {
        onFileUpload(validFiles);
      } else {
        alert('Por favor sube archivos con formato .STL / Please upload .STL files');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
    }
  };

  const updateField = <K extends keyof QuoteConfig>(key: K, value: QuoteConfig[K]) => {
    onConfigChange({ ...config, [key]: value });
  };

  // Grand totals across all loaded pieces
  const batchTotalQuantity = models.reduce((acc, m) => acc + m.config.quantity, 0);
  const batchTotalNet = models.reduce((acc, m) => acc + m.breakdown.subtotalNet, 0);
  const batchTotalVat = batchTotalNet * 0.21;
  const batchGrandTotal = batchTotalNet + batchTotalVat;

  const handleProtectedAction = (action: () => void) => {
    if (!isLoggedIn && onOpenAuth) {
      onOpenAuth();
    } else {
      action();
    }
  };

  const handleSaveClick = () => {
    if (!isLoggedIn && onOpenAuth) {
      onOpenAuth();
      return;
    }
    if (onSaveUserQuote) {
      onSaveUserQuote();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Drag & Drop STL Zone (Multi-file enabled) */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          isDragOver
            ? 'border-[#0284c7] bg-sky-50/70'
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
      >
        <input
          type="file"
          accept=".stl"
          multiple
          id="stl-upload-input"
          className="hidden"
          onChange={handleFileInput}
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284c7]">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <label
              htmlFor="stl-upload-input"
              className="cursor-pointer text-sm font-semibold text-slate-900 hover:text-[#0284c7] transition-colors"
            >
              {t.quote.dragDropTitle}{' '}
              <span className="text-[#0284c7] underline decoration-sky-300 underline-offset-4">
                {t.quote.dragDropBrowse}
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {t.quote.dragDropSub}
            </p>
          </div>

          {/* Quick Sample Models & Saved Quotes Shortcut */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500">{t.quote.samplePrompt}</span>
            <button
              type="button"
              onClick={() => onLoadSample('gear')}
              className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#0284c7] border border-slate-300 transition-colors"
            >
              {t.quote.sampleGear}
            </button>
            <button
              type="button"
              onClick={() => onLoadSample('bracket')}
              className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#0284c7] border border-slate-300 transition-colors"
            >
              {t.quote.sampleBracket}
            </button>
            <button
              type="button"
              onClick={() => onLoadSample('enclosure')}
              className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#0284c7] border border-slate-300 transition-colors"
            >
              {t.quote.sampleEnclosure}
            </button>

            {isLoggedIn && onOpenSavedQuotes && (
              <button
                type="button"
                onClick={onOpenSavedQuotes}
                className="text-xs font-mono px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-300 transition-colors flex items-center gap-1 font-semibold"
              >
                <History className="w-3 h-3" />
                <span>Mis Cotizaciones ({savedQuotesCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Selector de Piezas Cargadas en Lote (Multi-STL Tabs) */}
      {models.length > 0 && (
        <div className="card-industrial p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-[#0284c7]" />
              <h3 className="text-xs uppercase font-mono tracking-wider text-slate-800 font-bold">
                {t.quote.multiStlTitle} ({models.length})
              </h3>
            </div>

            <label
              htmlFor="stl-upload-input"
              className="cursor-pointer text-xs font-mono text-[#0284c7] hover:text-[#0369a1] flex items-center gap-1 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.quote.multiStlAddBtn}</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {models.map((item) => {
              const isActive = item.id === activeModelId;
              const itemMat = getMaterialById(item.config.materialId);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectModel(item.id)}
                  className={`relative p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-[#0284c7] bg-sky-50/80 shadow-sm ring-1 ring-[#0284c7]/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-300"
                          style={{ backgroundColor: itemMat.colorHex }}
                        />
                        <span className="text-xs font-bold text-slate-900 truncate block">
                          {item.fileName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                        {item.metrics.volumeCm3.toFixed(1)} cm³ · {item.metrics.boundingBox.x}×{item.metrics.boundingBox.y}×{item.metrics.boundingBox.z} mm
                      </span>
                    </div>

                    {models.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveModel(item.id);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-200 transition-colors"
                        title="Eliminar pieza"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-600">{item.config.quantity} uds</span>
                    <span className="font-bold text-[#0284c7]">
                      {isLoggedIn ? `€${item.breakdown.totalWithVat.toFixed(2)}` : '€ ••••'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Parámetros Técnicos de Fabricación para la Pieza Activa */}
      <div className="card-industrial p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0284c7]" />
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-900 font-bold">
              Configuración de Fabricación {models.length > 1 && `(${models.find((m) => m.id === activeModelId)?.fileName || ''})`}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Planta Torrijos Hub</span>
        </div>

        {/* Selector de Polímero Industrial */}
        <div>
          <label className="text-xs uppercase font-mono tracking-wider text-slate-700 font-semibold block mb-2">
            {t.quote.stepMaterial || '1. Material Industrial Certificado'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INDUSTRIAL_MATERIALS.map((mat) => {
              const isSelected = mat.id === config.materialId;
              return (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => updateField('materialId', mat.id)}
                  className={`p-3 rounded-lg border text-left transition-all relative ${
                    isSelected
                      ? 'border-[#0284c7] bg-sky-50/70 ring-1 ring-[#0284c7]/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-slate-300 shadow-sm"
                        style={{ backgroundColor: mat.colorHex }}
                      />
                      <span className="text-xs font-bold text-slate-900">{mat.shortName}</span>
                    </div>
                    {mat.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">
                        {mat.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">{mat.technology}</span>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-600 border-t border-slate-200 pt-1">
                    <span>{mat.tensileStrength}</span>
                    <span className="text-slate-800 font-semibold">HDT {mat.heatDeflectionTemp}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders: Infill y Altura de Capa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase font-mono tracking-wider text-slate-700 font-semibold">
                {t.quote.stepInfill || '2. Relleno Interno (Infill)'}
              </label>
              <span className="text-xs font-mono font-bold text-[#0284c7]">
                {config.infillPercent}%
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="100"
              step="5"
              value={config.infillPercent}
              onChange={(e) => updateField('infillPercent', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0284c7]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>15% Ligero</span>
              <span>40% Estructural</span>
              <span>100% Macizo</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase font-mono tracking-wider text-slate-700 font-semibold">
                {t.quote.stepLayer || '3. Altura de Capa / Precisión'}
              </label>
              <span className="text-xs font-mono font-bold text-[#0284c7]">
                {config.layerHeightMm} mm
              </span>
            </div>
            <select
              value={config.layerHeightMm}
              onChange={(e) => updateField('layerHeightMm', Number(e.target.value))}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:border-[#0284c7] focus:outline-none"
            >
              <option value={0.1}>0.10 mm (Ultra Definición - Moldes y Encastres)</option>
              <option value={0.16}>0.16 mm (Alta Calidad Dimensional)</option>
              <option value={0.2}>0.20 mm (Estándar Industrial Recomendado)</option>
              <option value={0.28}>0.28 mm (Borrador Rápido de Concepto)</option>
            </select>
          </div>
        </div>

        {/* Cantidad y Posprocesado B2B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase font-mono tracking-wider text-slate-700 font-semibold block mb-2">
              {t.quote.quantityLabel}
            </label>
            <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => updateField('quantity', Math.max(1, config.quantity - 1))}
                className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors font-bold"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="500"
                value={config.quantity}
                onChange={(e) => updateField('quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full text-center bg-transparent text-sm font-mono text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => updateField('quantity', config.quantity + 1)}
                className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase font-mono tracking-wider text-slate-700 font-semibold block mb-2">
              {t.quote.postProcessingLabel}
            </label>
            <select
              value={config.postProcessing}
              onChange={(e) => updateField('postProcessing', e.target.value as PostProcessingOption)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:border-[#0284c7] focus:outline-none"
            >
              <option value="none">Sin acabado (Desoporte básico) (+€0.00)</option>
              <option value="threaded_inserts">Lijado e Insertos Roscados (+€12.50)</option>
              <option value="heat_treatment">Tratamiento Térmico Annealing (+€9.00)</option>
              <option value="blasted">Chorreado microesferas de vidrio (+€7.50)</option>
              <option value="cmm_certified">Informe Metrológico CMM Torrijos (+€26.00)</option>
            </select>
          </div>
        </div>

        {/* Priority 24h Express Toggle */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${config.priorityService ? 'text-amber-500' : 'text-slate-400'}`} />
            <div>
              <span className="text-xs font-semibold text-slate-800">{t.quote.priorityLabel}</span>
              <p className="text-[11px] text-slate-500">{t.quote.prioritySub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateField('priorityService', !config.priorityService)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
              config.priorityService
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            {config.priorityService ? t.quote.priorityActive : t.quote.priorityStandard}
          </button>
        </div>
      </div>

      {/* 4. Listado Resumen de Piezas y Presupuesto Consolidado */}
      {breakdown && (
        <div className="card-industrial p-5 border-sky-300 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-mono text-[#0284c7] uppercase tracking-wider font-semibold block">
                {models.length > 1 ? t.quote.totalPiecesLabel : t.quote.summaryTag}
              </span>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <span className="font-mono text-2xl text-[#0284c7]">
                  {isLoggedIn ? `€${(models.length > 1 ? batchGrandTotal : breakdown.totalWithVat).toFixed(2)}` : '€ ••••'}
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  ({models.length > 1 ? `${batchTotalQuantity} unidades en total` : (isLoggedIn ? `€${breakdown.unitPriceNet.toFixed(2)} / ud + IVA` : 'Tarifa B2B')})
                </span>
              </h3>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] text-slate-500 block">{t.quote.estimatedDelivery}</span>
              <span className="font-mono text-xs font-semibold text-emerald-700">
                {breakdown.estimatedDeliveryDate} (Torrijos Hub)
              </span>
            </div>
          </div>

          {/* Si hay múltiples piezas, mostrar tabla resumen de piezas */}
          {models.length > 1 && (
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                    <th className="py-2 px-2">Pieza</th>
                    <th className="py-2 px-2">Material</th>
                    <th className="py-2 px-2 text-center">Uds</th>
                    <th className="py-2 px-2 text-right">Unitario</th>
                    <th className="py-2 px-2 text-right">Total (+IVA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {models.map((item) => {
                    const mat = getMaterialById(item.config.materialId);
                    return (
                      <tr key={item.id} className="hover:bg-slate-100/70">
                        <td className="py-2 px-2 font-sans font-semibold text-slate-800">
                          {item.fileName}
                        </td>
                        <td className="py-2 px-2 text-slate-600">
                          {mat.shortName}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-600">
                          {item.config.quantity}
                        </td>
                        <td className="py-2 px-2 text-right text-slate-700">
                          {isLoggedIn ? `€${item.breakdown.unitPriceNet.toFixed(2)}` : '€•••'}
                        </td>
                        <td className="py-2 px-2 text-right text-[#0284c7] font-bold">
                          {isLoggedIn ? `€${item.breakdown.totalWithVat.toFixed(2)}` : '€••••'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pricing Formula Breakdown details: Transparente Materia Prima + Máquina + Setup + IVA */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1 text-xs font-mono">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">
                {t.quote.rawMaterial} (cm³×densidad)
              </span>
              <span className="text-slate-900 font-semibold">
                {isLoggedIn ? `€${breakdown.materialCost.toFixed(2)}` : '€ ••••'}
              </span>
              <span className="text-[10px] text-slate-500 block">~{breakdown.materialGrams} g</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">
                {t.quote.machineTime}
              </span>
              <span className="text-slate-900 font-semibold">
                {isLoggedIn ? `€${breakdown.machineCost.toFixed(2)}` : '€ ••••'}
              </span>
              <span className="text-[10px] text-slate-500 block">~{breakdown.estimatedPrintHours} h máq</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">
                {t.quote.setupFee}
              </span>
              <span className="text-slate-900 font-semibold">
                {isLoggedIn ? `€${breakdown.setupFee.toFixed(2)}` : '€ ••••'}
              </span>
              <span className="text-[10px] text-slate-500 block">CAM & Slicing</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">
                {t.quote.vat} (21%)
              </span>
              <span className="text-slate-900 font-semibold">
                {isLoggedIn ? `€${(models.length > 1 ? batchTotalVat : breakdown.vatAmount).toFixed(2)}` : '€ ••••'}
              </span>
              <span className="text-[10px] text-slate-500 block">Oficial ES</span>
            </div>
          </div>

          {/* Prompt if not authenticated: Overlay card to unlock pricing */}
          {!isLoggedIn && (
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-800">
                <Lock className="w-5 h-5 text-[#0284c7] shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Desglose presupuestario restringido</span>
                  <span className="text-slate-600 text-[11px]">
                    Inicia sesión con Google o Email para desbloquear las tarifas netas, el PDF formal y la sincronización con Google Workspace.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg text-xs transition-colors shrink-0 shadow-md shadow-sky-600/20 active:scale-95"
              >
                Identificarse
              </button>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => handleProtectedAction(models.length > 1 ? onAddAllToCart : onAddToCart)}
              className="flex-1 py-3 px-4 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 active:scale-[0.99]"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t.quote.addToCart} ({models.length > 1 ? `${batchTotalQuantity} piezas` : `${config.quantity} uds`})</span>
            </button>

            {/* Guardar Presupuesto Vinculado al UID del Usuario */}
            <button
              type="button"
              onClick={handleSaveClick}
              title="Guardar presupuesto en mi cuenta"
              className="py-3 px-3.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              {justSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
              <span>{justSaved ? '¡Guardado!' : 'Guardar'}</span>
            </button>

            {/* Workspace Integration: Gmail API & Sheets */}
            {onExportWorkspace && (
              <button
                type="button"
                onClick={() => handleProtectedAction(onExportWorkspace)}
                title="Exportar a Google Workspace (Gmail y Google Sheets)"
                className="py-3 px-3.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Table className="w-4 h-4 text-emerald-600" />
                <span>Workspace</span>
              </button>
            )}

            {/* Descargar Presupuesto Formal en PDF (15 días) */}
            <button
              type="button"
              onClick={() => handleProtectedAction(onDownloadPdf)}
              title={t.quote.downloadPdfBtn}
              className="py-3 px-3.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-600" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => handleProtectedAction(onRequestReview)}
              className="py-3 px-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-[#0284c7]" />
              <span>Revisión</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t.quote.guaranteeNotice}
            </span>
            <span className="hidden sm:inline text-slate-500">
              {t.quote.facilityNotice}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

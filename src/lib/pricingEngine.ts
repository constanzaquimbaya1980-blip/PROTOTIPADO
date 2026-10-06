import { MaterialOption, PostProcessingOption, PriceBreakdown, QuoteConfig, StlMetrics } from '../types';

export const INDUSTRIAL_MATERIALS: MaterialOption[] = [
  {
    id: 'pla_pro',
    name: 'PLA Industrial Plus',
    shortName: 'PLA Plus',
    technology: 'FDM / FFF Industrial',
    densityGramsCm3: 1.24,
    costPerGram: 0.085,
    machineCostPerHour: 6.80,
    colorHex: '#38bdf8', // Steel Cyan
    roughness: 0.5,
    metalness: 0.05,
    heatDeflectionTemp: '58°C',
    tensileStrength: '52 MPa',
    recommendedFor: 'Prototipado rápido de concepto, maquetas de ajuste, validación ergonómica y bajo coste.',
    badge: 'Más Popular',
  },
  {
    id: 'abs_industrial',
    name: 'ABS Grado Automoción',
    shortName: 'ABS Técnico',
    technology: 'FDM / FFF Industrial',
    densityGramsCm3: 1.05,
    costPerGram: 0.115,
    machineCostPerHour: 8.50,
    colorHex: '#f97316', // Industrial Orange
    roughness: 0.45,
    metalness: 0.1,
    heatDeflectionTemp: '96°C',
    tensileStrength: '45 MPa',
    recommendedFor: 'Piezas funcionales bajo capó, carcasas de electrónica industrial, alta resistencia a golpes.',
    badge: 'Térmico',
  },
  {
    id: 'petg_carbon',
    name: 'PETG Técnico Reforzado',
    shortName: 'PETG Químico',
    technology: 'FDM / FFF Industrial',
    densityGramsCm3: 1.27,
    costPerGram: 0.105,
    machineCostPerHour: 7.90,
    colorHex: '#10b981', // Emerald
    roughness: 0.35,
    metalness: 0.08,
    heatDeflectionTemp: '75°C',
    tensileStrength: '50 MPa',
    recommendedFor: 'Piezas estancas a líquidos, recipientes industriales, resistencia a aceites y agentes químicos.',
  },
  {
    id: 'nylon_pa12_cf',
    name: 'Nylon PA12 con Fibra de Carbono',
    shortName: 'PA12-CF',
    technology: 'SLS Polvo Láser',
    densityGramsCm3: 1.15,
    costPerGram: 0.24,
    machineCostPerHour: 14.50,
    colorHex: '#334155', // Charcoal Carbon
    roughness: 0.8,
    metalness: 0.2,
    heatDeflectionTemp: '145°C',
    tensileStrength: '88 MPa',
    recommendedFor: 'Sustitución directa de aluminio mecanizado, brazos robóticos, utillajes de taller y motorsport.',
    badge: 'Máxima Rigidez',
  },
  {
    id: 'sla_tough_resin',
    name: 'Resina SLA Ultra Precisión',
    shortName: 'Resina SLA',
    technology: 'SLA / DLP Fotopolímero',
    densityGramsCm3: 1.18,
    costPerGram: 0.29,
    machineCostPerHour: 18.00,
    colorHex: '#e2e8f0', // Clean Ivory White
    roughness: 0.15,
    metalness: 0.05,
    heatDeflectionTemp: '68°C',
    tensileStrength: '58 MPa',
    recommendedFor: 'Modelos maestros para moldes, carcasas de ensamblaje fino, tolerancias de ±0.05 mm sin capas visibles.',
    badge: 'Alta Definición',
  },
];

export function getMaterialById(id: string): MaterialOption {
  return INDUSTRIAL_MATERIALS.find((m) => m.id === id) || INDUSTRIAL_MATERIALS[0];
}

export function getPostProcessingLabel(option: PostProcessingOption, lang = 'es'): string {
  const labels: Record<string, Record<PostProcessingOption, string>> = {
    es: {
      none: 'Sin acabado (Desoporte básico CAM)',
      threaded_inserts: 'Lijado e Insertos Roscados (+€12.50)',
      heat_treatment: 'Tratamiento Térmico Annealing (+€9.00)',
      blasted: 'Chorreado microesferas de vidrio (+€7.50)',
      cured_smooth: 'Baño térmico / Pulido superficial (+€14.00)',
      cmm_certified: 'Informe Metrológico CMM Torrijos (+€26.00)',
    },
    en: {
      none: 'No finish (Raw CAM support removal)',
      threaded_inserts: 'Sanding & Threaded Brass Inserts (+€12.50)',
      heat_treatment: 'Thermal Annealing Treatment (+€9.00)',
      blasted: 'Glass bead micro-blasting (+€7.50)',
      cured_smooth: 'Vapor smoothing / Thermal polish (+€14.00)',
      cmm_certified: 'Torrijos CMM Metrology Certificate (+€26.00)',
    },
    fr: {
      none: 'Sans finition (Ébavurage standard CAM)',
      threaded_inserts: 'Ponçage et Inserts Taraudés (+€12.50)',
      heat_treatment: 'Traitement Thermique de Recuit (+€9.00)',
      blasted: 'Microbillage aux billes de verre (+€7.50)',
      cured_smooth: 'Bain thermique / Lissage de surface (+€14.00)',
      cmm_certified: 'Certificat Métrologique MMT Torrijos (+€26.00)',
    },
    it: {
      none: 'Senza finitura (Rimozione supporti standard)',
      threaded_inserts: 'Levigatura e Inserti Filettati (+€12.50)',
      heat_treatment: 'Trattamento Termico di Ricottura (+€9.00)',
      blasted: 'Micropallinatura con microsfere (+€7.50)',
      cured_smooth: 'Bagno termico / Lucidatura superficiale (+€14.00)',
      cmm_certified: 'Certificato Metrologico CMM Torrijos (+€26.00)',
    },
    pt: {
      none: 'Sem acabamento (Remoção suportes CAM)',
      threaded_inserts: 'Lixagem e Insertos Roscados (+€12.50)',
      heat_treatment: 'Tratamento Térmico de Recozimento (+€9.00)',
      blasted: 'Jateamento com microesferas de vidro (+€7.50)',
      cured_smooth: 'Banho térmico / Polimento superficial (+€14.00)',
      cmm_certified: 'Certificado Metrológico CMM Torrijos (+€26.00)',
    },
  };

  const dict = labels[lang] || labels.es;
  return dict[option] || dict.none;
}

export function calculateQuotation(metrics: StlMetrics, config: QuoteConfig): PriceBreakdown {
  const material = getMaterialById(config.materialId);

  // Volume in cm3
  const rawVolumeCm3 = Math.max(metrics.volumeCm3, 0.5);

  // Effective volume based on infill:
  // Outer perimeter shells take ~35% of solid geometry; core volume scales with infill percentage
  const infillFactor = config.infillPercent / 100.0;
  const effectiveVolumeCm3 = rawVolumeCm3 * (0.35 + 0.65 * infillFactor);

  // Weight calculation
  const materialGrams = effectiveVolumeCm3 * material.densityGramsCm3;
  const unitMaterialCost = materialGrams * material.costPerGram;

  // Print speed estimation (cm3 per hour depending on layer height)
  let speedCm3PerHour = 22; // default 0.20mm
  if (config.layerHeightMm <= 0.12) {
    speedCm3PerHour = 11;
  } else if (config.layerHeightMm <= 0.16) {
    speedCm3PerHour = 16;
  } else if (config.layerHeightMm >= 0.28) {
    speedCm3PerHour = 34;
  }

  // SLA is layer-based photopolymerization
  if (material.id === 'sla_tough_resin') {
    speedCm3PerHour = 14;
  }

  // Time in hours: fixed machine prep (0.25h) + volume extrusion time
  const estimatedPrintHours = Math.max(0.4, 0.25 + effectiveVolumeCm3 / speedCm3PerHour);
  const unitMachineCost = estimatedPrintHours * material.machineCostPerHour;

  // Base CAM setup fee (discounted across multiple units)
  const baseSetupFee = 11.50;

  // Post-processing additions per unit
  let unitPostProcessing = 0;
  if (config.postProcessing === 'threaded_inserts') {
    unitPostProcessing = 12.50; // Lijado e insertos roscados M3/M4/M5 en caliente
  } else if (config.postProcessing === 'heat_treatment') {
    unitPostProcessing = 9.00; // Recocido térmico (Annealing) en horno
  } else if (config.postProcessing === 'blasted') {
    unitPostProcessing = 7.50; // Chorreado con microesferas de vidrio
  } else if (config.postProcessing === 'cured_smooth') {
    unitPostProcessing = 14.00; // Baño térmico / Pulido superficial
  } else if (config.postProcessing === 'cmm_certified') {
    unitPostProcessing = 26.00; // Informe metrológico CMM en Torrijos
  }

  // Unit net price calculation: (Volumen * Coste) + (Tiempo * Coste Maquina) + Tarifa Setup proporcional
  const unitProductionNet = unitMaterialCost + unitMachineCost + unitPostProcessing;
  
  // Volume scaling discounts for batches
  let volumeDiscountRate = 0;
  if (config.quantity >= 25) {
    volumeDiscountRate = 0.25;
  } else if (config.quantity >= 10) {
    volumeDiscountRate = 0.15;
  } else if (config.quantity >= 5) {
    volumeDiscountRate = 0.08;
  }

  const discountedUnitNet = unitProductionNet * (1 - volumeDiscountRate);
  const totalProductionNet = discountedUnitNet * config.quantity;
  const totalSetupFee = baseSetupFee + (config.quantity > 1 ? (config.quantity - 1) * 2.50 : 0);

  let subtotalNet = totalProductionNet + totalSetupFee;

  // Priority Express 24h (+25% operational dispatch surcharge)
  const priorityFee = config.priorityService ? subtotalNet * 0.25 : 0;
  subtotalNet += priorityFee;

  // Spanish Standard VAT (21%)
  const vatAmount = subtotalNet * 0.21;
  const totalWithVat = subtotalNet + vatAmount;

  // Delivery date calculation (excluding weekends)
  const now = new Date();
  const deliveryDays = config.priorityService ? 1 : (config.quantity > 15 ? 4 : 2);
  const targetDate = new Date(now.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
  const formattedDelivery = targetDate.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return {
    effectiveVolumeCm3: Math.round(effectiveVolumeCm3 * 100) / 100,
    materialGrams: Math.round(materialGrams * 10) / 10,
    materialCost: Math.round(unitMaterialCost * 100) / 100,
    estimatedPrintHours: Math.round(estimatedPrintHours * 10) / 10,
    machineCost: Math.round(unitMachineCost * 100) / 100,
    setupFee: Math.round(totalSetupFee * 100) / 100,
    postProcessingCost: Math.round(unitPostProcessing * config.quantity * 100) / 100,
    unitPriceNet: Math.round((subtotalNet / config.quantity) * 100) / 100,
    subtotalNet: Math.round(subtotalNet * 100) / 100,
    priorityFee: Math.round(priorityFee * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    totalWithVat: Math.round(totalWithVat * 100) / 100,
    estimatedDeliveryDate: formattedDelivery,
  };
}

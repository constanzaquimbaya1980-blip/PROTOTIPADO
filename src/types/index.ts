import * as THREE from 'three';

export type Language = 'es' | 'en' | 'fr' | 'it' | 'pt';

export type MeasurementUnit = 'mm' | 'in';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  company?: string;
  provider: 'google' | 'email';
  avatarUrl?: string;
  verifiedAt: number;
}

export interface BoundingBoxDimensions {
  x: number;
  y: number;
  z: number;
}

export interface StlMetrics {
  fileName: string;
  fileSizeBytes: number;
  triangleCount: number;
  volumeCm3: number;
  areaCm2: number;
  boundingBox: BoundingBoxDimensions;
  units: MeasurementUnit;
  isWatertight: boolean;
  minThicknessDetectedMm?: number;
}

export interface MaterialOption {
  id: string;
  name: string;
  shortName: string;
  technology: 'FDM / FFF Industrial' | 'SLA / DLP Fotopolímero' | 'SLS Polvo Láser';
  densityGramsCm3: number; // Density in g/cm³
  costPerGram: number; // Material cost in € / g
  machineCostPerHour: number; // Machine operational cost in € / h
  colorHex: string;
  roughness: number;
  metalness: number;
  heatDeflectionTemp: string; // e.g. "85°C"
  tensileStrength: string; // e.g. "48 MPa"
  recommendedFor: string;
  badge?: string;
}

export type PostProcessingOption =
  | 'none'
  | 'threaded_inserts'
  | 'heat_treatment'
  | 'blasted'
  | 'cured_smooth'
  | 'cmm_certified';

export interface QuoteConfig {
  materialId: string;
  infillPercent: number; // 10 to 100
  layerHeightMm: number; // 0.10, 0.12, 0.20, 0.28
  units: MeasurementUnit;
  quantity: number;
  postProcessing: PostProcessingOption;
  priorityService: boolean; // 24h Express
}

export interface PriceBreakdown {
  effectiveVolumeCm3: number;
  materialGrams: number;
  materialCost: number;
  estimatedPrintHours: number;
  machineCost: number;
  setupFee: number;
  postProcessingCost: number;
  unitPriceNet: number;
  subtotalNet: number;
  priorityFee: number;
  vatAmount: number;
  totalWithVat: number;
  estimatedDeliveryDate: string;
}

export interface StlModelItem {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  buffer: ArrayBuffer;
  geometry: THREE.BufferGeometry;
  metrics: StlMetrics;
  config: QuoteConfig;
  breakdown: PriceBreakdown;
  thinWallCount: number;
  isOptimallyOriented: boolean;
}

export interface CartItem {
  id: string;
  fileName: string;
  metrics: StlMetrics;
  config: QuoteConfig;
  breakdown: PriceBreakdown;
  createdAt: number;
}

export interface ActivePieceContext {
  fileName: string;
  volumeCm3: number;
  dimensionsMm: string;
  materialName: string;
  infillPercent: number;
  layerHeightMm: number;
  postProcessingName: string;
  thinWallCount: number;
  unitPriceNet: number;
  totalWithVat: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  suggestedActions?: string[];
  pieceContext?: ActivePieceContext;
}

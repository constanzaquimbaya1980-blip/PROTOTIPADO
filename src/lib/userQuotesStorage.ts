import { StlModelItem, AuthUser } from '../types';

export interface SavedUserQuote {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  company?: string;
  fileName: string;
  fileSizeBytes: number;
  dimensions: {
    x: number;
    y: number;
    z: number;
    units: string;
  };
  volumeCm3: number;
  surfaceAreaCm2: number;
  triangleCount: number;
  materialId: string;
  materialName: string;
  infillPercent: number;
  layerHeightMm: number;
  postProcessing: string;
  quantity: number;
  unitPriceNet: number;
  subtotalNet: number;
  vatAmount: number;
  totalWithVat: number;
  thinWallCount: number;
  status: 'draft' | 'quoted' | 'approved';
  createdAt: number;
  isoDate: string;
}

const STORAGE_PREFIX = 'p3d_firestore_quotes_';

export function getSavedQuotesForUser(userId: string): SavedUserQuote[] {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading saved quotes from storage:', err);
    return [];
  }
}

export function saveQuoteForUser(user: AuthUser, item: StlModelItem): SavedUserQuote {
  const quotes = getSavedQuotesForUser(user.id);
  
  const newQuote: SavedUserQuote = {
    id: `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    company: user.company,
    fileName: item.fileName,
    fileSizeBytes: item.fileSizeBytes,
    dimensions: {
      x: item.metrics.boundingBox.x,
      y: item.metrics.boundingBox.y,
      z: item.metrics.boundingBox.z,
      units: item.metrics.units,
    },
    volumeCm3: item.metrics.volumeCm3,
    surfaceAreaCm2: item.metrics.areaCm2,
    triangleCount: item.metrics.triangleCount,
    materialId: item.config.materialId,
    materialName: item.config.materialId,
    infillPercent: item.config.infillPercent,
    layerHeightMm: item.config.layerHeightMm,
    postProcessing: item.config.postProcessing,
    quantity: item.config.quantity,
    unitPriceNet: item.breakdown.unitPriceNet,
    subtotalNet: item.breakdown.subtotalNet,
    vatAmount: item.breakdown.vatAmount,
    totalWithVat: item.breakdown.totalWithVat,
    thinWallCount: item.thinWallCount,
    status: 'quoted',
    createdAt: Date.now(),
    isoDate: new Date().toISOString(),
  };

  const updated = [newQuote, ...quotes.filter((q) => q.fileName !== item.fileName || q.totalWithVat !== item.breakdown.totalWithVat)];
  localStorage.setItem(`${STORAGE_PREFIX}${user.id}`, JSON.stringify(updated.slice(0, 50)));

  // Dispatch custom event for reactive UI updates across components
  window.dispatchEvent(new CustomEvent('p3d_quotes_updated', { detail: { userId: user.id } }));

  return newQuote;
}

export function deleteSavedQuote(userId: string, quoteId: string): void {
  if (!userId) return;
  const quotes = getSavedQuotesForUser(userId);
  const filtered = quotes.filter((q) => q.id !== quoteId);
  localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('p3d_quotes_updated', { detail: { userId } }));
}

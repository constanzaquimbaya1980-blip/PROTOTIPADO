import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from './firebase';
import { StlModelItem, AuthUser } from '../types';
import { getMaterialById } from './pricingEngine';

export interface FirestoreQuoteData {
  userId: string;
  userEmail: string;
  userName: string;
  userCompany?: string;
  fileName: string;
  fileSizeBytes: number;
  dimensionsMm: {
    x: number;
    y: number;
    z: number;
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
  estimatedDeliveryDate: string;
  plantLocation: string;
  status: 'borrador' | 'cotizado' | 'en_fabricacion' | 'completado';
  createdAt: any;
}

/**
 * Guarda los datos del presupuesto (.STL, volumen cm³, dimensiones mm, material seleccionado, total con IVA)
 * en la colección 'presupuestos' vinculada al UID del usuario.
 */
export async function saveQuoteToFirestore(
  user: AuthUser,
  item: StlModelItem
): Promise<{ success: boolean; id: string; error?: string }> {
  if (!user || !user.id) {
    throw new Error('Usuario no autenticado para guardar en Firestore');
  }

  const mat = getMaterialById(item.config.materialId);

  const quotePayload: FirestoreQuoteData = {
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    userCompany: user.company || 'Sector Industrial',
    fileName: item.fileName,
    fileSizeBytes: item.fileSizeBytes,
    dimensionsMm: {
      x: item.metrics.boundingBox.x,
      y: item.metrics.boundingBox.y,
      z: item.metrics.boundingBox.z,
    },
    volumeCm3: parseFloat(item.metrics.volumeCm3.toFixed(2)),
    surfaceAreaCm2: parseFloat(item.metrics.areaCm2.toFixed(1)),
    triangleCount: item.metrics.triangleCount,
    materialId: item.config.materialId,
    materialName: mat.name,
    infillPercent: item.config.infillPercent,
    layerHeightMm: item.config.layerHeightMm,
    postProcessing: item.config.postProcessing,
    quantity: item.config.quantity,
    unitPriceNet: item.breakdown.unitPriceNet,
    subtotalNet: item.breakdown.subtotalNet,
    vatAmount: item.breakdown.vatAmount,
    totalWithVat: item.breakdown.totalWithVat,
    estimatedDeliveryDate: item.breakdown.estimatedDeliveryDate,
    plantLocation: 'Av. de los Trabajadores nº 23, Polígono Industrial de Torrijos (Toledo)',
    status: 'cotizado',
    createdAt: serverTimestamp(),
  };

  try {
    const presupuestosCol = collection(db, 'presupuestos');
    const docRef = await addDoc(presupuestosCol, quotePayload);
    
    // Also save in local persistence storage for offline and instant resilience
    saveToLocalStorageBackup(user.id, { ...quotePayload, id: docRef.id, createdAt: Date.now() });

    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.warn('Firestore write warning (utilizando almacenamiento local como fallback seguro):', err);
    // Graceful fallback to local persistence so user flow is never disrupted
    const fallbackId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    saveToLocalStorageBackup(user.id, { ...quotePayload, id: fallbackId, createdAt: Date.now() });
    return { success: true, id: fallbackId };
  }
}

/**
 * Consulta la colección 'presupuestos' filtrando por el UID del usuario
 */
export async function getUserQuotesFromFirestore(userId: string): Promise<any[]> {
  if (!userId) return [];
  try {
    const presupuestosCol = collection(db, 'presupuestos');
    const q = query(presupuestosCol, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (results.length > 0) return results;
  } catch (err) {
    console.warn('Firestore read fallback to local cache:', err);
  }
  return getFromLocalStorageBackup(userId);
}

function saveToLocalStorageBackup(userId: string, quote: any) {
  try {
    const key = `p3d_firestore_presupuestos_${userId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter((q: any) => q.id !== quote.id);
    localStorage.setItem(key, JSON.stringify([quote, ...filtered].slice(0, 50)));
    window.dispatchEvent(new CustomEvent('p3d_quotes_updated', { detail: { userId } }));
  } catch (e) {
    console.error(e);
  }
}

function getFromLocalStorageBackup(userId: string): any[] {
  try {
    const key = `p3d_firestore_presupuestos_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

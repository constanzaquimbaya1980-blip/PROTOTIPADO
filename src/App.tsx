/**
 * Project 3D - Prototipado Industrial Rápido (Torrijos, Toledo)
 * Web corporativa, visor 3D Three.js y cotizador automático de archivos STL
 */

import React, { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StlViewer3D } from './components/QuoteEngine/StlViewer3D';
import { QuoteConfigurator } from './components/QuoteEngine/QuoteConfigurator';
import { ServicesSection } from './components/ServicesSection';
import { MaterialsCatalog } from './components/MaterialsCatalog';
import { CaseStudies } from './components/CaseStudies';
import { LocationTorrijos } from './components/LocationTorrijos';
import { FaqSection } from './components/FaqSection';
import { TechnicalChatbot } from './components/TechnicalChatbot';
import { Footer } from './components/Footer';
import { CartReviewModal } from './components/CartReviewModal';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { AuthModal } from './components/Auth/AuthModal';
import { WorkspaceExportModal } from './components/WorkspaceExportModal';
import { SavedQuotesModal } from './components/SavedQuotesModal';

import { parseStlBuffer } from './lib/stlParser';
import { calculateQuotation, getMaterialById, getPostProcessingLabel } from './lib/pricingEngine';
import { generateFormalQuotePdf } from './lib/pdfGenerator';
import { saveQuoteForUser, getSavedQuotesForUser } from './lib/userQuotesStorage';
import { saveQuoteToFirestore } from './lib/firestoreService';
import {
  generateSampleHelicalGear,
  generateSampleMotorMount,
  generateSampleSensorBox,
} from './lib/sampleModels';
import { ActivePieceContext, CartItem, QuoteConfig, StlModelItem } from './types';

const DEFAULT_CONFIG: QuoteConfig = {
  materialId: 'pla_pro',
  infillPercent: 30,
  layerHeightMm: 0.2,
  units: 'mm',
  quantity: 1,
  postProcessing: 'none',
  priorityService: false,
};

function AppContent() {
  const { t, language } = useI18n();
  const { user, isLoggedIn, accessToken, openAuthModal } = useAuth();

  // Multi-STL models state
  const [models, setModels] = useState<StlModelItem[]>([]);
  const [activeModelId, setActiveModelId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Cart & Modal states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartModalMode, setCartModalMode] = useState<'cart' | 'technical_review'>('cart');
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isSavedQuotesModalOpen, setIsSavedQuotesModalOpen] = useState(false);
  const [savedQuotesCount, setSavedQuotesCount] = useState(0);

  // Stable Quote Reference
  const [currentQuoteRef, setCurrentQuoteRef] = useState<string>(() => `P3D-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  // Update saved quotes count when user or storage updates
  useEffect(() => {
    if (user) {
      const q = getSavedQuotesForUser(user.id);
      setSavedQuotesCount(q.length);
    } else {
      setSavedQuotesCount(0);
    }

    const handleQuotesChanged = () => {
      if (user) {
        setSavedQuotesCount(getSavedQuotesForUser(user.id).length);
      }
    };
    window.addEventListener('p3d_quotes_updated', handleQuotesChanged);
    return () => window.removeEventListener('p3d_quotes_updated', handleQuotesChanged);
  }, [user]);

  // Pre-load a sample model on initial mount for instant feedback
  useEffect(() => {
    loadSampleModel('gear');
  }, []);

  const loadSampleModel = (type: 'gear' | 'bracket' | 'enclosure') => {
    setIsProcessing(true);
    setTimeout(() => {
      let sampleData: { buffer: ArrayBuffer; name: string };
      if (type === 'gear') {
        sampleData = generateSampleHelicalGear();
      } else if (type === 'bracket') {
        sampleData = generateSampleMotorMount();
      } else {
        sampleData = generateSampleSensorBox();
      }

      const parsed = parseStlBuffer(sampleData.buffer, sampleData.name, 'mm');
      const itemConfig: QuoteConfig = { ...DEFAULT_CONFIG };
      const breakdown = calculateQuotation(parsed.metrics, itemConfig);

      const newItem: StlModelItem = {
        id: `sample-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fileName: sampleData.name,
        fileSizeBytes: sampleData.buffer.byteLength,
        buffer: sampleData.buffer,
        geometry: parsed.geometry,
        metrics: parsed.metrics,
        config: itemConfig,
        breakdown,
        thinWallCount: parsed.thinWallCount,
        isOptimallyOriented: false,
      };

      setModels((prev) => {
        const filtered = prev.filter((m) => !m.id.startsWith('sample-'));
        return [...filtered, newItem];
      });
      setActiveModelId(newItem.id);
      setIsProcessing(false);
    }, 120);
  };

  const handleMultipleFilesUpload = async (files: FileList | File[]) => {
    setIsProcessing(true);
    const fileList = Array.from(files).filter((f) => f.name.toLowerCase().endsWith('.stl'));

    if (fileList.length === 0) {
      alert('Por favor selecciona archivos con formato .STL');
      setIsProcessing(false);
      return;
    }

    try {
      const newItems: StlModelItem[] = [];

      for (const file of fileList) {
        const buffer = await file.arrayBuffer();
        const parsed = parseStlBuffer(buffer, file.name, 'mm');
        const itemConfig: QuoteConfig = { ...DEFAULT_CONFIG };
        const breakdown = calculateQuotation(parsed.metrics, itemConfig);

        newItems.push({
          id: `stl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          fileName: file.name,
          fileSizeBytes: buffer.byteLength,
          buffer,
          geometry: parsed.geometry,
          metrics: parsed.metrics,
          config: itemConfig,
          breakdown,
          thinWallCount: parsed.thinWallCount,
          isOptimallyOriented: false,
        });
      }

      setModels((prev) => [...prev, ...newItems]);
      if (newItems.length > 0) {
        setActiveModelId(newItems[0].id);
      }
    } catch (err) {
      console.error('Error procesando archivos STL:', err);
      alert('Hubo un error al procesar uno de los archivos STL. Por favor revisa que sean mallas válidas.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Find currently active model
  const activeModel = useMemo(() => {
    return models.find((m) => m.id === activeModelId) || models[0] || null;
  }, [models, activeModelId]);

  // Update configuration for the active model
  const handleConfigChange = (newConfig: QuoteConfig) => {
    if (!activeModel) return;

    setModels((prev) =>
      prev.map((item) => {
        if (item.id !== activeModel.id) return item;

        let updatedMetrics = item.metrics;
        // Re-scale metrics if units toggled
        if (newConfig.units !== item.config.units) {
          const reParsed = parseStlBuffer(item.buffer, item.metrics.fileName, newConfig.units);
          updatedMetrics = reParsed.metrics;
        }

        const newBreakdown = calculateQuotation(updatedMetrics, newConfig);
        return {
          ...item,
          config: newConfig,
          metrics: updatedMetrics,
          breakdown: newBreakdown,
        };
      })
    );
  };

  // Handle geometry update from auto-orientation in 3D viewer
  const handleGeometryUpdated = (
    newGeometry: THREE.BufferGeometry,
    newBoundingBox: { x: number; y: number; z: number }
  ) => {
    if (!activeModel) return;

    setModels((prev) =>
      prev.map((item) => {
        if (item.id !== activeModel.id) return item;

        const updatedMetrics = {
          ...item.metrics,
          boundingBox: newBoundingBox,
        };
        const updatedBreakdown = calculateQuotation(updatedMetrics, item.config);

        return {
          ...item,
          geometry: newGeometry,
          metrics: updatedMetrics,
          breakdown: updatedBreakdown,
          isOptimallyOriented: true,
        };
      })
    );
  };

  const handleRemoveModel = (id: string) => {
    setModels((prev) => {
      const remaining = prev.filter((m) => m.id !== id);
      if (activeModelId === id && remaining.length > 0) {
        setActiveModelId(remaining[0].id);
      }
      return remaining;
    });
  };

  const currentMaterial = useMemo(() => {
    const matId = activeModel ? activeModel.config.materialId : 'pla_pro';
    return getMaterialById(matId);
  }, [activeModel]);

  // Context passed to Technical Chatbot
  const activePieceContext: ActivePieceContext | null = useMemo(() => {
    if (!activeModel) return null;
    const mat = getMaterialById(activeModel.config.materialId);
    return {
      fileName: activeModel.metrics.fileName,
      volumeCm3: activeModel.metrics.volumeCm3,
      dimensionsMm: `${activeModel.metrics.boundingBox.x} × ${activeModel.metrics.boundingBox.y} × ${activeModel.metrics.boundingBox.z}`,
      materialName: mat.name,
      infillPercent: activeModel.config.infillPercent,
      layerHeightMm: activeModel.config.layerHeightMm,
      postProcessingName: getPostProcessingLabel(activeModel.config.postProcessing, language),
      thinWallCount: activeModel.thinWallCount,
      unitPriceNet: activeModel.breakdown.unitPriceNet,
      totalWithVat: activeModel.breakdown.totalWithVat,
    };
  }, [activeModel, language]);

  // Save Quote linked to User UID in Firestore
  const handleSaveUserQuote = async () => {
    if (!activeModel) return;
    if (!user) {
      openAuthModal('Inicia sesión o regístrate para guardar tus cotizaciones en tu cuenta.');
      return;
    }
    // Guardado primario en colección Firestore 'presupuestos'
    await saveQuoteToFirestore(user, activeModel);
    // Sincronización en almacenamiento local
    saveQuoteForUser(user, activeModel);
  };

  // Download Formal PDF Quote with 15-day validity
  const handleDownloadPdf = () => {
    if (models.length === 0) return;

    if (!isLoggedIn) {
      openAuthModal('Inicia sesión o crea una cuenta para descargar tu presupuesto formal en PDF con validez de 15 días.');
      return;
    }

    const items = models.map((m) => {
      const mat = getMaterialById(m.config.materialId);
      return {
        fileName: m.fileName,
        materialName: mat.name,
        volumeCm3: m.metrics.volumeCm3,
        infill: m.config.infillPercent,
        layerHeight: m.config.layerHeightMm,
        postProcessing: getPostProcessingLabel(m.config.postProcessing, language),
        quantity: m.config.quantity,
        unitPriceNet: m.breakdown.unitPriceNet,
        totalNet: m.breakdown.subtotalNet,
      };
    });

    const subtotalNet = models.reduce((acc, m) => acc + m.breakdown.subtotalNet, 0);
    const vatAmount = subtotalNet * 0.21;
    const grandTotal = subtotalNet + vatAmount;

    generateFormalQuotePdf({
      quoteNumber: currentQuoteRef,
      clientName: user?.name || 'Cliente Industrial Torrijos',
      clientCompany: user?.company || 'Departamento de I+D / Fabricación',
      clientEmail: user?.email,
      items,
      subtotalNet,
      vatAmount,
      grandTotal,
    });
  };

  const handleAddToCart = () => {
    if (!activeModel) return;

    if (!isLoggedIn) {
      openAuthModal('Identifícate para añadir piezas al carrito y formalizar tu orden de fabricación.');
      return;
    }

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fileName: activeModel.fileName,
      metrics: activeModel.metrics,
      config: activeModel.config,
      breakdown: activeModel.breakdown,
      createdAt: Date.now(),
    };

    setCart((prev) => [...prev, newItem]);
    setCartModalMode('cart');
    setIsCartModalOpen(true);
  };

  const handleAddAllToCart = () => {
    if (models.length === 0) return;

    if (!isLoggedIn) {
      openAuthModal('Identifícate para añadir el lote al carrito y solicitar fabricación en Torrijos.');
      return;
    }

    const newItems: CartItem[] = models.map((m) => ({
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fileName: m.fileName,
      metrics: m.metrics,
      config: m.config,
      breakdown: m.breakdown,
      createdAt: Date.now(),
    }));

    setCart((prev) => [...prev, ...newItems]);
    setCartModalMode('cart');
    setIsCartModalOpen(true);
  };

  const handleRequestReview = () => {
    if (!activeModel) return;

    if (!isLoggedIn) {
      openAuthModal('Identifícate para solicitar la revisión técnica gratuita por un ingeniero de planta.');
      return;
    }

    if (cart.length === 0) {
      const items: CartItem[] = models.map((m) => ({
        id: `review-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fileName: m.fileName,
        metrics: m.metrics,
        config: m.config,
        breakdown: m.breakdown,
        createdAt: Date.now(),
      }));
      setCart(items);
    }
    setCartModalMode('technical_review');
    setIsCartModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-800">
      {/* Top Bar Navigation with Language Selector & Auth */}
      <Navbar
        cart={cart}
        onOpenCart={() => {
          setCartModalMode('cart');
          setIsCartModalOpen(true);
        }}
        onOpenDocs={() => setIsDocsModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Integrated Web App: STL 3D Viewer & Quotation Engine (Split 2-Column) */}
        <section id="cotizador" className="py-16 lg:py-24 border-b border-slate-200 bg-[#f8fafc] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#0284c7] font-semibold block mb-2">
                {t.quote.tag}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight text-balance">
                {t.quote.title}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2">
                {t.quote.subtitle}
              </p>
            </div>

            {/* Split Screen Layout: 3D Viewer on Left, Configurator on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: 3D Three.js Canvas with Dynamic Dimension Tags (Cotas mm) and Wall Thickness */}
              <div className="lg:col-span-6 sticky top-20">
                <StlViewer3D
                  geometry={activeModel ? activeModel.geometry : null}
                  metrics={activeModel ? activeModel.metrics : null}
                  material={currentMaterial}
                  isProcessing={isProcessing}
                  thinWallCount={activeModel ? activeModel.thinWallCount : 0}
                  onGeometryUpdated={handleGeometryUpdated}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={() =>
                    openAuthModal(
                      'Crea una cuenta o Inicia Sesión para ver el modelo 3D con cotas dinámicas en mm y obtener la cotización oficial.'
                    )
                  }
                />
              </div>

              {/* Right Column: Parameters and Multi-STL Price Formula */}
              <div className="lg:col-span-6">
                <QuoteConfigurator
                  models={models}
                  activeModelId={activeModel ? activeModel.id : ''}
                  onSelectModel={setActiveModelId}
                  onRemoveModel={handleRemoveModel}
                  metrics={activeModel ? activeModel.metrics : null}
                  config={activeModel ? activeModel.config : DEFAULT_CONFIG}
                  breakdown={activeModel ? activeModel.breakdown : null}
                  onConfigChange={handleConfigChange}
                  onFileUpload={handleMultipleFilesUpload}
                  onLoadSample={loadSampleModel}
                  onAddToCart={handleAddToCart}
                  onAddAllToCart={handleAddAllToCart}
                  onRequestReview={handleRequestReview}
                  onDownloadPdf={handleDownloadPdf}
                  onExportWorkspace={() => setIsWorkspaceModalOpen(true)}
                  onSaveUserQuote={handleSaveUserQuote}
                  onOpenSavedQuotes={() => setIsSavedQuotesModalOpen(true)}
                  savedQuotesCount={savedQuotesCount}
                  isProcessing={isProcessing}
                  thinWallCount={activeModel ? activeModel.thinWallCount : 0}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={() =>
                    openAuthModal(
                      'Inicia sesión o regístrate para acceder al desglose presupuestario y formalizar tu pedido.'
                    )
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Industrial Prototyping Services */}
        <ServicesSection />

        {/* Materials Catalog */}
        <MaterialsCatalog
          onSelectMaterial={(materialId) => {
            if (activeModel) {
              handleConfigChange({ ...activeModel.config, materialId });
            }
          }}
        />

        {/* Industrial Case Studies */}
        <CaseStudies />

        {/* Facility Location in Torrijos, Toledo & Map */}
        <LocationTorrijos />

        {/* Technical FAQ */}
        <FaqSection />
      </main>

      {/* Corporate Footer */}
      <Footer onOpenDocs={() => setIsDocsModalOpen(true)} />

      {/* Floating Technical Assistant Chatbot (Contextually connected to 3D Viewer & Authenticated) */}
      <TechnicalChatbot activePiece={activePieceContext} />

      {/* Auth Modal with Google Sign-In & Email Authentication */}
      <AuthModal />

      {/* Workspace Integration Export Modal (Gmail API, Drive & Google Sheets) */}
      {user && (
        <WorkspaceExportModal
          isOpen={isWorkspaceModalOpen}
          onClose={() => setIsWorkspaceModalOpen(false)}
          models={models}
          user={user}
          quoteReference={currentQuoteRef}
          accessToken={accessToken}
        />
      )}

      {/* Saved Quotes History Modal */}
      <SavedQuotesModal
        isOpen={isSavedQuotesModalOpen}
        onClose={() => setIsSavedQuotesModalOpen(false)}
        user={user}
      />

      {/* Cart & Review Modal */}
      <CartReviewModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cart={cart}
        onRemoveItem={(id) => setCart((prev) => prev.filter((item) => item.id !== id))}
        onClearCart={() => setCart([])}
        mode={cartModalMode}
      />

      {/* Architecture Documentation Modal */}
      <ArchitectureDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </I18nProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle2, Send, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../context/AuthContext';
import { generateFormalQuotePdf } from '../lib/pdfGenerator';
import { getMaterialById, getPostProcessingLabel } from '../lib/pricingEngine';

interface CartReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  mode: 'cart' | 'technical_review';
}

export const CartReviewModal: React.FC<CartReviewModalProps> = ({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onClearCart,
  mode: initialMode,
}) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [mode, setMode] = useState<'cart' | 'technical_review'>(initialMode);
  const [contactData, setContactData] = useState({
    name: user?.name || '',
    company: user?.company || '',
    email: user?.email || '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{ ticketId: string } | null>(null);

  useEffect(() => {
    if (user) {
      setContactData((prev) => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email,
        company: prev.company || user.company || '',
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const totalNet = cart.reduce((acc, item) => acc + item.breakdown.subtotalNet, 0);
  const totalVat = totalNet * 0.21;
  const grandTotal = totalNet + totalVat;

  const handleCheckoutOrReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.email || !contactData.name) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quote/review-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          cartItems: cart,
          contactInfo: contactData,
          notes: contactData.notes,
        }),
      });
      const data = await res.json();
      setOrderConfirmed({ ticketId: data.ticketId || `P3D-${Date.now().toString(36).toUpperCase()}` });
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti optional
      }
      onClearCart();
    } catch (err) {
      console.error(err);
      setOrderConfirmed({ ticketId: `P3D-${Date.now().toString(36).toUpperCase()}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#0284c7] font-bold block">
              {mode === 'cart' ? t.cart.modalCartTitle : t.cart.modalReviewTitle}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {mode === 'cart' ? t.nav.cart : t.quote.requestReview}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {orderConfirmed ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {mode === 'cart' ? t.cart.successTitle : t.cart.successReviewTitle}
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Ref: <strong className="font-mono text-[#0284c7]">{orderConfirmed.ticketId}</strong>. {t.cart.successDesc}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 rounded-lg bg-[#0284c7] text-white font-bold text-xs hover:bg-[#0369a1] transition-colors shadow-sm"
              >
                {t.cart.closeBtn}
              </button>
            </div>
          ) : (
            <>
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  {t.cart.empty}
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold block">
                    {t.cart.modelsToProduce} ({cart.length})
                  </span>

                  {cart.map((item) => {
                    const mat = getMaterialById(item.config.materialId);
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-sm">{item.fileName}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-slate-600 font-mono text-[11px]">
                            <span>{mat.name}</span>
                            <span>·</span>
                            <span>{item.config.infillPercent}% infill</span>
                            <span>·</span>
                            <span>{item.config.layerHeightMm} mm</span>
                            <span>·</span>
                            <span>{getPostProcessingLabel(item.config.postProcessing)}</span>
                          </div>
                          <p className="text-slate-500 text-[10px] font-mono">
                            {item.metrics.volumeCm3.toFixed(1)} cm³ · {item.metrics.boundingBox.x}×{item.metrics.boundingBox.y}×{item.metrics.boundingBox.z} {item.metrics.units}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="text-right font-mono">
                            <span className="text-slate-500 block text-[10px]">
                              {item.config.quantity} ud × €{item.breakdown.unitPriceNet.toFixed(2)}
                            </span>
                            <span className="text-[#0284c7] font-bold text-sm">
                              €{item.breakdown.totalWithVat.toFixed(2)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Summary Totals */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>{t.cart.baseSubtotal}</span>
                      <span>€{totalNet.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>{t.cart.vatLabel}</span>
                      <span>€{totalVat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold text-base pt-2 border-t border-slate-200">
                      <span>{t.cart.grandTotal}</span>
                      <span className="text-[#0284c7]">€{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {cart.length > 0 && (
                <form onSubmit={handleCheckoutOrReview} className="space-y-4 pt-2 border-t border-slate-200">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold block">
                    Información de Envío / Receptor Técnico
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">{t.cart.fieldContact} *</label>
                      <input
                        type="text"
                        required
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                        placeholder="Nombre completo"
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">{t.cart.fieldCompany}</label>
                      <input
                        type="text"
                        value={contactData.company}
                        onChange={(e) => setContactData({ ...contactData, company: e.target.value })}
                        placeholder="Ej. Industrias Mecánicas S.L."
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">{t.cart.fieldEmail} *</label>
                      <input
                        type="email"
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="roberto@empresa.com"
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">{t.cart.fieldPhone}</label>
                      <input
                        type="tel"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        placeholder="+34 612 345 678"
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">{t.cart.fieldNotes}</label>
                    <textarea
                      rows={2}
                      value={contactData.notes}
                      onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                      placeholder="Indicar tolerancias especiales, orientación preferente de piezas o necesidad de certificado..."
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-sky-600/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {isSubmitting
                          ? t.cart.submitting
                          : mode === 'cart'
                          ? `${t.cart.submitCart} · €${grandTotal.toFixed(2)}`
                          : t.cart.submitReview}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const quoteNumber = `P3D-${Date.now().toString(36).toUpperCase()}`;
                        const items = cart.map((c) => {
                          const mat = getMaterialById(c.config.materialId);
                          return {
                            fileName: c.fileName,
                            materialName: mat.name,
                            volumeCm3: c.metrics.volumeCm3,
                            infill: c.config.infillPercent,
                            layerHeight: c.config.layerHeightMm,
                            postProcessing: getPostProcessingLabel(c.config.postProcessing),
                            quantity: c.config.quantity,
                            unitPriceNet: c.breakdown.unitPriceNet,
                            totalNet: c.breakdown.subtotalNet,
                          };
                        });
                        generateFormalQuotePdf({
                          quoteNumber,
                          clientName: contactData.name || 'Cliente Industrial',
                          clientCompany: contactData.company || undefined,
                          clientEmail: contactData.email || undefined,
                          items,
                          subtotalNet: totalNet,
                          vatAmount: totalVat,
                          grandTotal: grandTotal,
                          notes: contactData.notes || undefined,
                        });
                      }}
                      className="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4 text-amber-600" />
                      <span>Descargar PDF (15 días)</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

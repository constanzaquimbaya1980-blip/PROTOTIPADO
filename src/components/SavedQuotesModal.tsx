import React, { useState, useEffect } from 'react';
import { X, Trash2, Box, Calendar, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { getSavedQuotesForUser, deleteSavedQuote, SavedUserQuote } from '../lib/userQuotesStorage';
import { AuthUser } from '../types';

interface SavedQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onLoadQuoteIntoViewer?: (quote: SavedUserQuote) => void;
}

export const SavedQuotesModal: React.FC<SavedQuotesModalProps> = ({
  isOpen,
  onClose,
  user,
  onLoadQuoteIntoViewer,
}) => {
  const [quotes, setQuotes] = useState<SavedUserQuote[]>([]);

  const loadQuotes = () => {
    if (user) {
      setQuotes(getSavedQuotesForUser(user.id));
    } else {
      setQuotes([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadQuotes();
    }
  }, [isOpen, user]);

  useEffect(() => {
    const handleUpdate = () => {
      loadQuotes();
    };
    window.addEventListener('p3d_quotes_updated', handleUpdate);
    return () => window.removeEventListener('p3d_quotes_updated', handleUpdate);
  }, [user]);

  if (!isOpen) return null;

  const handleDelete = (quoteId: string) => {
    if (!user) return;
    deleteSavedQuote(user.id, quoteId);
    loadQuotes();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-[#0284c7]">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#0284c7] font-bold block">
                Historial de Cotizaciones Guardadas
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Presupuestos Vinculados a {user?.name || 'Usuario'}
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

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 text-xs">
          {quotes.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-semibold text-slate-700">Aún no tienes presupuestos guardados</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Carga un archivo .STL en el cotizador y pulsa en "Guardar Presupuesto" para archivarlo en tu perfil.
              </p>
            </div>
          ) : (
            quotes.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm font-sans">{q.fileName}</span>
                    <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-semibold">
                      {q.materialName}
                    </span>
                  </div>

                  <div className="text-slate-500 font-mono text-[11px] flex flex-wrap items-center gap-2">
                    <span>
                      {q.dimensions.x}×{q.dimensions.y}×{q.dimensions.z} mm
                    </span>
                    <span>·</span>
                    <span className="text-[#0284c7] font-semibold">{q.volumeCm3.toFixed(1)} cm³</span>
                    <span>·</span>
                    <span>{q.quantity} {q.quantity === 1 ? 'unidad' : 'unidades'}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(q.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-[#0284c7] block">
                      €{q.totalWithVat.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">IVA incl.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    title="Eliminar de mi historial"
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>{quotes.length} presupuestos en tu historial</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

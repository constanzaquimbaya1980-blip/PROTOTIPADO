import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export const FaqSection: React.FC = () => {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS = [
    {
      q: '¿Qué formatos de archivo 3D acepta el cotizador y el taller?',
      a: 'El cotizador web automático procesa archivos .STL (formato binario y ASCII). Para proyectos con revisión de ingeniería también admitimos archivos nativos paramétricos (.STEP, .STP, .IGES, .SLDPRT, .IPT). Si tienes un formato diferente, puedes solicitar la revisión técnica o enviarlo por email a ingenieria@project3d-torrijos.es.',
    },
    {
      q: '¿Cómo calcula la plataforma el volumen y coste exacto de mi pieza?',
      a: 'Nuestro motor en el navegador analiza cada faceta triangular de la malla usando el Teorema de la Divergencia (cálculo de volumen mediante tetraedros orientados) para obtener el volumen neto exacto en cm³. A partir de ahí, se calcula la masa en gramos según la densidad del material, el tiempo de impresión basado en la altura de capa y se aplica la fórmula industrial: (Volumen × Coste Material) + (Tiempo estimado × Coste de Máquina) + Tarifa CAM.',
    },
    {
      q: '¿Podemos firmar un acuerdo de confidencialidad (NDA) antes de subir el diseño?',
      a: 'Absolutamente. Trabajamos bajo estrictos protocolos de confidencialidad industrial. Podemos enviarte nuestro modelo estándar de acuerdo de confidencialidad (NDA) bilateral o firmar el provisto por el departamento legal de tu empresa antes de la revisión detallada de tus archivos CAD.',
    },
    {
      q: '¿Cómo funciona la recogida en vuestra planta de Torrijos (Toledo)?',
      a: 'Una vez finalizada la fabricación y el control de calidad, recibirás un aviso con el parte de finalización. Puedes retirar las piezas directamente en nuestra nave en el Polígono Industrial de Torrijos, Av. de los Trabajadores nº 23, de lunes a viernes en horario ininterrumpido de 7:30 a 18:30. Disponemos de muelle de carga.',
    },
    {
      q: '¿Qué diferencia hay entre la altura de capa 0.12 mm y 0.20 mm?',
      a: 'Una altura de capa de 0.12 mm duplica la resolución en el eje Z respecto a 0.20 mm, reduciendo notablemente el efecto escalera en superficies curvas y aumentando la precisión en roscas finas o ensambles delicados, a cambio de un mayor tiempo de máquina. Para prototipos estructurales de gran tamaño, 0.20 mm o 0.28 mm ofrece una resistencia idéntica con menor coste.',
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 border-b border-slate-200 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-[#0284c7] font-semibold block mb-2">
            {t.faq.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight text-balance">
            {t.faq.title}
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-800 hover:text-[#0284c7] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0284c7]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

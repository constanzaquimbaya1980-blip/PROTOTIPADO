import React from 'react';
import { useI18n } from '../i18n/I18nContext';

export const CaseStudies: React.FC = () => {
  const { t } = useI18n();

  const CASE_STUDIES = [
    {
      tag: 'Aeroespacial & Drones',
      title: 'Soporte de tren y manifold topológico para UAV autónomo',
      client: 'Fabricante de Drones de Inspección Industrial',
      material: 'Nylon PA12 + Fibra de Carbono (SLS)',
      metricValue: '-62% Peso',
      metricContext: 'vs. aleación mecanizada Al 6061-T6',
      turnaround: '36 Horas',
      description: 'Optimización topológica de la pieza eliminando material innecesario. Resistencia a vibraciones de motor térmico y rigidez torsional comprobada en banco de ensayo.',
    },
    {
      tag: 'Automoción & Motorsport',
      title: 'Colector de admisión y canalizador de frenos para competición',
      client: 'Equipo Técnico de Ingeniería de Competición (Castilla-La Mancha)',
      material: 'ABS Grado Automoción (Cámara calefactada 90°C)',
      metricValue: '110 °C',
      metricContext: 'temperatura pico de operación continua',
      turnaround: '24 Horas Express',
      description: 'Impresión en una única pieza hermética sin uniones adhesivas. Sometido a presiones de turbo de 1.8 bar y contacto con vapores de combustible sin degradación.',
    },
    {
      tag: 'Robótica & Automatización',
      title: 'Garras neumáticas e insertos roscados para célula de paletizado',
      client: 'Integrador de Robótica de Torrijos',
      material: 'PETG Técnico Reforzado con casquillos M4/M6',
      metricValue: '+340.000',
      metricContext: 'ciclos sin holgura ni fatiga',
      turnaround: '48 Horas',
      description: 'Fabricación directa con roscas métricas encastradas en caliente. Sustitución de piezas de recambio descatalogadas para evitar parada de línea de producción.',
    },
  ];

  return (
    <section id="casos" className="py-20 lg:py-28 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-[#0284c7] font-semibold block mb-2">
            {t.cases.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight text-balance">
            {t.cases.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            {t.cases.subtitle}
          </p>
        </div>

        {/* Highlight Banner with image */}
        <div className="rounded-2xl border border-slate-300 bg-slate-50 overflow-hidden mb-10 grid grid-cols-1 lg:grid-cols-12 shadow-md">
          <div className="lg:col-span-7 h-64 lg:h-auto relative">
            <img
              src="/src/assets/images/case_study_aerospace_1791188544618.jpg"
              alt="Caso de estudio prototipo colector aeroespacial"
              width={800}
              height={600}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-mono text-[#0284c7] uppercase tracking-wider font-semibold">
                {t.cases.featuredTag}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Colector Topológico de Alta Presión en PA12-CF
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Fabricación de prototipo funcional sometido a validación en banco de pruebas con gases calientes en 36h desde el envío del archivo STEP/STL a nuestro taller de Torrijos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 font-mono">
              <div>
                <span className="text-2xl font-black text-[#0284c7] block">-58%</span>
                <span className="text-xs text-slate-500">{t.cases.savingLabel}</span>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block">36 h</span>
                <span className="text-xs text-slate-500">{t.cases.turnaroundLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_STUDIES.map((cs, idx) => (
            <div
              key={idx}
              className="card-industrial p-6 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-mono text-[#0284c7] uppercase font-bold tracking-wider block mb-2">
                  {cs.tag}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{cs.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{cs.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-lg font-black text-[#0284c7]">{cs.metricValue}</span>
                  <span className="text-xs font-semibold text-slate-700">{cs.turnaround}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  <span className="text-slate-400 block font-mono">{t.cases.materialUsed}:</span>
                  <span className="text-slate-800 font-medium">{cs.material}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

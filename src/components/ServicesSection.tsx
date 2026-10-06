import React from 'react';
import { useI18n } from '../i18n/I18nContext';

export const ServicesSection: React.FC = () => {
  const { t } = useI18n();

  const SERVICES = [
    {
      number: '01',
      title: 'FDM / FFF Industrial Gran Formato',
      description: 'Capacidad de fabricación continua para componentes monolíticos de hasta 600×600×600 mm con control térmico activo en cámara cerrada a 90°C.',
      tolerances: '±0.20 mm',
      technologies: 'ABS Técnico, PETG Reforzado, ASA UV, PC',
      idealFor: 'Conductos de ventilación, parachoques, utillajes de taller y calibres de control.',
    },
    {
      number: '02',
      title: 'SLA / DLP Estereolitografía Ultra Precisión',
      description: 'Polimerización láser capa a capa para obtener acabados lisos clase molde de inyección, transparencias ópticas y roscas métricas M2-M6.',
      tolerances: '±0.05 mm',
      technologies: 'Resinas Tough, Alta Temperatura, Elastoméricas',
      idealFor: 'Master para moldes de silicona, conectores micrométricos, carcasas de electrónica fina.',
    },
    {
      number: '03',
      title: 'SLS Sinterizado Láser & Pre-series Poliamida',
      description: 'Fusión selectiva de polvo de poliamida PA12 y fibra de carbono sin soportes de impresión, permitiendo geometrías orgánicas y topología optimizada.',
      tolerances: '±0.10 mm',
      technologies: 'Nylon PA12, PA11 ESD, Compuestos de Carbono',
      idealFor: 'Lotes de 10 a 500 unidades, sustitución de aluminio, drones y piezas finales de vuelo.',
    },
    {
      number: '04',
      title: 'Mecanizado Complementario CNC & Post-Proceso',
      description: 'Planeado de caras críticas, roscado helicoidal de precisión e inserción de casquillos térmicos de latón en piezas aditivas.',
      tolerances: '±0.02 mm',
      technologies: 'Centro mecanizado 3 ejes & banco CMM',
      idealFor: 'Ensambles de alta carga, pistas de rodadura y uniones atornilladas de alta tensión.',
    },
  ];

  return (
    <section id="servicios" className="py-20 lg:py-28 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-[#0284c7] font-semibold block mb-2">
            {t.services.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight text-balance">
            {t.services.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((srv) => (
            <div
              key={srv.number}
              className="card-industrial p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-50 text-[#0284c7] border border-sky-200">
                    {srv.number}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
                    <span className="text-slate-400 font-sans">{t.services.toleranceLabel}:</span>
                    <span className="font-bold text-slate-900">{srv.tolerances}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{srv.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{srv.description}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 font-mono">Polímeros:</span>
                  <span className="text-slate-700 font-medium">{srv.technologies}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 font-mono">{t.services.idealForLabel}:</span>
                  <span className="text-slate-600">{srv.idealFor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

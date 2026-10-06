import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface MaterialsCatalogProps {
  onSelectMaterial: (materialId: string) => void;
}

const MATERIAL_SPECS_DETAILED = [
  {
    id: 'pla_pro',
    name: 'PLA Industrial Plus',
    polymer: 'Ácido Poliláctico modificado con elastómeros',
    tensile: '52 MPa',
    modulus: '3.1 GPa',
    elongation: '8%',
    temp: '58 °C',
    density: '1.24 g/cm³',
    costKg: '€85 / kg',
    pros: ['Impresión rápida y sin deformaciones', 'Excelente estabilidad dimensional', 'Económico para maquetas volumétricas'],
    cons: ['Baja resistencia a más de 55°C', 'No apto para exteriores prolongados'],
    color: '#0284c7',
  },
  {
    id: 'abs_industrial',
    name: 'ABS Grado Automoción',
    polymer: 'Acrilonitrilo Butadieno Estireno',
    tensile: '45 MPa',
    modulus: '2.3 GPa',
    elongation: '14%',
    temp: '96 °C',
    density: '1.05 g/cm³',
    costKg: '€115 / kg',
    pros: ['Excelente tenacidad al impacto', 'Mecanizable, roscable y pegable con acetona', 'Apto para vano motor y componentes de automoción'],
    cons: ['Requiere cámara cerrada a 90°C', 'Sensible a rayos UV directos sin aditivos'],
    color: '#f97316',
  },
  {
    id: 'petg_carbon',
    name: 'PETG Técnico Reforzado',
    polymer: 'Polietileno Tereftalato de Glicol',
    tensile: '50 MPa',
    modulus: '2.5 GPa',
    elongation: '20%',
    temp: '75 °C',
    density: '1.27 g/cm³',
    costKg: '€105 / kg',
    pros: ['Resistencia química a grasas y ácidos diluidos', 'Estanqueidad hidrostática superior', 'Alta adhesión entre capas'],
    cons: ['Acabado superficial ligeramente brillante', 'Menos rígido que nylon con fibra'],
    color: '#10b981',
  },
  {
    id: 'nylon_pa12_cf',
    name: 'Nylon PA12 con Fibra de Carbono',
    polymer: 'Poliamida 12 reforzada con 15% fibra de carbono picada',
    tensile: '88 MPa',
    modulus: '6.2 GPa',
    elongation: '4.5%',
    temp: '145 °C',
    density: '1.15 g/cm³',
    costKg: '€240 / kg',
    pros: ['Rigidez similar al aluminio fundido', 'Excelente comportamiento a fatiga cíclica', 'Acabado mate técnico negro grafito'],
    cons: ['Higroscópico (requiere secado previo)', 'Coste unitario más elevado'],
    color: '#334155',
  },
  {
    id: 'sla_tough_resin',
    name: 'Resina SLA Ultra Precisión',
    polymer: 'Fotopolímero de acrilato curable UV (405 nm)',
    tensile: '58 MPa',
    modulus: '2.8 GPa',
    elongation: '12%',
    temp: '68 °C',
    density: '1.18 g/cm³',
    costKg: '€290 / kg',
    pros: ['Superficie lisa Clase A sin líneas de deposición', 'Tolerancias micrométricas ±0.05 mm', 'Roscas métricas finas integrables'],
    cons: ['Requiere lavado con alcohol isopropílico y post-curado UV', 'Menor resistencia a impactos violentos'],
    color: '#64748b',
  },
];

export const MaterialsCatalog: React.FC<MaterialsCatalogProps> = ({ onSelectMaterial }) => {
  const { t } = useI18n();
  const [selectedMatId, setSelectedMatId] = useState<string>('pla_pro');
  const current = MATERIAL_SPECS_DETAILED.find((m) => m.id === selectedMatId) || MATERIAL_SPECS_DETAILED[0];

  const handleSelectAndScroll = (id: string) => {
    onSelectMaterial(id);
    const element = document.getElementById('cotizador');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="materiales" className="py-20 lg:py-28 border-b border-slate-200 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#0284c7] font-semibold block mb-2">
              {t.materials.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight text-balance">
              {t.materials.title}
            </h2>
          </div>
          <p className="text-slate-600 text-sm max-w-md">
            {t.materials.subtitle}
          </p>
        </div>

        {/* Feature Grid with Image Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Material Selectors List */}
          <div className="lg:col-span-4 space-y-2">
            {MATERIAL_SPECS_DETAILED.map((mat) => {
              const active = selectedMatId === mat.id;
              return (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMatId(mat.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    active
                      ? 'border-[#0284c7] bg-white text-slate-900 shadow-md ring-1 ring-[#0284c7]/40'
                      : 'border-slate-200 bg-white/70 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: mat.color }}
                      />
                      <span className="font-semibold text-sm">{mat.name}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500 font-bold">{mat.temp}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-1">{mat.polymer}</div>
                </button>
              );
            })}
          </div>

          {/* Active Material Deep Inspection Card */}
          <div className="lg:col-span-8 rounded-xl border border-slate-300 bg-white p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs font-mono text-[#0284c7] uppercase tracking-wider font-semibold">
                    {t.materials.datasheetTag}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{current.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{current.polymer}</p>
                </div>

                <button
                  onClick={() => handleSelectAndScroll(current.id)}
                  className="py-2.5 px-4 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>{t.materials.configureCta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Technical Property Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 text-xs font-mono">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">{t.materials.propTensile}</span>
                  <span className="text-slate-900 font-bold text-base tabular-nums">{current.tensile}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">{t.materials.propHdt}</span>
                  <span className="text-[#0284c7] font-bold text-base tabular-nums">{current.temp}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">{t.materials.propModulus}</span>
                  <span className="text-slate-900 font-bold text-base tabular-nums">{current.modulus}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">{t.materials.propDensity}</span>
                  <span className="text-slate-900 font-bold text-base tabular-nums">{current.density}</span>
                </div>
              </div>

              {/* Pros & Industrial Applications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <h4 className="text-xs font-mono uppercase text-emerald-700 font-bold tracking-wider mb-2.5">
                    {t.materials.prosTitle}
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {current.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider mb-2.5">
                    {t.materials.consTitle}
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-500">
                    {current.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Facility Guarantee in Torrijos */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-mono">
                {t.materials.rawCostEst}: <strong className="text-slate-900">{current.costKg}</strong>
              </span>
              <span className="text-emerald-700 font-medium">
                {t.materials.stockNotice}
              </span>
            </div>
          </div>
        </div>

        {/* Quality Lab & Specimens Showcase banner */}
        <div className="rounded-2xl overflow-hidden border border-slate-300 bg-white grid grid-cols-1 lg:grid-cols-12 shadow-md">
          <div className="lg:col-span-5 relative h-64 lg:h-auto">
            <img
              src="/src/assets/images/materials_specimens_1791188532805.jpg"
              alt="Probetas mecánicas ensayadas de polímeros industriales en Torrijos"
              width={800}
              height={600}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-4">
            <span className="text-xs font-mono uppercase text-[#0284c7] font-semibold">
              {t.materials.labTag}
            </span>
            <h3 className="text-2xl font-bold text-slate-900">
              {t.materials.labTitle}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.materials.labDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

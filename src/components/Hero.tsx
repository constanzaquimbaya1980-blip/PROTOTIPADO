import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export const Hero: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#f8fafc] pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Proposition and Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Facility trust signal */}
            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] text-balance">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#cotizador"
                className="py-3.5 px-6 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-600/20 active:scale-[0.99]"
              >
                <span>{t.hero.ctaQuote}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#materiales"
                className="py-3.5 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>{t.hero.ctaCatalog}</span>
              </a>
            </div>

            {/* Adjacent Proof Rigor */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-slate-700">
              <div>
                <span className="font-mono text-2xl font-black text-[#0284c7] tabular-nums">{t.hero.statTolerance}</span>
                <span className="text-xs text-slate-500 block mt-0.5">{t.hero.statToleranceLabel}</span>
              </div>
              <div>
                <span className="font-mono text-2xl font-black text-slate-900 tabular-nums">{t.hero.statTurnaround}</span>
                <span className="text-xs text-slate-500 block mt-0.5">{t.hero.statTurnaroundLabel}</span>
              </div>
              <div>
                <span className="font-mono text-2xl font-black text-slate-900 tabular-nums">{t.hero.statQuality}</span>
                <span className="text-xs text-slate-500 block mt-0.5">{t.hero.statQualityLabel}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset (Optimized Web Vitals) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-white shadow-2xl">
              <img
                src="/src/assets/images/hero_industrial_3d_1791188520806.jpg"
                alt="Instalaciones industriales de prototipado rápido en Torrijos"
                width={1920}
                height={1080}
                loading="eager"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />

              {/* Floating Industrial Machine Spec Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-300 p-3.5 rounded-xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-900">{t.hero.machinePark}</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#0284c7] uppercase">
                    {t.hero.machineStatus}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-600">
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[9px]">FDM PRO</span>
                    <span className="text-slate-900 font-semibold">600×600mm</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[9px]">SLA 4K</span>
                    <span className="text-slate-900 font-semibold">±0.05 mm</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[9px]">SLS LÁSER</span>
                    <span className="text-slate-900 font-semibold">PA12 + CF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

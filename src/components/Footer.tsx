import React from 'react';
import { ShieldCheck, BookOpen, MapPin, ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface FooterProps {
  onOpenDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs }) => {
  const { t } = useI18n();

  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Av.+de+los+Trabajadores+23+Poligono+Industrial+Torrijos+Toledo';

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-200">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <a href="#" className="text-base font-bold text-slate-900 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-500 to-[#0284c7] flex items-center justify-center text-white font-black text-xs shadow-sm">
                3D
              </div>
              <span className="font-extrabold text-slate-900">Project 3D</span>
            </a>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.footer.iso}</span>
            </div>
          </div>

          {/* Torrijos Facility Contact with Google Maps Link */}
          <div className="space-y-2">
            <h4 className="font-mono text-slate-900 uppercase tracking-wider text-[11px] font-bold">
              {t.footer.facilityTitle}
            </h4>
            <div className="space-y-1 text-[11px] text-slate-600">
              <p>Polígono Industrial de Torrijos</p>
              <p className="font-semibold text-slate-800">Av. de los Trabajadores nº 23</p>
              <p>45500 Torrijos (Toledo), España</p>
              <p className="text-slate-800 font-mono pt-1">Tel: +34 925 77 12 34</p>
              <p className="text-[#0284c7] font-medium">ingenieria@project3d-torrijos.es</p>

              {/* Direct Google Maps link */}
              <div className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-50 border border-slate-300 text-[#0284c7] font-semibold text-[11px] transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Ver en Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h4 className="font-mono text-slate-900 uppercase tracking-wider text-[11px] font-bold">
              {t.footer.navTitle}
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#cotizador" className="hover:text-[#0284c7] transition-colors">{t.nav.quote}</a></li>
              <li><a href="#servicios" className="hover:text-[#0284c7] transition-colors">{t.nav.services}</a></li>
              <li><a href="#materiales" className="hover:text-[#0284c7] transition-colors">{t.nav.materials}</a></li>
              <li><a href="#casos" className="hover:text-[#0284c7] transition-colors">{t.nav.cases}</a></li>
              <li><a href="#ubicacion" className="hover:text-[#0284c7] transition-colors">{t.nav.torrijos}</a></li>
              <li><a href="#faq" className="hover:text-[#0284c7] transition-colors">{t.nav.faq}</a></li>
            </ul>
          </div>

          {/* Technical Resources & Docs */}
          <div className="space-y-2">
            <h4 className="font-mono text-slate-900 uppercase tracking-wider text-[11px] font-bold">
              {t.footer.legalTitle}
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={onOpenDocs}
                  className="text-[#0284c7] hover:underline flex items-center gap-1 font-semibold"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{t.footer.docsLink}</span>
                </button>
              </li>
              <li><span>Acuerdos de Confidencialidad (NDA)</span></li>
              <li><span>Trazabilidad CMM y Probetas ISO</span></li>
              <li><span>Aviso Legal y Privacidad</span></li>
              <li><span>Condiciones de Suministro B2B</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {t.footer.rights}
          </div>
          <div>
            {t.footer.dispatchNotice}
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, Truck, ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export const LocationTorrijos: React.FC = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Av.+de+los+Trabajadores+23+Poligono+Industrial+Torrijos+Toledo';

  return (
    <section id="ubicacion" className="py-20 lg:py-28 border-b border-slate-200 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-[#0284c7] font-semibold block mb-2">
            {t.location.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight text-balance">
            {t.location.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            {t.location.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact details + Map representation */}
          <div className="lg:col-span-7 space-y-6">
            {/* Torrijos Map Card */}
            <div className="rounded-xl border border-slate-300 bg-white overflow-hidden shadow-md">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0284c7]" />
                  <span className="text-xs font-semibold text-slate-900">
                    {t.location.addressHeader}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">45500 Torrijos (Toledo)</span>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-[#0284c7] hover:text-[#0369a1] flex items-center gap-1 font-semibold"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Embedded Interactive Google Map for Torrijos Av. de los Trabajadores 23 */}
              <div className="w-full h-80 relative bg-slate-100">
                <iframe
                  title="Mapa de localización Project 3D Torrijos"
                  src="https://maps.google.com/maps?q=Avenida+de+los+Trabajadores+23,+Torrijos,+Toledo,+Spain&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono">{t.location.hubHighway}</span>
                    <span className="text-slate-800 font-semibold">{t.location.hubHighwayVal}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono">{t.location.hubDistances}</span>
                    <span className="text-slate-800 font-semibold">{t.location.hubDistancesVal}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono">{t.location.hubDock}</span>
                    <span className="text-slate-800 font-semibold">{t.location.hubDockVal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Channel Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-300 bg-white shadow-sm">
                <Phone className="w-4 h-4 text-[#0284c7] mb-2" />
                <span className="text-[10px] uppercase font-mono text-slate-500 block">{t.location.phoneLabel}</span>
                <a href="tel:+34925771234" className="text-sm font-bold text-slate-900 hover:text-[#0284c7]">
                  +34 925 77 12 34
                </a>
                <span className="text-[10px] text-slate-500 block mt-1">{t.location.hoursVal}</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-300 bg-white shadow-sm">
                <Mail className="w-4 h-4 text-[#0284c7] mb-2" />
                <span className="text-[10px] uppercase font-mono text-slate-500 block">{t.location.emailLabel}</span>
                <a href="mailto:ingenieria@project3d-torrijos.es" className="text-xs font-bold text-slate-900 hover:text-[#0284c7] break-all">
                  ingenieria@project3d-torrijos.es
                </a>
                <span className="text-[10px] text-slate-500 block mt-1">&lt; 2h SLA respuesta</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-300 bg-white shadow-sm">
                <Clock className="w-4 h-4 text-[#0284c7] mb-2" />
                <span className="text-[10px] uppercase font-mono text-slate-500 block">{t.location.hoursLabel}</span>
                <span className="text-xs font-bold text-slate-900 block">Torrijos Hub</span>
                <span className="text-[10px] text-slate-500 block mt-1">Av. Trabajadores 23</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Contact Form */}
          <div className="lg:col-span-5 rounded-xl border border-slate-300 bg-white p-6 sm:p-8 shadow-md">
            <span className="text-xs font-mono uppercase tracking-wider text-[#0284c7] font-semibold block mb-1">
              {t.location.formTag}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t.location.formTitle}</h3>
            <p className="text-xs text-slate-600 mb-6">
              {t.location.formSub}
            </p>

            {isSuccess ? (
              <div className="p-6 rounded-xl border border-emerald-300 bg-emerald-50 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 mx-auto flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-emerald-900">{t.location.formSuccessTitle}</h4>
                <p className="text-xs text-emerald-800">
                  {t.location.formSuccessMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="mt-3 text-xs font-semibold text-[#0284c7] underline"
                >
                  {t.location.formAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {t.location.formName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Ing. Roberto Mendoza"
                    className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {t.location.formEmail} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="roberto@empresa.com"
                      className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {t.location.formPhone}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+34 600 000 000"
                      className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {t.location.formCompany}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Ej. Mecanizados Torrijos S.L."
                    className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {t.location.formMessage}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe los requerimientos mecánicos, térmicos, número de piezas o tolerancias de tu prototipo..."
                    className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? t.location.formSending : t.location.formSubmit}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

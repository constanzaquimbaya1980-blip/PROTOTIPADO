import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, BookOpen, ChevronDown, User, LogOut, Lock } from 'lucide-react';
import { CartItem } from '../types';
import { useI18n, AVAILABLE_LANGUAGES } from '../i18n/I18nContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cart, onOpenCart, onOpenDocs }) => {
  const { language, setLanguage, t } = useI18n();
  const { user, isLoggedIn, logout, openAuthModal } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const activeLang = AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element brand wordmark */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-[#0284c7] transition-colors flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-[#0284c7] flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-500/20">
            3D
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight leading-none text-slate-900">Project 3D</span>
            <span className="text-[9px] font-mono text-slate-500 tracking-wider uppercase mt-0.5">Torrijos Hub</span>
          </div>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#cotizador" className="hover:text-[#0284c7] transition-colors whitespace-nowrap">
            {t.nav.quote}
          </a>
          <a href="#servicios" className="hover:text-[#0284c7] transition-colors whitespace-nowrap">
            {t.nav.services}
          </a>
          <a href="#materiales" className="hover:text-[#0284c7] transition-colors whitespace-nowrap">
            {t.nav.materials}
          </a>
          <a href="#casos" className="hover:text-[#0284c7] transition-colors whitespace-nowrap">
            {t.nav.cases}
          </a>
          <a href="#ubicacion" className="hover:text-[#0284c7] transition-colors whitespace-nowrap">
            {t.nav.torrijos}
          </a>
          <a href="#faq" className="hover:text-[#0284c7] transition-colors whitespace-nowrap">
            {t.nav.faq}
          </a>
        </nav>

        {/* Zone 3: Primary actions & Language selector & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multilingual Selector (ES, EN, FR, IT, PT) */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-mono rounded-lg bg-slate-100 border border-slate-300 text-slate-700 hover:border-slate-400 transition-colors"
              title="Cambiar idioma / Change language"
            >
              <span>{activeLang.flag}</span>
              <span className="uppercase font-semibold">{activeLang.code}</span>
              <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1.5 w-36 rounded-xl border border-slate-200 bg-white shadow-xl py-1 z-50 text-xs font-mono animate-in fade-in">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-100 transition-colors ${
                      language === lang.code ? 'text-[#0284c7] font-bold bg-sky-50' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    <span className="text-[10px] uppercase text-slate-400">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Auth Profile / Login Button */}
          {isLoggedIn && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-slate-50 text-xs font-semibold text-slate-800 transition-colors"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-[#0284c7] flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-slate-200 bg-white shadow-xl p-2 z-50 text-xs animate-in fade-in">
                  <div className="p-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    {user.company && (
                      <span className="inline-block mt-1 text-[10px] font-mono bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded border border-sky-200">
                        {user.company}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full mt-1 px-2.5 py-1.5 text-left rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('Inicia sesión o crea una cuenta para acceder a la cotización 3D y chatear con el Asistente Técnico')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#0284c7] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#0284c7]" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
              <span className="sm:hidden">Acceso</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenDocs}
            title={t.nav.docs}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-[#0284c7] bg-slate-100 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Docs</span>
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 rounded-lg bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-700 transition-colors"
            title={t.nav.cart}
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0284c7] text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-sm">
                {cart.length}
              </span>
            )}
          </button>

          <a
            href="#cotizador"
            className="px-3 sm:px-4 py-2 text-xs font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-sky-600/25"
          >
            {t.nav.uploadCta}
          </a>
        </div>
      </div>
    </header>
  );
};

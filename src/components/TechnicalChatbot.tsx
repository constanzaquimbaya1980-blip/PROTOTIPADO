import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, ChevronRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { ActivePieceContext, ChatMessage } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../context/AuthContext';

interface TechnicalChatbotProps {
  activePiece?: ActivePieceContext | null;
}

export const TechnicalChatbot: React.FC<TechnicalChatbotProps> = ({ activePiece }) => {
  const { t, language } = useI18n();
  const { user, isLoggedIn, openAuthModal } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHumanForm, setShowHumanForm] = useState(false);
  const [humanFormData, setHumanFormData] = useState({ name: '', email: '', phone: '' });
  const [humanSubmitted, setHumanSubmitted] = useState(false);

  const initialWelcomeMessages: Record<string, string> = {
    es: '¡Hola! Soy el asesor técnico de Project 3D en Torrijos (Toledo). Puedo recomendarte polímeros industriales (PLA, ABS, PETG, Nylon CF, Resina SLA), verificar tolerancias y bancadas o conectarte con un ingeniero de planta.',
    en: 'Hello! I am the technical advisor for Project 3D in Torrijos (Toledo, Spain). I can recommend industrial polymers, verify build limits or connect you with a shop engineer.',
    fr: 'Bonjour ! Je suis le conseiller technique de Project 3D à Torrijos (Espagne). Je peux vous conseiller sur les polymères industriels ou vous mettre en contact avec un ingénieur.',
    it: 'Ciao! Sono l’assistente tecnico di Project 3D a Torrijos (Toledo). Posso consigliarti sui polimeri industriali o metterti in contatto con un ingegnere.',
    pt: 'Olá! Sou o assistente técnico da Project 3D em Torrijos (Espanha). Posso ajudar na escolha de polímeros industriais ou ligá-lo a um engenheiro.',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: initialWelcomeMessages[language] || initialWelcomeMessages.es,
      timestamp: Date.now(),
      suggestedActions: [
        '¿Qué material soporta más de 100°C?',
        '¿Plazos de entrega y servicio Express?',
        '¿Cómo cotizo mi archivo STL?',
        'Hablar con un ingeniero de planta',
      ],
    },
  ]);

  // Update initial message when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome-1') {
        return [
          {
            ...prev[0],
            text: initialWelcomeMessages[language] || initialWelcomeMessages.es,
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleToggleChat = () => {
    if (!isLoggedIn) {
      openAuthModal('Identifícate para chatear con nuestro Asistente Técnico sobre tus materiales e impresiones 3D.');
      return;
    }
    setIsOpen(!isOpen);
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    if (!isLoggedIn) {
      openAuthModal('Identifícate para chatear con nuestro Asistente Técnico sobre tus materiales e impresiones 3D.');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const lower = textToSend.toLowerCase();
    if (
      lower.includes('humano') ||
      lower.includes('ingeniero') ||
      lower.includes('human') ||
      lower.includes('engineer') ||
      lower.includes('excede') ||
      lower.includes('grande') ||
      lower.includes('gran formato')
    ) {
      setShowHumanForm(true);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.slice(-5),
          pieceContext: activePiece || undefined,
          userName: user?.name,
          userEmail: user?.email,
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'He recibido tu consulta. Estamos a tu disposición en la planta de Torrijos.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Nuestros ingenieros en Torrijos están disponibles en el +34 925 77 12 34 o en ingenieria@project3d-torrijos.es para resolver cualquier especificación técnica.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHumanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanFormData.email) return;

    setHumanSubmitted(true);
    const botMsg: ChatMessage = {
      id: `bot-human-${Date.now()}`,
      sender: 'bot',
      text: `¡Perfecto ${humanFormData.name || user?.name || ''}! Hemos asignado un ticket directo a nuestro ingeniero de planta en Torrijos. Te llamará o responderá a ${humanFormData.email} en menos de 2 horas laborables.`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleToggleChat}
          className="group flex items-center gap-2.5 py-3 px-4 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-xl shadow-sky-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <span className="tracking-tight">
            {isLoggedIn ? (user?.name ? `Asistente (${user.name.split(' ')[0]})` : t.chatbot.buttonTitle) : 'Asistente IA (Acceso)'}
          </span>
          {!isLoggedIn && <Lock className="w-3.5 h-3.5 text-sky-200" />}
        </button>
      )}

      {/* Chat Window Drawer in Industrial Technical Light Mode */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[550px] max-h-[85vh] rounded-2xl border border-slate-300 bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-[#0284c7]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{t.chatbot.headerTitle}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  {user ? `${user.name} · ${user.company || 'Cliente B2B'}` : t.chatbot.facilitySub}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Piece 3D Context Sync Pill */}
          {activePiece && (
            <div className="bg-sky-50 border-b border-sky-200 px-3.5 py-2 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse shrink-0" />
                <span className="text-slate-900 font-semibold truncate max-w-[130px]">
                  {activePiece.fileName}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 font-mono shrink-0">
                  {activePiece.volumeCm3} cm³
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-[#0284c7] font-semibold shrink-0 truncate max-w-[100px]">
                  {activePiece.materialName}
                </span>
              </div>

              {activePiece.thinWallCount > 0 ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-100 text-red-800 border border-red-300 shrink-0 font-bold">
                  {activePiece.thinWallCount} &lt;0.8mm
                </span>
              ) : (
                <span className="text-[10px] font-mono text-emerald-700 shrink-0 font-medium">
                  ✓ Conforme
                </span>
              )}
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[#0284c7] shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-xl p-3 shadow-sm ${
                      isUser
                        ? 'bg-[#0284c7] text-white font-medium'
                        : 'bg-white border border-slate-200 text-slate-800 leading-relaxed'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Quick suggested chips */}
                    {!isUser && msg.suggestedActions && (
                      <div className="mt-3 pt-2 border-t border-slate-200 flex flex-col gap-1.5">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => sendMessage(action)}
                            className="text-left text-[11px] py-1 px-2 rounded bg-slate-50 hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-[#0284c7] transition-colors flex items-center justify-between"
                          >
                            <span>{action}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-[#0284c7] shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Human Handover Form if requested */}
            {showHumanForm && !humanSubmitted && (
              <div className="p-3.5 rounded-xl border border-sky-300 bg-white text-slate-800 space-y-2 shadow-sm">
                <span className="text-[10px] font-mono text-[#0284c7] uppercase tracking-wider block font-bold">
                  {t.chatbot.humanTitle}
                </span>
                <p className="text-[11px] text-slate-600">
                  {t.chatbot.humanSub}
                </p>
                <form onSubmit={handleHumanSubmit} className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder={t.chatbot.humanName}
                    value={humanFormData.name || user?.name || ''}
                    onChange={(e) => setHumanFormData({ ...humanFormData, name: e.target.value })}
                    className="w-full py-1.5 px-2.5 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:border-[#0284c7] focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder={t.chatbot.humanEmail}
                    value={humanFormData.email || user?.email || ''}
                    onChange={(e) => setHumanFormData({ ...humanFormData, email: e.target.value })}
                    className="w-full py-1.5 px-2.5 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:border-[#0284c7] focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder={t.chatbot.humanPhone}
                    value={humanFormData.phone}
                    onChange={(e) => setHumanFormData({ ...humanFormData, phone: e.target.value })}
                    className="w-full py-1.5 px-2.5 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:border-[#0284c7] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    {t.chatbot.humanSubmit}
                  </button>
                </form>
              </div>
            )}

            {isLoading && (
              <div className="flex gap-2 items-center text-slate-500 text-xs font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-bounce [animation-delay:0.4s]" />
                <span>{t.chatbot.thinking}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Chips */}
          {activePiece && (
            <div className="px-3 py-1.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <span className="text-slate-500 uppercase tracking-wider font-mono shrink-0">💡 Consulta:</span>
              <button
                type="button"
                onClick={() => sendMessage(`¿Es ${activePiece.materialName} el mejor polímero para mi pieza de ${activePiece.volumeCm3} cm³ (${activePiece.dimensionsMm} mm)?`)}
                className="whitespace-nowrap px-2 py-0.5 rounded bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-200 transition-colors font-medium"
              >
                Idoneidad {activePiece.materialName}
              </button>
              {activePiece.thinWallCount > 0 ? (
                <button
                  type="button"
                  onClick={() => sendMessage(`El visor ha detectado ${activePiece.thinWallCount} zonas con grosor inferior a 0.8 mm. ¿Qué solución técnica recomendáis para que no se fracture?`)}
                  className="whitespace-nowrap px-2 py-0.5 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors font-semibold"
                >
                  ⚠️ Espesores &lt;0.8mm
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => sendMessage(`¿Cómo optimizar el tiempo de impresión y coste de fabricación para ${activePiece.fileName}?`)}
                  className="whitespace-nowrap px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                >
                  Optimizar tiempo/coste
                </button>
              )}
            </div>
          )}

          {/* Footer Input */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chatbot.placeholder}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none shadow-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold disabled:opacity-40 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
              <span>{t.chatbot.footerPhone}</span>
              <button
                type="button"
                onClick={() => setShowHumanForm(true)}
                className="text-[#0284c7] hover:underline font-medium"
              >
                {t.chatbot.footerHuman}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

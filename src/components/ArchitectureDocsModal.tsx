import React, { useState } from 'react';
import { X, Code, FileCode, Copy, Check, Terminal, Globe, Cpu } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html_app' | 'stl_script' | 'i18n_json' | 'gemini_prompt'>('html_app');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const stlScriptCode = `// =========================================================================
// SCRIPT JAVASCRIPT / THREE.JS: LECTURA STL, CÁLCULO DE VOLUMEN Y BOUDING BOX
// =========================================================================
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * 1. Inicialización de la Escena Three.js con Bancada Cilíndrica Ø260x300mm
 */
export function initThreeViewer(containerElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f5f9); // Modo Claro Técnico Industrial

  const camera = new THREE.PerspectiveCamera(45, containerElement.clientWidth / containerElement.clientHeight, 0.1, 2000);
  camera.position.set(120, 140, 160);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(containerElement.clientWidth, containerElement.clientHeight);
  renderer.shadowMap.enabled = true;
  containerElement.innerHTML = '';
  containerElement.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2 + 0.05;

  // Iluminación Técnica de Estudio
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(130, 200, 120);
  scene.add(keyLight);

  // Bancada de Torrijos (Ø260 mm)
  const gridHelper = new THREE.GridHelper(260, 26, 0x0284c7, 0xcbd5e1);
  scene.add(gridHelper);

  return { scene, camera, renderer, controls };
}

/**
 * 2. Lector STL y Algoritmo de Cálculo de Métricas (Volumen por Divergencia)
 */
export function parseStlAndComputeMetrics(arrayBuffer, units = 'mm') {
  const loader = new STLLoader();
  const geometry = loader.parse(arrayBuffer);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  const box = geometry.boundingBox;
  const sizeMm = new THREE.Vector3();
  box.getSize(sizeMm);

  const position = geometry.getAttribute('position');
  let totalSignedVolume = 0;
  let totalArea = 0;

  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  const cross = new THREE.Vector3();

  const triangleCount = position.count / 3;

  for (let i = 0; i < triangleCount; i++) {
    p1.set(position.getX(i * 3), position.getY(i * 3), position.getZ(i * 3));
    p2.set(position.getX(i * 3 + 1), position.getY(i * 3 + 1), position.getZ(i * 3 + 1));
    p3.set(position.getX(i * 3 + 2), position.getY(i * 3 + 2), position.getZ(i * 3 + 2));

    // Volumen del tetraedro
    const v321 = p3.x * p2.y * p1.z;
    const v231 = p2.x * p3.y * p1.z;
    const v312 = p3.x * p1.y * p2.z;
    const v132 = p1.x * p3.y * p2.z;
    const v213 = p2.x * p1.y * p3.z;
    const v123 = p1.x * p2.y * p3.z;

    totalSignedVolume += (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);

    // Superficie
    e1.subVectors(p2, p1);
    e2.subVectors(p3, p1);
    cross.crossVectors(e1, e2);
    totalArea += 0.5 * cross.length();
  }

  geometry.center();

  return {
    geometry,
    metrics: {
      volumeCm3: Math.abs(totalSignedVolume) / 1000.0,
      areaCm2: totalArea / 100.0,
      boundingBox: {
        x: Math.round(sizeMm.x * 10) / 10,
        y: Math.round(sizeMm.y * 10) / 10,
        z: Math.round(sizeMm.z * 10) / 10,
      },
      triangleCount,
      isOutOfBounds: sizeMm.x > 260 || sizeMm.y > 260 || sizeMm.z > 300
    }
  };
}`;

  const geminiPromptText = `Eres el Asesor Técnico Senior y Agente de Ingeniería de "Project 3D", referente en fabricación aditiva industrial y prototipado rápido en Torrijos (Toledo, España).

DATOS DE PLANTA Y LOGÍSTICA:
- Dirección física: Polígono Industrial de Torrijos, Av. de los Trabajadores nº 23, 45500 Torrijos (Toledo).
- Conexiones logísticas: Acceso directo por autovías A-40 y A-5 (25 min de Toledo, 50 min de Madrid y Aeropuerto Adolfo Suárez).
- Teléfono directo de taller: +34 925 77 12 34
- Email técnico: ingenieria@project3d-torrijos.es
- Horario de taller: Lunes a Viernes de 07:30 a 18:30 (Recepción de archivos y cotizador 24/7).
- Certificaciones: ISO 9001:2015, Trazabilidad de lote y Control Metrológico con máquina tridimensional CMM.

POLÍMEROS CERTIFICADOS DISPONIBLES:
1. PLA Industrial Plus (52 MPa, HDT 58°C, 1.24 g/cm³)
2. ABS Grado Automoción (45 MPa, HDT 96°C, 1.05 g/cm³)
3. PETG Técnico Reforzado (50 MPa, HDT 75°C, 1.27 g/cm³)
4. Nylon PA12 + Fibra de Carbono (88 MPa, HDT 145°C, 1.15 g/cm³)
5. Resina SLA Ultra Precisión (58 MPa, HDT 68°C, 1.18 g/cm³)

PARQUE DE MÁQUINAS Y LÍMITES DE VOLUMEN:
- Bancada estándar cilíndrica: Ø260 mm × 300 mm de altura.
- FDM Industrial Gran Formato: hasta 600 × 600 × 600 mm.

CLIENTE AUTENTICADO:
Si se reciben 'userName' y 'userEmail', saluda al usuario por su nombre y ofrécele trato preferente B2B.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border border-slate-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-[#0284c7]">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#0284c7] font-bold block">
                Project 3D Torrijos · Entregables Técnicos
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Arquitectura, Scripts Three.js, Diccionario i18n & Prompt Gemini API
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('html_app')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'html_app' ? 'border-[#0284c7] text-[#0284c7]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>1. Arquitectura & Stack</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stl_script')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'stl_script' ? 'border-[#0284c7] text-[#0284c7]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>2. Script JS Lector STL</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('i18n_json')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'i18n_json' ? 'border-[#0284c7] text-[#0284c7]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3. Diccionario JSON i18n</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gemini_prompt')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'gemini_prompt' ? 'border-[#0284c7] text-[#0284c7]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>4. Prompt Gemini API</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 leading-relaxed font-sans">
          {activeTab === 'html_app' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#0284c7]" />
                  <span>Estructura de la Plataforma Web & Web App Modular</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-500">Light Mode #f8fafc · Tailwind CSS · Three.js</span>
              </div>

              <p className="text-slate-600">
                La plataforma implementa un diseño inspirado en líderes globales como Xometry, Protolabs y Hubs, en Modo Claro Técnico Industrial:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono text-[#0284c7] text-xs font-bold">1. Web Corporativa & Lead Gen</span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    <li>· Header fijo con selector 5 idiomas (ES, EN, FR, IT, PT)</li>
                    <li>· Autenticación B2B con Google Identity Services y Email</li>
                    <li>· Hero Section con credenciales Torrijos y CTA directo</li>
                    <li>· Fichas técnicas de polímeros (PLA, ABS, PETG, Nylon CF, SLA)</li>
                    <li>· Casos de éxito cuantificados con reducción de peso y ciclo</li>
                    <li>· Mapa interactivo y enlace Google Maps (Av. Trabajadores 23)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono text-[#0284c7] text-xs font-bold">2. Visor 3D & Cotizador STL</span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    <li>· Paywall de datos / barrera de autenticación previa al render</li>
                    <li>· Bancada cilíndrica calibrada Ø260 × 300 mm con alerta de exceso</li>
                    <li>· Análisis de espesores de pared &lt; 0.8 mm con mapa de colores</li>
                    <li>· Auto-orientación óptima para reducir altura Z</li>
                    <li>· Carga de múltiples archivos STL con resumen de piezas y suma total</li>
                    <li>· Descarga de presupuesto formal en PDF con validez de 15 días</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stl_script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0284c7]" />
                  <span>Script JavaScript para Three.js: Lector STL y Cálculo de Métricas</span>
                </h4>
                <button
                  type="button"
                  onClick={() => copyToClipboard(stlScriptCode, 'stl')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 font-mono transition-colors border border-slate-300"
                >
                  {copiedKey === 'stl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'stl' ? 'Copiado' : 'Copiar Script'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 text-[11px] font-mono text-sky-300 overflow-x-auto max-h-[460px]">
                {stlScriptCode}
              </pre>
            </div>
          )}

          {activeTab === 'i18n_json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0284c7]" />
                  <span>Objeto JSON del Sistema Multilingüe (ES, EN, FR, IT, PT)</span>
                </h4>
                <button
                  type="button"
                  onClick={() => copyToClipboard(JSON.stringify(TRANSLATIONS, null, 2), 'i18n')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 font-mono transition-colors border border-slate-300"
                >
                  {copiedKey === 'i18n' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'i18n' ? 'Copiado JSON' : 'Copiar JSON'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 text-[11px] font-mono text-slate-200 overflow-x-auto max-h-[460px]">
                {JSON.stringify(TRANSLATIONS, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'gemini_prompt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#0284c7]" />
                  <span>Instrucciones del Sistema (Prompt) para Chatbot Gemini API</span>
                </h4>
                <button
                  type="button"
                  onClick={() => copyToClipboard(geminiPromptText, 'prompt')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 font-mono transition-colors border border-slate-300"
                >
                  {copiedKey === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'prompt' ? 'Copiado' : 'Copiar Prompt'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-[11px] text-slate-200 font-mono whitespace-pre-wrap max-h-[460px] overflow-y-auto">
                {geminiPromptText}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Project 3D · Polígono Industrial de Torrijos (Toledo) · Estándar ISO 9001
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Server-side Gemini AI setup
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const PROJECT_3D_SYSTEM_PROMPT = `Eres el Asesor Técnico Senior y Agente de Ingeniería de "Project 3D", referente en fabricación aditiva industrial y prototipado rápido en Torrijos (Toledo, España).

DATOS DE PLANTA Y LOGÍSTICA:
- Dirección física: Polígono Industrial de Torrijos, Av. de los Trabajadores nº 23, 45500 Torrijos (Toledo).
- Conexiones logísticas: Acceso directo por autovías A-40 y A-5 (25 min de Toledo, 50 min de Madrid y Aeropuerto Adolfo Suárez).
- Teléfono directo de taller: +34 925 77 12 34
- Email técnico: ingenieria@project3d-torrijos.es
- Horario de taller: Lunes a Viernes de 07:30 a 18:30 (Recepción de archivos y cotizador 24/7).
- Certificaciones: ISO 9001:2015, Trazabilidad de lote y Control Metrológico con máquina tridimensional CMM.

MATRIZ TÉCNICA DE POLÍMEROS CERTIFICADOS:
1. PLA Industrial Plus: 52 MPa, HDT 58°C, densidad 1.24 g/cm³. Para maquetas de concepto, validación ergonómica y bajo coste.
2. ABS Grado Automoción: 45 MPa, HDT 96°C, densidad 1.05 g/cm³. Excelente tenacidad ante impacto y vapores de hidrocarburos. Impreso en cámara cerrada a 90°C.
3. PETG Reforzado: 50 MPa, HDT 75°C, densidad 1.27 g/cm³. Estanqueidad hidráulica, resistencia a grasas/ácidos diluidos y rayos UV.
4. Nylon PA12 + Fibra de Carbono (SLS/FDM industrial): 88 MPa, módulo 6.2 GPa, HDT 145°C, densidad 1.15 g/cm³. Sustituto directo de aluminio fundido en utillajes, drones y motorsport.
5. Resina SLA Ultra Precisión: 58 MPa, HDT 68°C, densidad 1.18 g/cm³. Acabado cosmético Clase A sin estrías de capa. Tolerancias micrométricas de ±0.05 mm.

PARQUE DE MÁQUINAS Y LÍMITES DE VOLUMEN (TRIGGER DE CAPTURA DE LEADS):
- Bancada estándar cilíndrica delta/SLA: Ø260 mm × 300 mm de altura.
- Impresoras FDM Industrial Gran Formato: hasta 600 × 600 × 600 mm.
- REGLA CRÍTICA DE CAPTURA DE LEADS: Si un usuario menciona que su pieza excede los 260 mm (o 600 mm), requiere mecanizado CNC en aluminio/acero, o lotes superiores a 50 unidades, indícale inmediatamente que su proyecto califica para ingeniería personalizada de gran formato en Torrijos y solicita amablemente su nombre, email corporativo y teléfono para que un ingeniero de planta evalúe la partición por cola de milano o máquina especial en menos de 2 horas.

TIEMPOS DE ENTREGA Y PRECIOS:
- Servicio Express 24h disponible (+25% recargo de despacho prioritario).
- Servicio Estándar: 48h a 72h con envío asegurado o recogida en muelle de planta Torrijos.
- Fórmula de cotización: (Volumen neto cm³ × Densidad × Coste Material/g) + (Tiempo estimado × Coste máquina/h) + Setup CAM + IVA 21%.

IDIOMA:
Responde de manera nativa y fluida en el idioma del usuario (Español, Inglés, Francés, Italiano o Portugués). Si escribe en inglés, responde en inglés; si escribe en español, en español.
Mantén siempre un tono de ingeniero senior: riguroso, educado, empático y orientado a la conversión B2B.`;

// Fallback intelligent response generator if API key is not present or offline
function getEngineeringFallbackReply(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('material') || lower.includes('pla') || lower.includes('abs') || lower.includes('petg') || lower.includes('nylon') || lower.includes('resina')) {
    return `En Project 3D (Torrijos) trabajamos con 5 familias principales según los requerimientos de tu proyecto:
- **PLA Industrial**: Ideal para validación ergonómica y maquetas iniciales al menor coste.
- **ABS Técnico**: Resiste hasta 95°C y alta tenacidad ante impactos (muy usado en automoción).
- **PETG Reforzado**: Excelente resistencia química, impermeable y resistente a la intemperie UV.
- **Nylon PA12 con Fibra de Carbono**: Para utillajes funcionales y sustitución de piezas de aluminio ligero.
- **Resina SLA**: Para acabados estéticos perfectos sin líneas de capa y tolerancias de hasta ±0.05 mm.

¿Deseas que revisemos tu archivo STL en el cotizador superior o prefieres que un ingeniero evalúe el esfuerzo mecánico?`;
  }

  if (lower.includes('plazo') || lower.includes('tiempo') || lower.includes('entrega') || lower.includes('urgente') || lower.includes('envio') || lower.includes('envío')) {
    return `Nuestros plazos habituales son:
- **Servicio Express 24h**: Fabricación prioritaria con entrega al día siguiente en península.
- **Estándar 48-72h**: Producción optimizada con envío asegurado mediante mensajería técnica.
- **Recogida en planta**: Puedes retirar tus piezas directamente en nuestras instalaciones en Av. de los Trabajadores nº 23, Polígono Industrial de Torrijos (Toledo).

Si nos indicas la fecha límite de tu proyecto, priorizaremos tu orden de trabajo.`;
  }

  if (lower.includes('precio') || lower.includes('cotizar') || lower.includes('coste') || lower.includes('presupuesto') || lower.includes('stl')) {
    return `Nuestra cotización es 100% transparente y automática:
1. Arrastra tu archivo .STL a la sección **Cotizador 3D** en esta misma página.
2. Nuestro visor Three.js medirá instantáneamente el volumen cúbico exacto ($cm^3$), dimensiones y superficie.
3. Elige material, infill (relleno) y altura de capa. La fórmula calcula el coste de material + tiempo de máquina + tarifa base.
4. Puedes añadirlo al carrito o pulsar en "Solicitar Revisión Técnica" para que nuestros ingenieros verifiquen orientaciones y soportes.`;
  }

  if (lower.includes('contacto') || lower.includes('humano') || lower.includes('asesor') || lower.includes('ingeniero') || lower.includes('telefono') || lower.includes('teléfono') || lower.includes('torrijos') || lower.includes('ubicacion') || lower.includes('donde')) {
    return `Puedes contactar directamente con nuestro equipo de ingeniería:
- **Ubicación**: Polígono Industrial, Av. de los Trabajadores nº 23, 45500 Torrijos (Toledo).
- **Teléfono directo**: +34 925 77 12 34
- **Email**: ingenieria@project3d-torrijos.es
- **Horario**: L-V de 7:30 a 18:30.

Si me dejas tu nombre y correo o teléfono por aquí, un ingeniero técnico te llamará hoy mismo.`;
  }

  return `Gracias por contactar con Project 3D Torrijos. Somos especialistas en prototipado rápido industrial, fabricación aditiva FDM/SLA/SLS y series cortas. 
Puedes subir tu modelo STL al cotizador para obtener precio al instante o preguntarme sobre materiales, tolerancias mecánicas y tiempos de fabricación. ¿En qué aplicación estás trabajando?`;
}

// Endpoint: AI Chatbot for technical advice
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, pieceContext, userName, userEmail } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    let contextualInstruction = PROJECT_3D_SYSTEM_PROMPT;

    if (userName || userEmail) {
      contextualInstruction += `\n\n[CLIENTE B2B AUTENTICADO]:
- Nombre: ${userName || 'Cliente'}
- Email: ${userEmail || 'No especificado'}
Instrucción clave: Dirígete a él de forma personalizada (ej. "Hola ${userName || ''}") con un trato de ingeniero de aplicaciones B2B de planta Torrijos. Bríndale atención prioritaria.`;
    }

    if (pieceContext) {
      contextualInstruction += `\n\n[CONTEXTO EN VIVO DE LA PIEZA ACTIVA EN EL VISOR 3D THREE.JS]:
- Fichero: "${pieceContext.fileName}"
- Volumen neto: ${pieceContext.volumeCm3} cm³
- Dimensiones: ${pieceContext.dimensionsMm} mm
- Material actual: ${pieceContext.materialName}
- Infill: ${pieceContext.infillPercent}% | Altura de capa: ${pieceContext.layerHeightMm} mm
- Posprocesado: ${pieceContext.postProcessingName}
- Espesores críticos (< 0.8 mm): ${pieceContext.thinWallCount > 0 ? `${pieceContext.thinWallCount} zonas finas detectadas (riesgo de fragilidad para FDM)` : 'Estructura robusta sin paredes críticas'}
- Presupuesto actual: €${pieceContext.unitPriceNet} / ud (+IVA)`;
    }

    if (!aiClient) {
      let fallbackReply = getEngineeringFallbackReply(message);
      if (userName) {
        fallbackReply = `Estimado/a ${userName}, ` + fallbackReply;
      }
      if (pieceContext && (message.toLowerCase().includes('esta pieza') || message.toLowerCase().includes('mi pieza') || message.toLowerCase().includes('grosor') || message.toLowerCase().includes('material') || message.toLowerCase().includes('aguanta'))) {
        fallbackReply = `${userName ? `Estimado ${userName}, analizando` : 'Analizando'} tu pieza activa ("${pieceContext.fileName}", ${pieceContext.volumeCm3} cm³, ${pieceContext.dimensionsMm} mm) en ${pieceContext.materialName}:
${pieceContext.thinWallCount > 0 ? `⚠️ Hemos detectado zonas con espesor inferior a 0.8 mm. Si se imprime en FDM pueden ser frágiles; para esta geometría te recomiendo Resina SLA de alta definición o Nylon PA12-CF para garantizar solidez.` : `✅ La geometría presenta espesores robustos (>0.8 mm) idóneos para ${pieceContext.materialName}.`}
Con un ${pieceContext.infillPercent}% de infill y capa de ${pieceContext.layerHeightMm} mm, el coste unitario es de €${pieceContext.unitPriceNet} + IVA. ¿Quieres evaluar otro acabado o certificar con CMM en Torrijos?`;
      }
      return res.json({ reply: fallbackReply, source: 'knowledge-base' });
    }

    // Build context
    const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.sender === 'user') {
          formattedContents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'bot') {
          formattedContents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    formattedContents.push({ role: 'user', parts: [{ text: message }] });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: contextualInstruction,
        temperature: 0.6,
      },
    });

    const reply = response.text || getEngineeringFallbackReply(message);
    return res.json({ reply, source: 'gemini' });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    const fallbackReply = getEngineeringFallbackReply(req.body.message || '');
    return res.json({ reply: fallbackReply, source: 'fallback' });
  }
});

// Endpoint: Save Technical Review request
app.post('/api/quote/review-request', (req: Request, res: Response) => {
  const { quoteData, contactInfo, notes } = req.body;

  if (!contactInfo || !contactInfo.email) {
    return res.status(400).json({ error: 'Email de contacto obligatorio' });
  }

  const ticketId = `P3D-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  // In production, this would save to database and dispatch email/webhook
  console.log(`[Project 3D Torrijos] Technical Review requested: ${ticketId}`, {
    quoteData,
    contactInfo,
    notes,
  });

  return res.json({
    success: true,
    ticketId,
    estimatedTurnaround: 'Menos de 2 horas laborables',
    facility: 'Planta de Torrijos (Toledo)',
  });
});

// Endpoint: General contact form
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, company, message } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }

  console.log('[Project 3D Torrijos] New contact form lead:', { name, email, phone, company, message });

  return res.json({
    success: true,
    message: 'Solicitud recibida. Nuestro equipo de ingeniería en Torrijos se pondrá en contacto en breve.',
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Project 3D] Servidor activo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

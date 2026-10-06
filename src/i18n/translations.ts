import { Language } from '../types';

export interface TranslationDictionary {
  nav: {
    quote: string;
    services: string;
    materials: string;
    cases: string;
    torrijos: string;
    faq: string;
    docs: string;
    uploadCta: string;
    cart: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaQuote: string;
    ctaCatalog: string;
    statTolerance: string;
    statToleranceLabel: string;
    statTurnaround: string;
    statTurnaroundLabel: string;
    statQuality: string;
    statQualityLabel: string;
    machinePark: string;
    machineStatus: string;
  };
  quote: {
    tag: string;
    title: string;
    subtitle: string;
    dragDropTitle: string;
    dragDropSub: string;
    dragDropBrowse: string;
    samplePrompt: string;
    sampleGear: string;
    sampleBracket: string;
    sampleEnclosure: string;
    stepMaterial: string;
    stepMaterialSub: string;
    stepInfill: string;
    stepInfillLight: string;
    stepInfillStandard: string;
    stepInfillTooling: string;
    stepInfillSolid: string;
    stepLayer: string;
    stepLayerFine: string;
    stepLayerPrecision: string;
    stepLayerStandard: string;
    stepLayerFast: string;
    unitsLabel: string;
    unitMm: string;
    unitIn: string;
    quantityLabel: string;
    volumeDiscount: string;
    postProcessingLabel: string;
    postNone: string;
    postStandard: string;
    postThreaded: string;
    postHeatTreatment: string;
    postBlasted: string;
    postSmooth: string;
    postCmm: string;
    priorityLabel: string;
    prioritySub: string;
    priorityActive: string;
    priorityStandard: string;
    summaryTag: string;
    estimatedDelivery: string;
    rawMaterial: string;
    machineTime: string;
    setupFee: string;
    vat: string;
    addToCart: string;
    requestReview: string;
    guaranteeNotice: string;
    facilityNotice: string;
    emptyPrompt: string;
    analyzing: string;
    analyzingSub: string;
    dimensions: string;
    volume: string;
    surfaceArea: string;
    bedNotice: string;
    outOfBoundsWarning: string;
    wallThicknessBtn: string;
    autoOrientBtn: string;
    downloadPdfBtn: string;
    multiStlTitle: string;
    multiStlAddBtn: string;
    activeModelLabel: string;
    thinWallAlert: string;
    autoOrientSuccess: string;
    removePiece: string;
    totalPiecesLabel: string;
  };
  services: {
    tag: string;
    title: string;
    subtitle: string;
    toleranceLabel: string;
    idealForLabel: string;
  };
  materials: {
    tag: string;
    title: string;
    subtitle: string;
    datasheetTag: string;
    configureCta: string;
    propTensile: string;
    propHdt: string;
    propModulus: string;
    propDensity: string;
    prosTitle: string;
    consTitle: string;
    rawCostEst: string;
    stockNotice: string;
    labTag: string;
    labTitle: string;
    labDesc: string;
  };
  cases: {
    tag: string;
    title: string;
    subtitle: string;
    featuredTag: string;
    savingLabel: string;
    turnaroundLabel: string;
    materialUsed: string;
  };
  location: {
    tag: string;
    title: string;
    subtitle: string;
    addressHeader: string;
    hubHighway: string;
    hubHighwayVal: string;
    hubDistances: string;
    hubDistancesVal: string;
    hubDock: string;
    hubDockVal: string;
    phoneLabel: string;
    emailLabel: string;
    hoursLabel: string;
    hoursVal: string;
    formTag: string;
    formTitle: string;
    formSub: string;
    formName: string;
    formEmail: string;
    formPhone: string;
    formCompany: string;
    formMessage: string;
    formSubmit: string;
    formSending: string;
    formSuccessTitle: string;
    formSuccessMsg: string;
    formAnother: string;
  };
  faq: {
    tag: string;
    title: string;
  };
  chatbot: {
    buttonTitle: string;
    headerTitle: string;
    headerStatus: string;
    facilitySub: string;
    placeholder: string;
    footerPhone: string;
    footerHuman: string;
    humanTitle: string;
    humanSub: string;
    humanName: string;
    humanEmail: string;
    humanPhone: string;
    humanSubmit: string;
    thinking: string;
    connectedToViewer: string;
    askAboutActivePiece: string;
  };
  cart: {
    modalCartTitle: string;
    modalReviewTitle: string;
    empty: string;
    modelsToProduce: string;
    baseSubtotal: string;
    vatLabel: string;
    grandTotal: string;
    tabCart: string;
    tabReview: string;
    fieldContact: string;
    fieldCompany: string;
    fieldEmail: string;
    fieldPhone: string;
    fieldNotes: string;
    submitCart: string;
    submitReview: string;
    submitting: string;
    successTitle: string;
    successReviewTitle: string;
    successDesc: string;
    closeBtn: string;
  };
  footer: {
    desc: string;
    iso: string;
    facilityTitle: string;
    navTitle: string;
    legalTitle: string;
    docsLink: string;
    rights: string;
    dispatchNotice: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  es: {
    nav: {
      quote: 'Cotizador STL',
      services: 'Servicios',
      materials: 'Materiales',
      cases: 'Casos de Éxito',
      torrijos: 'Torrijos',
      faq: 'FAQ',
      docs: 'Docs Arquitectura',
      uploadCta: 'Subir Archivo STL',
      cart: 'Carrito',
    },
    hero: {
      badge: 'Torrijos (Toledo) · Polígono Industrial, Av. de los Trabajadores 23',
      title: 'Prototipado industrial rápido y fabricación aditiva de precisión.',
      subtitle: 'Transformamos tus archivos CAD en piezas funcionales de grado aeronáutico, automoción y maquinaria. Cotización automática al instante con visor 3D Three.js y entrega en 24h a 48h desde nuestra planta técnica en Torrijos.',
      ctaQuote: 'Cotizar Archivo STL Online',
      ctaCatalog: 'Ver Catálogo de Materiales',
      statTolerance: '±0.05 mm',
      statToleranceLabel: 'Tolerancia dimensional SLA / CNC',
      statTurnaround: '24 Horas',
      statTurnaroundLabel: 'Servicio Express península ibérica',
      statQuality: 'ISO 9001',
      statQualityLabel: 'Control de calidad y metrología',
      machinePark: 'Parque Industrial Project 3D',
      machineStatus: 'Operativo 24/7',
    },
    quote: {
      tag: 'Motor de Cotización 3D en Tiempo Real',
      title: 'Visor interactivo y cálculo presupuestario de archivos STL.',
      subtitle: 'Sube tu pieza o interactúa con nuestras muestras. Nuestro algoritmo calcula volumen cúbico exacto (cm³), superficie y coste de fabricación con tarifas de taller transparentes.',
      dragDropTitle: 'Arrastra tu archivo .STL aquí o',
      dragDropSub: 'Archivos binarios o ASCII de hasta 100 MB. Procesamiento local instantáneo y confidencialidad garantizada.',
      dragDropBrowse: 'selecciona varios archivos',
      samplePrompt: '¿No tienes un STL a mano? Prueba:',
      sampleGear: 'Engranaje M2',
      sampleBracket: 'Soporte NEMA 23',
      sampleEnclosure: 'Carcasa Sensor IP65',
      stepMaterial: '1. Selección de Material Industrial',
      stepMaterialSub: '5 polímeros certificados',
      stepInfill: '2. Relleno Interno (Infill)',
      stepInfillLight: '10% Ligero',
      stepInfillStandard: '20% Estándar',
      stepInfillTooling: '50% Utillaje',
      stepInfillSolid: '100% Sólido',
      stepLayer: '3. Altura de Capa / Precisión',
      stepLayerFine: 'Fino',
      stepLayerPrecision: 'Preciso',
      stepLayerStandard: 'Estándar',
      stepLayerFast: 'Rápido',
      unitsLabel: 'Unidades de Malla',
      unitMm: 'Milímetros (mm)',
      unitIn: 'Pulgadas (in)',
      quantityLabel: 'Cantidad',
      volumeDiscount: 'Descuento lote',
      postProcessingLabel: 'Acabado & Posprocesado',
      postNone: 'Sin acabado (Estándar desoporte)',
      postStandard: 'Estándar (Desoporte manual CAM)',
      postThreaded: 'Lijado e Insertos Roscados (+€12.50)',
      postHeatTreatment: 'Tratamiento Térmico Annealing (+€9.00)',
      postBlasted: 'Chorreado microesferas de vidrio (+€7.50)',
      postSmooth: 'Baño térmico / Pulido superficial (+€14.00)',
      postCmm: 'Informe Metrológico CMM Torrijos (+€26.00)',
      priorityLabel: 'Servicio Express 24 Horas',
      prioritySub: 'Puesta en máquina prioritaria en taller Torrijos',
      priorityActive: 'Activado (+25%)',
      priorityStandard: 'Estándar 48-72h',
      summaryTag: 'Presupuesto Industrial Instantáneo',
      estimatedDelivery: 'Entrega estimada',
      rawMaterial: 'Materia Prima',
      machineTime: 'Tiempo Máquina',
      setupFee: 'Setup & Slicing',
      vat: 'IVA (21%)',
      addToCart: 'Añadir al Carrito',
      requestReview: 'Solicitar Revisión Técnica Gratuita',
      guaranteeNotice: 'Garantía de tolerancia industrial y trazabilidad de lote',
      facilityNotice: 'Fabricado en Polígono Industrial de Torrijos (Toledo)',
      emptyPrompt: 'Carga un archivo .STL para calcular el desglose dinámico en tiempo real.',
      analyzing: 'Analizando geometría 3D...',
      analyzingSub: 'Calculando volumen neto en cm³, caja delimitadora y superficie mediante cálculo diferencial de mallas.',
      dimensions: 'Dimensiones',
      volume: 'Volumen',
      surfaceArea: 'Superficie',
      bedNotice: 'Bancada: Ø260 × 300 mm (Torrijos Hub)',
      outOfBoundsWarning: '¡Atención! La pieza excede la bancada estándar Ø260x300mm. Se requiere máquina FDM Gran Formato (600mm).',
      wallThicknessBtn: 'Analizador de Grosor (< 0.8 mm)',
      autoOrientBtn: 'Auto-Orientación Óptima',
      downloadPdfBtn: 'Descargar Presupuesto Formal en PDF (15 días)',
      multiStlTitle: 'Piezas Cargadas en Lote',
      multiStlAddBtn: 'Añadir Otro STL',
      activeModelLabel: 'Pieza Activa en Visor 3D',
      thinWallAlert: 'zonas detectadas con grosor < 0.8 mm (fragilidad crítica)',
      autoOrientSuccess: 'Pieza auto-orientada sobre la bancada con menor altura Z.',
      removePiece: 'Eliminar pieza',
      totalPiecesLabel: 'Resumen Global de Piezas',
    },
    services: {
      tag: 'Servicios Industriales',
      title: 'Soluciones de fabricación aditiva para ingeniería exigente.',
      subtitle: 'Combinamos tecnología de deposición fundida de grado industrial, fotopolimerización líquida y sinterizado láser en nuestras instalaciones de Torrijos (Toledo).',
      toleranceLabel: 'Tolerancia',
      idealForLabel: 'Aplicación Óptima',
    },
    materials: {
      tag: 'Catálogo de Materiales Industriales',
      title: 'Polímeros certificados con ficha técnica y trazabilidad de lote.',
      subtitle: 'Cada filamento, resina y polvo utilizado en Project 3D proviene de proveedores homologados ISO 9001 con certificados de composición química.',
      datasheetTag: 'Ficha Técnica de Homologación',
      configureCta: 'Configurar en Cotizador',
      propTensile: 'Resistencia Tracción',
      propHdt: 'Deflexión Térmica HDT',
      propModulus: 'Módulo Flexión',
      propDensity: 'Densidad Específica',
      prosTitle: 'Ventajas Principales',
      consTitle: 'Consideraciones Técnicas',
      rawCostEst: 'Coste estimado de materia prima:',
      stockNotice: 'Stock físico permanente en Torrijos',
      labTag: 'Laboratorio de Probetas y Calidad',
      labTitle: 'Ensayos mecánicos normalizados según ISO 527 y ASTM D638.',
      labDesc: 'Verificamos la adhesión interlayer, anisotropía y límite elástico en probetas impresas en nuestros propios hornos y cabinas de secado deshumidificadas.',
    },
    cases: {
      tag: 'Casos de Éxito Industriales',
      title: 'Piezas críticas validadas en entornos de alta exigencia.',
      subtitle: 'Evidencia cuantificable de reducciones de tiempo de ciclo, aligeramiento estructural y rapidez de entrega.',
      featuredTag: 'Caso Destacado · Proyecto Aeronáutico',
      savingLabel: 'Ahorro en Moldes',
      turnaroundLabel: 'Tiempo de Entrega',
      materialUsed: 'Material:',
    },
    location: {
      tag: 'Instalaciones & Logística',
      title: 'Planta de fabricación aditiva en Torrijos (Toledo).',
      subtitle: 'Ubicación estratégica en el corredor logístico de Castilla-La Mancha y Madrid, garantizando recogida directa en taller o entrega en 24h a cualquier punto peninsular.',
      addressHeader: 'Polígono Industrial de Torrijos · Av. de los Trabajadores 23',
      hubHighway: 'Autovías',
      hubHighwayVal: 'A-40 / A-5 directo',
      hubDistances: 'Distancias',
      hubDistancesVal: '25 min Toledo / 50 min Madrid',
      hubDock: 'Recepción',
      hubDockVal: 'Muelle propio de carga',
      phoneLabel: 'Línea Técnica Taller',
      emailLabel: 'Email de Ingeniería',
      hoursLabel: 'Horario de Taller',
      hoursVal: 'L-V de 7:30 a 18:30 (Recepción 24/7)',
      formTag: 'Contacto con Departamento Técnico',
      formTitle: 'Solicitar Asesoría o Presupuesto Especial',
      formSub: '¿Requieres mecanizado posterior, insertos metálicos, series de más de 100 unidades o acuerdo NDA? Escríbenos directamente.',
      formName: 'Nombre y Apellidos *',
      formEmail: 'Email Profesional *',
      formPhone: 'Teléfono Directo',
      formCompany: 'Empresa / Sector',
      formMessage: 'Detalles del Proyecto o Dudas Técnicas',
      formSubmit: 'Enviar Consulta a Planta Torrijos',
      formSending: 'Enviando a ingeniería...',
      formSuccessTitle: 'Mensaje enviado con éxito',
      formSuccessMsg: 'Hemos transferido tus datos al ingeniero de guardia en Torrijos. Nos pondremos en contacto contigo en menos de dos horas laborables.',
      formAnother: 'Enviar otra consulta',
    },
    faq: {
      tag: 'Preguntas Frecuentes',
      title: 'Dudas técnicas sobre cotización y fabricación aditiva.',
    },
    chatbot: {
      buttonTitle: 'Asesor Técnico 3D',
      headerTitle: 'Asesor de Ingeniería',
      headerStatus: 'En línea',
      facilitySub: 'Project 3D · Torrijos (Toledo)',
      placeholder: 'Pregunta sobre materiales, tolerancias o plazos...',
      footerPhone: 'Torrijos (Toledo) · +34 925 77 12 34',
      footerHuman: 'Hablar con un asesor',
      humanTitle: 'Conectar con Ingeniero de Planta',
      humanSub: 'Déjanos tus datos de contacto y un técnico especialista revisará tu requerimiento de inmediato:',
      humanName: 'Tu nombre',
      humanEmail: 'Email corporativo',
      humanPhone: 'Teléfono (opcional)',
      humanSubmit: 'Solicitar Llamada Técnica',
      thinking: 'Consultando especificaciones técnicas...',
      connectedToViewer: 'Conectado a la pieza activa en el visor 3D',
      askAboutActivePiece: '¿Qué resistencia tiene esta pieza?',
    },
    cart: {
      modalCartTitle: 'Orden de Fabricación Industrial',
      modalReviewTitle: 'Solicitud de Revisión Técnica Gratuita',
      empty: 'No hay piezas configuradas en el carrito todavía. Carga un archivo STL en el cotizador.',
      modelsToProduce: 'Modelos a Fabricar',
      baseSubtotal: 'Base Imponible Neta:',
      vatLabel: 'IVA (21% España):',
      grandTotal: 'Total Presupuestado:',
      tabCart: 'Confirmar y Solicitar Fabricación',
      tabReview: 'Solo Revisión Técnica con Ingeniero',
      fieldContact: 'Nombre de Contacto *',
      fieldCompany: 'Empresa / Razón Social',
      fieldEmail: 'Email Profesional *',
      fieldPhone: 'Teléfono Directo',
      fieldNotes: 'Notas Técnicas o Requisitos de Inspección',
      submitCart: 'Confirmar Pedido',
      submitReview: 'Solicitar Informe de Revisión Técnica Gratuita',
      submitting: 'Procesando en taller Torrijos...',
      successTitle: '¡Orden Confirmada con Éxito!',
      successReviewTitle: '¡Solicitud Técnica Registrada!',
      successDesc: 'Hemos enviado el albarán técnico detallado y las especificaciones a tu correo.',
      closeBtn: 'Cerrar y Volver a la Plataforma',
    },
    footer: {
      desc: 'Soluciones integrales de prototipado rápido industrial, fabricación aditiva y pre-series en Torrijos (Toledo).',
      iso: 'Certificación ISO 9001:2015',
      facilityTitle: 'Planta de Fabricación',
      navTitle: 'Navegación',
      legalTitle: 'Ingeniería & Legal',
      docsLink: 'Docs de Arquitectura y Código',
      rights: 'Project 3D Prototipado Industrial S.L. Todos los derechos reservados.',
      dispatchNotice: 'Torrijos (Toledo) · Despacho Express 24h a toda España y Europa',
    },
  },

  en: {
    nav: {
      quote: 'STL Quoter',
      services: 'Services',
      materials: 'Materials',
      cases: 'Case Studies',
      torrijos: 'Torrijos',
      faq: 'FAQ',
      docs: 'Architecture Docs',
      uploadCta: 'Upload STL File',
      cart: 'Cart',
    },
    hero: {
      badge: 'Torrijos (Toledo, Spain) · Industrial Park, Av. de los Trabajadores 23',
      title: 'Rapid industrial prototyping & precision additive manufacturing.',
      subtitle: 'We turn your CAD files into aerospace, automotive, and industrial machinery parts. Instant automated quotes with Three.js 3D viewer and 24h–48h express dispatch from our technical facility in Torrijos.',
      ctaQuote: 'Quote STL File Online',
      ctaCatalog: 'View Materials Catalog',
      statTolerance: '±0.05 mm',
      statToleranceLabel: 'Dimensional tolerance SLA / CNC',
      statTurnaround: '24 Hours',
      statTurnaroundLabel: 'Express Iberian Peninsula delivery',
      statQuality: 'ISO 9001',
      statQualityLabel: 'Quality control & CMM metrology',
      machinePark: 'Project 3D Machine Park',
      machineStatus: 'Operational 24/7',
    },
    quote: {
      tag: 'Real-Time 3D Quotation Engine',
      title: 'Interactive 3D viewer & automated STL quotation.',
      subtitle: 'Upload your file or try our sample models. Our differential mesh algorithm calculates exact cubic volume (cm³), surface area, and machining costs with transparent shop rates.',
      dragDropTitle: 'Drag & drop your .STL files here or',
      dragDropSub: 'Binary or ASCII files up to 100 MB. Instant client-side processing with guaranteed confidentiality.',
      dragDropBrowse: 'browse multiple files',
      samplePrompt: "Don't have an STL handy? Try:",
      sampleGear: 'M2 Helical Gear',
      sampleBracket: 'NEMA 23 Bracket',
      sampleEnclosure: 'IP65 Sensor Box',
      stepMaterial: '1. Industrial Material Selection',
      stepMaterialSub: '5 certified polymers',
      stepInfill: '2. Internal Infill Density',
      stepInfillLight: '10% Light',
      stepInfillStandard: '20% Standard',
      stepInfillTooling: '50% Tooling',
      stepInfillSolid: '100% Solid',
      stepLayer: '3. Layer Height / Quality',
      stepLayerFine: 'Fine',
      stepLayerPrecision: 'Precise',
      stepLayerStandard: 'Standard',
      stepLayerFast: 'Draft',
      unitsLabel: 'Mesh Units',
      unitMm: 'Millimeters (mm)',
      unitIn: 'Inches (in)',
      quantityLabel: 'Quantity',
      volumeDiscount: 'Batch discount',
      postProcessingLabel: 'Post-Processing & Finishing',
      postNone: 'No finish (Raw support removal)',
      postStandard: 'Standard (Manual CAM support removal)',
      postThreaded: 'Sanding & Threaded Brass Inserts (+€12.50)',
      postHeatTreatment: 'Thermal Annealing Treatment (+€9.00)',
      postBlasted: 'Glass bead micro-blasting (+€7.50)',
      postSmooth: 'Vapor smoothing / Thermal polish (+€14.00)',
      postCmm: 'Torrijos CMM Metrology Certificate (+€26.00)',
      priorityLabel: '24-Hour Express Dispatch',
      prioritySub: 'Priority machine queuing at Torrijos shop',
      priorityActive: 'Enabled (+25%)',
      priorityStandard: 'Standard 48-72h',
      summaryTag: 'Instant Industrial Quotation',
      estimatedDelivery: 'Estimated dispatch',
      rawMaterial: 'Raw Material',
      machineTime: 'Machine Time',
      setupFee: 'CAM Setup & Slicing',
      vat: 'VAT (21%)',
      addToCart: 'Add to Cart',
      requestReview: 'Request Free Technical CAM Review',
      guaranteeNotice: 'Industrial tolerance guarantee & batch traceability',
      facilityNotice: 'Manufactured at Torrijos Industrial Park (Toledo, Spain)',
      emptyPrompt: 'Load an .STL file to calculate dynamic pricing breakdown in real time.',
      analyzing: 'Analyzing 3D geometry...',
      analyzingSub: 'Calculating net volume in cm³, bounding box, and surface area via tetrahedral divergence theorem.',
      dimensions: 'Dimensions',
      volume: 'Volume',
      surfaceArea: 'Surface Area',
      bedNotice: 'Build Plate: Ø260 × 300 mm (Torrijos Hub)',
      outOfBoundsWarning: 'Notice: Model exceeds standard Ø260x300mm plate. Large-format FDM (600mm) will be allocated.',
      wallThicknessBtn: 'Wall Thickness Analyzer (< 0.8 mm)',
      autoOrientBtn: 'Optimal Auto-Orientation',
      downloadPdfBtn: 'Download Formal PDF Quote (15-Day Validity)',
      multiStlTitle: 'Batch Loaded STL Parts',
      multiStlAddBtn: 'Add Another STL File',
      activeModelLabel: 'Active Part in 3D Viewport',
      thinWallAlert: 'areas detected with thickness < 0.8 mm (critical fragility warning)',
      autoOrientSuccess: 'Model auto-oriented on build plate with minimal Z height.',
      removePiece: 'Remove piece',
      totalPiecesLabel: 'Total Parts Summary',
    },
    services: {
      tag: 'Industrial Capabilities',
      title: 'Additive manufacturing engineered for rigorous requirements.',
      subtitle: 'We combine industrial-grade FDM extrusion, high-resolution SLA photopolymerization, and SLS laser sintering at our Torrijos facility.',
      toleranceLabel: 'Tolerance',
      idealForLabel: 'Optimal Application',
    },
    materials: {
      tag: 'Certified Polymers Catalog',
      title: 'Certified polymers with batch traceability and technical datasheets.',
      subtitle: 'All filaments, photopolymer resins, and laser powders are sourced from ISO 9001 certified suppliers with full chemical certificates.',
      datasheetTag: 'Technical Approval Datasheet',
      configureCta: 'Select in Quoter',
      propTensile: 'Tensile Strength',
      propHdt: 'Heat Deflection HDT',
      propModulus: 'Flexural Modulus',
      propDensity: 'Specific Density',
      prosTitle: 'Key Advantages',
      consTitle: 'Engineering Considerations',
      rawCostEst: 'Estimated raw material cost:',
      stockNotice: 'Permanent on-site stock in Torrijos',
      labTag: 'Quality & Specimen Testing Lab',
      labTitle: 'Standardized mechanical testing per ISO 527 & ASTM D638.',
      labDesc: 'We verify interlayer bonding, anisotropy, and yield strength on specimens printed in our dehumidified dry cabinets.',
    },
    cases: {
      tag: 'Industrial Success Stories',
      title: 'Critical components validated in high-stress environments.',
      subtitle: 'Quantified evidence of cycle time reduction, structural lightweighting, and turnaround velocity.',
      featuredTag: 'Featured Case · Aerospace Project',
      savingLabel: 'Tooling Cost Saved',
      turnaroundLabel: 'Delivery Time',
      materialUsed: 'Material:',
    },
    location: {
      tag: 'Facility & Logistics',
      title: 'Additive manufacturing facility in Torrijos (Toledo, Spain).',
      subtitle: 'Strategically located along the Madrid-Castilla logistics corridor, ensuring direct workshop pickup or 24h delivery across Europe.',
      addressHeader: 'Torrijos Industrial Park · Av. de los Trabajadores 23',
      hubHighway: 'Highways',
      hubHighwayVal: 'A-40 / A-5 direct link',
      hubDistances: 'Transit Times',
      hubDistancesVal: '25 min Toledo / 50 min Madrid',
      hubDock: 'Logistics Dock',
      hubDockVal: 'Dedicated freight bay',
      phoneLabel: 'Shop Technical Line',
      emailLabel: 'Engineering Email',
      hoursLabel: 'Shop Hours',
      hoursVal: 'Mon-Fri 7:30 to 18:30 (24/7 Quoter)',
      formTag: 'Contact Technical Engineering',
      formTitle: 'Request Consultation or Special Project Quote',
      formSub: 'Require post-machining, threaded brass inserts, 100+ unit pre-series, or an NDA agreement? Contact us directly.',
      formName: 'Full Name *',
      formEmail: 'Business Email *',
      formPhone: 'Direct Phone',
      formCompany: 'Company / Industry',
      formMessage: 'Project Details & Technical Specifications',
      formSubmit: 'Send Request to Torrijos Plant',
      formSending: 'Transmitting to engineering...',
      formSuccessTitle: 'Inquiry Sent Successfully',
      formSuccessMsg: 'Your specifications have been routed to our on-duty engineer in Torrijos. We will get back to you within 2 business hours.',
      formAnother: 'Submit another inquiry',
    },
    faq: {
      tag: 'Frequently Asked Questions',
      title: 'Technical answers on quotation and rapid prototyping.',
    },
    chatbot: {
      buttonTitle: 'Technical 3D Assistant',
      headerTitle: 'Engineering Advisor',
      headerStatus: 'Online',
      facilitySub: 'Project 3D · Torrijos (Toledo)',
      placeholder: 'Ask about materials, tolerances, turnaround...',
      footerPhone: 'Torrijos (Toledo) · +34 925 77 12 34',
      footerHuman: 'Speak with an engineer',
      humanTitle: 'Connect with a Plant Engineer',
      humanSub: 'Leave your details and a specialized technician will review your CAD specs immediately:',
      humanName: 'Your name',
      humanEmail: 'Corporate email',
      humanPhone: 'Phone number (optional)',
      humanSubmit: 'Request Engineering Callback',
      thinking: 'Consulting engineering specifications...',
      connectedToViewer: 'Linked to active piece in 3D viewport',
      askAboutActivePiece: 'How strong is this piece?',
    },
    cart: {
      modalCartTitle: 'Industrial Manufacturing Order',
      modalReviewTitle: 'Request Free Technical CAM Review',
      empty: 'No items configured in cart yet. Upload an STL file in the quotation engine.',
      modelsToProduce: 'Models to Produce',
      baseSubtotal: 'Net Subtotal:',
      vatLabel: 'VAT (21% Spain):',
      grandTotal: 'Total Quote:',
      tabCart: 'Confirm & Place Manufacturing Order',
      tabReview: 'Technical Review with Engineer',
      fieldContact: 'Contact Name *',
      fieldCompany: 'Company / Entity',
      fieldEmail: 'Business Email *',
      fieldPhone: 'Direct Phone',
      fieldNotes: 'Technical Notes or Inspection Requirements',
      submitCart: 'Confirm Order',
      submitReview: 'Request Free Technical Inspection Report',
      submitting: 'Processing at Torrijos shop...',
      successTitle: 'Order Confirmed Successfully!',
      successReviewTitle: 'Technical Review Registered!',
      successDesc: 'We have dispatched your technical dispatch note and specifications to your email.',
      closeBtn: 'Close & Return to Platform',
    },
    footer: {
      desc: 'End-to-end industrial rapid prototyping, precision additive manufacturing, and pre-series at Torrijos (Toledo).',
      iso: 'ISO 9001:2015 Certified Facility',
      facilityTitle: 'Manufacturing Plant',
      navTitle: 'Navigation',
      legalTitle: 'Engineering & Legal',
      docsLink: 'Architecture & Code Docs',
      rights: 'Project 3D Prototipado Industrial S.L. All rights reserved.',
      dispatchNotice: 'Torrijos (Toledo) · 24h Express Dispatch across Spain and Europe',
    },
  },

  fr: {
    nav: {
      quote: 'Devis STL',
      services: 'Services',
      materials: 'Matériaux',
      cases: 'Études de Cas',
      torrijos: 'Torrijos',
      faq: 'FAQ',
      docs: 'Architecture Docs',
      uploadCta: 'Charger Fichier STL',
      cart: 'Panier',
    },
    hero: {
      badge: 'Torrijos (Tolède, Espagne) · Parc Industriel, Av. de los Trabajadores 23',
      title: 'Prototypage industriel rapide et fabrication additive de précision.',
      subtitle: 'Nous transformons vos fichiers CAO en pièces fonctionnelles de qualité aéronautique, automobile et mécanique. Devis automatique instantané sous 24h à 48h depuis notre usine de Torrijos.',
      ctaQuote: 'Deviser Fichier STL en Ligne',
      ctaCatalog: 'Voir le Catalogue Matériaux',
      statTolerance: '±0.05 mm',
      statToleranceLabel: 'Tolérance dimensionnelle SLA / CNC',
      statTurnaround: '24 Heures',
      statTurnaroundLabel: 'Service Express péninsule ibérique',
      statQuality: 'ISO 9001',
      statQualityLabel: 'Contrôle qualité & métrologie MMT',
      machinePark: 'Parc Industriel Project 3D',
      machineStatus: 'Opérationnel 24/7',
    },
    quote: {
      tag: 'Moteur de Devis 3D en Temps Réel',
      title: 'Visionneuse 3D interactive et chiffrage automatique de fichiers STL.',
      subtitle: 'Téléversez votre pièce ou testez nos modèles. Notre algorithme calcule le volume net exact (cm³), la surface et le coût d’usinage avec des tarifs d’atelier transparents.',
      dragDropTitle: 'Glissez-déposez vos fichiers .STL ici ou',
      dragDropSub: 'Fichiers binaires ou ASCII jusqu’à 100 Mo. Traitement local instantané et stricte confidentialité.',
      dragDropBrowse: 'sélectionnez plusieurs fichiers',
      samplePrompt: 'Pas de fichier sous la main ? Essayez :',
      sampleGear: 'Engrenage M2',
      sampleBracket: 'Support NEMA 23',
      sampleEnclosure: 'Boîtier Capteur IP65',
      stepMaterial: '1. Sélection du Matériau Industriel',
      stepMaterialSub: '5 polymères certifiés',
      stepInfill: '2. Densité de Remplissage (Infill)',
      stepInfillLight: '10% Léger',
      stepInfillStandard: '20% Standard',
      stepInfillTooling: '50% Outillage',
      stepInfillSolid: '100% Solide',
      stepLayer: '3. Hauteur de Couche / Précision',
      stepLayerFine: 'Fin',
      stepLayerPrecision: 'Précis',
      stepLayerStandard: 'Standard',
      stepLayerFast: 'Rapide',
      unitsLabel: 'Unités du Maillage',
      unitMm: 'Millimètres (mm)',
      unitIn: 'Pouces (in)',
      quantityLabel: 'Quantité',
      volumeDiscount: 'Remise sur volume',
      postProcessingLabel: 'Finition & Post-Traitement',
      postNone: 'Sans finition (Ébavurage brut)',
      postStandard: 'Standard (Ébavurage manuel FAO)',
      postThreaded: 'Ponçage & Inserts Taraudés Laiton (+€12.50)',
      postHeatTreatment: 'Traitement Thermique de Recuit (+€9.00)',
      postBlasted: 'Microbillage aux billes de verre (+€7.50)',
      postSmooth: 'Polissage thermique / lissage vapeur (+€14.00)',
      postCmm: 'Rapport métrologique MMT Torrijos (+€26.00)',
      priorityLabel: 'Expédition Express 24 Heures',
      prioritySub: 'Mise en machine prioritaire à Torrijos',
      priorityActive: 'Activé (+25%)',
      priorityStandard: 'Standard 48-72h',
      summaryTag: 'Devis Industriel Instantané',
      estimatedDelivery: 'Expédition estimée',
      rawMaterial: 'Matière Première',
      machineTime: 'Temps Machine',
      setupFee: 'Configuration FAO & Slicing',
      vat: 'TVA (21%)',
      addToCart: 'Ajouter au Panier',
      requestReview: 'Demander une Révision Technique Gratuite',
      guaranteeNotice: 'Garantie de tolérance industrielle et traçabilité de lot',
      facilityNotice: 'Fabriqué au Parc Industriel de Torrijos (Tolède, Espagne)',
      emptyPrompt: 'Chargez un fichier .STL pour calculer le devis en temps réel.',
      analyzing: 'Analyse géométrique 3D en cours...',
      analyzingSub: 'Calcul du volume net en cm³, de la boîte englobante et de la surface par intégration de divergence tétraédrique.',
      dimensions: 'Dimensions',
      volume: 'Volume',
      surfaceArea: 'Surface',
      bedNotice: 'Plateau : Ø260 × 300 mm (Hub Torrijos)',
      outOfBoundsWarning: 'Attention : le modèle dépasse le plateau Ø260x300mm. Machine FDM Grand Format (600mm) allouée.',
      wallThicknessBtn: 'Analyseur d’Épaisseur (< 0.8 mm)',
      autoOrientBtn: 'Auto-Orientation Optimale',
      downloadPdfBtn: 'Télécharger Devis Formel PDF (15 jours)',
      multiStlTitle: 'Pièces STL Chargées en Lot',
      multiStlAddBtn: 'Ajouter un Autre STL',
      activeModelLabel: 'Pièce Active dans la Vue 3D',
      thinWallAlert: 'zones détectées avec épaisseur < 0.8 mm (fragilité critique)',
      autoOrientSuccess: 'Modèle orienté sur le plateau avec une hauteur Z minimale.',
      removePiece: 'Supprimer la pièce',
      totalPiecesLabel: 'Récapitulatif Global des Pièces',
    },
    services: {
      tag: 'Services Industriels',
      title: 'Solutions de fabrication additive pour ingénierie exigeante.',
      subtitle: 'Dépôt de fil fondu industriel, stéréolithographie SLA haute résolution et frittage laser SLS à Torrijos.',
      toleranceLabel: 'Tolérance',
      idealForLabel: 'Application Optimale',
    },
    materials: {
      tag: 'Catalogue de Polymères Certifiés',
      title: 'Polymères certifiés avec fiches techniques et traçabilité de lot.',
      subtitle: 'Tous nos matériaux proviennent de fabricants certifiés ISO 9001 avec certificats d’analyse chimique.',
      datasheetTag: 'Fiche Technique d’Homologation',
      configureCta: 'Configurer dans le Devis',
      propTensile: 'Résistance Traction',
      propHdt: 'Déflexion Thermique HDT',
      propModulus: 'Module de Flexion',
      propDensity: 'Densité Spécifique',
      prosTitle: 'Avantages Clés',
      consTitle: 'Considérations Techniques',
      rawCostEst: 'Coût estimé matière première :',
      stockNotice: 'Stock permanent sur site à Torrijos',
      labTag: 'Laboratoire d’Essais Mécaniques',
      labTitle: 'Essais normalisés selon ISO 527 et ASTM D638.',
      labDesc: 'Vérification de l’adhérence intercouches et de la limite d’élasticité en enceintes déshumidifiées.',
    },
    cases: {
      tag: 'Études de Cas Industrielles',
      title: 'Pièces critiques validées en environnements extrêmes.',
      subtitle: 'Données chiffrées de réduction de poids, gain de cycle et réactivité.',
      featuredTag: 'Projet Phare · Aéronautique',
      savingLabel: 'Économie sur Outillages',
      turnaroundLabel: 'Délai de Livraison',
      materialUsed: 'Matériau :',
    },
    location: {
      tag: 'Usine & Logistique',
      title: 'Site de fabrication additive à Torrijos (Tolède, Espagne).',
      subtitle: 'Position stratégique sur le corridor logistique Madrid-Tolède pour enlèvement direct ou livraison sous 24h en Europe.',
      addressHeader: 'Parc Industriel de Torrijos · Av. de los Trabajadores 23',
      hubHighway: 'Autoroutes',
      hubHighwayVal: 'Liaison directe A-40 / A-5',
      hubDistances: 'Distances',
      hubDistancesVal: '25 min Tolède / 50 min Madrid',
      hubDock: 'Quai de Réception',
      hubDockVal: 'Quai de fret dédié',
      phoneLabel: 'Ligne Atelier Directe',
      emailLabel: 'Email Ingénierie',
      hoursLabel: 'Horaires Atelier',
      hoursVal: 'Lun-Ven 7h30 à 18h30 (Devis 24/7)',
      formTag: 'Contacter le Bureau d’Études',
      formTitle: 'Demander un Conseil ou Devis Spécial',
      formSub: 'Besoin d’inserts laiton, d’usinage complémentaire, de préséries >100 pièces ou d’un accord NDA ? Écrivez-nous.',
      formName: 'Nom et Prénom *',
      formEmail: 'Email Professionnel *',
      formPhone: 'Téléphone Direct',
      formCompany: 'Entreprise / Secteur',
      formMessage: 'Détails du Projet ou Spécifications',
      formSubmit: 'Transmettre à l’Usine de Torrijos',
      formSending: 'Envoi en cours...',
      formSuccessTitle: 'Demande Transmise',
      formSuccessMsg: 'Vos données ont été remises à l’ingénieur de permanence à Torrijos. Réponse sous 2 heures ouvrées.',
      formAnother: 'Envoyer une autre demande',
    },
    faq: {
      tag: 'Questions Fréquentes',
      title: 'Réponses techniques sur le prototypage et le chiffrage STL.',
    },
    chatbot: {
      buttonTitle: 'Conseiller Technique 3D',
      headerTitle: 'Ingénieur Conseil',
      headerStatus: 'En ligne',
      facilitySub: 'Project 3D · Torrijos (Tolède)',
      placeholder: 'Posez une question sur les matériaux, délais, tolérances...',
      footerPhone: 'Torrijos (Tolède) · +34 925 77 12 34',
      footerHuman: 'Parler à un ingénieur',
      humanTitle: 'Contacter un Ingénieur d’Usine',
      humanSub: 'Laissez vos coordonnées pour un échange technique immédiat :',
      humanName: 'Votre nom',
      humanEmail: 'Email professionnel',
      humanPhone: 'Téléphone (optionnel)',
      humanSubmit: 'Demander un Appel Technique',
      thinking: 'Consultation des spécifications en cours...',
      connectedToViewer: 'Lié à la pièce active dans la vue 3D',
      askAboutActivePiece: 'Quelle est la résistance de cette pièce ?',
    },
    cart: {
      modalCartTitle: 'Commande de Fabrication Industrielle',
      modalReviewTitle: 'Demande de Révision Technique FAO Gratuite',
      empty: 'Aucune pièce dans le panier. Téléversez un fichier STL dans le cotateur.',
      modelsToProduce: 'Modèles à Fabriquer',
      baseSubtotal: 'Sous-total Net :',
      vatLabel: 'TVA (21% Espagne) :',
      grandTotal: 'Total Devisé :',
      tabCart: 'Confirmer la Commande',
      tabReview: 'Révision Technique avec un Ingénieur',
      fieldContact: 'Nom du Contact *',
      fieldCompany: 'Société / Raison Sociale',
      fieldEmail: 'Email Professionnel *',
      fieldPhone: 'Téléphone Direct',
      fieldNotes: 'Notes Techniques ou Tolérances',
      submitCart: 'Confirmer la Commande',
      submitReview: 'Demander le Rapport Technique Gratuit',
      submitting: 'Traitement à Torrijos...',
      successTitle: 'Commande Confirmée !',
      successReviewTitle: 'Demande Enregistrée !',
      successDesc: 'Nous avons transmis le récapitulatif technique et les spécifications à votre adresse email.',
      closeBtn: 'Fermer et Revenir à la Plateforme',
    },
    footer: {
      desc: 'Prototypage rapide industriel, fabrication additive et pré-séries à Torrijos (Tolède).',
      iso: 'Certifié ISO 9001:2015',
      facilityTitle: 'Usine de Fabrication',
      navTitle: 'Navigation',
      legalTitle: 'Ingénierie & Légal',
      docsLink: 'Architecture & Code Source',
      rights: 'Project 3D Prototipado Industrial S.L. Tous droits réservés.',
      dispatchNotice: 'Torrijos (Tolède) · Expédition Express 24h Espagne et Europe',
    },
  },

  it: {
    nav: {
      quote: 'Preventivatore STL',
      services: 'Servizi',
      materials: 'Materiali',
      cases: 'Casi di Studio',
      torrijos: 'Torrijos',
      faq: 'FAQ',
      docs: 'Architettura Docs',
      uploadCta: 'Carica File STL',
      cart: 'Carrello',
    },
    hero: {
      badge: 'Torrijos (Toledo, Spagna) · Parco Industriale, Av. de los Trabajadores 23',
      title: 'Prototipazione rapida industriale e manifattura additiva di precisione.',
      subtitle: 'Trasformiamo i tuoi file CAD in componenti funzionali per aerospazio, automotive e macchinari industriali. Consegna express 24h-48h dalla fabbrica di Torrijos.',
      ctaQuote: 'Preventiva File STL Online',
      ctaCatalog: 'Catalogo Materiali',
      statTolerance: '±0.05 mm',
      statToleranceLabel: 'Tolleranza dimensionale SLA / CNC',
      statTurnaround: '24 Ore',
      statTurnaroundLabel: 'Servizio Express penisola iberica',
      statQuality: 'ISO 9001',
      statQualityLabel: 'Controllo qualità e metrologia CMM',
      machinePark: 'Parco Macchine Project 3D',
      machineStatus: 'Operativo 24/7',
    },
    quote: {
      tag: 'Motore di Quotazione 3D in Tempo Reale',
      title: 'Visualizzatore 3D interattivo e preventivazione automatica file STL.',
      subtitle: 'Carica il tuo file o prova i nostri modelli campione. Il nostro algoritmo calcola volume esatto (cm³), superficie e costi di officina in piena trasparenza.',
      dragDropTitle: 'Trascina qui i tuoi file .STL o',
      dragDropSub: 'File binari o ASCII fino a 100 MB. Elaborazione locale istantanea e massima riservatezza.',
      dragDropBrowse: 'seleziona file multipli',
      samplePrompt: 'Non hai un file a portata di mano? Prova:',
      sampleGear: 'Ingranaggio M2',
      sampleBracket: 'Supporto NEMA 23',
      sampleEnclosure: 'Custodia Sensore IP65',
      stepMaterial: '1. Selezione Materiale Industriale',
      stepMaterialSub: '5 polimeri certificati',
      stepInfill: '2. Densità Riempimento (Infill)',
      stepInfillLight: '10% Leggero',
      stepInfillStandard: '20% Standard',
      stepInfillTooling: '50% Attrezzaggio',
      stepInfillSolid: '100% Solido',
      stepLayer: '3. Altezza Layer / Precisione',
      stepLayerFine: 'Fine',
      stepLayerPrecision: 'Preciso',
      stepLayerStandard: 'Standard',
      stepLayerFast: 'Rapido',
      unitsLabel: 'Unità Mesh',
      unitMm: 'Millimetri (mm)',
      unitIn: 'Pollici (in)',
      quantityLabel: 'Quantità',
      volumeDiscount: 'Sconto quantità',
      postProcessingLabel: 'Finitura & Post-Processo',
      postNone: 'Nessuna finitura (Rimozione supporti grezza)',
      postStandard: 'Standard (Rimozione supporti CAM)',
      postThreaded: 'Levigatura e Inserti Filettati in Ottone (+€12.50)',
      postHeatTreatment: 'Trattamento Termico di Ricottura (+€9.00)',
      postBlasted: 'Microsabbiatura con microsfere di vetro (+€7.50)',
      postSmooth: 'Lucidatura chimica / termica (+€14.00)',
      postCmm: 'Certificato Metrologico CMM Torrijos (+€26.00)',
      priorityLabel: 'Spedizione Express 24 Ore',
      prioritySub: 'Lavorazione prioritaria in officina Torrijos',
      priorityActive: 'Attivo (+25%)',
      priorityStandard: 'Standard 48-72h',
      summaryTag: 'Preventivo Industriale Istantaneo',
      estimatedDelivery: 'Spedizione prevista',
      rawMaterial: 'Materia Prima',
      machineTime: 'Tempo Macchina',
      setupFee: 'Setup CAM & Slicing',
      vat: 'IVA (21%)',
      addToCart: 'Aggiungi al Carrello',
      requestReview: 'Richiedi Revisione Tecnica Gratuita',
      guaranteeNotice: 'Garanzia di tolleranza e tracciabilità di lotto',
      facilityNotice: 'Prodotto nel Parco Industriale di Torrijos (Toledo, Spagna)',
      emptyPrompt: 'Carica un file .STL per calcolare il preventivo in tempo reale.',
      analyzing: 'Analisi geometrica 3D in corso...',
      analyzingSub: 'Calcolo volume netto in cm³, bounding box e superficie tramite divergenza tetraedrica.',
      dimensions: 'Dimensioni',
      volume: 'Volume',
      surfaceArea: 'Superficie',
      bedNotice: 'Piatto: Ø260 × 300 mm (Hub Torrijos)',
      outOfBoundsWarning: 'Attenzione: la parte supera il piatto Ø260x300mm. Macchina FDM Grande Formato (600mm) assegnata.',
      wallThicknessBtn: 'Analizzatore Spessore Parete (< 0.8 mm)',
      autoOrientBtn: 'Auto-Orientamento Ottimale',
      downloadPdfBtn: 'Scarica Preventivo Formale PDF (Validità 15 gg)',
      multiStlTitle: 'Parti STL Caricate in Lotto',
      multiStlAddBtn: 'Aggiungi Altro STL',
      activeModelLabel: 'Parte Attiva nel Visore 3D',
      thinWallAlert: 'aree rilevate con spessore < 0.8 mm (criticità strutturale)',
      autoOrientSuccess: 'Modello orientato sul piatto con altezza Z minima.',
      removePiece: 'Rimuovi parte',
      totalPiecesLabel: 'Riepilogo Totale Componenti',
    },
    services: {
      tag: 'Servizi Industriali',
      title: 'Manifattura additiva per ingegneria ad alte prestazioni.',
      subtitle: 'FDM industriale, stereolitografia SLA ad altissima definizione e sinterizzazione laser SLS a Torrijos.',
      toleranceLabel: 'Tolleranza',
      idealForLabel: 'Applicazione Ideale',
    },
    materials: {
      tag: 'Catalogo Polimeri Certificati',
      title: 'Polimeri certificati con schede tecniche e tracciabilità di lotto.',
      subtitle: 'Tutti i materiali provengono da fornitori certificati ISO 9001 con certificato di analisi chimica.',
      datasheetTag: 'Scheda Tecnica di Omologazione',
      configureCta: 'Configura nel Preventivatore',
      propTensile: 'Resistenza a Trazione',
      propHdt: 'Deflessione Termica HDT',
      propModulus: 'Modulo di Flessione',
      propDensity: 'Densità Specifica',
      prosTitle: 'Vantaggi Principali',
      consTitle: 'Considerazioni Tecniche',
      rawCostEst: 'Costo stimato materia prima:',
      stockNotice: 'Giacenza fisica permanente a Torrijos',
      labTag: 'Laboratorio Prove e Qualità',
      labTitle: 'Test meccanici normalizzati secondo ISO 527 e ASTM D638.',
      labDesc: 'Verifica dell’adesione inter-layer e carico di snervamento su provini stampati nei nostri forni dedicati.',
    },
    cases: {
      tag: 'Casi di Successo Industriale',
      title: 'Componenti critici validati in condizioni estreme.',
      subtitle: 'Dati quantificati su alleggerimento strutturale e tempi di ciclo.',
      featuredTag: 'Progetto in Evidenza · Aerospazio',
      savingLabel: 'Risparmio Stampi',
      turnaroundLabel: 'Tempi di Consegna',
      materialUsed: 'Materiale:',
    },
    location: {
      tag: 'Stabilimento & Logistica',
      title: 'Impianto di manifattura additiva a Torrijos (Toledo, Spagna).',
      subtitle: 'Posizione strategica sull’asse Madrid-Toledo per ritiro diretto o consegna rapida in 24h in Europa.',
      addressHeader: 'Parco Industriale di Torrijos · Av. de los Trabajadores 23',
      hubHighway: 'Autostrade',
      hubHighwayVal: 'Collegamento diretto A-40 / A-5',
      hubDistances: 'Distanze',
      hubDistancesVal: '25 min Toledo / 50 min Madrid',
      hubDock: 'Banchina Merci',
      hubDockVal: 'Molo di carico dedicato',
      phoneLabel: 'Telefono Tecnico',
      emailLabel: 'Email Ingegneria',
      hoursLabel: 'Orario Officina',
      hoursVal: 'Lun-Ven 7:30 - 18:30 (Preventivi 24/7)',
      formTag: 'Contatta l’Ufficio Tecnico',
      formTitle: 'Richiedi Consulenza o Preventivo Speciale',
      formSub: 'Necessiti di boccole in ottone, lavorazioni CNC, preserie >100 pezzi o accordo NDA? Contattaci.',
      formName: 'Nome e Cognome *',
      formEmail: 'Email Aziendale *',
      formPhone: 'Telefono Diretto',
      formCompany: 'Azienda / Settore',
      formMessage: 'Dettagli Progetto o Specifiche',
      formSubmit: 'Invia Richiesta all’Officina di Torrijos',
      formSending: 'Invio in corso...',
      formSuccessTitle: 'Richiesta Inviata',
      formSuccessMsg: 'I dati sono stati inoltrati all’ingegnere di turno a Torrijos. Risposta entro 2 ore lavorative.',
      formAnother: 'Invia un’altra richiesta',
    },
    faq: {
      tag: 'Domande Frequenti',
      title: 'Risposte tecniche su preventivi STL e prototipazione.',
    },
    chatbot: {
      buttonTitle: 'Assistente Tecnico 3D',
      headerTitle: 'Consulente di Ingegneria',
      headerStatus: 'Online',
      facilitySub: 'Project 3D · Torrijos (Toledo)',
      placeholder: 'Chiedi su materiali, tolleranze, tempi di consegna...',
      footerPhone: 'Torrijos (Toledo) · +34 925 77 12 34',
      footerHuman: 'Parla con un ingegnere',
      humanTitle: 'Contatta Ingegnere di Impianto',
      humanSub: 'Lascia i tuoi recapiti per un confronto tecnico immediato:',
      humanName: 'Il tuo nome',
      humanEmail: 'Email aziendale',
      humanPhone: 'Telefono (opzionale)',
      humanSubmit: 'Richiedi Chiamata Tecnica',
      thinking: 'Consultazione specifiche in corso...',
      connectedToViewer: 'Collegato al pezzo attivo nel visualizzatore 3D',
      askAboutActivePiece: 'Qual è la resistenza di questo pezzo?',
    },
    cart: {
      modalCartTitle: 'Ordine di Produzione Industriale',
      modalReviewTitle: 'Richiesta Revisione Tecnica Gratuita',
      empty: 'Nessun componente nel carrello. Carica un file STL nel preventivatore.',
      modelsToProduce: 'Modelli da Produrre',
      baseSubtotal: 'Imponibile Netto:',
      vatLabel: 'IVA (21% Spagna):',
      grandTotal: 'Totale Preventivato:',
      tabCart: 'Conferma e Ordina Produzione',
      tabReview: 'Revisione Tecnica con Ingegnere',
      fieldContact: 'Nome Contatto *',
      fieldCompany: 'Azienda / Ragione Sociale',
      fieldEmail: 'Email Aziendale *',
      fieldPhone: 'Telefono Diretto',
      fieldNotes: 'Note Tecniche o Tolleranze',
      submitCart: 'Conferma Ordine',
      submitReview: 'Richiedi Report Tecnico Gratuito',
      submitting: 'Elaborazione in corso...',
      successTitle: 'Ordine Confermato con Successo!',
      successReviewTitle: 'Richiesta Tecnica Registrata!',
      successDesc: 'Abbiamo inviato il riepilogo tecnico e i parametri alla tua casella email.',
      closeBtn: 'Chiudi e Torna alla Piattaforma',
    },
    footer: {
      desc: 'Prototipazione rapida industriale, manifattura additiva e preserie a Torrijos (Toledo).',
      iso: 'Certificato ISO 9001:2015',
      facilityTitle: 'Stabilimento Produttivo',
      navTitle: 'Navigazione',
      legalTitle: 'Ingegneria & Legale',
      docsLink: 'Architettura & Codice Sorgente',
      rights: 'Project 3D Prototipado Industrial S.L. Tutti i diritti riservati.',
      dispatchNotice: 'Torrijos (Toledo) · Spedizione Express 24h Spagna ed Europa',
    },
  },

  pt: {
    nav: {
      quote: 'Cotador STL',
      services: 'Serviços',
      materials: 'Materiais',
      cases: 'Casos de Sucesso',
      torrijos: 'Torrijos',
      faq: 'FAQ',
      docs: 'Arquitetura Docs',
      uploadCta: 'Enviar Ficheiro STL',
      cart: 'Carrinho',
    },
    hero: {
      badge: 'Torrijos (Toledo, Espanha) · Parque Industrial, Av. de los Trabajadores 23',
      title: 'Prototipagem industrial rápida e fabricação aditiva de precisão.',
      subtitle: 'Transformamos os seus ficheiros CAD em peças funcionais para aeroespacial, automóvel e maquinaria industrial. Entrega express em 24h–48h a partir de Torrijos.',
      ctaQuote: 'Cotar Ficheiro STL Online',
      ctaCatalog: 'Ver Catálogo de Materiais',
      statTolerance: '±0.05 mm',
      statToleranceLabel: 'Tolerância dimensional SLA / CNC',
      statTurnaround: '24 Horas',
      statTurnaroundLabel: 'Serviço Express península ibérica',
      statQuality: 'ISO 9001',
      statQualityLabel: 'Controlo de qualidade e metrologia CMM',
      machinePark: 'Parque de Máquinas Project 3D',
      machineStatus: 'Operacional 24/7',
    },
    quote: {
      tag: 'Motor de Cotação 3D em Tempo Real',
      title: 'Visualizador 3D interativo e cálculo orçamental de ficheiros STL.',
      subtitle: 'Carregue a sua peça ou explore os nossos modelos. O nosso algoritmo calcula o volume cúbico líquido (cm³), a área e os custos de produção com tarifas transparentes.',
      dragDropTitle: 'Arraste os seus ficheiros .STL para aqui ou',
      dragDropSub: 'Ficheiros binários ou ASCII até 100 MB. Processamento local instantâneo com confidencialidade garantida.',
      dragDropBrowse: 'selecionar múltiplos ficheiros',
      samplePrompt: 'Sem ficheiro disponível? Experimente:',
      sampleGear: 'Engrenagem M2',
      sampleBracket: 'Suporte NEMA 23',
      sampleEnclosure: 'Caixa de Sensor IP65',
      stepMaterial: '1. Seleção de Material Industrial',
      stepMaterialSub: '5 polímeros certificados',
      stepInfill: '2. Densidade de Preenchimento (Infill)',
      stepInfillLight: '10% Leve',
      stepInfillStandard: '20% Padrão',
      stepInfillTooling: '50% Ferramental',
      stepInfillSolid: '100% Sólido',
      stepLayer: '3. Altura de Camada / Qualidade',
      stepLayerFine: 'Fino',
      stepLayerPrecision: 'Preciso',
      stepLayerStandard: 'Padrão',
      stepLayerFast: 'Rápido',
      unitsLabel: 'Unidades da Malha',
      unitMm: 'Milímetros (mm)',
      unitIn: 'Polegadas (in)',
      quantityLabel: 'Quantidade',
      volumeDiscount: 'Desconto de lote',
      postProcessingLabel: 'Acabamento & Pós-Processamento',
      postNone: 'Sem acabamento (Remoção bruta de suportes)',
      postStandard: 'Padrão (Remoção manual de suportes CAM)',
      postThreaded: 'Lixamento & Insertos Roscados de Latão (+€12.50)',
      postHeatTreatment: 'Tratamento Térmico de Recozimento (+€9.00)',
      postBlasted: 'Decapagem com microesferas de vidro (+€7.50)',
      postSmooth: 'Polimento químico / térmico (+€14.00)',
      postCmm: 'Certificado Metrológico CMM Torrijos (+€26.00)',
      priorityLabel: 'Expedição Express 24 Horas',
      prioritySub: 'Entrada prioritária em máquina em Torrijos',
      priorityActive: 'Ativado (+25%)',
      priorityStandard: 'Padrão 48-72h',
      summaryTag: 'Orçamento Industrial Instantâneo',
      estimatedDelivery: 'Expedição estimada',
      rawMaterial: 'Matéria-Prima',
      machineTime: 'Tempo de Máquina',
      setupFee: 'Preparação CAM & Fatiamento',
      vat: 'IVA (21%)',
      addToCart: 'Adicionar ao Carrinho',
      requestReview: 'Solicitar Revisão Técnica Gratuita',
      guaranteeNotice: 'Garantia de tolerância industrial e rastreabilidade de lote',
      facilityNotice: 'Fabricado no Parque Industrial de Torrijos (Toledo, Espanha)',
      emptyPrompt: 'Carregue um ficheiro .STL para calcular o orçamento em tempo real.',
      analyzing: 'A analisar geometria 3D...',
      analyzingSub: 'Cálculo de volume líquido em cm³, caixa delimitadora e área superficial por divergência tetraédrica.',
      dimensions: 'Dimensões',
      volume: 'Volume',
      surfaceArea: 'Superfície',
      bedNotice: 'Plataforma: Ø260 × 300 mm (Hub Torrijos)',
      outOfBoundsWarning: 'Atenção: A peça ultrapassa a bancada Ø260x300mm. Será alocada máquina FDM de Grande Formato (600mm).',
      wallThicknessBtn: 'Analisador de Espessura de Parede (< 0.8 mm)',
      autoOrientBtn: 'Auto-Orientação Ótima',
      downloadPdfBtn: 'Descarregar Orçamento Formal em PDF (15 dias)',
      multiStlTitle: 'Peças STL Carregadas em Lote',
      multiStlAddBtn: 'Adicionar Outro STL',
      activeModelLabel: 'Peça Ativa no Visualizador 3D',
      thinWallAlert: 'áreas detetadas com espessura < 0.8 mm (fragilidade crítica)',
      autoOrientSuccess: 'Peça orientada sobre a bancada com menor altura Z.',
      removePiece: 'Remover peça',
      totalPiecesLabel: 'Resumo Geral de Peças',
    },
    services: {
      tag: 'Serviços Industriais',
      title: 'Soluções de fabrico aditivo para engenharia exigente.',
      subtitle: 'FDM industrial de grande formato, estereolitografia SLA de ultra-definição e sinterização laser SLS em Torrijos.',
      toleranceLabel: 'Tolerância',
      idealForLabel: 'Aplicação Ótima',
    },
    materials: {
      tag: 'Catálogo de Polímeros Certificados',
      title: 'Polímeros certificados com fichas técnicas e rastreabilidade de lote.',
      subtitle: 'Todos os materiais provêm de fabricantes com certificação ISO 9001 e relatórios de composição química.',
      datasheetTag: 'Ficha Técnica de Homologação',
      configureCta: 'Configurar no Cotador',
      propTensile: 'Resistência à Tração',
      propHdt: 'Deflexão Térmica HDT',
      propModulus: 'Módulo de Flexão',
      propDensity: 'Densidade Específica',
      prosTitle: 'Principais Vantagens',
      consTitle: 'Considerações Técnicas',
      rawCostEst: 'Custo estimado de matéria-prima:',
      stockNotice: 'Stock permanente no local em Torrijos',
      labTag: 'Laboratório de Ensaio e Qualidade',
      labTitle: 'Ensaios mecânicos normalizados segundo ISO 527 e ASTM D638.',
      labDesc: 'Verificação de adesão entre camadas e limite elástico em provetes impressos em ambiente desumidificado.',
    },
    cases: {
      tag: 'Casos de Sucesso Industrial',
      title: 'Peças críticas validadas em ambientes de alta exigência.',
      subtitle: 'Evidência quantificada de redução de peso, rapidez de ciclo e entrega acelerada.',
      featuredTag: 'Caso em Destaque · Setor Aeroespacial',
      savingLabel: 'Poupança em Moldes',
      turnaroundLabel: 'Prazo de Entrega',
      materialUsed: 'Material:',
    },
    location: {
      tag: 'Instalações & Logística',
      title: 'Unidade de fabrico aditivo em Torrijos (Toledo, Espanha).',
      subtitle: 'Localização estratégica no eixo logístico Madrid-Toledo para levantamento direto ou envio em 24h para toda a Europa.',
      addressHeader: 'Parque Industrial de Torrijos · Av. de los Trabajadores 23',
      hubHighway: 'Autoestradas',
      hubHighwayVal: 'Ligação direta A-40 / A-5',
      hubDistances: 'Distâncias',
      hubDistancesVal: '25 min Toledo / 50 min Madrid',
      hubDock: 'Cais de Carga',
      hubDockVal: 'Cais exclusivo para camiões',
      phoneLabel: 'Linha Técnica Oficina',
      emailLabel: 'Email de Engenharia',
      hoursLabel: 'Horário de Oficina',
      hoursVal: 'Seg-Sex 7:30 às 18:30 (Cotação 24/7)',
      formTag: 'Contactar Departamento Técnico',
      formTitle: 'Solicitar Assessoria ou Orçamento Especial',
      formSub: 'Necessita de casquilhos roscados em latão, usinagem CNC, pré-séries >100 peças ou acordo NDA? Escreva-nos.',
      formName: 'Nome Completo *',
      formEmail: 'Email Profissional *',
      formPhone: 'Telefone Direto',
      formCompany: 'Empresa / Setor',
      formMessage: 'Detalhes do Projeto ou Especificações',
      formSubmit: 'Enviar Pedido para Oficina Torrijos',
      formSending: 'A transmitir à engenharia...',
      formSuccessTitle: 'Mensagem Enviada com Sucesso',
      formSuccessMsg: 'Os seus requisitos foram encaminhados para o engenheiro de serviço em Torrijos. Resposta em menos de 2 horas úteis.',
      formAnother: 'Enviar outro pedido',
    },
    faq: {
      tag: 'Perguntas Frequentes',
      title: 'Dúvidas técnicas sobre cotação STL e prototipagem.',
    },
    chatbot: {
      buttonTitle: 'Assistente Técnico 3D',
      headerTitle: 'Consultor de Engenharia',
      headerStatus: 'Online',
      facilitySub: 'Project 3D · Torrijos (Toledo)',
      placeholder: 'Pergunte sobre materiais, tolerâncias, prazos...',
      footerPhone: 'Torrijos (Toledo) · +34 925 77 12 34',
      footerHuman: 'Falar com um engenheiro',
      humanTitle: 'Ligar a Engenheiro de Produção',
      humanSub: 'Deixe os seus contactos para um contacto técnico imediato:',
      humanName: 'O seu nome',
      humanEmail: 'Email corporativo',
      humanPhone: 'Telefone (opcional)',
      humanSubmit: 'Solicitar Chamada Técnica',
      thinking: 'A consultar especificações técnicas...',
      connectedToViewer: 'Ligado à peça ativa no visualizador 3D',
      askAboutActivePiece: 'Qual é a resistência desta peça?',
    },
    cart: {
      modalCartTitle: 'Ordem de Fabrico Industrial',
      modalReviewTitle: 'Pedido de Revisão Técnica Gratuita',
      empty: 'Ainda não existem peças configuradas no carrinho. Carregue um ficheiro STL no cotador.',
      modelsToProduce: 'Modelos a Fabricar',
      baseSubtotal: 'Subtotal Líquido:',
      vatLabel: 'IVA (21% Espanha):',
      grandTotal: 'Total Orçamentado:',
      tabCart: 'Confirmar e Encomendar Produção',
      tabReview: 'Revisão Técnica com Engenheiro',
      fieldContact: 'Nome de Contacto *',
      fieldCompany: 'Empresa / Entidade',
      fieldEmail: 'Email Profissional *',
      fieldPhone: 'Telefone Direto',
      fieldNotes: 'Notas Técnicas ou Tolerâncias',
      submitCart: 'Confirmar Encomenda',
      submitReview: 'Pedir Relatório Técnico Gratuito',
      submitting: 'A processar na oficina de Torrijos...',
      successTitle: 'Encomenda Confirmada com Sucesso!',
      successReviewTitle: 'Pedido Técnico Registado!',
      successDesc: 'Enviámos o resumo técnico e as especificações para o seu email.',
      closeBtn: 'Fechar e Voltar à Plataforma',
    },
    footer: {
      desc: 'Prototipagem rápida industrial, fabrico aditivo e pré-séries em Torrijos (Toledo).',
      iso: 'Certificação ISO 9001:2015',
      facilityTitle: 'Unidade Fabril',
      navTitle: 'Navegação',
      legalTitle: 'Engenharia & Legal',
      docsLink: 'Arquitetura & Código Fonte',
      rights: 'Project 3D Prototipado Industrial S.L. Todos os direitos reservados.',
      dispatchNotice: 'Torrijos (Toledo) · Envio Express 24h para Espanha e Europa',
    },
  },
};

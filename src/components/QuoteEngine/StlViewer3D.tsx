import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCw,
  Box,
  Eye,
  Maximize2,
  Minimize2,
  Compass,
  AlertTriangle,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Ruler,
} from 'lucide-react';
import { MaterialOption, StlMetrics } from '../../types';
import { useI18n } from '../../i18n/I18nContext';
import { optimizePieceOrientation, analyzeWallThickness } from '../../lib/stlParser';

interface StlViewer3DProps {
  geometry: THREE.BufferGeometry | null;
  metrics: StlMetrics | null;
  material: MaterialOption;
  isProcessing?: boolean;
  thinWallCount?: number;
  onGeometryUpdated?: (newGeometry: THREE.BufferGeometry, newBoundingBox: { x: number; y: number; z: number }) => void;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
}

/**
 * Creates high-contrast 2D Canvas sprite for dynamic 3D CAD dimension tags (cotas en mm)
 */
function createDimensionSprite(text: string, accentColor = '#0284c7'): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Background pill
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(4, 4, 292, 72, 16);
    ctx.fill();
    ctx.stroke();

    // Dot indicator
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(28, 40, 8, 0, Math.PI * 2);
    ctx.fill();

    // Text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 48, 40);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    depthTest: false,
    transparent: true,
  });
  const sprite = new THREE.Sprite(material);
  sprite.renderOrder = 999;
  sprite.scale.set(38, 10, 1);
  return sprite;
}

export const StlViewer3D: React.FC<StlViewer3DProps> = ({
  geometry,
  metrics,
  material,
  isProcessing = false,
  thinWallCount = 0,
  onGeometryUpdated,
  isLoggedIn = true,
  onOpenAuth,
}) => {
  const { t } = useI18n();
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const boxHelperRef = useRef<THREE.BoxHelper | null>(null);
  const buildCylinderRef = useRef<THREE.LineSegments | null>(null);
  const dimensionGroupRef = useRef<THREE.Group | null>(null);

  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showBuildChamber, setShowBuildChamber] = useState<boolean>(true);
  const [showThicknessAnalysis, setShowThicknessAnalysis] = useState<boolean>(false);
  const [orientNotice, setOrientNotice] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if model exceeds standard build plate (Ø260mm x 300mm)
  const isOutOfBounds = metrics
    ? metrics.boundingBox.x > 260 || metrics.boundingBox.y > 260 || metrics.boundingBox.z > 300
    : false;

  // Initialize Three.js scene once in Light CAD Technical Environment
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene with Light CAD studio background (#f1f5f9)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 300),
      0.1,
      2500
    );
    camera.position.set(110, 120, 150);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 800;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // Studio Lighting in Technical Light CAD Mode
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(130, 200, 120);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.7);
    fillLight.position.set(-130, 100, -90);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x0284c7, 0.8);
    rimLight.position.set(0, 130, -160);
    scene.add(rimLight);

    // Build Platform Grid in Engineering Clean Steel
    const gridHelper = new THREE.GridHelper(260, 26, 0x0284c7, 0xcbd5e1);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Build plate base disc (Ø260 mm) in pure clean white
    const platformGeo = new THREE.CylinderGeometry(130, 130, 2.5, 64);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
      metalness: 0.1,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -1.25;
    platform.receiveShadow = true;
    scene.add(platform);

    // Standard build chamber wireframe (Cylinder: Radius 130mm, Height 300mm)
    const chamberGeo = new THREE.CylinderGeometry(130, 130, 300, 32, 4, true);
    const chamberEdges = new THREE.EdgesGeometry(chamberGeo);
    const chamberLine = new THREE.LineSegments(
      chamberEdges,
      new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.25 })
    );
    chamberLine.position.y = 150;
    scene.add(chamberLine);
    buildCylinderRef.current = chamberLine;

    // Dimension Group container
    const dimGroup = new THREE.Group();
    scene.add(dimGroup);
    dimensionGroupRef.current = dimGroup;

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / Math.max(height, 1);
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Toggle Chamber wireframe
  useEffect(() => {
    if (buildCylinderRef.current) {
      buildCylinderRef.current.visible = showBuildChamber;
    }
  }, [showBuildChamber]);

  // Update Geometry & Material & Dynamic Bounding Box Dimension Tags (Cotas mm)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (meshRef.current) {
      scene.remove(meshRef.current);
      if (meshRef.current.geometry) meshRef.current.geometry.dispose();
      if (Array.isArray(meshRef.current.material)) {
        meshRef.current.material.forEach((m) => m.dispose());
      } else {
        meshRef.current.material.dispose();
      }
      meshRef.current = null;
    }

    if (boxHelperRef.current) {
      scene.remove(boxHelperRef.current);
      boxHelperRef.current.dispose();
      boxHelperRef.current = null;
    }

    if (dimensionGroupRef.current) {
      while (dimensionGroupRef.current.children.length > 0) {
        const child = dimensionGroupRef.current.children[0];
        dimensionGroupRef.current.remove(child);
      }
    }

    if (!geometry) return;

    geometry.computeBoundingBox();
    const box = geometry.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    box.getSize(size);
    const height = size.y;

    // If thickness analysis active, make sure vertex colors exist
    if (showThicknessAnalysis && !geometry.getAttribute('color')) {
      analyzeWallThickness(geometry, 0.8);
    }

    const meshMaterial = new THREE.MeshStandardMaterial({
      color: showThicknessAnalysis ? 0xffffff : new THREE.Color(material.colorHex),
      vertexColors: showThicknessAnalysis,
      roughness: material.roughness,
      metalness: material.metalness,
      wireframe: isWireframe,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = height / 2;

    scene.add(mesh);
    meshRef.current = mesh;

    // Bounding Box Wireframe
    if (showBoundingBox) {
      const boxColor = isOutOfBounds ? 0xd97706 : 0x0284c7;
      const boxHelper = new THREE.BoxHelper(mesh, boxColor);
      scene.add(boxHelper);
      boxHelperRef.current = boxHelper;
    }

    // Dynamic 3D Dimension Tags (Cotas dinámicas en mm) around the Bounding Box
    if (showDimensions && dimensionGroupRef.current && metrics) {
      const dimGroup = dimensionGroupRef.current;
      const halfX = size.x / 2;
      const halfZ = size.z / 2;

      // 1. Cota X (Ancho frontal)
      const spriteX = createDimensionSprite(`X: ${metrics.boundingBox.x} mm`, '#0284c7');
      spriteX.position.set(0, 0, halfZ + 12);
      dimGroup.add(spriteX);

      // Line for X
      const xLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-halfX, 0, halfZ + 12),
        new THREE.Vector3(halfX, 0, halfZ + 12),
      ]);
      const xLineMat = new THREE.LineDashedMaterial({ color: 0x0284c7, dashSize: 3, gapSize: 2 });
      const xLine = new THREE.Line(xLineGeo, xLineMat);
      xLine.computeLineDistances();
      dimGroup.add(xLine);

      // 2. Cota Y (Altura vertical)
      const spriteY = createDimensionSprite(`Y: ${metrics.boundingBox.y} mm`, '#0284c7');
      spriteY.position.set(halfX + 16, height / 2, halfZ + 16);
      dimGroup.add(spriteY);

      // Vertical guide line for Y
      const yLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(halfX + 16, 0, halfZ + 16),
        new THREE.Vector3(halfX + 16, height, halfZ + 16),
      ]);
      const yLineMat = new THREE.LineDashedMaterial({ color: 0x0284c7, dashSize: 3, gapSize: 2 });
      const yLine = new THREE.Line(yLineGeo, yLineMat);
      yLine.computeLineDistances();
      dimGroup.add(yLine);

      // 3. Cota Z (Profundidad lateral)
      const spriteZ = createDimensionSprite(`Z: ${metrics.boundingBox.z} mm`, '#0284c7');
      spriteZ.position.set(halfX + 12, 0, 0);
      dimGroup.add(spriteZ);

      // Line for Z
      const zLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(halfX + 12, 0, -halfZ),
        new THREE.Vector3(halfX + 12, 0, halfZ),
      ]);
      const zLineMat = new THREE.LineDashedMaterial({ color: 0x0284c7, dashSize: 3, gapSize: 2 });
      const zLine = new THREE.Line(zLineGeo, zLineMat);
      zLine.computeLineDistances();
      dimGroup.add(zLine);
    }

    // Auto-fit camera
    const maxDim = Math.max(size.x, size.y, size.z, 25);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (camera && controls) {
      const fov = camera.fov * (Math.PI / 180);
      let cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * 1.1;
      cameraDistance = Math.max(cameraDistance, 70);

      camera.position.set(cameraDistance * 0.75, cameraDistance * 0.65, cameraDistance * 0.85);
      camera.lookAt(0, height / 2, 0);
      controls.target.set(0, height / 2, 0);
      controls.update();
    }
  }, [geometry, material, isWireframe, showBoundingBox, showDimensions, isOutOfBounds, showThicknessAnalysis, metrics]);

  // Auto-Orientation Handler
  const handleAutoOrientation = () => {
    if (!geometry) return;
    optimizePieceOrientation(geometry);

    geometry.computeBoundingBox();
    const box = geometry.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    box.getSize(size);

    if (meshRef.current) {
      meshRef.current.position.y = size.y / 2;
    }

    if (boxHelperRef.current && meshRef.current) {
      boxHelperRef.current.update();
    }

    resetCamera();

    setOrientNotice(t.quote.autoOrientSuccess);
    setTimeout(() => setOrientNotice(null), 3000);

    if (onGeometryUpdated) {
      onGeometryUpdated(geometry, {
        x: Math.round(size.x * 10) / 10,
        y: Math.round(size.y * 10) / 10,
        z: Math.round(size.z * 10) / 10,
      });
    }
  };

  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current || !meshRef.current) return;
    const box = new THREE.Box3().setFromObject(meshRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 30);
    const dist = maxDim * 1.8;

    cameraRef.current.position.set(dist * 0.7, dist * 0.6, dist * 0.8);
    cameraRef.current.lookAt(0, size.y / 2, 0);
    controlsRef.current.target.set(0, size.y / 2, 0);
    controlsRef.current.update();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      id="viewport-3d"
      className={`relative w-full rounded-xl overflow-hidden card-industrial flex flex-col ${
        isFullscreen ? 'h-screen' : 'h-[460px] md:h-[530px]'
      }`}
    >
      {/* 3D Canvas */}
      <div
        ref={mountRef}
        className={`w-full h-full relative cursor-grab active:cursor-grabbing transition-opacity duration-300 ${
          !isLoggedIn ? 'opacity-20 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Paywall Overlay if user is not authenticated: Completely blocks rendering and interactions */}
      {!isLoggedIn && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="max-w-md w-full bg-white p-7 rounded-2xl border border-slate-300 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-300 mx-auto flex items-center justify-center text-[#0284c7] shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#0284c7] font-bold block mb-1">
                Project 3D Torrijos · Autenticación Requerida
              </span>
              <h4 className="text-lg font-bold text-slate-900 leading-snug">
                Visor 3D y Cotización Oficial Bloqueados
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Crea una cuenta o Inicia Sesión para ver el modelo 3D con cotas dinámicas en mm, realizar el análisis geométrico y obtener la cotización automática en PDF y Google Workspace.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Iniciar sesión con Google</span>
              </button>

              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all active:scale-[0.99]"
              >
                <span>Identificarse con Email Corporativo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Loader Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-sky-200 border-t-[#0284c7] animate-spin mb-4" />
          <h4 className="text-base font-semibold text-slate-900">{t.quote.analyzing}</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">{t.quote.analyzingSub}</p>
        </div>
      )}

      {/* Floating HUD Top Bar */}
      {isLoggedIn && (
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse" />
            <span className="font-mono text-slate-800 uppercase tracking-wider font-semibold">
              {metrics ? metrics.fileName : 'Three.js CAD Engine'}
            </span>
            {metrics && (
              <>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 font-mono tabular-nums">
                  {metrics.triangleCount.toLocaleString()} {metrics.units}
                </span>
              </>
            )}
          </div>

          {/* Viewport Control Tools */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-300 p-1 rounded-lg shadow-sm">
            {/* Dynamic Dimensions Toggle (Cotas mm) */}
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              title="Activar/Desactivar cotas dinámicas en mm"
              className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                showDimensions
                  ? 'bg-sky-100 text-[#0284c7] border border-sky-300 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cotas mm</span>
            </button>

            {/* Wall Thickness Analyzer Button */}
            <button
              onClick={() => setShowThicknessAnalysis(!showThicknessAnalysis)}
              title={t.quote.wallThicknessBtn}
              className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                showThicknessAnalysis
                  ? 'bg-red-50 text-red-700 border border-red-300 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">&lt; 0.8mm</span>
            </button>

            {/* Auto-Orientation Button */}
            <button
              onClick={handleAutoOrientation}
              title={t.quote.autoOrientBtn}
              className="px-2 py-1 rounded text-xs font-mono text-slate-700 hover:text-[#0284c7] hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
              <span className="hidden sm:inline">Auto-Orient</span>
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Auto-rotate"
              className={`p-1.5 rounded transition-colors ${
                autoRotate ? 'bg-sky-100 text-[#0284c7]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowBoundingBox(!showBoundingBox)}
              title="Bounding Box"
              className={`p-1.5 rounded transition-colors ${
                showBoundingBox ? 'bg-sky-100 text-[#0284c7]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={resetCamera}
              title="Reset camera"
              className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              title="Fullscreen"
              className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Auto-orientation confirmation toast */}
      {orientNotice && (
        <div className="absolute top-14 left-3 right-3 z-20 pointer-events-none flex justify-center animate-in fade-in">
          <div className="pointer-events-auto bg-emerald-50 border border-emerald-400 text-emerald-800 px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-xs shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{orientNotice}</span>
          </div>
        </div>
      )}

      {/* Wall Thickness Analyzer Status Pill & Legend */}
      {showThicknessAnalysis && isLoggedIn && (
        <div className="absolute top-14 left-3 right-3 z-10 pointer-events-none flex flex-col items-center gap-1.5">
          <div className="pointer-events-auto bg-white/95 border border-red-300 text-slate-800 px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-xs shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold text-red-600">
              {thinWallCount > 0
                ? `${thinWallCount} ${t.quote.thinWallAlert}`
                : 'Paredes conformes: no se detectan espesores < 0.8 mm'}
            </span>
          </div>

          <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-300 px-3 py-1 rounded-md flex items-center gap-3 text-[10px] font-mono shadow-sm">
            <span className="flex items-center gap-1 text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt; 0.8 mm (Crítico)
            </span>
            <span className="flex items-center gap-1 text-amber-600">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 0.8 - 1.2 mm
            </span>
            <span className="flex items-center gap-1 text-sky-600">
              <span className="w-2 h-2 rounded-full bg-[#0284c7] inline-block" /> &gt; 1.2 mm (Óptimo)
            </span>
          </div>
        </div>
      )}

      {/* Out of bounds alert badge if dimensions exceed build plate */}
      {isOutOfBounds && !showThicknessAnalysis && isLoggedIn && (
        <div className="absolute top-14 left-3 right-3 z-10 pointer-events-none flex justify-center">
          <div className="pointer-events-auto bg-amber-50 border border-amber-400 text-amber-900 px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-xs shadow-md max-w-md">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] leading-tight">{t.quote.outOfBoundsWarning}</span>
          </div>
        </div>
      )}

      {/* Floating Bottom HUD: Dimensional & CAM Spec Overlays */}
      {metrics && isLoggedIn && (
        <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-300 px-3 py-2 rounded-lg flex items-center gap-4 text-xs font-mono shadow-sm">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">
                {t.quote.dimensions}
              </span>
              <span className="text-slate-900 font-semibold tabular-nums">
                {metrics.boundingBox.x} × {metrics.boundingBox.y} × {metrics.boundingBox.z} {metrics.units}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">
                {t.quote.volume}
              </span>
              <span className="text-[#0284c7] font-semibold tabular-nums">
                {metrics.volumeCm3.toFixed(2)} cm³
              </span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">
                {t.quote.surfaceArea}
              </span>
              <span className="text-slate-700 font-semibold tabular-nums">
                {metrics.areaCm2.toFixed(1)} cm²
              </span>
            </div>
          </div>

          <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-300 px-3 py-2 rounded-lg text-xs shadow-sm">
            <span className="text-slate-600 font-mono">{t.quote.bedNotice}</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!geometry && !isProcessing && isLoggedIn && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-300 flex items-center justify-center mb-3 shadow-sm">
            <Box className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Visor CAD 3D WebGL</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">{t.quote.emptyPrompt}</p>
        </div>
      )}
    </div>
  );
};

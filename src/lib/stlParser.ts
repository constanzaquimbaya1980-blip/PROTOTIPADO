import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { MeasurementUnit, StlMetrics } from '../types';

export interface ParseStlResult {
  geometry: THREE.BufferGeometry;
  metrics: StlMetrics;
  thinWallCount: number;
}

/**
 * Calculates volume of a closed triangle mesh using divergence theorem
 * signed tetrahedron volume summation: V = 1/6 * sum( p1 . (p2 x p3) )
 */
export function calculateVolumeAndArea(geometry: THREE.BufferGeometry): { volumeMm3: number; areaMm2: number } {
  const position = geometry.getAttribute('position');
  if (!position) return { volumeMm3: 0, areaMm2: 0 };

  const index = geometry.getIndex();
  let totalSignedVolume = 0;
  let totalArea = 0;

  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();
  const edge1 = new THREE.Vector3();
  const edge2 = new THREE.Vector3();
  const cross = new THREE.Vector3();

  const getVertex = (idx: number, target: THREE.Vector3) => {
    target.set(position.getX(idx), position.getY(idx), position.getZ(idx));
  };

  const triangleCount = index ? index.count / 3 : position.count / 3;

  for (let i = 0; i < triangleCount; i++) {
    const i1 = index ? index.getX(i * 3) : i * 3;
    const i2 = index ? index.getX(i * 3 + 1) : i * 3 + 1;
    const i3 = index ? index.getX(i * 3 + 2) : i * 3 + 2;

    getVertex(i1, p1);
    getVertex(i2, p2);
    getVertex(i3, p3);

    // Signed volume of tetrahedron formed by origin and triangle
    const signedVol = (
      -p3.x * p2.y * p1.z +
      p2.x * p3.y * p1.z +
      p3.x * p1.y * p2.z -
      p1.x * p3.y * p2.z -
      p2.x * p1.y * p3.z +
      p1.x * p2.y * p3.z
    ) / 6.0;

    totalSignedVolume += signedVol;

    // Triangle Surface Area = 0.5 * |edge1 x edge2|
    edge1.subVectors(p2, p1);
    edge2.subVectors(p3, p1);
    cross.crossVectors(edge1, edge2);
    totalArea += 0.5 * cross.length();
  }

  const absVolume = Math.abs(totalSignedVolume);
  return {
    volumeMm3: absVolume,
    areaMm2: totalArea,
  };
}

/**
 * Wall Thickness Analyzer
 * Evaluates internal distances and marks vertices with vertex colors:
 * - Red (thickness < 0.8mm)
 * - Amber (0.8mm - 1.2mm)
 * - Normal Cyan/Steel (> 1.2mm)
 */
export function analyzeWallThickness(
  geometry: THREE.BufferGeometry,
  thresholdMm = 0.8
): { thinCount: number; minThicknessMm: number } {
  const position = geometry.getAttribute('position');
  if (!position) return { thinCount: 0, minThicknessMm: 1.0 };

  geometry.computeVertexNormals();
  const normal = geometry.getAttribute('normal');

  const vertexCount = position.count;
  const colors = new Float32Array(vertexCount * 3);

  // Mesh raycasting setup
  const tempMesh = new THREE.Mesh(geometry);
  const raycaster = new THREE.Raycaster();
  (raycaster as any).firstHitOnly = true;

  const origin = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const vNorm = new THREE.Vector3();

  let thinCount = 0;
  let minThicknessMm = 999.0;

  // Adaptive sampling if mesh is extremely dense for fast 60fps UX
  const step = vertexCount > 15000 ? Math.ceil(vertexCount / 10000) : 1;

  for (let i = 0; i < vertexCount; i += step) {
    origin.set(position.getX(i), position.getY(i), position.getZ(i));
    vNorm.set(normal.getX(i), normal.getY(i), normal.getZ(i)).normalize();

    // Cast ray inward opposite to vertex normal
    dir.copy(vNorm).negate();
    // Offset slightly inside to avoid self-surface false hits
    origin.addScaledVector(dir, 0.05);

    raycaster.set(origin, dir);
    raycaster.near = 0.05;
    raycaster.far = 15.0; // Check up to 15mm

    const hits = raycaster.intersectObject(tempMesh, false);
    let dist = 10.0;
    if (hits.length > 0) {
      dist = hits[0].distance + 0.05;
    }

    if (dist < minThicknessMm) minThicknessMm = dist;

    // Apply color to sampled window
    for (let k = i; k < Math.min(i + step, vertexCount); k++) {
      if (dist < thresholdMm) {
        // Red warning for < 0.8 mm
        colors[k * 3] = 0.95;     // R
        colors[k * 3 + 1] = 0.15; // G
        colors[k * 3 + 2] = 0.15; // B
        thinCount++;
      } else if (dist < 1.2) {
        // Amber warning for 0.8mm - 1.2mm
        colors[k * 3] = 0.95;
        colors[k * 3 + 1] = 0.65;
        colors[k * 3 + 2] = 0.1;
      } else {
        // Healthy polymer thickness
        colors[k * 3] = 0.0;
        colors[k * 3 + 1] = 0.82;
        colors[k * 3 + 2] = 0.99;
      }
    }
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return {
    thinCount,
    minThicknessMm: minThicknessMm === 999.0 ? 1.5 : Math.round(minThicknessMm * 100) / 100,
  };
}

/**
 * Optimal Build Orientation Algorithm:
 * Rotates geometry to minimize vertical Z height (fewer layers & less support)
 * while maximizing bed contact stability on the Torrijos build plate.
 */
export function optimizePieceOrientation(geometry: THREE.BufferGeometry): {
  rotation: [number, number, number];
  heightReductionPercent: number;
} {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox || new THREE.Box3();
  const originalSize = new THREE.Vector3();
  box.getSize(originalSize);

  // The 3 axis dimensions
  const dims = [
    { axis: 'x', val: originalSize.x },
    { axis: 'y', val: originalSize.y },
    { axis: 'z', val: originalSize.z },
  ];

  // Find the smallest dimension to orient along Z
  dims.sort((a, b) => a.val - b.val);
  const minDim = dims[0];

  let rotX = 0;
  let rotY = 0;
  let rotZ = 0;

  if (minDim.axis === 'x') {
    // Rotate 90 deg around Y to put X on Z
    rotY = Math.PI / 2;
  } else if (minDim.axis === 'y') {
    // Rotate 90 deg around X to put Y on Z
    rotX = -Math.PI / 2;
  }

  // Apply rotation
  if (rotX !== 0 || rotY !== 0 || rotZ !== 0) {
    const euler = new THREE.Euler(rotX, rotY, rotZ, 'XYZ');
    const rotMatrix = new THREE.Matrix4().makeRotationFromEuler(euler);
    geometry.applyMatrix4(rotMatrix);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.center();
  }

  const newSize = new THREE.Vector3();
  geometry.boundingBox?.getSize(newSize);

  const heightReduction = Math.max(0, Math.round(((originalSize.z - newSize.z) / Math.max(originalSize.z, 1)) * 100));

  return {
    rotation: [rotX, rotY, rotZ],
    heightReductionPercent: heightReduction,
  };
}

/**
 * Parses STL ArrayBuffer, computes geometry bounding box, volume, area, and thickness analysis.
 */
export function parseStlBuffer(
  buffer: ArrayBuffer,
  fileName: string,
  units: MeasurementUnit = 'mm'
): ParseStlResult {
  const loader = new STLLoader();
  const geometry = loader.parse(buffer);

  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  const box = geometry.boundingBox || new THREE.Box3();
  const sizeMm = new THREE.Vector3();
  box.getSize(sizeMm);

  const { volumeMm3, areaMm2 } = calculateVolumeAndArea(geometry);

  const unitScale = units === 'in' ? 1 / 25.4 : 1;
  const isWatertight = volumeMm3 > 0.001;

  const volumeCm3 = volumeMm3 / 1000.0;
  const areaCm2 = areaMm2 / 100.0;

  const positionAttr = geometry.getAttribute('position');
  const indexAttr = geometry.getIndex();
  const triangleCount = indexAttr ? indexAttr.count / 3 : (positionAttr ? positionAttr.count / 3 : 0);

  // Center geometry
  geometry.center();

  // Run initial wall thickness inspection
  const { thinCount, minThicknessMm } = analyzeWallThickness(geometry, 0.8);

  const metrics: StlMetrics = {
    fileName,
    fileSizeBytes: buffer.byteLength,
    triangleCount: Math.round(triangleCount),
    volumeCm3: Math.round(volumeCm3 * 100) / 100,
    areaCm2: Math.round(areaCm2 * 100) / 100,
    boundingBox: {
      x: Math.round(sizeMm.x * unitScale * 10) / 10,
      y: Math.round(sizeMm.y * unitScale * 10) / 10,
      z: Math.round(sizeMm.z * unitScale * 10) / 10,
    },
    units,
    isWatertight,
    minThicknessDetectedMm: minThicknessMm,
  };

  return { geometry, metrics, thinWallCount: thinCount };
}

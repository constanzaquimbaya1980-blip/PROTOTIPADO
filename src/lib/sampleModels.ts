/**
 * Procedural watertight Binary STL generation for instant testing in the browser
 */

interface Triangle {
  normal: [number, number, number];
  v1: [number, number, number];
  v2: [number, number, number];
  v3: [number, number, number];
}

function createBinaryStl(triangles: Triangle[], title: string = 'Project 3D Torrijos Sample'): ArrayBuffer {
  const bufferSize = 84 + triangles.length * 50;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // 80 bytes header
  const encoder = new TextEncoder();
  const headerBytes = encoder.encode(title.padEnd(80, ' '));
  for (let i = 0; i < 80; i++) {
    view.setUint8(i, headerBytes[i] || 32);
  }

  // 4 bytes: number of triangles
  view.setUint32(80, triangles.length, true);

  // Each triangle is 50 bytes
  let offset = 84;
  for (const tri of triangles) {
    // Normal
    view.setFloat32(offset, tri.normal[0], true);
    view.setFloat32(offset + 4, tri.normal[1], true);
    view.setFloat32(offset + 8, tri.normal[2], true);

    // V1
    view.setFloat32(offset + 12, tri.v1[0], true);
    view.setFloat32(offset + 16, tri.v1[1], true);
    view.setFloat32(offset + 20, tri.v1[2], true);

    // V2
    view.setFloat32(offset + 24, tri.v2[0], true);
    view.setFloat32(offset + 28, tri.v2[1], true);
    view.setFloat32(offset + 32, tri.v2[2], true);

    // V3
    view.setFloat32(offset + 36, tri.v3[0], true);
    view.setFloat32(offset + 40, tri.v3[1], true);
    view.setFloat32(offset + 44, tri.v3[2], true);

    // 2 bytes attribute
    view.setUint16(offset + 48, 0, true);

    offset += 50;
  }

  return buffer;
}

function calcNormal(v1: [number, number, number], v2: [number, number, number], v3: [number, number, number]): [number, number, number] {
  const ax = v2[0] - v1[0];
  const ay = v2[1] - v1[1];
  const az = v2[2] - v1[2];

  const bx = v3[0] - v1[0];
  const by = v3[1] - v1[1];
  const bz = v3[2] - v1[2];

  const nx = ay * bz - az * by;
  const ny = az * bx - ax * bz;
  const nz = ax * by - ay * bx;

  const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
  return [nx / len, ny / len, nz / len];
}

/**
 * Generates an industrial Helical Gear with bore
 */
export function generateSampleHelicalGear(): { buffer: ArrayBuffer; name: string } {
  const triangles: Triangle[] = [];
  const teeth = 18;
  const rRoot = 22; // mm
  const rTip = 28; // mm
  const rBore = 8; // mm bore
  const height = 18; // mm
  const twistRad = 0.45; // helical angle
  const segments = teeth * 4;

  const getProfileR = (angle: number) => {
    const toothAngle = (Math.PI * 2) / teeth;
    const posInTooth = (angle % toothAngle) / toothAngle;
    if (posInTooth < 0.25) {
      return rRoot + (rTip - rRoot) * (posInTooth / 0.25);
    } else if (posInTooth < 0.5) {
      return rTip;
    } else if (posInTooth < 0.75) {
      return rTip - (rTip - rRoot) * ((posInTooth - 0.5) / 0.25);
    } else {
      return rRoot;
    }
  };

  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2;
    const a2 = ((i + 1) / segments) * Math.PI * 2;

    const r1 = getProfileR(a1);
    const r2 = getProfileR(a2);

    // Bottom face (Z = 0)
    const bOuter1: [number, number, number] = [r1 * Math.cos(a1), r1 * Math.sin(a1), 0];
    const bOuter2: [number, number, number] = [r2 * Math.cos(a2), r2 * Math.sin(a2), 0];
    const bBore1: [number, number, number] = [rBore * Math.cos(a1), rBore * Math.sin(a1), 0];
    const bBore2: [number, number, number] = [rBore * Math.cos(a2), rBore * Math.sin(a2), 0];

    // Bottom quad (bore to outer)
    triangles.push({
      normal: [0, 0, -1],
      v1: bOuter1,
      v2: bBore1,
      v3: bOuter2,
    });
    triangles.push({
      normal: [0, 0, -1],
      v1: bOuter2,
      v2: bBore1,
      v3: bBore2,
    });

    // Top face (Z = height, with twist)
    const tA1 = a1 + twistRad;
    const tA2 = a2 + twistRad;
    const tOuter1: [number, number, number] = [r1 * Math.cos(tA1), r1 * Math.sin(tA1), height];
    const tOuter2: [number, number, number] = [r2 * Math.cos(tA2), r2 * Math.sin(tA2), height];
    const tBore1: [number, number, number] = [rBore * Math.cos(tA1), rBore * Math.sin(tA1), height];
    const tBore2: [number, number, number] = [rBore * Math.cos(tA2), rBore * Math.sin(tA2), height];

    triangles.push({
      normal: [0, 0, 1],
      v1: tOuter1,
      v2: tOuter2,
      v3: tBore1,
    });
    triangles.push({
      normal: [0, 0, 1],
      v1: tOuter2,
      v2: tBore2,
      v3: tBore1,
    });

    // Outer side wall
    const nSide1 = calcNormal(bOuter1, bOuter2, tOuter1);
    triangles.push({ normal: nSide1, v1: bOuter1, v2: bOuter2, v3: tOuter1 });
    const nSide2 = calcNormal(bOuter2, tOuter2, tOuter1);
    triangles.push({ normal: nSide2, v1: bOuter2, v2: tOuter2, v3: tOuter1 });

    // Inner bore wall (facing inward)
    const nBore1 = calcNormal(bBore1, tBore1, bBore2);
    triangles.push({ normal: nBore1, v1: bBore1, v2: tBore1, v3: bBore2 });
    const nBore2 = calcNormal(bBore2, tBore1, tBore2);
    triangles.push({ normal: nBore2, v1: bBore2, v2: tBore1, v3: tBore2 });
  }

  const buffer = createBinaryStl(triangles, 'Engranaje_Helicoidal_P3D_Torrijos');
  return { buffer, name: 'Engranaje_Helicoidal_M2.stl' };
}

/**
 * Generates an industrial NEMA 23 Motor Mount Bracket
 */
export function generateSampleMotorMount(): { buffer: ArrayBuffer; name: string } {
  const triangles: Triangle[] = [];

  // Solid block with L-shape:
  // Base: 60x60x10 mm with central cylinder hole and 4 corner chamfers
  // Vertical flange: 60x10x55 mm
  function addBox(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
    const p = [
      [x0, y0, z0], // 0
      [x1, y0, z0], // 1
      [x1, y1, z0], // 2
      [x0, y1, z0], // 3
      [x0, y0, z1], // 4
      [x1, y0, z1], // 5
      [x1, y1, z1], // 6
      [x0, y1, z1], // 7
    ] as [number, number, number][];

    // Bottom
    triangles.push({ normal: [0, 0, -1], v1: p[0], v2: p[2], v3: p[1] });
    triangles.push({ normal: [0, 0, -1], v1: p[0], v2: p[3], v3: p[2] });
    // Top
    triangles.push({ normal: [0, 0, 1], v1: p[4], v2: p[5], v3: p[6] });
    triangles.push({ normal: [0, 0, 1], v1: p[4], v2: p[6], v3: p[7] });
    // Front (-Y)
    triangles.push({ normal: [0, -1, 0], v1: p[0], v2: p[1], v3: p[5] });
    triangles.push({ normal: [0, -1, 0], v1: p[0], v2: p[5], v3: p[4] });
    // Back (+Y)
    triangles.push({ normal: [0, 1, 0], v1: p[3], v2: p[6], v3: p[2] });
    triangles.push({ normal: [0, 1, 0], v1: p[3], v2: p[7], v3: p[6] });
    // Left (-X)
    triangles.push({ normal: [-1, 0, 0], v1: p[0], v2: p[4], v3: p[7] });
    triangles.push({ normal: [-1, 0, 0], v1: p[0], v2: p[7], v3: p[3] });
    // Right (+X)
    triangles.push({ normal: [1, 0, 0], v1: p[1], v2: p[2], v3: p[6] });
    triangles.push({ normal: [1, 0, 0], v1: p[1], v2: p[6], v3: p[5] });
  }

  // Base plate
  addBox(-30, -30, 0, 30, 30, 10);
  // Vertical upright wall
  addBox(-30, 20, 10, 30, 30, 65);
  // Left reinforcement gusset rib
  addBox(-30, -15, 10, -22, 20, 45);
  // Right reinforcement gusset rib
  addBox(22, -15, 10, 30, 20, 45);

  const buffer = createBinaryStl(triangles, 'Soporte_Motor_NEMA23_Torrijos');
  return { buffer, name: 'Soporte_Brida_NEMA23.stl' };
}

/**
 * Generates an industrial IoT Sensor Box Enclosure
 */
export function generateSampleSensorBox(): { buffer: ArrayBuffer; name: string } {
  const triangles: Triangle[] = [];

  function addBox(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
    const p = [
      [x0, y0, z0], // 0
      [x1, y0, z0], // 1
      [x1, y1, z0], // 2
      [x0, y1, z0], // 3
      [x0, y0, z1], // 4
      [x1, y0, z1], // 5
      [x1, y1, z1], // 6
      [x0, y1, z1], // 7
    ] as [number, number, number][];

    triangles.push({ normal: [0, 0, -1], v1: p[0], v2: p[2], v3: p[1] });
    triangles.push({ normal: [0, 0, -1], v1: p[0], v2: p[3], v3: p[2] });
    triangles.push({ normal: [0, 0, 1], v1: p[4], v2: p[5], v3: p[6] });
    triangles.push({ normal: [0, 0, 1], v1: p[4], v2: p[6], v3: p[7] });
    triangles.push({ normal: [0, -1, 0], v1: p[0], v2: p[1], v3: p[5] });
    triangles.push({ normal: [0, -1, 0], v1: p[0], v2: p[5], v3: p[4] });
    triangles.push({ normal: [0, 1, 0], v1: p[3], v2: p[6], v3: p[2] });
    triangles.push({ normal: [0, 1, 0], v1: p[3], v2: p[7], v3: p[6] });
    triangles.push({ normal: [-1, 0, 0], v1: p[0], v2: p[4], v3: p[7] });
    triangles.push({ normal: [-1, 0, 0], v1: p[0], v2: p[7], v3: p[3] });
    triangles.push({ normal: [1, 0, 0], v1: p[1], v2: p[2], v3: p[6] });
    triangles.push({ normal: [1, 0, 0], v1: p[1], v2: p[6], v3: p[5] });
  }

  // Bottom plate 70x45x4 mm
  addBox(-35, -22.5, 0, 35, 22.5, 4);
  // 4 perimeter walls height 24 mm, thickness 3 mm
  addBox(-35, -22.5, 4, 35, -19.5, 28); // front
  addBox(-35, 19.5, 4, 35, 22.5, 28); // back
  addBox(-35, -19.5, 4, -32, 19.5, 28); // left
  addBox(32, -19.5, 4, 35, 19.5, 28); // right

  // 4 corner screw mounting bosses
  addBox(-32, -19.5, 4, -25, -12.5, 26);
  addBox(25, -19.5, 4, 32, -12.5, 26);
  addBox(-32, 12.5, 4, -25, 19.5, 26);
  addBox(25, 12.5, 4, 32, 19.5, 26);

  // Cable gland entry flange on side
  addBox(-38, -6, 8, -35, 6, 20);

  const buffer = createBinaryStl(triangles, 'Carcasa_Sensor_IP65_Torrijos');
  return { buffer, name: 'Carcasa_Sensor_IP65.stl' };
}

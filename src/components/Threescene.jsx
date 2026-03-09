import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Camera position + look-at target per section
const WAYPTS = [
  { p: [0, 1.5, 16], l: [0, 0, 0] },
  { p: [-3, 2, 8], l: [0, .5, -2] },
  { p: [4, .5, 3], l: [0, 0, -6] },
  { p: [0, 4, 2], l: [0, 0, -8] },
];

export default function ThreeScene({ curSec }) {
  const canvasRef = useRef(null);
  const camTargetRef = useRef({ x: 0, y: 1.5, z: 16, lx: 0, ly: 0, lz: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const initRef = useRef(false);
  const rafRef = useRef(null);

  // Sync camera target whenever the active section changes
  useEffect(() => {
    const w = WAYPTS[curSec];
    camTargetRef.current = { x: w.p[0], y: w.p[1], z: w.p[2], lx: w.l[0], ly: w.l[1], lz: w.l[2] };
  }, [curSec]);

  // Initialize Three.js exactly once
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const canvas = canvasRef.current;
    const R = new THREE.WebGLRenderer({ canvas, antialias: true });
    R.setPixelRatio(Math.min(devicePixelRatio, 2));
    R.setClearColor(0x000510, 1);
    R.setSize(innerWidth, innerHeight);

    const S = new THREE.Scene();
    S.fog = new THREE.FogExp2(0x000510, 0.016);

    const CAM = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 600);
    CAM.position.set(0, 1.5, 16);

    // ── Radial glow sprite texture ──
    const makeGlowTex = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.35, 'rgba(255,255,255,0.65)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    };
    const pTex = makeGlowTex();

    // ── Ambient particle field ──
    const PN = 5500;
    const pG = new THREE.BufferGeometry();
    const pP = new Float32Array(PN * 3);
    const pV = new Float32Array(PN * 3);
    for (let i = 0; i < PN; i++) {
      pP[i * 3] = (Math.random() - 0.5) * 140;
      pP[i * 3 + 1] = (Math.random() - 0.5) * 65;
      pP[i * 3 + 2] = (Math.random() - 0.5) * 140;
      pV[i * 3] = (Math.random() - 0.5) * 0.009;
      pV[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      pV[i * 3 + 2] = (Math.random() - 0.5) * 0.009;
    }
    pG.setAttribute('position', new THREE.BufferAttribute(pP, 3));
    S.add(new THREE.Points(pG, new THREE.PointsMaterial({
      size: 0.1, map: pTex, alphaTest: 0.005, transparent: true,
      color: new THREE.Color(0x00d4ff),
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.72,
    })));

    // ── Orbital ring around icosahedron ──
    const RN = 280;
    const rG = new THREE.BufferGeometry();
    const rP = new Float32Array(RN * 3);
    for (let i = 0; i < RN; i++) {
      const a = (i / RN) * Math.PI * 2;
      const r = 3.4 + (Math.random() - 0.5) * 0.6;
      rP[i * 3] = Math.cos(a) * r;
      rP[i * 3 + 1] = (Math.random() - 0.5) * 0.45;
      rP[i * 3 + 2] = Math.sin(a) * r;
    }
    rG.setAttribute('position', new THREE.BufferAttribute(rP, 3));
    const ring = new THREE.Points(rG, new THREE.PointsMaterial({
      size: 0.07, map: pTex, alphaTest: 0.005, transparent: true,
      color: new THREE.Color(0x00d4ff),
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9,
    }));
    ring.position.set(0, 1, 0);
    S.add(ring);

    // ── Perspective grid floor ──
    const gVerts = [];
    for (let i = -90; i <= 90; i += 4) {
      gVerts.push(i, -4, -90, i, -4, 90);
      gVerts.push(-90, -4, i, 90, -4, i);
    }
    const gG = new THREE.BufferGeometry();
    gG.setAttribute('position', new THREE.Float32BufferAttribute(gVerts, 3));
    S.add(new THREE.LineSegments(gG, new THREE.LineBasicMaterial({ color: 0x001428, transparent: true, opacity: 0.5 })));

    // ── Helper: wireframe from geometry ──
    const wire = (geo, col, op) => new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })
    );

    // ── Main icosahedron ──
    const ico = wire(new THREE.IcosahedronGeometry(2.5, 1), 0x00d4ff, 0.58);
    ico.position.set(0, 1, 0);
    S.add(ico);
    // Soft glow sphere behind it
    S.add(new THREE.Mesh(
      new THREE.SphereGeometry(3.9, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x001a30, transparent: true, opacity: 0.22, side: THREE.BackSide })
    ));

    // ── Scattered floating shapes ──
    const shapes = [];
    const shapeDefs = [
      [new THREE.OctahedronGeometry(1.1, 0), -9, 0, -8, 0x6600ff, 0.45],
      [new THREE.OctahedronGeometry(0.7, 0), 8, -1, -6, 0x00d4ff, 0.4],
      [new THREE.TetrahedronGeometry(1.2, 0), -6, 3, 4, 0xff1166, 0.32],
      [new THREE.IcosahedronGeometry(0.85, 0), 10, 2, -13, 0x6600ff, 0.38],
      [new THREE.OctahedronGeometry(1.5, 0), -12, 1, -3, 0x00d4ff, 0.28],
      [new THREE.IcosahedronGeometry(1, 0), 3, -2, 6, 0x6600ff, 0.32],
      [new THREE.TorusGeometry(1.5, 0.055, 6, 22), 6, 0.5, 2, 0x00d4ff, 0.38],
      [new THREE.TorusGeometry(2.1, 0.046, 6, 30), -5, -2, -11, 0x6600ff, 0.26],
      [new THREE.OctahedronGeometry(0.55, 0), -2, 4, -5, 0x00d4ff, 0.5],
    ];
    shapeDefs.forEach(([geo, x, y, z, col, op]) => {
      const m = wire(geo, col, op);
      m.position.set(x, y, z);
      m.userData = { baseY: y, phase: Math.random() * Math.PI * 2 };
      S.add(m);
      shapes.push(m);
    });

    // ── Neon vertical poles ──
    const makePole = (x, z, c) => {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -4, z),
        new THREE.Vector3(x, 16, z),
      ]);
      return new THREE.Line(g, new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending }));
    };
    [[-22, -30, 0x00d4ff], [22, -30, 0x6600ff], [-22, 30, 0x6600ff],
    [22, 30, 0x00d4ff], [-14, -30, 0x00d4ff], [14, -30, 0x6600ff]]
      .forEach(([x, z, c]) => S.add(makePole(x, z, c)));

    // ── Neon horizontal bars ──
    const makeBar = (y, z, c, o) => {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-22, y, z),
        new THREE.Vector3(22, y, z),
      ]);
      return new THREE.Line(g, new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending }));
    };
    S.add(makeBar(9, -30, 0x00d4ff, 0.2));
    S.add(makeBar(-4, -30, 0x6600ff, 0.18));
    S.add(makeBar(4, 30, 0x00d4ff, 0.16));

    // ── Animation loop ──
    const lookV = new THREE.Vector3();
    const clock = new THREE.Clock();

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const ct = camTargetRef.current;
      const m = mouseRef.current;

      // Rotate & pulse main icosahedron
      ico.rotation.y = t * 0.13;
      ico.rotation.x = t * 0.055;
      ico.material.opacity = 0.42 + Math.sin(t * 0.9) * 0.14;

      // Spin orbital ring
      ring.rotation.y = t * 0.22;
      ring.rotation.x = Math.sin(t * 0.08) * 0.28;

      // Float + spin scattered shapes
      shapes.forEach((sh, i) => {
        sh.rotation.y += 0.0035 * (i % 2 ? 1 : -1);
        sh.rotation.x += 0.0025;
        sh.position.y = sh.userData.baseY + Math.sin(t * 0.32 + sh.userData.phase) * 0.28;
      });

      // Drift ambient particles (wrapping boundaries)
      for (let i = 0; i < PN; i++) {
        pP[i * 3] += pV[i * 3];
        pP[i * 3 + 1] += pV[i * 3 + 1];
        pP[i * 3 + 2] += pV[i * 3 + 2];
        if (pP[i * 3] > 70) pP[i * 3] -= 140;
        if (pP[i * 3] < -70) pP[i * 3] += 140;
        if (pP[i * 3 + 1] > 32) pP[i * 3 + 1] -= 64;
        if (pP[i * 3 + 1] < -32) pP[i * 3 + 1] += 64;
        if (pP[i * 3 + 2] > 70) pP[i * 3 + 2] -= 140;
        if (pP[i * 3 + 2] < -70) pP[i * 3 + 2] += 140;
      }
      pG.attributes.position.needsUpdate = true;

      // Smooth camera lerp to section target + mouse parallax
      CAM.position.x += (ct.x + m.x * 1.8 - CAM.position.x) * 0.05;
      CAM.position.y += (ct.y + m.y * 0.9 - CAM.position.y) * 0.05;
      CAM.position.z += (ct.z - CAM.position.z) * 0.05;
      lookV.set(ct.lx, ct.ly, ct.lz);
      CAM.lookAt(lookV);

      R.render(S, CAM);
    };
    animate();

    // Mouse parallax
    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', onMouseMove);

    // Responsive resize
    const onResize = () => {
      CAM.aspect = innerWidth / innerHeight;
      CAM.updateProjectionMatrix();
      R.setSize(innerWidth, innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      R.dispose();
    };
  }, []); // empty deps — runs once

  return <canvas id="c" ref={canvasRef} />;
}
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/** Rough angular centers (lat, lon in degrees) + radius (degrees) for the
 *  major landmasses, used to bias dot density so the point cloud reads as a
 *  recognizable world map rather than a uniform sphere. Stylized, not GIS-
 *  accurate - this is decorative chrome, not a data layer. */
const LAND_BLOBS: { lat: number; lon: number; radius: number; weight: number }[] = [
  { lat: 50, lon: -100, radius: 22, weight: 1 }, // N. America
  { lat: 30, lon: -95, radius: 14, weight: 0.8 },
  { lat: 60, lon: -100, radius: 16, weight: 0.7 }, // Canada
  { lat: 72, lon: -40, radius: 10, weight: 0.6 }, // Greenland
  { lat: -10, lon: -60, radius: 16, weight: 0.9 }, // S. America
  { lat: -30, lon: -65, radius: 12, weight: 0.7 },
  { lat: 50, lon: 12, radius: 12, weight: 0.9 }, // Europe
  { lat: 60, lon: 40, radius: 12, weight: 0.6 },
  { lat: 15, lon: 18, radius: 18, weight: 0.85 }, // N. Africa
  { lat: -15, lon: 25, radius: 16, weight: 0.8 }, // S. Africa
  { lat: 55, lon: 90, radius: 24, weight: 0.8 }, // Siberia
  { lat: 32, lon: 105, radius: 16, weight: 0.9 }, // China
  { lat: 20, lon: 78, radius: 12, weight: 0.85 }, // India
  { lat: 42, lon: 62, radius: 14, weight: 0.6 }, // Central Asia
  { lat: 28, lon: 46, radius: 12, weight: 0.6 }, // Middle East
  { lat: 55, lon: 25, radius: 10, weight: 0.5 }, // E. Europe
  { lat: -25, lon: 135, radius: 14, weight: 0.75 }, // Australia
  { lat: 33, lon: 138, radius: 8, weight: 0.6 }, // Japan
  { lat: 5, lon: 110, radius: 10, weight: 0.55 }, // Indonesia
];

const POINT_COUNT = 5200;

function landDensity(latDeg: number, lonDeg: number): number {
  let intensity = 0;
  for (const blob of LAND_BLOBS) {
    const dLat = latDeg - blob.lat;
    let dLon = lonDeg - blob.lon;
    if (dLon > 180) dLon -= 360;
    if (dLon < -180) dLon += 360;
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    intensity += blob.weight * Math.exp(-(dist * dist) / (2 * blob.radius * blob.radius));
  }
  return intensity;
}

function buildGlobeGeometry(radius: number) {
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];

  const violet = new THREE.Color("#7c5cff");
  const magenta = new THREE.Color("#e64980");
  const blue = new THREE.Color("#4f7cff");
  const dim = new THREE.Color("#3a4256");

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < POINT_COUNT; i++) {
    const y = 1 - (i / (POINT_COUNT - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    const latDeg = (Math.asin(y) * 180) / Math.PI;
    const lonDeg = (Math.atan2(z, x) * 180) / Math.PI;
    const density = landDensity(latDeg, lonDeg);

    // Sparse ocean dots for the sphere's silhouette; dense, brighter land dots.
    const isLand = density > 0.22;
    if (!isLand && i % 3 !== 0) continue;

    positions.push(x * radius, y * radius, z * radius);

    const mix = THREE.MathUtils.clamp((x + 1) / 2, 0, 1);
    const landColor = violet.clone().lerp(magenta, mix).lerp(blue, Math.max(0, y * 0.4));
    const color = isLand ? landColor : dim;
    colors.push(color.r, color.g, color.b);
    sizes.push(isLand ? 2.6 + density * 1.4 : 1.1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  return geometry;
}

function dotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.9)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function GlobePoints({ spinning }: { spinning: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => buildGlobeGeometry(2), []);
  const texture = useMemo(() => dotTexture(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (spinning) {
      groupRef.current.rotation.y += delta * 0.06;
    }
    const pointer = state.pointer;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.12,
      0.03
    );
  });

  return (
    <group ref={groupRef} rotation={[0.15, 0, 0.4]}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.045}
          vertexColors
          map={texture}
          transparent
          alphaTest={0.01}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      {/* Limb glow: slightly larger backside-lit sphere, additive blend. */}
      <mesh>
        <sphereGeometry args={[2.08, 48, 48]} />
        <meshBasicMaterial
          color="#7c5cff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Scene(props: ThreeElements["group"] & { spinning: boolean }) {
  const { spinning } = props;
  return (
    <>
      <ambientLight intensity={0.6} />
      <GlobePoints spinning={spinning} />
    </>
  );
}

/** Hero centerpiece: a glowing dot/particle 3D globe rendered with three.js
 *  via react-three-fiber. Client-only (mounted through a dynamic import with
 *  ssr:false, see usage in the homepage) - never runs during SSR. Rotation
 *  auto-pauses under prefers-reduced-motion. */
export default function ParticleGlobe() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden pt-24"
      aria-hidden
    >
      <div className="hero-atmosphere absolute h-[34rem] w-[34rem] rounded-full opacity-60" />
      <div className="relative h-[28rem] w-[28rem]">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.75]}
        >
          <Scene spinning={!reduce} />
        </Canvas>
      </div>
    </div>
  );
}

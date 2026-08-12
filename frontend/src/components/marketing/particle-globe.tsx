"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useSettings } from "@/providers/providers/settings-provider";

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

function buildGlobeGeometry(radius: number, isLight: boolean) {
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];

  // Dark mode: bright neon land dots glowing against near-black.
  // Light mode reads as ink stipple on warm paper instead: deep, saturated
  // continents (matching the --color-voyager-* light overrides in
  // globals.css) with much fainter oceans, so landmasses carry the image
  // and the silhouette is held by the guide ring rather than a muddy field
  // of mid-grey dots competing with the near-black headline over it.
  const violet = new THREE.Color(isLight ? "#3f2f9e" : "#7c5cff");
  const magenta = new THREE.Color(isLight ? "#a52a63" : "#e64980");
  const blue = new THREE.Color(isLight ? "#1f4bc4" : "#4f7cff");
  const dim = new THREE.Color(isLight ? "#b3bad0" : "#3a4256");

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

    // Ocean dots are dimmer/smaller than land, but every point is kept (not
    // thinned to 1-in-3 as before) - a sparse, ragged silhouette rim was the
    // main reason the globe read as not-quite-circular rather than a clean
    // sphere outline.
    const isLand = density > 0.22;

    positions.push(x * radius, y * radius, z * radius);

    const mix = THREE.MathUtils.clamp((x + 1) / 2, 0, 1);
    const landColor = violet.clone().lerp(magenta, mix).lerp(blue, Math.max(0, y * 0.4));
    const color = isLand ? landColor : dim;
    colors.push(color.r, color.g, color.b);
    // Light mode widens the land/ocean size gap (bigger land, smaller ocean)
    // to reinforce the ink-on-paper read; dark mode keeps its existing balance.
    sizes.push(
      isLand
        ? (isLight ? 3.0 + density * 1.6 : 2.6 + density * 1.4)
        : (isLight ? 0.85 : 1.1)
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  return geometry;
}

/** Soft round sprite for each dot. Dark mode keeps a wide, glowy falloff
 *  (the halo *is* the look against black). Light mode uses a much crisper
 *  core with a short falloff - a soft glow on a light background just reads
 *  as a blurry smudge, whereas a hard-edged dot reads as deliberate ink. */
function dotTexture(crisp: boolean) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  if (crisp) {
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.62, "rgba(255,255,255,1)");
    gradient.addColorStop(0.82, "rgba(255,255,255,0.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
  } else {
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.9)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function GlobePoints({ spinning, isLight }: { spinning: boolean; isLight: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => buildGlobeGeometry(2, isLight), [isLight]);
  const texture = useMemo(() => dotTexture(isLight), [isLight]);

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
      {/* Limb glow: slightly larger backside-lit sphere. Additive blend
          brightens toward white, which *weakens* contrast on a light
          background - light mode swaps to normal blending with a darker,
          lower-opacity tint so it reads as a soft depth/shadow halo instead
          of a glow that fights the page. */}
      <mesh>
        <sphereGeometry args={[2.08, 48, 48]} />
        <meshBasicMaterial
          color={isLight ? "#4b3f8a" : "#7c5cff"}
          transparent
          opacity={isLight ? 0.05 : 0.06}
          side={THREE.BackSide}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Scene(props: ThreeElements["group"] & { spinning: boolean; isLight: boolean }) {
  const { spinning, isLight } = props;
  return (
    <>
      <ambientLight intensity={0.6} />
      <GlobePoints spinning={spinning} isLight={isLight} />
    </>
  );
}

/** Hero centerpiece: a glowing dot/particle 3D globe rendered with three.js
 *  via react-three-fiber. Client-only (mounted through a dynamic import with
 *  ssr:false, see usage in the homepage) - never runs during SSR. Rotation
 *  auto-pauses under prefers-reduced-motion. Dot/glow/ring colors branch on
 *  the resolved theme (see globals.css's html.light --color-voyager-*
 *  overrides for the CSS-reachable half of this) since Three.js material
 *  props and inline styles can't pick up CSS custom properties on their own. */
export default function ParticleGlobe() {
  const reduce = useReducedMotion();
  const { resolvedTheme } = useSettings();
  const isLight = resolvedTheme === "light";

  return (
    <div
      // Same -translate-y offset as the hero text block (see (public)/page.tsx)
      // so the globe centers on the exact same point as the headline/copy
      // instead of drifting apart (padding-top and a transform shift a
      // flex-centered element by different amounts for the same value).
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden -translate-y-8 sm:-translate-y-12"
      aria-hidden
    >
      <div className="hero-atmosphere absolute h-[34rem] w-[34rem] rounded-full opacity-60" />
      <div className="relative h-[28rem] w-[28rem]">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.75]}
        >
          <Scene spinning={!reduce} isLight={isLight} />
        </Canvas>
        {/* A sparse point cloud has no continuous edge of its own - individual
            dot gaps/size variation make the silhouette read as uneven rather
            than a clean circle. This thin guide sits exactly at the sphere's
            true projected radius (2 / (5.2 * tan(22.5deg)) ~= 92.85% of this
            container, i.e. 26rem of 28rem - matches the Canvas's own camera
            math above) so the eye has an unambiguous circular edge. The
            light-lavender dark-mode border is nearly invisible on a light
            background, so light mode swaps to a darker, visible indigo. */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={
            isLight
              ? {
                  border: "1px solid rgba(70, 55, 130, 0.22)",
                  boxShadow: "0 0 20px 1px rgba(70, 55, 130, 0.08)",
                }
              : {
                  border: "1px solid rgba(180, 160, 255, 0.18)",
                  boxShadow: "0 0 28px 1px rgba(124, 92, 255, 0.1)",
                }
          }
          aria-hidden
        />
      </div>
    </div>
  );
}

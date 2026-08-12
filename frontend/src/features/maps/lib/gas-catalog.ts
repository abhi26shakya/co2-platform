/** Shared gas metadata for the map's legend and layer-control panels — single source of truth so
 *  the two can't drift (label/color/range shown in the legend must match what the layer toggle
 *  says). Only CO₂ is measured from real satellite data; the rest are simulated visualization
 *  layers derived from that same signal — see gas-plume.ts's getGasPlumes. */
export interface GasDef {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  range: string;
  gradient: string;
}

export const GASES: GasDef[] = [
  { id: "co2", label: "Carbon Dioxide (CO₂)", shortLabel: "CO₂", color: "bg-red-500", range: "380 - 450 ppm", gradient: "from-red-600 to-red-400" },
  { id: "ch4", label: "Methane (CH₄)", shortLabel: "CH₄", color: "bg-purple-500", range: "1800 - 2200 ppb", gradient: "from-purple-600 to-purple-400" },
  { id: "no2", label: "Nitrogen Dioxide (NO₂)", shortLabel: "NO₂", color: "bg-orange-500", range: "0 - 150 ppb", gradient: "from-orange-600 to-orange-400" },
  { id: "so2", label: "Sulfur Dioxide (SO₂)", shortLabel: "SO₂", color: "bg-pink-500", range: "0 - 80 ppb", gradient: "from-pink-600 to-pink-400" },
  { id: "co", label: "Carbon Monoxide (CO)", shortLabel: "CO", color: "bg-teal-500", range: "50 - 200 ppb", gradient: "from-teal-600 to-teal-400" },
];

export function gasById(id: string): GasDef | undefined {
  return GASES.find((g) => g.id === id);
}

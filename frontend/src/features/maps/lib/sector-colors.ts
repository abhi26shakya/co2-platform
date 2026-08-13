/**
 * Categorical color palette keyed by industrial sector, modeled on Climate TRACE's
 * teal/purple/orange/gold sector-coloring scheme. Sector values themselves come from
 * `enrichPlants()` (enrich-plants.ts) - a documented placeholder for backend fields that don't
 * exist yet (see backend/app/schemas/geo.py PlantOut). This module only owns the color mapping,
 * not the sector assignment itself.
 */
export const SECTOR_COLORS: Record<string, string> = {
  "Power Combustion": "#0d9488", // teal
  "Petrochemical Refinery": "#7c3aed", // purple
  "Cement Manufacturing": "#f97316", // orange
  "Steel Processing": "#eab308", // gold
};

export const UNCLASSIFIED_SECTOR = "Unclassified";
const UNCLASSIFIED_COLOR = "#71717a"; // zinc-500

export function getSectorColorHex(sector: string | null | undefined): string {
  if (!sector) return UNCLASSIFIED_COLOR;
  return SECTOR_COLORS[sector] ?? UNCLASSIFIED_COLOR;
}

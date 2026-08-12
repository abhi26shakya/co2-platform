import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";
import type { PlantOut } from "@/types/geo";

interface Props {
  plants: PlantOut[];
  selectedCountries: Set<string>;
  selectedFuelTypes: Set<string>;
  onToggleCountry: (country: string) => void;
  onToggleFuelType: (fuelType: string) => void;
  onClear: () => void;
}

export function toggleInSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

/** Facility registry filter — country and fuel type are the only PlantOut fields the backend
 *  actually reports (see backend/app/schemas/geo.py); enrich-plants.ts's sector/company fields
 *  are documented placeholders, deliberately not offered as filters here. */
export function FacilityFilterPanel({
  plants,
  selectedCountries,
  selectedFuelTypes,
  onToggleCountry,
  onToggleFuelType,
  onClear,
}: Props) {
  const countries = Array.from(new Set(plants.map((p) => p.country))).sort();
  const fuelTypes = Array.from(new Set(plants.map((p) => p.fuel_type))).sort();
  const hasActiveFilter = selectedCountries.size > 0 || selectedFuelTypes.size > 0;

  return (
    <Card className="glass p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5" /> Facility Filters
        </h3>
        {hasActiveFilter && (
          <button onClick={onClear} className="text-[10px] text-sensor hover:underline cursor-pointer">
            Clear
          </button>
        )}
      </div>

      {countries.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider text-ground-500">Country</span>
          <div className="flex flex-wrap gap-1.5">
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => onToggleCountry(country)}
                className={`px-2 py-1 rounded-md text-[10px] border cursor-pointer transition-colors ${
                  selectedCountries.has(country)
                    ? "bg-sensor/10 border-sensor text-sensor"
                    : "border-ground-700 text-ground-400 hover:border-ground-400"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      )}

      {fuelTypes.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider text-ground-500">Fuel Type</span>
          <div className="flex flex-wrap gap-1.5">
            {fuelTypes.map((fuelType) => (
              <button
                key={fuelType}
                onClick={() => onToggleFuelType(fuelType)}
                className={`px-2 py-1 rounded-md text-[10px] border cursor-pointer capitalize transition-colors ${
                  selectedFuelTypes.has(fuelType)
                    ? "bg-sensor/10 border-sensor text-sensor"
                    : "border-ground-700 text-ground-400 hover:border-ground-400"
                }`}
              >
                {fuelType}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export function applyFacilityFilters<T extends PlantOut>(
  plants: T[],
  selectedCountries: Set<string>,
  selectedFuelTypes: Set<string>
): T[] {
  return plants.filter(
    (p) =>
      (selectedCountries.size === 0 || selectedCountries.has(p.country)) &&
      (selectedFuelTypes.size === 0 || selectedFuelTypes.has(p.fuel_type))
  );
}

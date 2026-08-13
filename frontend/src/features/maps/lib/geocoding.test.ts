import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { geocodeSearch } from "./geocoding";

const originalFetch = global.fetch;
const originalToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

beforeEach(() => {
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN = "pk.test-token";
});

afterEach(() => {
  global.fetch = originalFetch;
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN = originalToken;
  vi.restoreAllMocks();
});

describe("geocodeSearch", () => {
  it("maps Mapbox features into MapSearchResult shape", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        features: [
          {
            id: "place.123",
            place_name: "Mumbai, Maharashtra, India",
            text: "Mumbai",
            center: [72.8777, 19.076],
            place_type: ["place"],
            context: [{ id: "country.456", text: "India" }],
          },
        ],
      }),
    }) as unknown as typeof fetch;

    const results = await geocodeSearch("Mumbai", { lat: 20, lon: 78 });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      type: "place",
      name: "Mumbai",
      country: "India",
      lat: 19.076,
      lon: 72.8777,
    });
  });

  it("resolves to an empty array for a blank query without calling fetch", async () => {
    global.fetch = vi.fn();
    const results = await geocodeSearch("   ");
    expect(results).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("fails open (resolves []) when the request errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));
    const results = await geocodeSearch("Mumbai");
    expect(results).toEqual([]);
  });

  it("fails open (resolves []) on a non-200 response", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;
    const results = await geocodeSearch("Mumbai");
    expect(results).toEqual([]);
  });

  it("resolves to an empty array when no Mapbox token is configured", async () => {
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN = "";
    global.fetch = vi.fn();
    const results = await geocodeSearch("Mumbai");
    expect(results).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

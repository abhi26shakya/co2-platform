"""Fakes for CombinedPredictor's external dependencies. Never hit real
GEE/NASA/backend in tests - see app/inference/model.py's TileFetcher/
PlantLookup protocols."""
from app.clients.backend_client import NearestPlant


class FakeTileFetcher:
    def __init__(self, tile=None, raises: Exception | None = None) -> None:
        self._tile = tile
        self._raises = raises
        self.calls: list[tuple[float, float]] = []

    def fetch_no2_so2_viirs_tile(self, *, lat: float, lon: float, year: int):
        self.calls.append((lat, lon))
        if self._raises:
            raise self._raises
        # Placeholder content - fine as long as the injected scorer (e.g.
        # tests' FakeScorer) doesn't actually need real tile data. Avoids a
        # numpy dependency in the test fake itself.
        return self._tile if self._tile is not None else "fake-tile"


class FakePlantLookup:
    def __init__(self, plant: NearestPlant | None = None, raises: Exception | None = None) -> None:
        self._plant = plant
        self._raises = raises
        self.calls: list[tuple[float, float]] = []

    def nearest_plant(self, *, lat: float, lon: float, max_distance_km: float):
        self.calls.append((lat, lon))
        if self._raises:
            raise self._raises
        return self._plant

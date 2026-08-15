"""CombinedPredictor's combining logic, fully tested via fakes - never
hits real GEE/NASA/backend. See tests/fakes.py."""
from app.clients.backend_client import NearestPlant
from app.core.config import Settings
from app.core.errors import CredentialsNotConfiguredError
from app.inference.model import CombinedPredictor
from app.schemas import PredictionRequest
from tests.fakes import FakePlantLookup, FakeTileFetcher


class FakeScorer:
    def __init__(self, prob: float) -> None:
        self.prob = prob

    def score(self, tile) -> float:
        return self.prob


BOUNDS = [82.6, 24.0, 82.8, 24.2]  # centroid ~ (24.1, 82.7)


def test_no_bounds_is_unavailable():
    predictor = CombinedPredictor(
        settings=Settings(),
        tile_fetcher=FakeTileFetcher(),
        plant_lookup=FakePlantLookup(),
        cnn=FakeScorer(0.9),
    )
    result = predictor.predict(PredictionRequest(image_id="x", bounds=None))
    assert result.data_source == "unavailable"
    assert result.co2_emission_tonnes_per_year is None
    assert result.hotspots == []


def test_oco3_estimated_when_plant_nearby():
    plant = NearestPlant(
        name="Test Plant",
        distance_km=3.2,
        co2_enhancement_ppm=2.0,
        co2_emission_tonnes_per_year_estimated=4800.0,
        co2_estimate_low=3000.0,
        co2_estimate_high=6600.0,
    )
    predictor = CombinedPredictor(
        settings=Settings(),
        tile_fetcher=FakeTileFetcher(),
        plant_lookup=FakePlantLookup(plant=plant),
        cnn=FakeScorer(0.85),
    )
    result = predictor.predict(PredictionRequest(image_id="x", bounds=BOUNDS))
    assert result.data_source == "oco3_estimated"
    assert result.co2_emission_tonnes_per_year == 4800.0
    assert result.co2_estimate_low == 3000.0
    assert result.co2_estimate_high == 6600.0
    assert result.co2_ppm_enhancement == 2.0
    assert result.detection_confidence == 85.0
    assert len(result.hotspots) == 1


def test_cnn_proxy_when_no_plant_nearby_but_cnn_available():
    predictor = CombinedPredictor(
        settings=Settings(),
        tile_fetcher=FakeTileFetcher(),
        plant_lookup=FakePlantLookup(plant=None),
        cnn=FakeScorer(0.72),
    )
    result = predictor.predict(PredictionRequest(image_id="x", bounds=BOUNDS))
    assert result.data_source == "cnn_proxy"
    assert result.detection_confidence == 72.0
    assert result.co2_emission_tonnes_per_year is None
    assert result.co2_estimate_low is None
    assert result.co2_estimate_high is None
    assert len(result.hotspots) == 1


def test_unavailable_when_no_plant_and_no_cnn():
    predictor = CombinedPredictor(
        settings=Settings(),
        tile_fetcher=FakeTileFetcher(),
        plant_lookup=FakePlantLookup(plant=None),
        cnn=None,
    )
    result = predictor.predict(PredictionRequest(image_id="x", bounds=BOUNDS))
    assert result.data_source == "unavailable"
    assert result.detection_confidence == 0.0
    assert result.hotspots == []


def test_gee_not_configured_falls_back_to_zero_confidence_not_a_crash():
    predictor = CombinedPredictor(
        settings=Settings(),
        tile_fetcher=FakeTileFetcher(raises=CredentialsNotConfiguredError("Google Earth Engine")),
        plant_lookup=FakePlantLookup(plant=None),
        cnn=FakeScorer(0.9),  # cnn "loaded", but the tile fetch itself fails
    )
    result = predictor.predict(PredictionRequest(image_id="x", bounds=BOUNDS))
    assert result.detection_confidence == 0.0
    # cnn is not None, but detection_confidence 0 still yields cnn_proxy
    # (not unavailable) since Track B is nominally "available", just
    # returned no signal for this request.
    assert result.data_source == "cnn_proxy"


def test_backend_unreachable_falls_back_gracefully():
    predictor = CombinedPredictor(
        settings=Settings(),
        tile_fetcher=FakeTileFetcher(),
        plant_lookup=FakePlantLookup(raises=ConnectionError("backend down")),
        cnn=FakeScorer(0.6),
    )
    result = predictor.predict(PredictionRequest(image_id="x", bounds=BOUNDS))
    assert result.data_source == "cnn_proxy"
    assert result.co2_emission_tonnes_per_year is None


def test_ground_truth_corrected_estimate_preferred_over_placeholder_formula():
    """When a plant has BOTH the platform's own placeholder-formula estimate
    AND a ground-truth-corrected one, the corrected one wins - and
    ground_truth_validated must say so."""
    plant = NearestPlant(
        name="Test Plant",
        distance_km=3.2,
        co2_enhancement_ppm=2.0,
        co2_emission_tonnes_per_year_estimated=4800.0,  # placeholder formula - should be ignored
        co2_estimate_low=3000.0,
        co2_estimate_high=6600.0,
        co2_corrected_tonnes_per_year=49_364_960.0,
        co2_corrected_std=17_689_788.0,
        co2_ground_truth_validation_status="cea_ground_truth_matched",
    )
    predictor = CombinedPredictor(
        settings=Settings(),
        tile_fetcher=FakeTileFetcher(),
        plant_lookup=FakePlantLookup(plant=plant),
        cnn=FakeScorer(0.85),
    )
    result = predictor.predict(PredictionRequest(image_id="x", bounds=BOUNDS))
    assert result.data_source == "oco3_estimated"
    assert result.ground_truth_validated is True
    assert result.co2_emission_tonnes_per_year == 49_364_960.0
    assert result.co2_estimate_low == 49_364_960.0 - 17_689_788.0
    assert result.co2_estimate_high == 49_364_960.0 + 17_689_788.0


def test_placeholder_formula_used_when_not_ground_truth_matched():
    """Not matched against CEA ground truth (validation_status is None or
    anything else) - falls back to the placeholder formula, exactly the
    pre-existing behavior, with ground_truth_validated left False."""
    plant = NearestPlant(
        name="Test Plant",
        distance_km=3.2,
        co2_enhancement_ppm=2.0,
        co2_emission_tonnes_per_year_estimated=4800.0,
        co2_estimate_low=3000.0,
        co2_estimate_high=6600.0,
        co2_corrected_tonnes_per_year=49_364_960.0,  # present, but not validated
        co2_ground_truth_validation_status="not_matched",
    )
    predictor = CombinedPredictor(
        settings=Settings(),
        tile_fetcher=FakeTileFetcher(),
        plant_lookup=FakePlantLookup(plant=plant),
        cnn=FakeScorer(0.85),
    )
    result = predictor.predict(PredictionRequest(image_id="x", bounds=BOUNDS))
    assert result.data_source == "oco3_estimated"
    assert result.ground_truth_validated is False
    assert result.co2_emission_tonnes_per_year == 4800.0


def test_plant_with_no_estimate_yet_falls_back_to_cnn_proxy():
    """A plant can exist within range but have no OCO-3 analysis yet
    (co2_emission_tonnes_per_year_estimated is null) - must not be treated
    as "oco3_estimated" with null numbers."""
    plant = NearestPlant(
        name="Unanalyzed Plant",
        distance_km=10.0,
        co2_enhancement_ppm=None,
        co2_emission_tonnes_per_year_estimated=None,
        co2_estimate_low=None,
        co2_estimate_high=None,
    )
    predictor = CombinedPredictor(
        settings=Settings(),
        tile_fetcher=FakeTileFetcher(),
        plant_lookup=FakePlantLookup(plant=plant),
        cnn=FakeScorer(0.5),
    )
    result = predictor.predict(PredictionRequest(image_id="x", bounds=BOUNDS))
    assert result.data_source == "cnn_proxy"


def test_info_reports_combined_version():
    predictor = CombinedPredictor(
        settings=Settings(), tile_fetcher=FakeTileFetcher(), plant_lookup=FakePlantLookup()
    )
    info = predictor.info()
    assert info.version == "combined-v1"

"""Pure-function tests for the ppm -> tonnes/year mass-balance estimate.
No DB, no external services - this is the one fully-testable piece of the
OCO-3 pipeline (see docs on the method's assumptions in the module itself)."""
from app.services.emissions_conversion import (
    MAX_UNCERTAINTY_FRACTION,
    MIN_UNCERTAINTY_FRACTION,
    estimate_emission_rate,
)


def test_positive_enhancement_and_wind_yields_positive_estimate():
    result = estimate_emission_rate(enhancement_ppm=2.5, bg_std_ppm=0.5, wind_speed_mps=4.0)
    assert result is not None
    assert result.tonnes_per_year > 0
    assert result.low <= result.tonnes_per_year <= result.high


def test_zero_or_negative_enhancement_returns_none():
    assert estimate_emission_rate(enhancement_ppm=0, bg_std_ppm=0.5, wind_speed_mps=4.0) is None
    assert estimate_emission_rate(enhancement_ppm=-1, bg_std_ppm=0.5, wind_speed_mps=4.0) is None


def test_zero_or_negative_wind_returns_none():
    assert estimate_emission_rate(enhancement_ppm=2.5, bg_std_ppm=0.5, wind_speed_mps=0) is None
    assert estimate_emission_rate(enhancement_ppm=2.5, bg_std_ppm=0.5, wind_speed_mps=-1) is None


def test_higher_wind_speed_increases_estimate():
    slow = estimate_emission_rate(enhancement_ppm=2.5, bg_std_ppm=0.5, wind_speed_mps=2.0)
    fast = estimate_emission_rate(enhancement_ppm=2.5, bg_std_ppm=0.5, wind_speed_mps=8.0)
    assert fast.tonnes_per_year > slow.tonnes_per_year


def test_higher_enhancement_increases_estimate():
    low_enh = estimate_emission_rate(enhancement_ppm=1.0, bg_std_ppm=0.2, wind_speed_mps=4.0)
    high_enh = estimate_emission_rate(enhancement_ppm=5.0, bg_std_ppm=0.2, wind_speed_mps=4.0)
    assert high_enh.tonnes_per_year > low_enh.tonnes_per_year


def test_uncertainty_fraction_is_bounded():
    # Very noisy background (bg_std >> enhancement) -> capped at MAX, not runaway.
    noisy = estimate_emission_rate(enhancement_ppm=1.0, bg_std_ppm=10.0, wind_speed_mps=4.0)
    implied_fraction = (noisy.high - noisy.tonnes_per_year) / noisy.tonnes_per_year
    assert implied_fraction == MAX_UNCERTAINTY_FRACTION

    # Very clean signal (bg_std << enhancement) -> floored at MIN, not a
    # false-precision near-zero range.
    clean = estimate_emission_rate(enhancement_ppm=10.0, bg_std_ppm=0.01, wind_speed_mps=4.0)
    implied_fraction = (clean.high - clean.tonnes_per_year) / clean.tonnes_per_year
    assert abs(implied_fraction - MIN_UNCERTAINTY_FRACTION) < 1e-6


def test_low_never_negative():
    result = estimate_emission_rate(enhancement_ppm=0.5, bg_std_ppm=5.0, wind_speed_mps=1.0)
    assert result.low >= 0.0

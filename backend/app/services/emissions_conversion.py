"""Converts an OCO-3 XCO2 ppm enhancement into an emission-rate ESTIMATE.

Nothing in either the platform or the source research repo implements this
conversion today (the research repo's `physics_gaussian.py` is a 0-byte
stub) - this is new domain-modeling work, not a ported/verified formula.

Method: a simplified mixed-layer mass-balance (cross-sectional flux)
approximation, standard in the satellite point-source literature (e.g.
Nassar et al.'s OCO-2/3 power-plant studies use variants of this idea):
assume the measured column enhancement is uniformly mixed through a
boundary-layer height H_mix, forming a plume of effective width W_EFF
moving past the observation point at the measured wind speed U. The mass
flux through that cross-section approximates the source emission rate.

    Q (kg/s) = delta_C (kg CO2 / m^3) * H_mix (m) * W_eff (m) * U (m/s)
    delta_C  = delta_XCO2 (mol/mol) * n_air (mol air / m^3) * M_CO2 (kg/mol)
    n_air    = P_surface / (R * T)            [ideal gas law, dry air]

This is a first-pass estimate, not a calibrated measurement. Every fixed
constant below (H_MIX_M, W_EFF_M, surface P/T) is a literature-typical
default, not observed - revisit against domain literature before treating
the output as more than a rough order-of-magnitude figure. The output is
always a [low, high] range (derived from the enhancement's own background
noise, `bg_std_ppm`), never presented as a bare point value, since
satellite-derived point-source emission estimates commonly carry 30-50%+
uncertainty in the literature.
"""
from dataclasses import dataclass

# --- Fixed physical/atmospheric assumptions (documented defaults, not
# measured per-plant) ---
SURFACE_PRESSURE_PA = 101_325.0
SURFACE_TEMPERATURE_K = 288.0
GAS_CONSTANT_J_PER_MOL_K = 8.314
CO2_MOLAR_MASS_KG_PER_MOL = 0.04401

H_MIX_M = 1000.0  # daytime convective boundary-layer height, literature-typical default
W_EFF_M = 5_000.0  # effective plume cross-section width, rough default (~1 OCO-3 footprint scale)

SECONDS_PER_YEAR = 365.25 * 24 * 3600
KG_PER_TONNE = 1000.0

# Uncertainty band as a fraction of the point estimate, floored/capped so a
# very clean or very noisy enhancement doesn't produce an unrealistically
# tight or unrealistically wide range.
MIN_UNCERTAINTY_FRACTION = 0.35
MAX_UNCERTAINTY_FRACTION = 1.0


@dataclass
class EmissionEstimate:
    tonnes_per_year: float
    low: float
    high: float


def estimate_emission_rate(
    *,
    enhancement_ppm: float,
    bg_std_ppm: float,
    wind_speed_mps: float,
) -> EmissionEstimate | None:
    """Returns None if the inputs can't support a physically meaningful
    estimate (non-positive enhancement or wind speed)."""
    if enhancement_ppm <= 0 or wind_speed_mps <= 0:
        return None

    delta_xco2 = enhancement_ppm * 1e-6  # ppm -> mol/mol
    n_air = SURFACE_PRESSURE_PA / (GAS_CONSTANT_J_PER_MOL_K * SURFACE_TEMPERATURE_K)  # mol/m^3
    delta_c = delta_xco2 * n_air * CO2_MOLAR_MASS_KG_PER_MOL  # kg CO2 / m^3

    q_kg_per_s = delta_c * H_MIX_M * W_EFF_M * wind_speed_mps
    tonnes_per_year = q_kg_per_s * SECONDS_PER_YEAR / KG_PER_TONNE

    uncertainty_fraction = (
        bg_std_ppm / enhancement_ppm if enhancement_ppm else MAX_UNCERTAINTY_FRACTION
    )
    uncertainty_fraction = max(
        MIN_UNCERTAINTY_FRACTION, min(MAX_UNCERTAINTY_FRACTION, uncertainty_fraction)
    )

    low = max(0.0, tonnes_per_year * (1 - uncertainty_fraction))
    high = tonnes_per_year * (1 + uncertainty_fraction)

    return EmissionEstimate(
        tonnes_per_year=round(tonnes_per_year, 1),
        low=round(low, 1),
        high=round(high, 1),
    )

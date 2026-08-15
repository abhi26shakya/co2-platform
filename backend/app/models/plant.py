"""Known industrial plants (e.g. from the Global Power Plant Database).
Linking predictions to plants powers the map, comparisons, and time series."""
from sqlalchemy import Boolean, Float, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Plant(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "plants"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    country: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    fuel_type: Mapped[str] = mapped_column(String(50), default="coal", nullable=False)
    capacity_mw: Mapped[float | None] = mapped_column(Float)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    external_id: Mapped[str | None] = mapped_column(String(100), unique=True)  # e.g. GPPD id

    # --- CO2 enhancement results (OCO-3 satellite analysis, Path A) ---
    # All nullable: a plant may have no CO2 analysis yet, or insufficient
    # satellite coverage (in which case co2_enhancement_ppm stays None).
    # Populated by backend/app/services/oco3_analysis.py (batch job), not
    # per-request - see backend/scripts/run_oco3_batch.py.
    co2_enhancement_ppm: Mapped[float | None] = mapped_column(Float)
    co2_bg_std_ppm: Mapped[float | None] = mapped_column(Float)
    co2_no2_peak_km: Mapped[float | None] = mapped_column(Float)
    co2_soundings: Mapped[int | None] = mapped_column(Integer)
    co2_wind_diff_deg: Mapped[float | None] = mapped_column(Float)

    # Wind speed magnitude (ERA5, same query as co2_wind_diff_deg's
    # direction) - needed by emissions_conversion.py's mass-balance
    # formula; the direction-only field above can't drive a Q estimate.
    co2_wind_speed_mps: Mapped[float | None] = mapped_column(Float)

    # Derived emission-rate ESTIMATE (see app/services/emissions_conversion.py)
    # - a formula-derived figure under stated assumptions (fixed boundary-
    # layer height, Gaussian plume model), not a directly measured value.
    # Always paired with a [low, high] range; never present the point value
    # alone as ground truth.
    co2_emission_tonnes_per_year_estimated: Mapped[float | None] = mapped_column(Float)
    co2_estimate_low: Mapped[float | None] = mapped_column(Float)
    co2_estimate_high: Mapped[float | None] = mapped_column(Float)

    # --- Ground-truth-validated results (research repo's Track B, i.e.
    # this platform's "Path A"/OCO-3 track under independent verification)
    # ---
    # Populated by backend/scripts/load_co2.py from the research repo's
    # data/api_export/facilities.json export, NOT by oco3_analysis.py's
    # live batch job - these are a materially different, more rigorous
    # figure than co2_emission_tonnes_per_year_estimated above (which uses
    # this platform's own placeholder mass-balance formula in
    # emissions_conversion.py). Kept as separate columns rather than
    # replacing the existing estimate fields: the two are not
    # interchangeable, and nothing here decides which one a consumer
    # should prefer - that's deliberately left to the caller.
    co2_ground_truth_tonnes_per_year: Mapped[float | None] = mapped_column(Float)
    co2_corrected_tonnes_per_year: Mapped[float | None] = mapped_column(Float)
    # Absolute uncertainty (tons/year) to build a [corrected-std, corrected+std]
    # range from co2_corrected_tonnes_per_year - the research repo's ground-
    # truth correction adjusts the point estimate's bias but doesn't
    # recompute uncertainty, so this reuses the RAW Track B estimate's own
    # 3-term uncertainty (track_b.raw_estimate.q_t_per_year_std in the
    # export) as the best available uncertainty magnitude for the
    # corrected value too. An approximation, not a re-derived figure -
    # documented here so it isn't mistaken for one.
    co2_corrected_std: Mapped[float | None] = mapped_column(Float)
    co2_correction_significant: Mapped[bool | None] = mapped_column(Boolean)
    co2_ground_truth_validation_status: Mapped[str | None] = mapped_column(String(50))

    # Climate TRACE benchmark comparison (an independent, imperfect
    # estimator - NOT ground truth; see the research repo's own
    # RESEARCH_PAPER.md Sec 2.2/6 for why the two are never conflated).
    co2_climate_trace_tonnes: Mapped[float | None] = mapped_column(Float)
    co2_climate_trace_ratio: Mapped[float | None] = mapped_column(Float)
    co2_climate_trace_bracketed: Mapped[bool | None] = mapped_column(Boolean)

    # Track A detector (research repo's naming - the NO2/SO2/VIIRS CNN,
    # this platform's "Track B") generalization metric for this specific
    # facility, from the research repo's exhaustive leave-one-facility-out
    # evaluation - NOT this platform's own CNN inference confidence
    # (that's per-request, computed live in ml-service's CombinedPredictor).
    detection_exhaustive_lofo_recall: Mapped[float | None] = mapped_column(Float)
    detection_validation_status: Mapped[str | None] = mapped_column(String(50))

    # Everything else from the research repo's per-facility export record
    # that doesn't have a dedicated column yet (plume/hotspot map status,
    # temporal Q series, Grad-CAM/SHAP explainability) - kept as a single
    # JSON blob rather than flattened into more columns, since nothing in
    # this platform reads those fields yet; flattening now would be
    # premature schema commitment for data with no current consumer.
    # Verbatim copy of that record's "plume"/"temporal"/"explainability"
    # keys - see the research repo's data/schema/emission_record_schema.json
    # for the full shape.
    co2_extended: Mapped[dict | None] = mapped_column(JSONB)

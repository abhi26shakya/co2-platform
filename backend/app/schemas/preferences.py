from pydantic import BaseModel, Field


class PreferencesOut(BaseModel):
    model_config = {"from_attributes": True}

    theme: str
    accent_color: str
    reduced_motion: bool
    compact_mode: bool
    ai_default_model: str
    heatmap_palette: str
    confidence_threshold: float
    prediction_units: str
    auto_run_after_upload: bool
    xai_enabled: bool
    notify_prediction_completed: bool
    notify_upload_finished: bool
    notify_report_generated: bool
    notify_weekly_summary: bool
    notify_announcements: bool
    notify_research_updates: bool
    notify_email_enabled: bool
    notify_browser_enabled: bool


class PreferencesUpdate(BaseModel):
    theme: str = Field(default="dark", pattern="^(dark|light|system)$")
    accent_color: str = Field(default="blue", pattern="^(blue|purple|green)$")
    reduced_motion: bool = False
    compact_mode: bool = False
    ai_default_model: str = "unet-v1"
    heatmap_palette: str = Field(default="viridis", pattern="^(viridis|inferno|plasma|turbo)$")
    confidence_threshold: float = Field(default=0.85, ge=0.5, le=0.99)
    prediction_units: str = Field(default="t_per_year", pattern="^(t_per_year|kg_per_day)$")
    auto_run_after_upload: bool = True
    xai_enabled: bool = False
    notify_prediction_completed: bool = True
    notify_upload_finished: bool = True
    notify_report_generated: bool = True
    notify_weekly_summary: bool = False
    notify_announcements: bool = False
    notify_research_updates: bool = False
    notify_email_enabled: bool = True
    notify_browser_enabled: bool = True

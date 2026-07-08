"""Import every model so Alembic autogenerate sees the full metadata."""
from app.models.inference_log import InferenceLog
from app.models.ml_model import MLModel
from app.models.plant import Plant
from app.models.prediction import Prediction
from app.models.refresh_token import RefreshToken
from app.models.report import Report
from app.models.satellite_image import SatelliteImage
from app.models.upload import Upload
from app.models.user import User

__all__ = [
    "InferenceLog",
    "MLModel",
    "Plant",
    "Prediction",
    "RefreshToken",
    "Report",
    "SatelliteImage",
    "Upload",
    "User",
]

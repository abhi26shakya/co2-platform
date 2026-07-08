from functools import lru_cache

from app.core.config import get_settings
from app.services.inference.base import InferenceClient
from app.services.inference.http_client import HTTPInferenceClient
from app.services.inference.mock_client import MockInferenceClient


@lru_cache
def get_inference_client() -> InferenceClient:
    """Selected by CO2_INFERENCE_BACKEND. Swapping mock -> real model = one env var."""
    if get_settings().inference_backend == "http":
        return HTTPInferenceClient()
    return MockInferenceClient()

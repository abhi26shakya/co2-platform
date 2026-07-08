import uuid
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query

from app.core.deps import CurrentUser, DbSession
from app.repositories.predictions import PredictionRepository
from app.schemas.prediction_api import PredictionListOut, PredictionOut, RunPredictionRequest
from app.services.predictions import PredictionError, PredictionService

router = APIRouter(prefix="/predictions", tags=["predictions"])


def _row_to_out(row) -> PredictionOut:
    prediction, filename, version = row
    out = PredictionOut.model_validate(prediction)
    out.image_filename = filename
    out.model_version = version
    return out


@router.post("", response_model=PredictionOut, status_code=201)
async def run_prediction(
    payload: RunPredictionRequest, user: CurrentUser, db: DbSession
) -> PredictionOut:
    try:
        return await PredictionService(db).run(owner_id=user.id, image_id=payload.image_id)
    except PredictionError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail) from e


@router.get("", response_model=PredictionListOut)
async def list_predictions(
    user: CurrentUser,
    db: DbSession,
    image_id: uuid.UUID | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> PredictionListOut:
    rows, total = await PredictionRepository(db).list_owned(
        user.id, image_id=image_id, page=page, page_size=page_size
    )
    return PredictionListOut(
        items=[_row_to_out(r) for r in rows], total=total, page=page, page_size=page_size
    )


@router.get("/{prediction_id}", response_model=PredictionOut)
async def get_prediction(
    prediction_id: uuid.UUID, user: CurrentUser, db: DbSession
) -> PredictionOut:
    row = await PredictionRepository(db).get_owned(prediction_id, user.id)
    if row is None:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return _row_to_out(row)

import uuid

from fastapi import APIRouter, HTTPException

from app.core.deps import CurrentUser, DbSession
from app.models import Report
from app.schemas.report import CreateReportRequest, ReportOut
from app.services.reports import ReportService
from app.storage.local import LocalStorageBackend, get_storage

router = APIRouter(prefix="/reports", tags=["reports"])


async def _to_out(report: Report, storage: LocalStorageBackend) -> ReportOut:
    out = ReportOut.model_validate(report)
    out.url = await storage.get_url(report.storage_key)
    return out


@router.post("", response_model=ReportOut, status_code=201)
async def create_report(
    payload: CreateReportRequest, user: CurrentUser, db: DbSession
) -> ReportOut:
    storage = get_storage()
    report = await ReportService(db, storage).generate(user, payload.format)
    return await _to_out(report, storage)


@router.get("", response_model=list[ReportOut])
async def list_reports(user: CurrentUser, db: DbSession) -> list[ReportOut]:
    storage = get_storage()
    reports = await ReportService(db, storage).list_owned(user.id)
    return [await _to_out(r, storage) for r in reports]


@router.delete("/{report_id}", status_code=204)
async def delete_report(report_id: uuid.UUID, user: CurrentUser, db: DbSession) -> None:
    storage = get_storage()
    service = ReportService(db, storage)
    report = await service.get_owned(report_id, user.id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    await service.delete(report)

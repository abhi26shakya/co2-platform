"""Report generation: PDF (reportlab + matplotlib charts) and CSV.

Print documents are light-themed by design. Generation is synchronous - fast
at research scale; move to a Celery task if reports grow heavy.
"""
import io
import uuid
from datetime import UTC, datetime

import matplotlib

matplotlib.use("Agg")  # headless - no display server
import matplotlib.pyplot as plt
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Report, User
from app.repositories.predictions import PredictionRepository
from app.schemas.geo import AnalyticsOut
from app.services.analytics import AnalyticsService
from app.storage.base import StorageBackend

PLUME_LO = "#f5a623"
PLUME_HI = "#e64980"
INK = "#0b1220"
MUTED = "#64748b"


class ReportService:
    def __init__(self, session: AsyncSession, storage: StorageBackend) -> None:
        self.session = session
        self.storage = storage
        self.analytics = AnalyticsService(session)

    async def generate(self, user: User, fmt: str) -> Report:
        if fmt == "csv":
            content = (await self.analytics.export_csv(user.id)).encode()
            ext, media = "csv", "text/csv"
        else:
            content = await self._build_pdf(user)
            ext, media = "pdf", "application/pdf"

        report_id = uuid.uuid4()
        key = f"reports/{user.id}/{report_id}.{ext}"
        await self.storage.save(key, io.BytesIO(content), media)

        stamp = datetime.now(UTC).strftime("%Y-%m-%d %H:%M UTC")
        report = Report(
            id=report_id,
            user_id=user.id,
            title=f"Emission report — {stamp}",
            format=ext,
            storage_key=key,
            params={"generated_at": stamp},
        )
        self.session.add(report)
        await self.session.commit()
        await self.session.refresh(report)
        return report

    async def list_owned(self, user_id: uuid.UUID) -> list[Report]:
        rows = await self.session.execute(
            select(Report).where(Report.user_id == user_id).order_by(Report.created_at.desc())
        )
        return list(rows.scalars().all())

    async def get_owned(self, report_id: uuid.UUID, user_id: uuid.UUID) -> Report | None:
        return await self.session.scalar(
            select(Report).where(Report.id == report_id, Report.user_id == user_id)
        )

    async def delete(self, report: Report) -> None:
        await self.storage.delete(report.storage_key)
        await self.session.delete(report)
        await self.session.commit()

    # ---------- PDF assembly ----------

    async def _build_pdf(self, user: User) -> bytes:
        data = await self.analytics.overview(user.id)
        rows, _ = await PredictionRepository(self.session).list_owned(
            user.id, page=1, page_size=15
        )

        buf = io.BytesIO()
        doc = SimpleDocTemplate(
            buf,
            pagesize=A4,
            topMargin=18 * mm,
            bottomMargin=18 * mm,
            leftMargin=18 * mm,
            rightMargin=18 * mm,
            title="Emissia — CO2 Emission Report",
        )
        styles = getSampleStyleSheet()
        h1 = ParagraphStyle("h1", parent=styles["Title"], textColor=INK, spaceAfter=2)
        sub = ParagraphStyle("sub", parent=styles["Normal"], textColor=MUTED, fontSize=9)
        h2 = ParagraphStyle(
            "h2", parent=styles["Heading2"], textColor=INK, spaceBefore=14, spaceAfter=6
        )

        stamp = datetime.now(UTC).strftime("%d %b %Y, %H:%M UTC")
        story = [
            Paragraph("Emissia — CO₂ Emission Report", h1),
            Paragraph(f"Prepared for {user.full_name} · generated {stamp}", sub),
            Spacer(1, 8 * mm),
            self._summary_table(data),
        ]

        if data.total_predictions > 0:
            story += [
                Paragraph("Monthly average emissions", h2),
                Image(self._timeseries_png(data), width=170 * mm, height=60 * mm),
                Paragraph("Prediction distribution", h2),
                Image(self._distribution_png(data), width=170 * mm, height=60 * mm),
                Paragraph("Recent predictions", h2),
                self._predictions_table(rows),
            ]
        else:
            story.append(
                Paragraph(
                    "No predictions yet. Upload satellite scenes and run predictions "
                    "to populate this report.",
                    styles["Normal"],
                )
            )

        story += [
            Spacer(1, 10 * mm),
            Paragraph(
                "Predictions produced by the Emissia inference service. "
                "Model performance metrics are available on the platform's Model page.",
                sub,
            ),
        ]
        doc.build(story)
        return buf.getvalue()

    def _summary_table(self, data: AnalyticsOut) -> Table:
        cells = [
            ["Total predictions", "Peak emission (t CO₂/yr)", "Avg confidence"],
            [
                str(data.total_predictions),
                f"{data.max_emission:,.1f}" if data.max_emission is not None else "—",
                f"{data.avg_confidence:.1f}%" if data.avg_confidence is not None else "—",
            ],
        ]
        table = Table(cells, colWidths=[57 * mm] * 3)
        table.setStyle(
            TableStyle(
                [
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor(MUTED)),
                    ("FONTSIZE", (0, 0), (-1, 0), 8),
                    ("FONTSIZE", (0, 1), (-1, 1), 16),
                    ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
                    ("TEXTCOLOR", (0, 1), (-1, 1), colors.HexColor(INK)),
                    ("TOPPADDING", (0, 1), (-1, 1), 6),
                    ("LINEBELOW", (0, 1), (-1, 1), 0.5, colors.HexColor("#e2e8f0")),
                ]
            )
        )
        return table

    def _timeseries_png(self, data: AnalyticsOut) -> io.BytesIO:
        months = [t.month for t in data.timeseries]
        values = [t.avg_emission for t in data.timeseries]
        fig, ax = plt.subplots(figsize=(8, 2.8), dpi=150)
        ax.plot(months, values, color=PLUME_HI, linewidth=2, marker="o", markersize=4)
        ax.fill_between(range(len(values)), values, color=PLUME_LO, alpha=0.15)
        self._style_axes(ax, "avg t CO₂ / yr")
        return self._fig_png(fig)

    def _distribution_png(self, data: AnalyticsOut) -> io.BytesIO:
        labels = [f"{b.lo/1000:.1f}k" for b in data.distribution]
        counts = [b.count for b in data.distribution]
        fig, ax = plt.subplots(figsize=(8, 2.8), dpi=150)
        ax.bar(labels, counts, color=PLUME_LO, edgecolor=PLUME_HI, linewidth=0.8)
        self._style_axes(ax, "prediction count")
        ax.yaxis.get_major_locator().set_params(integer=True)
        return self._fig_png(fig)

    @staticmethod
    def _style_axes(ax, ylabel: str) -> None:
        ax.set_ylabel(ylabel, fontsize=8, color=MUTED)
        ax.tick_params(labelsize=7, colors=MUTED)
        for spine in ("top", "right"):
            ax.spines[spine].set_visible(False)
        for spine in ("left", "bottom"):
            ax.spines[spine].set_color("#e2e8f0")
        ax.grid(axis="y", color="#e2e8f0", linewidth=0.5)
        ax.set_axisbelow(True)

    @staticmethod
    def _fig_png(fig) -> io.BytesIO:
        buf = io.BytesIO()
        fig.tight_layout()
        fig.savefig(buf, format="png")
        plt.close(fig)
        buf.seek(0)
        return buf

    def _predictions_table(self, rows) -> Table:
        header = ["Scene", "t CO₂ / yr", "Confidence", "Model", "Date"]
        body = [
            [
                filename[:34],
                f"{p.co2_emission_tonnes_per_year:,.1f}"
                if p.co2_emission_tonnes_per_year is not None
                else "—",
                f"{p.confidence:.1f}%" if p.confidence is not None else "—",
                version or "—",
                p.created_at.strftime("%d %b %Y"),
            ]
            for p, filename, version in rows
        ]
        table = Table([header, *body], colWidths=[60 * mm, 30 * mm, 25 * mm, 30 * mm, 26 * mm])
        table.setStyle(
            TableStyle(
                [
                    ("FONTSIZE", (0, 0), (-1, -1), 8),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor(MUTED)),
                    ("TEXTCOLOR", (0, 1), (-1, -1), colors.HexColor(INK)),
                    ("LINEBELOW", (0, 0), (-1, 0), 0.5, colors.HexColor("#cbd5e1")),
                    ("LINEBELOW", (0, 1), (-1, -2), 0.25, colors.HexColor("#e2e8f0")),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        return table


async def count_reports(session: AsyncSession, user_id: uuid.UUID) -> int:
    return await session.scalar(
        select(func.count(Report.id)).where(Report.user_id == user_id)
    )

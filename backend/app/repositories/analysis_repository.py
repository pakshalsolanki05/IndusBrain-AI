import json
from sqlalchemy.orm import Session

from app.models.analysis import Analysis


def save_analysis(
    db: Session,
    document_id: int,
    analysis: dict,
):
    """
    Save AI analysis into database.
    """

    record = Analysis(
        document_id=document_id,
        domain=analysis["domain"]["name"],
        summary=analysis["summary"],
        insights=json.dumps(
            analysis.get("insights", [])
        ),
        recommendations=json.dumps(
            analysis.get("recommendations", [])
        ),
        analysis_version="1.0",
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


def get_analysis(
    db: Session,
    document_id: int,
):

    record = (
        db.query(Analysis)
        .filter(
            Analysis.document_id == document_id
        )
        .first()
    )

    if not record:
        return None

    return {
        "domain": record.domain,
        "summary": record.summary,
        "insights": json.loads(record.insights),
        "recommendations": json.loads(record.recommendations),
        "analysis_version": record.analysis_version,
    }